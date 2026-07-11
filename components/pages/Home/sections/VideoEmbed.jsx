"use client";

import Image from "next/image";
import { useState } from "react";

export default function VideoEmbed({ post }) {
  const [loadEmbed, setLoadEmbed] = useState(false);

  // Facebook posts - load iframe directly
  if (post.platform === "facebook") {
    return (
      <div className="h-72 relative w-full bg-gray-50 overflow-hidden">
        <iframe
          src={post.embedUrl}
          className="absolute top-0 left-0 w-full h-full border-0"
          title={post.title || "Facebook post"}
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  // For video content, show thumbnail with play button
  if (post.type === "video") {
    return (
      <div className="relative w-full h-full bg-gray-100">
        {loadEmbed ? (
          <iframe
            src={post.embedUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={post.title || `${post.platform} video`}
            loading="lazy"
          />
        ) : (
          <button
            onClick={() => setLoadEmbed(true)}
            className="relative w-full h-full"
          >
            {/* Thumbnail */}
            {post.thumbnailUrl ? (
              <Image
                width={1000}
                height={1000}
                src={post.thumbnailUrl}
                alt={post.title || `${post.platform} video`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-gray-400">
                  <svg
                    className="w-16 h-16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            )}

            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg
                  className="w-6 h-6 text-black ml-1"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>

            {/* Platform badge */}
            <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/70 backdrop-blur-sm rounded text-white text-xs font-medium">
              {post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}{" "}
              Video
            </div>
          </button>
        )}
      </div>
    );
  }

  // For image content (Instagram, etc.)
  return (
    <div className="relative w-full h-full bg-gray-100">
      <iframe
        src={post.embedUrl}
        className="w-full h-full border-0"
        title={post.title || `${post.platform} post`}
        loading="lazy"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}
