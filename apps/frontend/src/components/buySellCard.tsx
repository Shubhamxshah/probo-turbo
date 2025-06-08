'use client';

import { LuSettings } from 'react-icons/lu';
import { IoIosArrowDown } from 'react-icons/io';
import { Switch } from '../utils/switch';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { authClient } from '@/lib/auth-client';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export const BuySellCard = () => {
  const [userId, setUserId] = useState('');
  const [buyTab, setBuyTab] = useState('YES');
  const [price, setPrice] = useState(0.5);
  const [quantity, setQuantity] = useState(1);
  const [advancedOption, setAdvancedOption] = useState(false);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    async function fetchUser() {
      const { data: session } = await authClient.getSession();
      setUserId(session!.user.id);
    }

    fetchUser();
  }, []);

  const placeOrder = async () => {
    if (status !== "idle") return;
    setStatus("loading");
    try {
      await axios.post(`${BACKEND_URL}/api/v1/trade/buy`, {
        userId,
        noOfTokens: quantity,
        event: 'btc',
        type: buyTab,
        price: String(price * 100),
      });
      setStatus("success")
    } finally {
      setTimeout(() => {
        setStatus("idle");
      }, 500)
    }
  };
  return (
    <div className="border rounded-xl w-full bg-white shadow-sm">
      <div className="p-4 md:p-5 space-y-4">
        {/* Yes/No Toggle */}
        <div className="relative w-full">
          <div
            onClick={(e: any) => {
              if (e.target.nodeName === 'BUTTON') {
                setBuyTab(e.target.getAttribute('value'));
              }
            }}
            className="w-full rounded-lg border-2 flex h-12 overflow-hidden"
          >
            <button
              value="YES"
              className={`w-1/2 transition-all duration-200 font-semibold text-sm ${
                buyTab === 'YES'
                  ? 'bg-[#197BFF] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              YES ₹9.5
            </button>
            <button
              value="NO"
              className={`w-1/2 transition-all duration-200 font-semibold text-sm ${
                buyTab === 'NO'
                  ? 'bg-[#E6675A] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              NO ₹0.5
            </button>
          </div>
        </div>

        {/* Set Price Label */}
        <div className="inline-block">
          <span className="px-4 py-1.5 border rounded-full text-sm font-semibold bg-gray-50">
            Set price
          </span>
        </div>

        {/* Price Card */}
        <div className="relative bg-white border rounded-xl p-5 shadow-sm">
          {/* Triangle Pointer */}
          <div className="absolute -top-2.5 left-10 w-5 h-5 bg-white border-l border-t border-gray-200 rotate-45"></div>

          {/* Price Controls */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Price</h2>
              <span className="text-sm text-gray-500">0 qty available</span>
            </div>
            <div className="flex items-center h-10 border rounded-lg overflow-hidden">
              <button
                value="-"
                onClick={() => price > 0.5 && setPrice((prev) => prev - 0.5)}
                className={`w-10 flex items-center justify-center ${
                  price === 0.5 ? 'text-gray-300' : 'text-[#9EC2FC] hover:bg-gray-50'
                } bg-gray-50`}
              >
                -
              </button>
              <span className="px-4 font-semibold">₹{price.toFixed(1)}</span>
              <button
                value="+"
                onClick={() => price < 9.5 && setPrice((prev) => prev + 0.5)}
                className={`w-10 flex items-center justify-center ${
                  price === 10 ? 'text-gray-300' : 'text-[#9EC2FC] hover:bg-gray-50'
                } bg-gray-50`}
              >
                +
              </button>
            </div>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900">Quantity</h2>
              <LuSettings className="text-gray-500" size={16} />
            </div>
            <div className="flex items-center h-10 border rounded-lg overflow-hidden">
              <button
                value="-"
                onClick={() => quantity > 1 && setQuantity((prev) => prev - 1)}
                className={`w-10 flex items-center justify-center ${
                  quantity === 1 ? 'text-gray-300' : 'text-[#9EC2FC] hover:bg-gray-50'
                } bg-gray-50`}
              >
                -
              </button>
              <span className="px-4 font-semibold">{quantity}</span>
              <button
                value="+"
                onClick={() => quantity < 5 && setQuantity((prev) => prev + 1)}
                className={`w-10 flex items-center justify-center ${
                  quantity === 5 ? 'text-gray-300' : 'text-[#9EC2FC] hover:bg-gray-50'
                } bg-gray-50`}
              >
                +
              </button>
            </div>
          </div>

          {/* Price Summary */}
          <div className="flex justify-between px-4">
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900">
                ₹{(price * quantity).toFixed(1)}
              </p>
              <p className="text-sm text-gray-500">You put</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-green-600">₹{(10 * quantity).toFixed(1)}</p>
              <p className="text-sm text-gray-500">You get</p>
            </div>
          </div>
        </div>

        {/* Advanced Options */}
        <div className="space-y-3">
          {advancedOption && (
            <div className="border rounded-xl divide-y">
              {/* Book Profit */}
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-50 rounded-md">
                    BP
                  </span>
                  <span className="font-semibold">Book Profit</span>
                </div>
                <Switch />
              </div>

              {/* Stop Loss */}
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 text-xs font-semibold text-red-700 bg-red-50 rounded-md">
                    SL
                  </span>
                  <span className="font-semibold">Stop Loss</span>
                </div>
                <Switch />
              </div>

              {/* Auto Cancel */}
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-50 rounded-md">
                    AC
                  </span>
                  <span className="font-semibold">Auto Cancel</span>
                </div>
                <Switch />
              </div>
            </div>
          )}

          <button
            onClick={() => setAdvancedOption(!advancedOption)}
            className="flex items-center justify-center w-full gap-2 text-gray-600 text-sm font-medium py-2 hover:text-gray-900"
          >
            Advanced Options
            <IoIosArrowDown
              size={18}
              className={`transition-transform duration-200 ${advancedOption ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {/* Error State */}
        {/* <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"> */}
        {/*   <div className="flex items-center gap-3"> */}
        {/*     <Image */}
        {/*       src={errorIcon} */}
        {/*       alt="Insufficient balance" */}
        {/*       className="w-6 h-6 object-contain" */}
        {/*     /> */}
        {/*     <div> */}
        {/*       <p className="font-semibold text-sm text-gray-900">Insufficient balance</p> */}
        {/*       <button className="text-xs text-gray-600 hover:text-gray-900">Learn more</button> */}
        {/*     </div> */}
        {/*   </div> */}
        {/*   <button className="px-4 py-2 text-sm font-semibold text-white bg-black rounded-lg hover:bg-gray-800"> */}
        {/*     Recharge */}
        {/*   </button> */}
        {/* </div> */}

        {/* Place Order Button */}
      </div>
    <button
      className={`w-full py-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2
        ${
          status === "loading"
            ? "bg-black/90 text-white cursor-not-allowed"
            : status === "success"
            ? "bg-green-600 text-white"
            : "bg-black/90 text-white hover:bg-black"
        }`}
      onClick={placeOrder}
      disabled={status === "loading"}
    >
      {status === "loading" && (
        <>
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
            />
          </svg>
          Placing...
        </>
      )}

      {status === "success" && (
        <>
          <svg
            className="h-5 w-5 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Placed!
        </>
      )}

      {status === "idle" && "Place Order"}
    </button>    </div>
  );
};
