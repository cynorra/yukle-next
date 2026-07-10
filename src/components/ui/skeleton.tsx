import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-stone-200/50 dark:bg-stone-800/50",
        className
      )}
      {...props}
    />
  )
}

function TextureSkeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] rounded-2xl border border-white/20 dark:border-stone-800/30",
        "bg-gradient-to-r from-stone-200/50 via-stone-100/50 to-stone-200/50 dark:from-stone-800/50 dark:via-stone-700/50 dark:to-stone-800/50",
        "shadow-inner backdrop-blur-sm",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton, TextureSkeleton }
