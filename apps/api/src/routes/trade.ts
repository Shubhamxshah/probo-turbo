import { Router } from 'express';
import { RedisManager } from '../config/redisManager';
import { AllowedPrice, allowedPrices } from '@repo/common/types/engine';

const tradeRouter = Router();

function isAllowedPrice(value: any): value is AllowedPrice {
  return allowedPrices.includes(value);
}

tradeRouter.post('/buy', async (req, res) => {
  const { userId, noOfTokens, type, event, price } = req.body;
  if (
    typeof userId !== 'string' ||
    typeof noOfTokens !== 'number' ||
    (type !== 'YES' && type !== 'NO') ||
    typeof event !== 'string' ||
    !isAllowedPrice(price)
  ) {
    res.status(400).json({ error: 'invalid types' });
    return;
  }

  const response = await RedisManager.getInstance().EngineProcessor({
    type: 'buy_tokens',
    payload: {
      userId,
      noOfTokens,
      type,
      event,
      price,
    },
  });

  res.status(response.status).json({ message: response.message });
});

tradeRouter.post('/sell', async (req, res) => {
  const { userId, noOfTokens, type, event, price } = req.body;

  if (
    typeof userId !== 'string' ||
    typeof noOfTokens !== 'number' ||
    (type !== 'YES' && type !== 'NO') ||
    typeof event !== 'string' ||
    !isAllowedPrice(price)
  ) {
    res.status(400).json({ error: 'invalid types' });
    return;
  }

  const response = await RedisManager.getInstance().EngineProcessor({
    type: 'sell_tokens',
    payload: {
      userId,
      noOfTokens,
      type,
      event,
      price,
    },
  });

  res.status(response.status).json({ message: response.message });
});
