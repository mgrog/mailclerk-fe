import { cn } from "@/lib/utils";
import { CaretRightIcon } from "@radix-ui/react-icons";
import { CSSProperties, PropsWithChildren } from "react";

interface TypewriterProps {
  align?: "left" | "center";
  className?: string;
  animationClass?: string;
  durationSeconds?: number;
}

export function Typewriter({
  className,
  children,
  align = "left",
  animationClass,
  durationSeconds = 1,
}: PropsWithChildren<TypewriterProps>) {
  const textLen = children && children.toString().length;
  return (
    <div className={cn("flex items-center", className)}>
      <CaretRightIcon className='fill-black' height={30} width={30} />
      <div
        className={cn("flex w-fit", {
          "justify-center mx-auto": align === "center",
        })}
      >
        <p
          className={cn(
            "overflow-hidden whitespace-nowrap border-r-[2px] border-transparent animate-typing",
            animationClass,
          )}
          style={{
            ...(!animationClass &&
              ({
                "--duration": `${durationSeconds}s`,
                "--steps": textLen,
              } as CSSProperties)),
          }}
        >
          {children}
        </p>
      </div>
    </div>
  );
}
