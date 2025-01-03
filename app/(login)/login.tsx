"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CircleIcon, Loader2 } from "lucide-react";
import { signIn, signUp } from "./actions";
import { ActionState } from "@/lib/auth/middleware";
import gmailIcon from "@/icons/gmail.svg";
import Image from "next/image";

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
    <div className="min-h-[100dvh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <CircleIcon className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Connect your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex flex-col gap-8 p-6 bg-white shadow rounded">
          <h2 className="text-lg font-medium text-gray-900">Select your email provider</h2>
          <Link
            href={`${process.env.NEXT_PUBLIC_API_URL}/auth/gmail`}
            className="flex items-center justify-center gap-2 rounded-sm border border-gray-200 p-4 hover:bg-gray-100 transition-colors"
          >
            <Image src={gmailIcon} alt="Gmail" className="w-8 h-8" />
            <span className="text-xl font-medium">Gmail</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
