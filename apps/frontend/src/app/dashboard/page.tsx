import React from 'react';
import { authClient } from '@/lib/auth-client';
import { auth } from "@/lib/auth"
import { headers } from "next/headers";

const Dashboard = async () => {
  // const { data: session, error } = await authClient.getSession();
  // console.log("session is" , session, error);
  
  const session = await auth.api.getSession({
    headers: await headers()
  })

  console.log("server session", session?.user.id)
  return <div>Dashboard
    <pre>{JSON.stringify(session, null, 2)}</pre>
  </div>;
};

export default Dashboard;
