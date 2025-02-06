import { cn } from "@/lib/utils";
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";

interface NumberFieldProps {
  value: number;
  onChange: React.Dispatch<number>;
}

export function NumberField({ value, onChange }: NumberFieldProps) {
  const btnClass =
    "w-6 h-6 md:w-8 md:h-8 flex items-center justify-center group bg-gray-100 [&:not(:active):hover]:bg-black active:bg-black/75 transition-colors";
  return (
    <div className="w-fit flex items-center gap-1 border border-gray-200 rounded-sm">
      <button className={cn(btnClass, "rounded-l-sm")} onClick={() => onChange(value - 1)}>
        <MinusIcon className="group-hover:text-white" />
      </button>
      <input
        className="text-base font-medium w-8 md:w-10 text-center"
        type="number"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
      />
      <button className={cn(btnClass, "rounded-r-sm")} onClick={() => onChange(value + 1)}>
        <PlusIcon className="group-hover:text-white group-active:text-white w-4" />
      </button>
    </div>
  );
}
