import { Router } from 'express';
import { RedisManager } from '../config/redisManager';

const userRouter = Router();

userRouter.post("/:userId", async (req, res) => {
  const userId = req.params.userId;

  const response = await RedisManager.getInstance().ArchiverProcessor({
    type: "create_user", 
    payload: {
      userId
    }
  })

  res.status(response.status).json({message: response.message})
});

userRouter.post("/mint", async (req, res) => {
  const {userId, noOfTokens, event} = req.body;

  const response = await RedisManager.getInstance().EngineProcessor({
    type: "mint_tokens", 
    payload: {
      userId, 
      noOfTokens,
      event
    }
  })

  res.status(response.status).json({message: response.message})
});

