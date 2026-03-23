"use client";
import ConfirmationModal from "@/components/admin/ConfirmationModal";
import { Button } from "@/components/ui/Button";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Flag,
  Loader2,
  MoreHorizontal,
  Paperclip,
  Search,
  Send,
  Shield,
  Smile,
  Trash2,
  User,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const INITIAL_MESSAGES = [
  {
    id: "h1",
    sender: "John Doe",
    message:
      "Is the Xiroo™ LED Cap Lamp back in stock? I'd like to order 5 for my team.",
    time: "10:42 AM",
    type: "received",
  },
  {
    id: "h2",
    sender: "Admin",
    message: "Initial inquiry registered. Checking inventory across all nodes.",
    time: "10:45 AM",
    type: "sent",
  },
  {
    id: "h3",
    sender: "John Doe",
    message:
      "Thank you. Let me know if you can ship them to Dhaka by tomorrow.",
    time: "10:48 AM",
    type: "received",
  },
];

export default function MessagingTerminalFunctional() {
  const router = useRouter();
  const { id } = useParams();
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [reply, setReply] = useState("");
  const [status, setStatus] = useState("Online Now");
  const [caseStatus, setCaseStatus] = useState("active"); // active, resolved
  const [isFlagged, setIsFlagged] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [isPurgeModalOpen, setIsPurgeModalOpen] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const scrollRef = useRef(null);
  const menuRef = useRef(null);
  const emojiRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [reply]);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmojis(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!reply.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      sender: "Admin",
      message: reply,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "sent",
    };

    setMessages((prev) => [...prev, newMessage]);
    setReply("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    // Simulate Client Response
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const response = {
          id: (Date.now() + 1).toString(),
          sender: "John Doe",
          message:
            "Understood. Please confirm the shipping timeline as soon as possible. ৳2,400 is the rate, correct?",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          type: "received",
        };
        setMessages((prev) => [...prev, response]);
      }, 2000);
    }, 1000);
  };

  const finalizeCase = () => {
    setCaseStatus("resolved");
    const closingMsg = {
      id: "finalize-" + Date.now(),
      sender: "System",
      message: "✓ Case officially finalized and archived by Admin.",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "system",
    };
    setMessages((prev) => [...prev, closingMsg]);
  };

  const purgeRecords = () => {
    setIsPurgeModalOpen(true);
  };

  const confirmPurge = () => {
    setMessages([]);
    setReply("");
  };

  const handleFileAttach = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const msg = {
        id: "file-" + Date.now(),
        sender: "System",
        message: `📎 File attachment detected: ${file.name} (${(file.size / 1024).toFixed(1)} KB). Processing upload...`,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        type: "system",
      };
      setMessages((prev) => [...prev, msg]);
    }
  };

  const addEmoji = (emoji) => {
    setReply((prev) => prev + emoji);
    setShowEmojis(false);
    textareaRef.current?.focus();
  };

  return (
    <div className="fixed inset-0 top-0 left-64 bg-white flex overflow-hidden font-montserrat antialiased z-50">
      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={isPurgeModalOpen}
        onClose={() => setIsPurgeModalOpen(false)}
        onConfirm={confirmPurge}
        title="Purge Operational Records"
        message="CRITICAL: You are about to permanently purge all conversation history for this session. This action is irreversible and will remove all intelligence metadata. Proceed?"
        confirmText="Purge History"
        type="danger"
      />

      {/* Main Conversation Hub */}
      <div className="flex-1 flex flex-col bg-[#F7F7F5] relative border-r border-[#EDECE9]">
        {/* Boutique Header: High Visibility */}
        <div className="h-16 bg-white flex items-center justify-between px-8 shrink-0 z-10 shadow-sm border-b border-[#EDECE9]">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="text-[#37352F80] hover:text-black transition-all p-1.5 hover:bg-[#F7F7F5] rounded-none"
            >
              <ArrowLeft size={18} strokeWidth={2.5} />
            </button>
            <div className="w-10 h-10 bg-black text-white rounded-none flex items-center justify-center font-bold text-[14px] shadow-lg shadow-black/10">
              J
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-bold text-[#37352F] leading-tight tracking-tight">
                John Doe
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <div
                  className={`w-2 h-2 rounded-full ${status === "Online Now" ? "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]" : "bg-gray-300"}`}
                />
                <span
                  className={`text-[10px] font-bold uppercase tracking-widest ${status === "Online Now" ? "text-green-700" : "text-gray-500"}`}
                >
                  {status}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-7 text-[#37352F60] relative">
            {isSearching ? (
              <div className="flex items-center bg-[#F7F7F5] border border-[#EDECE9] px-3 py-1 animate-in fade-in zoom-in-95 duration-200">
                <Search size={14} className="text-[#37352F40] mr-2" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Find in chat..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onBlur={() => !searchQuery && setIsSearching(false)}
                  className="bg-transparent text-[12px] font-medium outline-none w-40 text-black placeholder:text-[#37352F40]"
                />
              </div>
            ) : (
              <Search
                size={19}
                onClick={() => setIsSearching(true)}
                className="hover:text-black cursor-pointer transition-colors"
              />
            )}

            <div className="relative" ref={menuRef}>
              <MoreHorizontal
                size={19}
                onClick={() => setShowMenu(!showMenu)}
                className={`hover:text-black cursor-pointer transition-colors ${showMenu ? "text-black" : ""}`}
              />

              {showMenu && (
                <div className="absolute right-0 mt-4 w-56 bg-white border border-[#EDECE9] shadow-2xl py-2 z-60 animate-in fade-in slide-in-from-top-2 duration-200">
                  <button className="w-full text-left px-4 py-2 text-[12px] font-bold uppercase tracking-widest text-[#37352F80] hover:bg-[#F7F7F5] hover:text-black transition-all">
                    Export Conversation
                  </button>
                  <button className="w-full text-left px-4 py-2 text-[12px] font-bold uppercase tracking-widest text-[#37352F80] hover:bg-[#F7F7F5] hover:text-black transition-all">
                    Mute Alerts
                  </button>
                  <button
                    onClick={() => {
                      purgeRecords();
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-[12px] font-bold uppercase tracking-widest text-red-600 hover:bg-red-50 transition-all border-t border-[#EDECE9] mt-1 pt-3"
                  >
                    Clear History
                  </button>
                </div>
              )}
            </div>

            {caseStatus === "resolved" && (
              <span className="text-[10px] bg-green-100 text-green-700 px-3 py-1 font-bold uppercase tracking-[0.2em] animate-in fade-in zoom-in-95">
                Resolved
              </span>
            )}
          </div>
        </div>

        {/* Cinematic Chat Window: Solid Separation */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-10 space-y-8 bg-[#F7F7F5] custom-scrollbar relative scroll-smooth"
        >
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('https://i.pinimg.com/originals/97/c0/07/97c00754774d27ee05193060ef7da012.jpg')] bg-repeat bg-contain" />

          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full space-y-4 opacity-20">
              <Clock size={48} />
              <p className="text-[11px] font-bold uppercase tracking-[0.4em]">
                Historical Void
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.type === "sent" ? "justify-end" : msg.type === "system" ? "justify-center" : "justify-start"} relative z-10`}
            >
              {msg.type === "system" ? (
                <div className="bg-white/50 border border-[#EDECE9] px-6 py-2 text-[10px] font-bold text-[#37352F40] uppercase tracking-[0.2em] rounded-none">
                  {msg.message}
                </div>
              ) : (
                <div
                  className={`max-w-[70%] relative group shadow-sm border border-[#EDECE9]/50 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                    msg.type === "sent"
                      ? "bg-black text-white p-5 rounded-none shadow-black/5"
                      : "bg-white text-[#37352F] p-5 rounded-none"
                  }`}
                >
                  <p
                    className={`text-[13px] leading-relaxed font-medium whitespace-pre-wrap ${
                      msg.type === "sent" ? "text-white" : "text-[#37352F]"
                    }`}
                  >
                    {msg.message}
                  </p>
                  <div className="flex items-center gap-2 mt-3 opacity-60 group-hover:opacity-100 transition-opacity">
                    <span
                      className={`text-[9px] font-bold uppercase tracking-widest leading-none ${msg.type === "sent" ? "text-white/60" : "text-[#37352F80]"}`}
                    >
                      {msg.time}
                    </span>
                    {msg.type === "sent" && (
                      <div className="flex items-center -space-x-1 translate-y-[0.5px]">
                        <CheckCircle2 size={11} className="text-blue-400" />
                        <CheckCircle2 size={11} className="text-blue-400" />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start relative z-10 animate-pulse">
              <div className="bg-white text-[#37352F40] p-4 rounded-none border border-[#EDECE9]/50 flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                  Customer is typing...
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Boutique Solid Input Bar */}
        <form
          onSubmit={handleSend}
          className="p-6 bg-white flex items-end gap-6 border-t border-[#EDECE9] shrink-0"
        >
          <div className="flex items-center gap-5 text-[#37352F80] mb-3">
            <div className="relative" ref={emojiRef}>
              <Smile
                size={22}
                onClick={() => setShowEmojis(!showEmojis)}
                className={`hover:text-black cursor-pointer transition-transform hover:scale-110 active:scale-95 ${showEmojis ? "text-black" : ""}`}
              />
              {showEmojis && (
                <div className="absolute bottom-full left-0 mb-4 bg-white border border-[#EDECE9] shadow-2xl p-4 z-60 flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
                  {["✨", "📦", "✅", "🔥", "🚀", "⭐"].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => addEmoji(emoji)}
                      className="text-lg hover:scale-125 transition-transform"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileAttach}
            />
            <Paperclip
              size={22}
              onClick={() => fileInputRef.current?.click()}
              className="hover:text-black cursor-pointer transition-transform hover:scale-110 active:scale-95"
            />
          </div>
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              rows={1}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={
                caseStatus === "resolved"
                  ? "Case resolved. Dispatch locked."
                  : "Dispatch official response..."
              }
              disabled={caseStatus === "resolved"}
              className="w-full bg-[#F7F7F5] border border-[#EDECE9] focus:border-black focus:bg-white rounded-none px-6 py-4 text-[13px] font-medium outline-none transition-all placeholder:text-[#37352F40] disabled:opacity-50 resize-none max-h-[200px] custom-scrollbar"
            />
          </div>
          <button
            type="submit"
            disabled={!reply.trim() || caseStatus === "resolved"}
            className={`h-12 px-10 flex items-center justify-center transition-all rounded-none font-bold text-[11px] uppercase tracking-[0.2em] shadow-xl mb-0.5 ${
              reply && caseStatus !== "resolved"
                ? "bg-black text-white hover:bg-[#111111] hover:-translate-y-0.5 active:translate-y-0"
                : "bg-[#37352F20] text-white cursor-not-allowed opacity-40"
            }`}
          >
            <Send size={16} className="mr-3" /> Dispatch
          </button>
        </form>
      </div>

      {/* Right Sidebar: Architecturally Distinct Intelligence */}
      <div className="w-[330px] border-l border-[#EDECE9] flex flex-col bg-white overflow-y-auto custom-scrollbar">
        {/* Identity Hub: Solid Header */}
        <div className="p-8 text-center space-y-6 border-b border-[#EDECE9] bg-[#F7F7F5]/40">
          <div className="w-24 h-24 bg-white border-2 border-[#EDECE9] rounded-none flex items-center justify-center mx-auto mb-4 font-bold text-[36px] text-black shadow-2xl shadow-black/5">
            J
          </div>
          <div className="space-y-1.5">
            <h3 className="text-[20px] font-bold text-black tracking-tight">
              John Doe
            </h3>
            <p className="text-[12px] text-[#37352F] font-bold tracking-tight opacity-70">
              john.doe@example.com
            </p>
          </div>
          <div className="pt-3 flex flex-col gap-2.5 px-6">
            <span className="w-full py-2 bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-none shadow-xl shadow-black/10">
              Platinum Member
            </span>
            <button
              onClick={() => router.push("/admin/orders")}
              className="w-full py-2 bg-white border border-[#EDECE9] text-[10px] font-bold uppercase tracking-[0.3em] text-black rounded-none hover:bg-black hover:text-white transition-all"
            >
              14 Transactions
            </button>
          </div>
        </div>

        {/* Operation Zone: High Contrast Buttons */}
        <div className="p-10 space-y-10">
          <div className="space-y-6">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.5em] text-[#37352F] opacity-40">
              Case Management
            </h4>
            <div className="space-y-2.5">
              <Button
                variant="outline"
                disabled={caseStatus === "resolved"}
                onClick={finalizeCase}
                className={`w-full justify-start h-12 border-2 border-[#EDECE9] rounded-none text-[11px] font-bold tracking-tight transition-all px-5 ${
                  caseStatus === "resolved"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-white text-black hover:bg-black hover:text-white hover:border-black"
                }`}
              >
                <CheckCircle2
                  size={16}
                  className={`${caseStatus === "resolved" ? "text-green-700" : "text-green-600"} mr-4`}
                />{" "}
                {caseStatus === "resolved" ? "Case Resolved" : "Finalize Case"}
              </Button>
              <Button
                variant={isFlagged ? "primary" : "outline"}
                onClick={() => setIsFlagged(!isFlagged)}
                className={`w-full justify-start h-12 border-2 rounded-none text-[11px] font-bold tracking-tight px-5 transition-all ${
                  isFlagged
                    ? "bg-blue-600 border-blue-600 shadow-lg shadow-blue-600/20"
                    : "border-[#EDECE9] text-black hover:bg-zinc-50"
                }`}
              >
                <Flag
                  size={16}
                  className={`${isFlagged ? "text-white" : "text-blue-600"} mr-4`}
                />
                <span className={isFlagged ? "text-white" : "text-black"}>
                  {isFlagged ? "Flagged for Review" : "Flag for Review"}
                </span>
              </Button>
              <Button
                variant="outline"
                onClick={purgeRecords}
                className="w-full justify-start h-12 bg-white border-2 border-[#EDECE9] hover:bg-red-600 hover:text-white hover:border-red-600 rounded-none text-[11px] font-bold text-black tracking-tight transition-all px-5 group"
              >
                <Trash2
                  size={16}
                  className="text-red-600 mr-4 group-hover:text-white"
                />{" "}
                Purge Records
              </Button>
            </div>
          </div>

          <div className="space-y-6 pt-10 border-t border-[#EDECE9]">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.5em] text-[#37352F] opacity-40">
              Security Metadata
            </h4>
            <div className="space-y-5">
              <div className="flex gap-4 items-center group cursor-default">
                <div className="w-10 h-10 bg-black text-white border border-black rounded-none flex items-center justify-center shrink-0 shadow-lg shadow-black/10">
                  <Shield size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-bold text-black leading-none mb-1">
                    Platform Origin
                  </p>
                  <p className="text-[11px] text-[#37352F] font-bold opacity-60">
                    Boutique Core • 1h
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-center group cursor-default">
                <div className="w-10 h-10 bg-[#F7F7F5] border border-[#EDECE9] rounded-none flex items-center justify-center shrink-0">
                  <User size={18} className="text-[#37352F80]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-bold text-black leading-none mb-1">
                    Support REQ ID
                  </p>
                  <p className="text-[11px] text-[#37352F] font-bold opacity-60 truncate underline decoration-[#EDECE9] underline-offset-2">
                    XRO-8F8C-2D3E
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
