import { ChevronRight } from "lucide-react";
import Link from "next/link";

// Simple helper to cleanly concatenate class strings
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function Button({
  children,
  variant = "primary",
  size = "default",
  className = "",
  href,
  icon: Icon = ChevronRight,
  showHoverIcon = true,
  ...props
}) {
  // Base core styles - only include relative if absolute/fixed is not provided in className
  const isPositioned = /absolute|fixed|sticky/.test(className);
  const baseStyles = cn(
    "group inline-flex items-center justify-center font-bold tracking-[0.1em] uppercase transition-all duration-300 ease-out focus:outline-none disabled:opacity-50 disabled:pointer-events-none overflow-hidden rounded-none active:scale-[0.98]",
    !isPositioned && "relative"
  );

  // Pre-configured style variants
  const variants = {
    primary: "bg-black text-white hover:bg-zinc-800 border border-black",
    outline: "border border-zinc-200 bg-transparent text-black hover:border-black hover:bg-black hover:text-white",
    secondary: "bg-zinc-100 text-black hover:bg-zinc-200 border border-zinc-100",
    white: "bg-white text-black hover:bg-zinc-50 border border-white",
    ghost: "bg-transparent text-zinc-600 hover:bg-zinc-100 hover:text-black",
    link: "bg-transparent text-zinc-900 underline underline-offset-4 hover:text-black p-0 h-auto",
    danger: "bg-red-600 text-white hover:bg-red-700 border border-red-600",
    warning: "bg-amber-500 text-black hover:bg-amber-600 border border-amber-500",
  };

  // Pre-configured sizing specifications
  const sizes = {
    default: "px-8 py-4 text-[11px] h-12",
    sm: "px-5 py-2.5 text-[10px] h-10",
    lg: "px-10 py-5 text-[12px] h-14",
    icon: "w-10 h-10 flex items-center justify-center p-0",
  };

  const finalClasses = cn(
    baseStyles,
    variants[variant],
    sizes[size],
    className
  );

  const content = (
    <span className="relative z-10 flex items-center justify-center gap-2">
      <span className="flex items-center">{children}</span>
      {showHoverIcon && variant !== "link" && variant !== "icon" && (
        <span className="flex items-center w-0 opacity-0 -translate-x-2 group-hover:w-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out">
          <Icon className="w-3.5 h-3.5 stroke-[2.5]" />
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className={finalClasses} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button className={finalClasses} {...props}>
      {content}
    </button>
  );
}
