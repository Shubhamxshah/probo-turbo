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



