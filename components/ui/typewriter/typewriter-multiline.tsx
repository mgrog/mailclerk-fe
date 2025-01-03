"use client";

import { cn } from "@/lib/utils";
import { CaretRightIcon } from "@radix-ui/react-icons";
import React, { CSSProperties, PropsWithChildren, useEffect, useState } from "react";
import { useIntersectionObserver } from "usehooks-ts";

interface TypewriterProps {
  align?: "left" | "center";
  className?: string;
  durationSeconds?: number;
}

export function TypewriterMultiline({
  className,
  children,
  align = "left",
  durationSeconds = 1,
}: PropsWithChildren<TypewriterProps>) {
  const textLen = children && children.toString().length;
  const [animEnded, setAnimEnded] = useState(false);
  const { isIntersecting, ref } = useIntersectionObserver({ threshold: 0.9 });
  return (
    <div ref={ref} className={cn("flex relative", className)}>
      <div
        className={cn("text-white", {
          "justify-center mx-auto": align === "center",
        })}
      >
        <span
          className={cn({
            "text-transparent": !isIntersecting,
            "typewriter-multiline": !animEnded && isIntersecting,
            "animate-cursor-blink-3X text-black border-r-2 border-transparent pr-1": animEnded,
          })}
          onAnimationEnd={() => setAnimEnded(true)}
          style={
            {
              "--steps": textLen,
              "--duration": `${durationSeconds}s`,
            } as CSSProperties
          }
        >
          {children}
        </span>
      </div>
    </div>
  );
}
