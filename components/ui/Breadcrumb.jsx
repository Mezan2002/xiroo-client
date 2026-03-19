"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { ChevronRight } from "lucide-react";

export default function Breadcrumb({ customItems }) {
  const pathname = usePathname();

  let items = [];

  if (customItems) {
    items = customItems;
  } else {
    // Dynamically unfold standard path segments bridging root to current page.
    const pathSegments = (pathname || "").split("/").filter((segment) => segment !== "");
    
    items = [
      { label: "Home", href: "/" }
    ];

    let currentPath = "";
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      items.push({
        label: segment.replace(/-/g, " "),
        href: isLast ? null : currentPath
      });
    });
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center xl:gap-3 gap-2 text-[9px] xl:text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-2">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            {item.href ? (
              <Link href={item.href} className="hover:text-black transition-colors block max-w-[120px] md:max-w-none truncate">
                {item.label}
              </Link>
            ) : (
              <span className="text-black block max-w-[150px] md:max-w-none truncate">
                {item.label}
              </span>
            )}
            {!isLast && <ChevronRight size={12} className="text-gray-300" strokeWidth={2} />}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
