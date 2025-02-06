import { VercelLogo } from "@/icons/vercel";
import { PropsWithChildren } from "react";

export default function SignInLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-background">
      <span className="absolute top-4 left-4 flex gap-2 text-2xl font-extrabold tracking-wide font-manrope items-center">
        <VercelLogo className="text-gray-900 w-8 h-8" />
        Mailclerk
      </span>
      {children}
    </div>
  );
}
