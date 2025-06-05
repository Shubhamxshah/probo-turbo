'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@repo/ui/components/base/button";
import { IndianRupeeIcon } from 'lucide-react';
import axios from 'axios';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@repo/ui/components/base/alert-dialog';
import { Input } from '@repo/ui/components/base/input';

const AddMoney = () => {
  const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

  const [money, setMoney] = useState("0");

  const loadScript = (src: string) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(true);
      };
      document.body.appendChild(script);
    });
  };

  const onPayment = async (amount: string) => {

    const price = Number(amount);
    // create order
    try {
      const options = {
        courseId: 1,
        amount: price,
      };

      const res = await axios.post(`${BACKEND_URL}/api/v1/balance/createOrder`, options);
      const data = res.data;

      console.log(data);

      const paymentObject = new (window as any).Razorpay({
        key: 'rzp_test_mId6JJc4QCnPYo',
        order_id: data.id,
        ...data,
        handler: function (response: any) {
          console.log(response);

          const options2 = {
            order_id: response.razorpay_order_id,
            payment_id: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          };

          axios
            .post(`${BACKEND_URL}/api/v1/balance/verifyPayment`, options2)
            .then((res) => {
              console.log(res.data);
              if (res.data.success) {
                alert('Payment successful');
              } else {
                alert('payment rejected');
              }
            })
            .catch((err) => {
              console.log(err);
            });
        },
      });

      paymentObject.open();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadScript('https://checkout.razorpay.com/v1/checkout.js');
  }, []);

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="bg-green-200 mr-4" variant="outline">
            <IndianRupeeIcon /> Add Money
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Enter Amount</AlertDialogTitle>
            <AlertDialogDescription className='text-black/80'>Youre all set to add balance to your account!</AlertDialogDescription>
            <Input value={money} onChange={(e) => setMoney(e.target.value)} /> 
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => onPayment(money)}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AddMoney;
