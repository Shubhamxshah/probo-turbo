import { Router } from 'express';
import { RedisManager } from '../config/redisManager';

const tradeRouter = Router();

tradeRouter.post("/buy", async (req, res) => {
  const {userId, noOfTokens, type, event} = req.body;

  const response = await RedisManager.getInstance().EngineProcessor({
    type: "buy_tokens", 
    payload: {
      userId, 
      noOfTokens,
      type, 
      event
    }
  })

  res.status(response.status).json({message: response.message})
});

tradeRouter.post("/sell", async (req, res) => {
  const {userId, noOfTokens, type, event} = req.body;

  const response = await RedisManager.getInstance().EngineProcessor({
    type: "sell_tokens", 
    payload: {
      userId, 
      noOfTokens,
      type, 
      event
    }
  })

  res.status(response.status).json({message: response.message})
});


