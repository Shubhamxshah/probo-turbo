import React from 'react';
import Image from 'next/image';
import { BriefcaseBusiness, House } from 'lucide-react';
import { Logout } from './logout';


const Navbar = () => {
  return (
    <div className="flex justify-between items-center max-w-7xl mx-auto mt-6 px-2">
      <Image src="/probo.avif" alt="logo" height={100} width={100} />
      <div className="flex">
        <House className="mx-4 relative top-2 " />
        <BriefcaseBusiness className="mx-4 relative top-2 right-2" />
        <Logout />
      </div>
    </div>
  );
};

export default Navbar;
