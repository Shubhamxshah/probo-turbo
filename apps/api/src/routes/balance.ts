import { Router } from 'express';
import { RedisManager } from '../config/redisManager';
import { createRazorpayInstance } from '../config/razorpay.config';
import crypto from 'crypto';

const balanceRouter = Router();
const razorpayInstance = createRazorpayInstance();

balanceRouter.post('/check', async (req, res) => {
  const { userId } = req.body;

  const response = await RedisManager.getInstance().EngineProcessor({
    type: 'check_balance',
    payload: {
      userId,
    },
  });

  res.status(response.status).json({ message: response.payload.simpleres });
});

balanceRouter.post('/addfree', async (req, res) => {
  const { userId, amount } = req.body;

  const response = await RedisManager.getInstance().EngineProcessor({
    type: 'add_money',
    payload: {
      userId,
      amount,
    },
  });

  res.status(response.status).json({ message: response.payload.simpleres });
});

//TODO: complete razorpay 
// balanceRouter.post('/createOrder', async (req, res) => {
//   const { amount } = req.body;
//
//   const options = {
//     amount: amount * 100,
//     currency: 'INR',
//     receipt: `receipt_order_1`,
//   };
//
//   try {
//     razorpayInstance.orders.create(options, (err, order) => {
//       if (err) {
//         res.status(500).json({
//           success: false,
//           message: 'something went wrong with payment',
//         });
//         return;
//       }
//
//       res.status(200).json(order);
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'something went wrong with payment',
//     });
//   }
// });
//
// balanceRouter.post('/verifyOrder', async (req, res) => {
//   const { order_id, payment_id, signature, amount, userId } = req.body;
//
//   const secret = process.env.RAZORPAY_KEY_SECRET || '';
//   const hmac = crypto.createHmac('sha256', secret);
//   hmac.update(order_id + '|' + payment_id);
//   const generatedSignature = hmac.digest('hex');
//
//   if (generatedSignature === signature) {
//     const response = await RedisManager.getInstance().ArchiverProcessor({
//       type: 'add_money',
//       payload: {
//         amount,
//         userId,
//       },
//     });
//
//     res.status(200).json(200).json({
//       success: true,
//       message: response.message,
//     });
//   } else {
//     res.status(400).json({
//       success: false,
//       message: 'payment failed',
//     });
//   }
// });
