import { cn } from "@/lib/utils";
import { useAlert } from "@/hooks/useAlert";
import { CircleX } from "lucide-react";

const variantStyles: Record<"success" | "error" | "warning" | "info", string> =
  {
    success:
      "bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-200",
    error:
      "bg-rose-50 text-rose-900 border-rose-200 dark:bg-rose-950 dark:text-rose-200",
    warning:
      "bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950 dark:text-amber-200",
    info: "bg-sky-50 text-sky-900 border-sky-200 dark:bg-sky-950 dark:text-sky-200",
  };

export const Alert = () => {
  const { alert, clearAlert } = useAlert();

  if (!alert.isOpen || !alert.message) {
    return null;
  }

  return (
    <div
      role='alert'
      className={cn(
        "fixed inset-x-4 top-4 z-50 mx-auto flex max-w-xl items-start justify-between gap-4 rounded-lg border px-4 py-3 shadow-lg shadow-slate-950/10 backdrop-blur-sm sm:px-6",
        variantStyles[alert.type],
      )}
    >
      <div className='space-y-1 text-sm sm:text-base'>
        <p className='font-medium'>{alert.type.toUpperCase()}</p>
        <p>{alert.message}</p>
      </div>
      <button type='button' onClick={clearAlert} className=''>
        <CircleX className='h-6 w-6' />
      </button>
    </div>
  );
};
