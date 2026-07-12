"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import SocialPostCard from "./SocialPostCard";
import useSocialPosts from "@/hooks/api/useSocialPosts";

function splitIntoColumns(items, columnCount) {
  const columns = Array.from({ length: columnCount }, () => []);
  items.forEach((item, index) => {
    columns[index % columnCount].push(item);
  });
  return columns;
}

export default function SocialFeed() {
  const { useActiveSocialPosts } = useSocialPosts();
  const { data, isLoading } = useActiveSocialPosts(8);
  const posts = data?.data || [];

  if (isLoading) {
    return (
      <section className="w-full py-16 lg:py-24 px-6 lg:px-12 bg-white border-t border-gray-100">
        <div className="flex flex-col items-center text-center mb-12 lg:mb-16">
          <span className="text-[10px] font-bold tracking-[0.4em] text-gray-400 uppercase mb-3">
            Social Feed
          </span>
          <h2 className="text-3xl md:text-4xl font-mono tracking-[0.12em] font-medium text-black uppercase">
            Follow Us
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-zinc-100 animate-pulse"
              style={{ height: `${180 + (i % 3) * 80}px` }}
            />
          ))}
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-16 lg:py-24 px-6 lg:px-12 bg-white border-t border-gray-100">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-12 lg:mb-16">
        <span className="text-[10px] font-bold tracking-[0.4em] text-gray-400 uppercase mb-3">
          Social Feed
        </span>
        <h2 className="text-3xl md:text-4xl font-mono tracking-[0.12em] font-medium text-black uppercase">
          Follow Us
        </h2>
      </div>

      {/* Masonry Grid with Fade */}
      <div className="relative max-w-6xl mx-auto">
        {/* Mobile: 1 column */}
        <div className="block sm:hidden max-h-[600px] overflow-hidden">
          {posts.map((post) => (
            <SocialPostCard key={post._id} post={post} />
          ))}
        </div>

        {/* Tablet: 2 columns */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:hidden gap-4 max-h-[600px] overflow-hidden">
          {splitIntoColumns(posts, 2).map((column, colIndex) => (
            <div key={colIndex}>
              {column.map((post) => (
                <SocialPostCard key={post._id} post={post} />
              ))}
            </div>
          ))}
        </div>

        {/* Desktop: 3 columns */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-4 lg:gap-6 max-h-[600px] overflow-hidden">
          {splitIntoColumns(posts, 3).map((column, colIndex) => (
            <div key={colIndex}>
              {column.map((post) => (
                <SocialPostCard key={post._id} post={post} />
              ))}
            </div>
          ))}
        </div>

        {/* Gradient Fade Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />

        {/* See All Button */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-2">
          <Link
            href="/social"
            className="group inline-flex items-center gap-3 border border-black px-8 py-3 transition-all hover:bg-black hover:text-white bg-white"
          >
            <span className="text-xs font-bold uppercase text-black tracking-widest group-hover:text-white">
              See All Posts
            </span>
            <ArrowRight
              size={14}
              className="text-black group-hover:text-white group-hover:translate-x-1 transition-all duration-300"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
