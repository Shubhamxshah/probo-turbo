import { Balances, Orderbook, StockBalances } from '@repo/common/types/engine';
import { MessageFromApi } from '@repo/common/types/fromApi';
import fs from 'fs';
import { RedisManager } from '../config/redisManager';

export class Engine {
  private orderBook: Map<string, Orderbook>;
  private balances: Map<string, Balances>;
  private stockBalances: Map<string, StockBalances[]>;

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
    switch(message.type){
      case 'create_user':
        try {
          const userId = message.payload.userId;
          const simpleres = this.createUser(userId);
          RedisManager.getInstance().sendToApi(clientId, {
            type: "simpleres", 
            payload: {
              simpleres
            }
          })
        } catch (error) {
          console.log("error creating user in engine", error)
        }
      case 'create_event':
      case 'add_money':
      case 'mint_tokens':
      case 'buy_tokens':
      case 'sell_tokens':
    }
  }

  createUser(userId: string) {
    this.balances.set(userId, {
      available: 0, 
      locked: 0
    })

    return `user ${userId} created`
  }

  createEvent(event: string) {
         
  }
}
