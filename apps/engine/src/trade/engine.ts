import { AllowedPrice, Balances, eventInitialize, Orderbook, StockBalances } from '@repo/common';
import { MessageFromApi, YesNo } from '@repo/common';
import fs from 'fs';
import { RedisManager } from '../config/redisManager';
import dotenv from 'dotenv';

dotenv.config();

export class Engine {
  private orderBook: Map<string, Orderbook>;
  private balances: Map<string, Balances>;
  private stockBalances: Map<string, StockBalances>;
  private static instance: Engine;

  constructor() {
    let snapshot = null;
    try {
      if (process.env.WITH_SNAPSHOT) {
        snapshot = fs.readFileSync('./snapshot.json'); // returns a buffer
      }
    } catch (error) {
      console.log('no snapshot found', error);
    }

    if (snapshot) {
      const snapshotSnapshot = JSON.parse(snapshot.toString()); // converts the buffer into object
      this.orderBook = new Map(snapshotSnapshot.orderBook);
      this.balances = new Map(snapshotSnapshot.balances);
      this.stockBalances = new Map(snapshotSnapshot.stockBalances);
    } else {
      //TODO: initialize with base seed values
      this.orderBook = new Map();
      this.stockBalances = new Map();
      this.balances = new Map();
    }

    setInterval(() => {
      this.saveSnapshot();
    }, 1000 * 3);
  }

  saveSnapshot() {
    const snapshotSnapshot = {
      orderBook: Array.from(this.orderBook.entries()),
      stockBalances: Array.from(this.stockBalances.entries()),
      balances: Array.from(this.balances.entries()),
    };

    fs.writeFileSync('./snapshot.json', JSON.stringify(snapshotSnapshot, null, 2)); // null, 2 prints JSON prettily in json file, remove in prod for performance, keep in dev for debug
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Engine();
    }
    return this.instance;
  }

  process({ message, clientId }: { message: MessageFromApi; clientId: string }) {
    switch (message.type) {
      case 'create_user':
        try {
          const userId = message.payload.userId;
          const { message: simpleres, status } = this.createUser(userId);
          RedisManager.getInstance().sendToApi(clientId, {
            type: 'simpleres',
            status,
            payload: {
              simpleres,
            },
          });
        } catch (error) {
          console.log('error creating user in engine', error);
        }
        break;
      case 'create_event':
        try {
          const eventName = message.payload.eventName;
          const { message: simpleres, status } = this.createEvent(eventName);
          RedisManager.getInstance().sendToApi(clientId, {
            type: 'simpleres',
            status,
            payload: {
              simpleres,
            },
          });
        } catch (e) {
          console.log('error creating event in engine', e);
        }
        break;
      case 'add_money':
        try {
          const { userId, amount } = message.payload;
          const { message: simpleres, status } = this.AddMoney(userId, amount);
          RedisManager.getInstance().sendToApi(clientId, {
            type: 'simpleres',
            status,
            payload: {
              simpleres,
            },
          });
        } catch (error) {
          console.log('error adding money', error);
        }
        break;
      case 'mint_tokens':
        try {
          const { userId, event, noOfTokens } = message.payload;
          const { message: simpleres, status } = this.MintTokens(userId, event, noOfTokens);
          RedisManager.getInstance().sendToApi(clientId, {
            type: 'simpleres',
            status,
            payload: {
              simpleres,
            },
          });
        } catch (error) {
          console.log('error adding money', error);
        }
        break;
      case 'sell_tokens':
        try {
          const { userId, event, noOfTokens, type, price } = message.payload;
          const simpleres = this.sellOrder(userId, event, noOfTokens, type, price);
          RedisManager.getInstance().sendToApi(clientId, {
            type: 'simpleres',
            status: simpleres.status,
            payload: {
              simpleres: simpleres.message,
            },
          });
        } catch (e) {
          console.log('error selling stock', e);
        }
        break;
      case 'buy_tokens':
        try {
          const { userId, event, noOfTokens, type, price } = message.payload;
          const simpleres = this.buyOrder(userId, event, noOfTokens, type, price);
          RedisManager.getInstance().sendToApi(clientId, {
            type: 'simpleres',
            status: simpleres.status,
            payload: {
              simpleres: simpleres.message,
            },
          });
        } catch (e) {
          console.log('error selling stock', e);
        }
        break;
    }
  }

  generateAsks(event: string) {
    const currentBook = this.orderBook.get(event);
    if (!currentBook) return null;

    const result: Record<YesNo, { asks: Record<string, number> }> = {
      YES: { asks: {} },
      NO: { asks: {} },
    };

    (['YES', 'NO'] as YesNo[]).forEach((type) => {
      result[type].asks = Object.fromEntries(
        Object.entries(currentBook[type].asks).map(([price, data]) => [price, data.total])
      );
    });

    return result;
  }
  createUser(userId: string) {
    try {
      this.balances.set(userId, {
        available: 0,
        locked: 0,
      });
      return { message: `user ${userId} created`, status: 200 };
    } catch (error) {
      console.log(error);
      return { message: `user ${userId} wasnt created`, status: 400 };
    }
  }

  createEvent(event: string) {
    try {
      this.orderBook.set(event, eventInitialize);
      return { message: `new event ${event} created`, status: 200 };
    } catch (error) {
      console.log(error);
      return { message: `new event ${event} failed`, status: 400 };
    }
  }

  //TODO: deleteEvent

  AddMoney(userId: string, amount: number) {
    const balances = this.balances.get(userId);
    try {
      if (balances) {
        balances.available += amount; // objects are references, you can mutate it directly
        return { message: `added balance ${amount} to ${userId}`, status: 200 };
      }
      return { message: `user not exist`, status: 400 };
    } catch (error) {
      console.log(error);
      return { message: `user not exist`, status: 400 };
    }
  }

  MintTokens(userId: string, event: string, noOfTokens: number) {
    const totalAmount = noOfTokens * 10 * 100;

    const userBalance = this.balances.get(userId);
    if (!userBalance) {
      return { message: `user not exist`, status: 400 };
    }

    if (userBalance.available < totalAmount) {
      return { message: `user has insufficient funds`, status: 400 };
    }

    userBalance.available -= totalAmount;

    let userStocks = this.stockBalances.get(userId);
    if (!userStocks) {
      userStocks = {};
      this.stockBalances.set(userId, userStocks);
    }

    if (!userStocks[event]) {
      userStocks[event] = {
        YES: { available: 0, locked: 0 },
        NO: { available: 0, locked: 0 },
      };
    }

    userStocks[event].YES.available += noOfTokens;
    userStocks[event].NO.available += noOfTokens;

    return {
      message: `minted ${noOfTokens} YES and NO tokens for ${userId} in ${event}`,
      status: 200,
    };
  }

  sellOrder(userId: string, event: string, noOfTokens: number, type: YesNo, price: AllowedPrice) {
    const sellerStocks = this.stockBalances.get(userId);
    if (!sellerStocks || !sellerStocks[event]) {
      return { message: `Invalid order: seller does not own this stock.`, status: 400 };
    }

    if (sellerStocks[event][type].available < noOfTokens) {
      return { message: `User does not have enough stocks to sell.`, status: 400 };
    }

    const orderbook = this.orderBook.get(event);
    if (!orderbook) {
      return { message: `Invalid order: event does not exist in orderbook.`, status: 400 };
    }

    const reverseType: YesNo = type === 'YES' ? 'NO' : 'YES';
    const reversePrice: AllowedPrice = (1000 - Number(price)).toString() as AllowedPrice;

    let bids = orderbook[type].bids[price];
    let reverseAsks = orderbook[reverseType].asks[reversePrice];

    let remainingQuantity = noOfTokens;
    let status = 'Matching sell order...';

    // Lock seller's stocks
    sellerStocks[event][type].available -= remainingQuantity;
    sellerStocks[event][type].locked += remainingQuantity;

    const sellerBalance = this.balances.get(userId);

    // Try to fulfill from direct bids
    while (remainingQuantity > 0 && bids.total > 0) {
      const order = bids.orders[0]!;
      const matchedQty = Math.min(order.quantity, remainingQuantity);

      const buyerId = order.userId;
      const buyerStocks = this.stockBalances.get(buyerId);
      const buyerBalance = this.balances.get(buyerId);

      order.quantity -= matchedQty;
      bids.total -= matchedQty;

      // Update buyer
      buyerStocks![event]![type].available += matchedQty;
      buyerBalance!.locked -= matchedQty * Number(price);

      // Update seller
      sellerStocks[event][type].locked -= matchedQty;
      sellerBalance!.available += matchedQty * Number(price);

      if (order.quantity === 0) {
        bids.orders.shift();
      }

      remainingQuantity -= matchedQty;
      status =
        matchedQty === noOfTokens
          ? 'Order filled completely from direct bids'
          : 'Order partially filled from direct bids';
    }

    // Try to fulfill from reverse asks
    while (remainingQuantity > 0 && reverseAsks.total > 0) {
      const order = reverseAsks.orders[0]!;
      const matchedQty = Math.min(order.quantity, remainingQuantity);

      const counterpartyId = order.userId;
      const counterStocks = this.stockBalances.get(counterpartyId);
      const counterBalance = this.balances.get(counterpartyId);

      order.quantity -= matchedQty;
      reverseAsks.total -= matchedQty;

      // Update reverse ask counterparty
      counterStocks![event]![reverseType].locked -= matchedQty;
      counterBalance!.available += matchedQty * Number(price); // they get paid for opposing bet

      // Update seller
      sellerStocks[event][type].locked -= matchedQty;
      sellerBalance!.available += matchedQty * Number(price);

      if (order.quantity === 0) {
        reverseAsks.orders.shift();
      }

      remainingQuantity -= matchedQty;
      status =
        matchedQty === noOfTokens
          ? 'Order filled completely via reverse asks'
          : 'Order partially filled via reverse asks';
    }

    // Put remaining on ask book
    if (remainingQuantity > 0) {
      orderbook[type].asks[price].orders.push({ userId, quantity: remainingQuantity });
      orderbook[type].asks[price].total += remainingQuantity;
      status = `Order partially matched, remaining ${remainingQuantity} placed on ask book`;
    }

    // send event to websocket
    const onlyAsksWithTotals = this.generateAsks(event);
    RedisManager.getInstance().publishMessage(event, onlyAsksWithTotals!);

    return { message: `${status}`, status: 200 };
  }

  buyOrder(userId: string, event: string, noOfTokens: number, type: YesNo, price: AllowedPrice) {
    const totalCost = noOfTokens * Number(price);

    const userBalance = this.balances.get(userId);
    if (!userBalance || userBalance.available < totalCost) {
      return { message: `Insufficient balance`, status: 400 };
    }

    const orderbook = this.orderBook.get(event);
    if (!orderbook) {
      return { message: `Event does not exist`, status: 200 };
    }

    let remainingQuantity = noOfTokens;
    userBalance.available -= totalCost;
    userBalance.locked += totalCost;

    const buyerStocks = this.stockBalances.get(userId) || {};
    if (!this.stockBalances.has(userId)) {
      this.stockBalances.set(userId, buyerStocks);
    }

    if (!buyerStocks[event]) {
      buyerStocks[event] = {
        YES: { available: 0, locked: 0 },
        NO: { available: 0, locked: 0 },
      };
    }

    let status = 'matching buy order...';
    const reverseType: YesNo = type === 'YES' ? 'NO' : 'YES';
    const reversePrice: AllowedPrice = (1000 - Number(price)).toString() as AllowedPrice;

    const asks = orderbook[type].asks[price];
    const reverseBids = orderbook[reverseType].bids[reversePrice];

    while (remainingQuantity > 0 && asks.total > 0) {
      const order = asks.orders[0]!;
      const sellerId = order.userId;
      const sellerStocks = this.stockBalances.get(sellerId);
      const sellerBalance = this.balances.get(sellerId);

      const matchedQuantity = Math.min(order.quantity, remainingQuantity);
      order.quantity -= matchedQuantity;
      asks.total -= matchedQuantity;

      buyerStocks[event][type].available += matchedQuantity;
      userBalance.locked -= matchedQuantity * Number(price);

      sellerStocks![event]![type].locked -= matchedQuantity;
      sellerBalance!.available += matchedQuantity * Number(price);

      remainingQuantity -= matchedQuantity;

      if (order.quantity === 0) {
        asks.orders.shift();
      }

      status =
        matchedQuantity === noOfTokens ? 'Order filled completely' : 'Order filled partially';
    }

    // Try matching with reverse bids
    while (remainingQuantity > 0 && reverseBids.total > 0) {
      const order = reverseBids.orders[0]!;
      const sellerId = order.userId;
      const sellerStocks = this.stockBalances.get(sellerId);
      const sellerBalance = this.balances.get(sellerId);

      const matchedQuantity = Math.min(order.quantity, remainingQuantity);
      order.quantity -= matchedQuantity;
      reverseBids.total -= matchedQuantity;

      buyerStocks[event][type].available += matchedQuantity;
      userBalance.locked -= matchedQuantity * Number(price);

      sellerStocks![event]![reverseType].locked -= matchedQuantity;
      sellerBalance!.available += matchedQuantity * Number(price);

      remainingQuantity -= matchedQuantity;

      if (order.quantity === 0) {
        reverseBids.orders.shift();
      }

      status = 'Order partially filled via reverse type';
    }

    // Place remaining on bid book
    if (remainingQuantity > 0) {
      orderbook[type].bids[price].orders.push({ userId, quantity: remainingQuantity });
      orderbook[type].bids[price].total += remainingQuantity;

      status = 'Buy order placed, waiting to match';
    }

    // send event to websocket
    const onlyAsksWithTotals = this.generateAsks(event);
    RedisManager.getInstance().publishMessage(event, onlyAsksWithTotals!);

    return { message: `${status}`, status: 200 };
  }
}
