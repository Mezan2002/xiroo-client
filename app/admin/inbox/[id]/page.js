"use client";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import CustomerInfoSidebar from "./sections/CustomerInfoSidebar";
import MessageHeader from "./sections/MessageHeader";
import MessageInput from "./sections/MessageInput";
import MessageList from "./sections/MessageList";
import { useMessagingLogic } from "./sections/useMessagingLogic";

export default function MessagingTerminal() {
  const { id } = useParams();
  const {
    conversation, isLoading, currentUser, adminRegistry, reply, setReply,
    showPriorityMenu, setShowPriorityMenu, showAssignMenu, setShowAssignMenu,
    isInfoOpen, setIsInfoOpen, scrollRef, textareaRef, fileInputRef, handleSend,
    setStatus, setPriority, assignConversation, flagConversation
  } = useMessagingLogic(id);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-zinc-300" />
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-600">Synchronizing...</p>
      </div>
    );
  }

  const customer = conversation?.customer || conversation?.participants?.find((p) => p.role === "customer") || conversation?.participants?.[0] || {};
  const isResolved = conversation?.status === "resolved";

  return (
    <div className="fixed inset-0 top-0 left-0 lg:left-64 flex overflow-hidden bg-white font-montserrat antialiased z-50">
      <div className="flex-1 flex flex-col min-w-0 border-r border-zinc-100 h-full">
        <MessageHeader
          customer={customer}
          conversationId={id}
          isResolved={isResolved}
          setStatus={setStatus}
          isInfoOpen={isInfoOpen}
          setIsInfoOpen={setIsInfoOpen}
        />

        <MessageList
          messages={conversation?.messages}
          currentUser={currentUser}
          customer={customer}
          scrollRef={scrollRef}
        />

        <MessageInput
          reply={reply}
          setReply={setReply}
          isResolved={isResolved}
          sendMessagePending={useMessagingLogic.sendMessage?.isPending}
          handleSend={handleSend}
          fileInputRef={fileInputRef}
          textareaRef={textareaRef}
        />
      </div>

      <CustomerInfoSidebar
        customer={customer}
        conversation={conversation}
        adminRegistry={adminRegistry}
        isInfoOpen={isInfoOpen}
        setIsInfoOpen={setIsInfoOpen}
        showPriorityMenu={showPriorityMenu}
        setShowPriorityMenu={setShowPriorityMenu}
        showAssignMenu={showAssignMenu}
        setShowAssignMenu={setShowAssignMenu}
        setPriority={setPriority}
        assignConversation={assignConversation}
        flagConversation={flagConversation}
      />
    </div>
  );
}
