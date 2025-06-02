import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  const client = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
  await client.subscribe('archiver');

  client.on('message', (_, message) => {
    const {type, event } = message;
    
  })
}

main();
