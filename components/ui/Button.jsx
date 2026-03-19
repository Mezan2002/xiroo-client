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
  ...props
}) {
  // Base core styles with group tracking and hidden overflow for the nested sliding background
  const baseStyles =
    "group relative inline-flex items-center justify-center font-semibold tracking-[0.15em] leading-none uppercase transition-colors duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] focus:outline-none disabled:opacity-50 disabled:pointer-events-none overflow-hidden";

  // Pre-configured style variants
  const variants = {
    primary: "bg-black text-white hover:bg-zinc-800",
    secondary: "bg-gray-100 text-black hover:bg-gray-200",
    white: "bg-white text-black hover:text-white",
    outline: "border border-black text-black hover:text-white",
    ghost: "bg-transparent text-black hover:bg-gray-100",
  };

  // Determines which variants receive the absolute top-to-bottom sliding background overlay
  const slideVariants = {
    white: "bg-black",
    outline: "bg-black",
  };

  // Pre-configured sizing specifications
  const sizes = {
    default: "px-8 py-4 text-[11px]",
    sm: "px-5 py-3 text-[10px]",
    lg: "px-10 py-[18px] text-[11px]",
    icon: "w-10 h-10 flex items-center justify-center p-0",
  };

  const finalClasses = cn(
    baseStyles,
    variants[variant],
    sizes[size],
    className
  );

  const slidingLayerBg = slideVariants[variant];

  // We wrap children in a z-10 span so they sit cleanly on top of the absolutely positioned sliding layer
  const content = (
    <>
      {slidingLayerBg && (
        <span
          className={cn(
            "absolute inset-0 origin-top scale-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-y-100 pointer-events-none",
            slidingLayerBg
          )}
        />
      )}
      <span className="relative z-10">{children}</span>
    </>
  );

  // Switch dynamically between rendering an anchor tag or button depending on the 'href'
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
