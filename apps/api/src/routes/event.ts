import { Router } from 'express';
import { RedisManager } from '../config/redisManager';

export const eventRouter:Router = Router();

eventRouter.post("/:event", async (req, res) => {
  const event = req.params.event;

  const response = await RedisManager.getInstance().EngineProcessor({
    type: "create_event", 
    payload: {
      eventName: event
    }
  })

  res.status(response.status).json({message: response.payload.simpleres})
});


