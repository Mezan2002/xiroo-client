"use client";
import { CheckCircle2, Loader2, Paperclip, Send } from "lucide-react";

export default function MessageInput({
  reply,
  setReply,
  isResolved,
  sendMessagePending,
  handleSend,
  fileInputRef,
  textareaRef,
}) {
  return (
    <footer className="p-6 bg-white border-t border-zinc-100 shrink-0">
      {isResolved ? (
        <div className="flex items-center justify-center h-14 bg-emerald-50 text-emerald-700 text-[12px] font-semibold gap-2 border border-emerald-100">
          <CheckCircle2 size={16} /> This conversation was resolved. Reopen to continue.
        </div>
      ) : (
        <form onSubmit={handleSend} className="flex items-end gap-3 max-w-5xl mx-auto">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 md:p-3 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 transition-all mb-0.5"
          >
            <Paperclip size={20} />
          </button>
          <input ref={fileInputRef} type="file" hidden multiple />

          <div className="flex-1 bg-zinc-50 border border-zinc-100 focus-within:bg-white focus-within:border-zinc-300 transition-all px-2 md:px-4 py-1">
            <textarea
              ref={textareaRef}
              rows={1}
              value={reply}
              onChange={(e) => {
                setReply(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type your response…"
              disabled={sendMessagePending}
              className="w-full bg-transparent px-2 py-4 text-[14px] text-zinc-800 placeholder:text-zinc-400 outline-none resize-none max-h-[160px] leading-relaxed font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={!reply.trim() || sendMessagePending}
            className="h-12 w-12 md:h-14 md:w-14 flex items-center justify-center transition-all shadow-xl shadow-zinc-200/50 mb-0.5 shrink-0 enabled:bg-zinc-900 enabled:text-white enabled:hover:bg-zinc-700 disabled:bg-zinc-100 disabled:text-zinc-300"
          >
            {sendMessagePending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-0.5" />}
          </button>
        </form>
      )}
    </footer>
  );
}
