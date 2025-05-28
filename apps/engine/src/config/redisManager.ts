import { MessageFromEngine } from "@repo/common/types/fromEngine";
import Redis from "ioredis";

export class RedisManager {
  private client: Redis;
  private static instance: RedisManager;

  constructor() {
    this.client = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')
    this.client.connect();
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new RedisManager;
    }
    return this.instance;
  }

  public sendToApi(clientId: string, message: MessageFromEngine) {
      this.client.publish(clientId, JSON.stringify(message));
  }

  public pushToArchiver(message: ArchiverMessage) {
    this.client.lpush("messageToArchiver", JSON.stringify(message))
  }

  public publishMessage(channel: string, message: WsMessage) {
    this.client.publish(channel, JSON.stringify(message))
  }
}
