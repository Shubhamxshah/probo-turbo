'use client'
import React, { useEffect, useState } from 'react'
import axios from "axios";
import { authClient } from '@/lib/auth-client';
import { IndianRupeeIcon, Wallet, Wallet2 } from 'lucide-react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"

const Check_Balance = () => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setLoading(true);
        
        // Get session inside useEffect
        const { data: session, error: sessionError } = await authClient.getSession();
        
        if (sessionError || !session?.user?.id) {
          throw new Error('No valid session found');
        }

        const response = await axios.post(`${BACKEND_URL}/api/v1/balance/check`, {
          userId: session.user.id
        });
        
        setBalance(response.data.available/100 || 0);
      } catch (e) {
        console.error("Failed to fetch balance", e);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-1 mr-4">
        <IndianRupeeIcon size={16} />
        <span>...</span>
      </div>
    );
  }


  return (
    <span className="flex items-center gap-1 mr-4 relative bottom-1 border border-gray-200 bg-slate-200 rounded-sm p-2">
      <Wallet />
      <IndianRupeeIcon size={16} />
      <span>{balance}</span>
    </span>
  );
};

export default Check_Balance;
