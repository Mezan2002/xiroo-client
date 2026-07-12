"use client";

export default function VideoEmbed({ post }) {
  const mediaUrl = post.mediaUrl || post.url;

  if (!mediaUrl) {
    return (
      <div className="w-full aspect-[4/5] bg-gray-100 flex items-center justify-center">
        <span className="text-gray-400 text-xs">No media</span>
      </div>
    );
  }

  const isVideo = post.type === "video" || mediaUrl.endsWith(".mp4");

  if (isVideo) {
    return (
      <video
        src={mediaUrl}
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover"
      />
    );
  }

  return (
    <img
      src={mediaUrl}
      alt={post.title || "Social post"}
      className="w-full h-full object-cover"
      loading="lazy"
    />
  );
}
