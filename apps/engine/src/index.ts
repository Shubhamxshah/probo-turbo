import Redis from "ioredis";
import { Engine } from "./trade/engine";

async function main() {

  const client = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

  while (true) {
    const response = await client.rpop("engineMessages")
    if (response) {
      const parsed = JSON.parse(response)
      Engine.getInstance().process(parsed)
    } else {}
  }
}

main();
