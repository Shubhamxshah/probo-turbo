import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '@repo/db';
import { phoneNumber } from 'better-auth/plugins';
import twilio from 'twilio';

const prisma = new PrismaClient();
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    phoneNumber({
      sendOTP: ({ phoneNumber, code }, request) => {
        sendOtpTwilio(phoneNumber, code)
      },
      signUpOnVerification: {
        getTempEmail: (phoneNumber) => {
          return `${phoneNumber}@probo.art`;
        },
        getTempName: (phoneNumber) => {
          return phoneNumber;
        },
      },
    }),
  ],
});

const sendOtpTwilio = async (phoneNumber: string, code: string) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = twilio(accountSid, authToken);
  
 const message = await client.messages.create({
  body: `Hi Shubham, your OTP is ${code}`, 
  from: process.env.TWILIO_PHONE, 
  to: `+91${phoneNumber.trim()}`, // Ensure +91 prefix
});
 
  console.log(message.body)
};
