import {
  AllowedPrice,
  Balances,
  eventInitialize,
  Orderbook,
  StockBalances,
} from '@repo/common/types/engine';
import { MessageFromApi, YesNo } from '@repo/common/types/fromApi';
import fs from 'fs';
import { RedisManager } from '../config/redisManager';

export class Engine {
  private orderBook: Map<string, Orderbook>;
  private balances: Map<string, Balances>;
  private stockBalances: Map<string, StockBalances>;

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

  process({ message, clientId }: { message: MessageFromApi; clientId: string }) {
    switch (message.type) {
      case 'create_user':
        try {
          const userId = message.payload.userId;
          const simpleres = this.createUser(userId);
          RedisManager.getInstance().sendToApi(clientId, {
            type: 'simpleres',
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
          const simpleres = this.createEvent(eventName);
          RedisManager.getInstance().sendToApi(clientId, {
            type: 'simpleres',
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
          const simpleres = this.AddMoney(userId, amount);
          RedisManager.getInstance().sendToApi(clientId, {
            type: 'simpleres',
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
          const simpleres = this.MintTokens(userId, event, noOfTokens);
          RedisManager.getInstance().sendToApi(clientId, {
            type: 'simpleres',
            payload: {
              simpleres,
            },
          });
        } catch (error) {
          console.log('error adding money', error);
        }
        break;
      case 'buy_tokens':
      case 'sell_tokens':
    }
  }

  createUser(userId: string) {
    this.balances.set(userId, {
      available: 0,
      locked: 0,
    });

    return `user ${userId} created`;
  }

  createEvent(event: string) {
    this.orderBook.set(event, eventInitialize);
    return `new event ${event} created`;
  }

  //TODO: deleteEvent

  AddMoney(userId: string, amount: number) {
    const balances = this.balances.get(userId);
    if (balances) {
      balances.available += amount; // objects are references, you can mutate it directly
      return `added balance ${amount} to ${userId}`;
    } else {
      return `user not exist`;
    }
  }

  MintTokens(userId: string, event: string, noOfTokens: number) {
    const totalAmount = noOfTokens * 2 * 10;

    const userBalance = this.balances.get(userId);
    if (!userBalance) {
      return `user does not exist`;
    }

    if (userBalance.available < totalAmount) {
      return `insufficient balance, can't mint`;
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

    return `minted ${noOfTokens} YES and NO tokens for ${userId} in ${event}`;
  }

  sellOrder(userId: string, event: string, noOfTokens: number, type: YesNo, price: AllowedPrice) {
    // see if there are bids you can fulfill

    const sellerStocks = this.stockBalances.get(userId);
    if (!sellerStocks || !sellerStocks[event]) {
      return `invalid order, seller doesnt contain this stocks`;
    }
    if (sellerStocks[event][type].available < noOfTokens) {
      return `user doesnt have enough stocks to sell`;
    }

    let remainingQuantity = noOfTokens;
    sellerStocks[event][type].available -= remainingQuantity;
    sellerStocks[event][type].locked += remainingQuantity;

    const orderbook = this.orderBook.get(event);
    if (!orderbook) {
      return `invalid orders, event doesnt exist in orderbook`;
    }

    const reverseType: YesNo = type === 'YES' ? 'NO' : 'YES';
    const reversePrice: AllowedPrice = (1000 - Number(price)).toString() as AllowedPrice;

    let bids = orderbook[type].bids[price];
    let asks = orderbook[reverseType].asks[reversePrice];

    while (remainingQuantity > 0) {
      if (bids.total > 0) {
        if (bids.orders[0]!.quantity >= remainingQuantity) {
          bids.orders[0]!.quantity -= remainingQuantity;
          bids.total -= remainingQuantity;
          const bidderId = bids.orders[0]!.userId;
          const bidderStocks = this.stockBalances.get(bidderId);
          bidderStocks![event]![type].available += remainingQuantity;
          const bidderBalance = this.balances.get(bidderId);
          bidderBalance!.locked -= noOfTokens * Number(price);

          sellerStocks[event][type].locked -= remainingQuantity;
          const sellerBalance = this.balances.get(userId);
          sellerBalance!.available += noOfTokens * Number(price);

          if (bids.orders[0]!.quantity === 0) {
            bids.orders.shift();
          }
          remainingQuantity = 0;
          return `Order filled completely`;
        } else {
          let quantity = bids.orders[0]!.quantity;
          bids.orders[0]!.quantity = 0;
          const bidderId = bids.orders[0]!.userId;
          const bidderStocks = this.stockBalances.get(bidderId);
          bidderStocks![event]![type].available += quantity;
          const bidderBalance = this.balances.get(bidderId);
          bidderBalance!.locked -= quantity * Number(price);

          sellerStocks[event][type].locked -= quantity;
          const sellerBalance = this.balances.get(userId);
          sellerBalance!.available += quantity * Number(price);

          remainingQuantity -= quantity;
          bids.total -= quantity;
          bids.orders.shift();
          return `Order filled partially`;
        }
      } else {
        return 'No bids at the ask price, trying to nullify with reverse Type asks ';
      }
    }
    // see if there are asks in reverse order you can nullify with.
    while (remainingQuantity > 0) {
      if (asks.total > 0) {
        if (asks.orders[0]!.quantity >= remainingQuantity) {
          asks.orders[0]!.quantity -= remainingQuantity;
          asks.total -= remainingQuantity;
          const askerId = asks.orders[0]!.userId;
          const askerStocks = this.stockBalances.get(askerId);
          askerStocks![event]![reverseType].locked -= remainingQuantity;
          const askerBalance = this.balances.get(askerId);
          askerBalance!.available += noOfTokens * Number(price);

          sellerStocks[event][type].locked -= remainingQuantity;
          const sellerBalance = this.balances.get(userId);
          sellerBalance!.available += noOfTokens * Number(price);

          if (asks.orders[0]!.quantity === 0) {
            asks.orders.shift();
          }
          remainingQuantity = 0;
          return `Order filled completely`;
        } else {
          let quantity = asks.orders[0]!.quantity;
          asks.orders[0]!.quantity = 0;
          const askerId = asks.orders[0]!.userId;
          const askerStocks = this.stockBalances.get(askerId);
          askerStocks![event]![reverseType].locked -= quantity;
          const askerBalance = this.balances.get(askerId);
          askerBalance!.locked += quantity * Number(price);

          sellerStocks[event][type].locked -= quantity;
          const sellerBalance = this.balances.get(userId);
          sellerBalance!.available += quantity * Number(price);

          remainingQuantity -= quantity;
          asks.total -= quantity;
          bids.orders.shift();
          return `Order filled partially`;
        }
      } else {
        return `cant fulfill even in reverse ask orders, will place it in asks to fulfill as pending`;
      }
    }

    // finally place it on asks side
    if (remainingQuantity > 0) {
      orderbook[type].asks[price].orders.push({ userId, quantity: remainingQuantity });
      orderbook[type].asks[price].total += remainingQuantity;
    }
  }
}
