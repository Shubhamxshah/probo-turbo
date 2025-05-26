import { Router } from 'express';

const eventRouter = Router();

eventRouter.post("/:event", async (req, res) => {
  const event = req.params.event;
})
