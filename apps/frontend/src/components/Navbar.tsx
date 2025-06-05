import React from 'react';
import Image from 'next/image';
import { Logout } from './logout';
import AddMoney from './AddMoney';

const Navbar = () => {

  return (
    <div className="flex justify-between items-center max-w-7xl mx-auto mt-6 px-2">
      <Image src="/probo.avif" alt="logo" height={100} width={100} />
      <div className="flex">
        <AddMoney />
        <Logout />
      </div>
    </div>
  );
};

export default Navbar;
