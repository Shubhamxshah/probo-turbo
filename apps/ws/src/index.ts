import Redis from 'ioredis';
import { WebSocket, WebSocketServer } from 'ws';
import { v4 as uuid } from 'uuid';
import dotenv from "dotenv"

dotenv.config();

const wss = new WebSocketServer({ port: 8080 });

const subscriberClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

const UserManager = new Map<
  WebSocket,
  {
    userId: string;
    rooms: string[];
  }
>();

const channelSubscribers = new Map<string, number>();

const subscribeChannel = (room: string) => {
  if (!channelSubscribers.has(room)) {
    channelSubscribers.set(room, 1);
    subscriberClient.subscribe(room);
  } else {
    channelSubscribers.set(room, channelSubscribers.get(room)! + 1);
  }
};

const unsubscribeChannel = (room: string) => {
  const count = channelSubscribers.get(room);
  if (count !== undefined) {
    if (count <= 1) {
      subscriberClient.unsubscribe(room);
      channelSubscribers.delete(room);
    } else {
      channelSubscribers.set(room, count - 1);
    }
  }
};

wss.on('connection', function (ws) {
  const userId = uuid();

  UserManager.set(ws, { userId, rooms: [] });

  ws.on('message', function message(data) {
    try {
      const parsed = JSON.parse(data.toString());
      const { type, room } = parsed;

      if (!type || !room) return;

      if (type === 'SUBSCRIBE') {
        const user = UserManager.get(ws);
        if (user && !user.rooms.includes(room)) {
          user.rooms.push(room);
          subscribeChannel(room);
        }
      }

      if (type === 'UNSUBSCRIBE') {
        const user = UserManager.get(ws);
        if (user) {
          user.rooms = user.rooms.filter((x) => x !== room);
        }

        unsubscribeChannel(room);
      }
    } catch (err) {
      console.error('failed to parse messaege', err);
    }
  });

  ws.on('close', () => {
    const user = UserManager.get(ws);
    if (user) {
      for (const room of user.rooms) {
        unsubscribeChannel(room);
      }
    }
    UserManager.delete(ws);
  });
});

subscriberClient.on('message', (channel, message) => {
  UserManager.forEach((User, UserWs) => {
    if (User.rooms.includes(channel) && UserWs.readyState === WebSocket.OPEN) {
      UserWs.send(message);
    }
  });
});
