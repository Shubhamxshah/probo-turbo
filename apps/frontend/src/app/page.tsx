'use client';

import { authClient } from '@/lib/auth-client';
import { useState } from 'react';
import { Input } from '@repo/ui/components/base/input';
import { Button } from '@repo/ui/components/base/button';
import { useRouter } from 'next/navigation';


export default function AuthLanding() {
  const router = useRouter();
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/dashboard',
        errorCallbackURL: '/',
      });
    } catch (err) {
      console.log('google login failed', err);
    }
  };

  const handlePhoneLogin = async () => {
    setShowPhoneInput(true);
  };

  const sendingOtp = async () => {
    if (phoneNumber.length < 10) {
      setError('Phone number must be at least 10 digits');
      return;
    }

    try {
      await authClient.phoneNumber.sendOtp({ phoneNumber: phoneNumber });
      setError(''); // Clear error on success
      setShowOtpInput(true); // If you want to proceed
    } catch (error) {
      console.log('error sending code to phoneNumber', error);
      setError('Failed to send OTP. Please try again.');
    }
  };

  const verifyOtp = async () => {
    if (otp.length !== 6 ) {
      setError("otp must be 6 digit long")
      return;
    }

    try {
      const verify = await authClient.phoneNumber.verify({
        phoneNumber: phoneNumber, 
        code: otp
      })

      console.log(verify)

      if (verify?.data?.status) {
        router.push("/dashboard")
      }
    } catch (error) {
      console.log("couldnt verify otp", error) 
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-600 text-sm">Sign in to your account</p>
        </div>

        {!showPhoneInput && (
          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-red-300 rounded-lg text-red-600 hover:bg-red-50 hover:border-red-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              {'Continue with Google'}
            </button>

            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-sm text-gray-500">or</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <button
              onClick={handlePhoneLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-emerald-300 rounded-lg text-emerald-600 hover:bg-emerald-50 hover:border-emerald-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              {'Continue with Phone'}
            </button>
          </div>
        )}

        {showPhoneInput && !showOtpInput && (
          <div className="space-y-4">
            <div className="flex rounded-md overflow-hidden border border-red-300">
              <div className="flex items-center px-4 bg-gray-100 text-gray-700 border-r border-red-300">
                +91
              </div>
              <Input
                className="flex-1 border-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none shadow-none"
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                }}
                placeholder="Enter phone number"
              />
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <Button className="w-full mt-4" onClick={sendingOtp}>
              Submit
            </Button>
          </div>
        )}

        {showPhoneInput && showOtpInput && (
          <div className="space-y-4">
            <div className="flex rounded-md overflow-hidden border border-red-300">
              <Input
                className="flex-1 border-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none shadow-none"
                onChange={(e) => {
                  setOtp(e.target.value);
                }}
                placeholder="Enter Otp"
              />
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            
            <Button className="w-full mt-4" onClick={verifyOtp}>
              Submit
            </Button>
          </div>
        )}


        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            By continuing, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
