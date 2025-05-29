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
    const orderbook = this.orderBook.get(event);
    const remainingQuantity = noOfTokens;
    while (remainingQuantity > 0) {
      if (orderbook![type].bids[price].total > 0) {
        
      } else {

      }
    }
    // see if there are asks in reverse order you can nullify with.
    // finally place it on asks side
  }
}
