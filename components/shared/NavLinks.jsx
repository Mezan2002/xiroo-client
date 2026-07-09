"use client";

import { motion } from "framer-motion";
import Link from "next/link";

function NavLinkItem({ item, index, activeMenu, setActiveMenu }) {
  const isActive = activeMenu === item.id;

  return (
    <div
      className="flex items-center h-full cursor-pointer"
      onMouseEnter={() => setActiveMenu(item.id)}
    >
      <motion.div
        className="w-max"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 1.2, ease: "easeOut" }}
      >
        <Link
          href={`/${item.id}`}
          className={`text-[11px] font-semibold uppercase tracking-widest w-max transition-opacity py-1 ${
            isActive ? "opacity-70" : "hover:opacity-70"
          }`}
        >
          {item.label}
        </Link>
      </motion.div>
    </div>
  );
}

function StaticNavLink({ href, label, index, setActiveMenu }) {
  return (
    <div
      className="flex items-center h-full cursor-pointer"
      onMouseEnter={() => setActiveMenu(null)}
    >
      <motion.div
        className="w-max"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 1.2, ease: "easeOut" }}
      >
        <Link
          href={href}
          className="text-[11px] font-semibold uppercase tracking-widest w-max transition-opacity py-1 hover:opacity-70"
        >
          {label}
        </Link>
      </motion.div>
    </div>
  );
}

export default function NavLinks({ navItems, activeMenu, setActiveMenu }) {
  const totalItems = navItems.length + 2;

  return (
    <>
      {navItems.map((item, index) => (
        <NavLinkItem
          key={item.id}
          item={item}
          index={index}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
        />
      ))}
      <StaticNavLink
        href="/bundles/create"
        label="CREATE BUNDLE"
        index={totalItems - 2}
        setActiveMenu={setActiveMenu}
      />
      <StaticNavLink
        href="/track-order"
        label="TRACK ORDER"
        index={totalItems - 1}
        setActiveMenu={setActiveMenu}
      />
    </>
  );
}
