import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { MessageFromOrderbook, MessageToEngine } from '@repo/common/types';

export class RedisManager {
  private client: Redis;
  private publisher: Redis;
  private static instance: RedisManager;

  constructor() {
    this.client = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    this.client.connect();
    this.publisher = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    this.publisher.connect();
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new RedisManager();
    }
    return this.instance;
  }

  public async EngineProcessor(message: MessageToEngine) {
    return new Promise<MessageFromOrderbook>((resolve) => {
      const id = uuidv4();
      this.client.subscribe(id, (response) => {
        if (response && typeof response === 'string') {
          this.client.unsubscribe(id);
          resolve(JSON.parse(response));
        }
      });
      this.publisher.lpush('enginemessages', JSON.stringify({ clientId: id, message }));
    });
  }

  //TODO: type MessageToArchiver
  public async ArchiverProcessor(message: MessageToEngine ) {
    return new Promise<MessageFromOrderbook>((resolve) => {
      const id = uuidv4();
      this.client.subscribe(id, (message) => {
        if (message && typeof message === "string") {
          this.client.unsubscribe(id);
          resolve(JSON.parse(message));
        }
      })
      this.publisher.lpush("archiverMessages", JSON.stringify({clientId: id, message }));
    })
  }
}
