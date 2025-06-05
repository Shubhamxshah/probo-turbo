'use client'

import React from 'react';
import Image from 'next/image';
import { Button } from '@repo/ui/components/base/button';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const router = useRouter();
  return (
    <div className="flex justify-between items-center max-w-7xl mx-auto mt-6 px-2">
      <Image src="/probo.avif" alt="logo" height={100} width={100} />
      <div className="flex">
        <Button onClick={() => router.push("/auth")} >Trade Online</Button>
      </div>
    </div>
  );
};

export default Navbar;

