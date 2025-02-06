"use client";

import gmailIcon from "@/icons/gmail.svg";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { VercelLogo } from "@/icons/vercel";

export function Login({ mode = "signin" }: { mode?: "signin" | "signup" }) {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const priceId = searchParams.get("priceId");
  const inviteId = searchParams.get("inviteId");

  // const onLogin = async () => {
  //   const res = await fetch("https://api.mailclerk.io/auth/gmail", {
  //     method: "GET",
  //     credentials: "include",
  //   });
  //   console.log(res);
  // };

  return (
    <div className="h-full flex flex-col items-center space-y-4">
      <h1 className="flex items-center text-3xl gap-6 font-semibold tracking-wide">
        Welcome to mailclerk
      </h1>
      <h2 className="text-muted-foreground">AI powered email management</h2>

      <div className="flex flex-col justify-center py-4 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex flex-col gap-8">
            <Link
              href={`${process.env.NEXT_PUBLIC_API_URL}/auth/gmail`}
              className="flex items-center justify-center rounded-lg gap-3 bg-gray-100 px-6 py-4 hover:bg-gray-200 transition-colors"
            >
              <Image src={gmailIcon} alt="Gmail" className="w-8 h-8" />
              <span className="text-lg">Continue with Gmail</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
