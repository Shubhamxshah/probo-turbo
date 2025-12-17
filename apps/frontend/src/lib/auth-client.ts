import { createAuthClient } from 'better-auth/client';
import { phoneNumberClient } from 'better-auth/client/plugins';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

if (!process.env.NEXT_PUBLIC_BASE_URL) {
  console.warn('NEXT_PUBLIC_BASE_URL is not set, using fallback:', baseURL);
}

export const authClient = createAuthClient({
  baseURL,
  plugins: [phoneNumberClient()],
});

