import React from 'react';
import Navbar from '@/components/Navbar';
import { Separator } from '@repo/ui/components/base/separator';
import Events from '@/components/events';

const Dashboard = () => {
  return (
    <>
      <Navbar />
      <Separator className="mt-2 max-w-7xl mx-auto" />
      <Events />
    </>
  );
};

export default Dashboard;
