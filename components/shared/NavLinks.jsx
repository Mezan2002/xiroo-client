"use client";

import Link from "next/link";

/**
 * NavLinks — Client-only component.
 * Dynamically imported with ssr:false so it is NEVER included in server HTML.
 * This eliminates hydration mismatches caused by localStorage-populated menus
 * not existing on the server but existing on the client.
 */
export default function NavLinks({ navItems, activeMenu, setActiveMenu }) {
  return (
    <>
      {navItems.map((item) => (
        <div
          key={item.id}
          className="flex items-center h-full cursor-pointer"
          onMouseEnter={() => setActiveMenu(item.id)}
        >
          <Link
            href={`/${item.id}`}
            className={`text-[11px] font-semibold transition-opacity uppercase tracking-widest w-max ${
              activeMenu === item.id ? "opacity-70" : "hover:opacity-70"
            }`}
          >
            {item.label}
          </Link>
        </div>
      ))}
      <div 
        className="flex items-center h-full cursor-pointer"
        onMouseEnter={() => setActiveMenu(null)}
      >
        <Link
          href="/bundles/create"
          className="text-[11px] font-semibold transition-opacity uppercase tracking-widest w-max hover:opacity-70"
        >
          CREATE BUNDLE
        </Link>
      </div>
      <div 
        className="flex items-center h-full cursor-pointer"
        onMouseEnter={() => setActiveMenu(null)}
      >
        <Link
          href="/track-order"
          className="text-[11px] font-semibold transition-opacity uppercase tracking-widest w-max hover:opacity-70"
        >
          TRACK ORDER
        </Link>
      </div>
    </>
  );
}
