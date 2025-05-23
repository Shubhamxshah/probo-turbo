import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import { PrismaClient } from "@repo/db";
import { phoneNumber } from "better-auth/plugins";
 
const prisma = new PrismaClient();
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    plugins: [
    phoneNumber({
      sendOTP: ({ phoneNumber, code}, request) => {
        console.log("phone number and code is", phoneNumber, code) 
      },
      signUpOnVerification: {
        getTempEmail: (phoneNumber) => {
          return `${phoneNumber}@probo.com`
        }, 
        getTempName: (phoneNumber) => {
          return phoneNumber
        }
      }
    })
  ]
});
