import { Router } from 'express';
import { RedisManager } from '../config/redisManager';

const balanceRouter = Router();

balanceRouter.post("/check", async (req, res) => {
  const {userId} = req.body;

  const response = await RedisManager.getInstance().EngineProcessor({
    type: "check_balance", 
    payload: {
      userId,
    }
  })

  res.status(response.status).json({message: response.message})
});

balanceRouter.post("/add", async (req, res) => {
  const {userId, amount} = req.body;

  const response = await RedisManager.getInstance().ArchiverProcessor({
    type: "add_money", 
    payload: {
      userId,
      amount
    }
  })

  res.status(response.status).json({message: response.message})
});

