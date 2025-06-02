import Redis from 'ioredis';
import dotenv from "dotenv";
import { Archiver } from './archiver';

dotenv.config();

async function main() {
  const client = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

  while (true) {
    const result = await client.brpop('archiver', 0); // with 0, it will wait forever until an item is passed. for e.g. with 100, if no item is pushed till 100 s it'll return null and close connection.
    if (result) {
      const [_key, value] = result; // result is a tuple: [key, value]
      const parsed = JSON.parse(value);
      console.log(parsed)
      Archiver.getInstance().process(parsed);
    } 
  }
}

main();

