'use client'
import * as React from 'react';
import Image from 'next/image';
import { Button } from '@repo/ui/components/base/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@repo/ui/components/base/dropdown-menu';
import { LogOut } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export function Logout() {
  
  async function handleLogout() {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            // Force a full page reload to clear any cached session data
            window.location.href = '/';
          },
          onError: (error) => {
            console.error('Logout error:', error);
            // Still redirect even if there's an error
          }
        },
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Image src="/userprofile.avif" alt="logout" width={40} height={40} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>
          <Button variant={'destructive'} className="w-full" onClick={handleLogout}>
            <LogOut /> Logout
          </Button>
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
