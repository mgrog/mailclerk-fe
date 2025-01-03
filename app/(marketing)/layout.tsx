"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CircleIcon, Home, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/lib/auth";
import { signOut } from "@/app/(login)/actions";
import { useRouter } from "next/navigation";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, setUser } = useUser();
  const router = useRouter();

  async function handleSignOut() {
    setUser(null);
    await signOut();
    router.push("/");
  }

  return (
    <header className='border-b border-gray-200'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center'>
        <Link href='/' className='flex items-center'>
          <CircleIcon className='h-6 w-6 text-blue-600' />
          <span className='ml-2 text-xl font-semibold text-gray-900'>Mailclerk</span>
        </Link>
        <div className='flex items-center space-x-4'>
          <Link href='#pricing' className='text-sm font-medium text-gray-700 hover:text-gray-900'>
            Pricing
          </Link>
          {user ? (
            <form action={handleSignOut} className='w-full'>
              <button type='submit' className='flex w-full'>
                <DropdownMenuItem className='w-full flex-1 cursor-pointer'>
                  <LogOut className='mr-2 h-4 w-4' />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </button>
            </form>
          ) : (
            <Button
              asChild
              className='bg-white hover:bg-gray-100 text-black text-sm px-4 py-2 rounded-full'
            >
              <Link href='/sign-up'>Sign Up</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className='flex flex-col min-h-screen'>
      <Header />
      {children}
    </section>
  );
}