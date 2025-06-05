import React from 'react';
import Navbar from '@/components/Navbar';
import { Separator } from '@repo/ui/components/base/separator';

const Dashboard = () => {
  // const { data: session, error } = await authClient.getSession();
  // console.log("session is" , session, error);
  

  return <div>
    <Navbar />
    <Separator className='mt-2 max-w-7xl mx-auto'/>
  </div>;
};

export default Dashboard;
