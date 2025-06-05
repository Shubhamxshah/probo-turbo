import React from 'react';
import Navbar from '@/components/Navbar';
import { Separator } from '@repo/ui/components/base/separator';
import Events from '@/components/events';
import { BodyContent } from '@/components/body-content';

const Dashboard = () => {
  return (
    <>
      <Navbar />
      <Separator className="mt-2 max-w-7xl mx-auto" />
      <Events />
      <BodyContent />
    </>
  );
};

export default Dashboard;
