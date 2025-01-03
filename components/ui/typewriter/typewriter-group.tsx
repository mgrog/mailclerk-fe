"use client";

import React, { useEffect, useId, useState } from "react";
import { Typewriter } from "./typewriter";
import { cn } from "@/lib/utils";

interface TypewriterDef {
  content: string;
}

interface TypewriterGroupProps {
  className?: string;
  typewriters: TypewriterDef[];
  flipDelaySeconds?: number;
  initialDelaySeconds?: number;
}

export function TypewriterGroup({
  className,
  typewriters,
  flipDelaySeconds = 7,
  initialDelaySeconds = 2,
}: TypewriterGroupProps) {
  const [index, setIndex] = useState(0);
  const [hasWaitedForInitialDelay, setHasWaitedForInitialDelay] = useState(false);

  const id = useId();

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasWaitedForInitialDelay(true);
    }, initialDelaySeconds * 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hasWaitedForInitialDelay) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev < typewriters.length - 1 ? prev + 1 : 0));
    }, flipDelaySeconds * 1000);

    return () => clearInterval(timer);
  }, [hasWaitedForInitialDelay]);

  const components = typewriters.map((typewriter, i) => (
    <Typewriter
      key={`${id}-typewriter-{${i}}`}
      className={cn(className, { hidden: index !== i || !hasWaitedForInitialDelay })}
      durationSeconds={1}
    >
      {typewriter.content}
    </Typewriter>
  ));

  if (!hasWaitedForInitialDelay) {
    return (
      <>
        <Typewriter className={cn(className)} animationClass='animate-cursor-blink'>
          &nbsp;
        </Typewriter>
        {components}
      </>
    );
  }

  return components;
}
