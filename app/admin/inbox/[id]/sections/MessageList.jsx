"use client";
import { Paperclip } from "lucide-react";
import Image from "next/image";

export default function MessageList({ messages, currentUser, customer, scrollRef }) {
  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-10 py-6 md:py-10 space-y-6 md:space-y-8 bg-white custom-scrollbar">
      {messages?.map((msg, idx) => {
        const isMe = String(msg.sender?._id || msg.sender) === String(currentUser?._id);
        const isAdminMsg = msg.senderRole === "admin";

        return (
          <div key={msg._id || idx} className={`flex ${isMe ? "justify-end" : "justify-start"} animate-in fade-in duration-500`}>
            <div className={`max-w-[85%] sm:max-w-[75%] flex flex-col ${isMe ? "items-end" : "items-start"} gap-1.5`}>
              <div className={`px-5 py-3.5 text-[14px] leading-relaxed ${isMe ? "bg-zinc-900 text-white shadow-lg" : "bg-zinc-100 text-zinc-800 border border-zinc-200/50"}`}>
                {msg.content && <p className="whitespace-pre-wrap font-medium">{msg.content}</p>}
                {msg.attachments?.map((at, i) => (
                  <div key={i} className="mt-3">
                    {at.type?.startsWith("image") ? (
                      <Image src={at.url} alt="Attachment" width={500} height={500} className="max-w-full border border-zinc-200/50" />
                    ) : (
                      <a href={at.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 bg-zinc-800/50 text-white hover:bg-zinc-700/50 transition-all">
                        <Paperclip size={14} />
                        <div className="text-left">
                          <p className="text-[11px] font-semibold truncate max-w-[150px]">{at.name}</p>
                          <p className="text-[9px] opacity-40 uppercase tracking-widest">{(at.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </a>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 px-1 opacity-70">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-900">
                  {isAdminMsg ? (isMe ? "You" : msg.sender?.firstName || "Admin") : customer.firstName}
                </span>
                <span className="text-[10px] font-semibold text-zinc-600">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
