"use client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function Breadcrumb({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <nav className="flex items-center gap-2 text-[10px] font-semibold tracking-widest uppercase font-montserrat">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2">
          {item.href && !item.active ? (
            <Link 
              href={item.href} 
              className="text-zinc-400 hover:text-black transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className={item.active ? "text-zinc-800" : "text-zinc-400"}>
              {item.label}
            </span>
          )}
          {idx < items.length - 1 && (
            <ChevronRight size={10} className="text-zinc-300" />
          )}
        </div>
      ))}
    </nav>
  );
}
