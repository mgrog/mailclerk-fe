import gmailLogo from "@/icons/gmail.svg";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

async function getGmailUrl() {
  "use server";

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/gmail`);
  const data = await res.json();
  return data.url;
}

const btnClass =
  "px-8 py-4 flex font-medium text-gray-600 items-center gap-4 border border-gray-200 rounded-sm mb-10 transition-colors hover:bg-slate-100 hover:border-slate-200";

function Loading() {
  return (
    <button className={cn(btnClass, "justify-center min-w-[297px] min-h-[74px]")}>
      <span className="loading loading-bars loading-sm" sr-only="loading gmail url" />
    </button>
  );
}

async function InnerGmailConnect() {
  const url = await getGmailUrl();
  return (
    <Link href={url} className={btnClass}>
      <Image src={gmailLogo} alt="gmail logo" height={40} width={40} />
      Connect Gmail Account
    </Link>
  );
}

export function GmailConnect() {
  return (
    <Suspense fallback={<Loading />}>
      <ErrorBoundary fallback={<p>⚠️ Something went wrong please reload</p>}>
        <InnerGmailConnect />
      </ErrorBoundary>
    </Suspense>
  );
}
