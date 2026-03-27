"use client";
import { useSocket } from "@/context/SocketContext";
import { useUser } from "@/context/UserContext";
import { useCustomerContext, useSendMessage } from "@/hooks/useInbox";
import { Loader2, MessageSquare, Send, Shield, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const scrollRef = useRef(null);

  const { user } = useUser();
  const { data: conversation, isLoading, refetch } = useCustomerContext();
  const sendMessageMutation = useSendMessage();
  const { socket } = useSocket();

  // Socket sync & Room Join
  useEffect(() => {
    if (socket && conversation?._id) {
      socket.emit("join_room", conversation._id);

      const handleUpdate = (data) => {
        if (!data || data.conversationId === conversation._id) {
          refetch();
        }
      };

      socket.on("new_message", handleUpdate);
      socket.on("inbox_update", handleUpdate);

      return () => {
        socket.off("new_message", handleUpdate);
        socket.off("inbox_update", handleUpdate);
      };
    }
  }, [socket, conversation?._id, refetch]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [isOpen, conversation?.messages]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!message.trim() || !user) return;
    sendMessageMutation.mutate({
      content: message,
      conversationId: conversation?._id,
    });
    setMessage("");
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-black text-white flex items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all z-50 group overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          <div className="relative z-10">
            <MessageSquare size={24} />
            {/* Unread dot logic if needed */}
          </div>
        </button>
      )}

      {/* Chat Terminal Overlay */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 w-[calc(100vw-2rem)] sm:w-[420px] h-[600px] max-h-[calc(100vh-6rem)] bg-white border border-[#EDECE9] shadow-[0_32px_64px_rgba(0,0,0,0.15)] flex flex-col z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
          {/* Header */}
          <div className="h-20 bg-black text-white px-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/10 flex items-center justify-center border border-white/20">
                <Shield size={18} className="text-white" />
              </div>
              <div>
                <h3 className="text-[14px] font-bold tracking-tight uppercase">
                  Boutique Concierge
                </h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-none animate-pulse" />
                  <span className="text-[10px] text-white/60 font-bold uppercase tracking-widest">
                    Always Active
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 -mr-2 hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Transcript Area */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#FBFBFA]/50 custom-scrollbar">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4 opacity-40">
                <Loader2 size={32} className="animate-spin" />
                <p className="text-[10px] font-bold uppercase tracking-[0.2em]">
                  Synchronizing...
                </p>
              </div>
            ) : (
              <>
                {conversation?.messages.length === 0 && (
                  <div className="py-20 text-center opacity-30">
                    <p className="text-[11px] font-bold uppercase tracking-[0.4em]">
                      Inquiry Stream Initialized
                    </p>
                  </div>
                )}
                {conversation?.messages.map((msg, idx) => {
                  const isMe =
                    String(msg.sender?._id || msg.sender) === String(user?._id);
                  return (
                    <div
                      key={idx}
                      className={`flex ${isMe ? "justify-end" : "justify-start"} animate-in fade-in duration-500`}
                    >
                      <div className="max-w-[85%] space-y-2">
                        <div
                          className={`px-5 py-3.5 text-[13px] leading-relaxed tracking-tight font-semibold ${isMe ? "bg-black text-white" : "bg-[#F7F7F5] text-[#37352F]"} border border-black`}
                        >
                          {msg.content}
                        </div>
                        <div
                          className={`flex items-center gap-2 ${isMe ? "justify-end" : "justify-start"} px-1`}
                        >
                          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#37352F80]">
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            {isMe ? "• You" : "• Representative"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Interaction Bar */}
          <form
            onSubmit={handleSend}
            className="p-6 bg-white border-t border-[#EDECE9]"
          >
            <div className="relative group">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Compose inquiry..."
                disabled={isLoading}
                className="w-full bg-[#F7F7F5] border border-[#EDECE9] h-12 px-6 pr-14 text-[13px] focus:outline-none focus:border-black focus:bg-white transition-all tracking-tight disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!message.trim() || isLoading}
                className="absolute right-2 top-1.5 p-2.5 text-[#37352F40] hover:text-black transition-colors disabled:opacity-30"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
