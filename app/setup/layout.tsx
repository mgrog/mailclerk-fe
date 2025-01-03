import { VercelLogo } from "@/icons/vercel";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center mt-12">
      <span className="flex items-center text-xl gap-6 font-manrope font-extrabold tracking-wider">
        <VercelLogo className="text-gray-900 w-8 h-8" />
        mailclerk
      </span>
      {children}
    </div>
  );
}
