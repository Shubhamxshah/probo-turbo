import Redis from 'ioredis';
import { Engine } from './trade/engine';
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const client = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

  while (true) {
    const result = await client.brpop('engineMessages', 0); // Note: 0 is a number, not string
    if (result) {
      console.log(result);
      const [_key, value] = result; // result is a tuple: [key, value]
      const parsed = JSON.parse(value.toString());
      console.log(parsed)
      Engine.getInstance().process(parsed);
    } 
  }
}

main();
