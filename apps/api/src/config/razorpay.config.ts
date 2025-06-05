import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

//TODO: perhaps make this a singleton
export const createRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID, 
    key_secret: process.env.RAZORPAY_KEY_SECRET
  })
}
