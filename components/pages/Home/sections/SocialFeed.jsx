"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import SocialPostCard from "./SocialPostCard";
import useSocialPosts from "@/hooks/api/useSocialPosts";

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
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 max-w-7xl mx-auto">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`break-inside-avoid mb-4 bg-zinc-50 animate-pulse ${
                i % 2 === 0 ? "h-96" : "h-72"
              }`}
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

      {/* Masonry Grid */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 max-w-7xl mx-auto">
        {posts.map((post, index) => (
          <div key={post._id} className="break-inside-avoid">
            <SocialPostCard post={post} index={index} />
          </div>
        ))}
      </div>

      {/* See All Button */}
      <div className="flex justify-center mt-12">
        <Link
          href="/social"
          className="group inline-flex items-center gap-3 border border-black px-8 py-3 transition-all hover:bg-black hover:text-white"
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
    </section>
  );
}
