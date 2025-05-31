import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { MessageFromApi } from '@repo/common';
import { MessageFromEngine } from '@repo/common';

export class RedisManager {
  private client: Redis;
  private publisher: Redis;
  private static instance: RedisManager;

  constructor() {
    this.client = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    console.log('client connected to redis');
    this.publisher = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    console.log('publisher connected to redis');
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new RedisManager();
    }
    return this.instance;
  }

  public async EngineProcessor(message: MessageFromApi): Promise<MessageFromEngine> {
    console.log(message);
    return new Promise<MessageFromEngine>(async (resolve) => {
      const id = uuidv4();
      console.log(typeof id)
      const onMessage = (channel: string, messageStr: string) => {
        if (channel === id) {
          this.client.unsubscribe(id);
          this.client.removeListener('message', onMessage);
          resolve(JSON.parse(messageStr));
        }
      };

      this.client.on('message', onMessage);
      await this.client.subscribe(id);
      console.log(`subscribed to id`, id)
      await this.publisher.lpush('engineMessages', JSON.stringify({ clientId: id, message }));
      console.log('pushed to engine from redis')
    });
  }

  ////TODO: type MessageToArchiver
  //public async ArchiverProcessor(message: MessageFromApi ) {
  //  return new Promise<MessageFromOrderbook>((resolve) => {
  //    const id = uuidv4();
  //    this.client.subscribe(id, (message) => {
  //      if (message && typeof message === "string") {
  //        this.client.unsubscribe(id);
  //        resolve(JSON.parse(message));
  //      }
  //    })
  //    this.publisher.lpush("archiverMessages", JSON.stringify({clientId: id, message }));
  //  })
  //}
}
