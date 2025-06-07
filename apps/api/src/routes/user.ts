import { Router } from 'express';
import { RedisManager } from '../config/redisManager';

export const userRouter:Router = Router();

userRouter.post("/:userId", async (req, res) => {
  const userId = req.params.userId;

  const response = await RedisManager.getInstance().EngineProcessor({
    type: "create_user", 
    payload: {
      userId
    }
  })

  res.status(response.status).json({message: response.payload.simpleres})
});

userRouter.post("/reset", async (_, res) => {

  const response = await RedisManager.getInstance().EngineProcessor({
    type: "reset", 
  })

  res.status(response.status).json({message: response.payload.simpleres})
});

