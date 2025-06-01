import Redis from 'ioredis';
import { WebSocket, WebSocketServer } from 'ws';
import { v4 as uuid } from 'uuid';

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
    channelSubscribers.set(room, channelSubscribers.get(room)! + 1)
  }
}

wss.on('connection', function (ws) {
  const userId = uuid();

  UserManager.set(ws, { userId, rooms: [] });

  ws.on('message', function message(data) {
    const parsed = JSON.parse(data.toString());
    const { type, room } = parsed;

    if (type === 'SUBSCRIBE') {
      UserManager.get(ws)?.rooms.push(room);
      subscriberClient.subscribe(room);
    }

    if (type === 'UNSUBSCRIBE') {
      const user = UserManager.get(ws);
      if (user) {
        user.rooms = user.rooms.filter(x => x !== room)
      }

      let roomFound = false;
      for (const [_, otherUser] of UserManager) {
        if (otherUser.rooms.includes(room)) {
          roomFound = true;
        }
      }
      if (!roomFound) {
        subscriberClient.unsubscribe(room);
      }
    }
  });

  ws.on('close', () => {
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
