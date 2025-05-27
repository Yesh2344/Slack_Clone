import React, { useState, useEffect, useRef, FormEvent } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id, Doc } from "../convex/_generated/dataModel";
import { toast } from "sonner";

function PaperAirplaneIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
    </svg>
  );
}

interface MessagesPaneProps {
  channelId: Id<"channels">;
}

export default function MessagesPane({ channelId }: MessagesPaneProps) {
  const messages = useQuery(api.messages.list, { channelId }) || [];
  const sendMessage = useMutation(api.messages.send);
  const updateTypingStatus = useMutation(api.typing.updateTypingStatus);
  const typingUsers = useQuery(api.typing.getTypingUsers, { channelId }) || [];
  const markChannelNotificationsAsRead = useMutation(api.notifications.markChannelNotificationsAsRead);

  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelInfo = useQuery(api.channels.list)?.find(c => c._id === channelId);
  const loggedInUser = useQuery(api.auth.loggedInUser);

  const typingTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mark notifications as read when channel is viewed
  useEffect(() => {
    if (channelId) {
      markChannelNotificationsAsRead({ channelId });
    }
  }, [channelId, markChannelNotificationsAsRead]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    updateTypingStatus({ channelId, isTyping: true });
    typingTimeoutRef.current = window.setTimeout(() => {
      updateTypingStatus({ channelId, isTyping: false });
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      // Check if updateTypingStatus is available before calling
      if (updateTypingStatus && channelId) {
         updateTypingStatus({ channelId, isTyping: false });
      }
    };
  }, [channelId, updateTypingStatus]);


  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !loggedInUser) return;
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    updateTypingStatus({ channelId, isTyping: false });
    try {
      await sendMessage({ channelId, content: newMessage });
      setNewMessage("");
    } catch (error: any) {
      toast.error("Transmission error: " + error.message);
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background-DEFAULT">
      <header className="p-4 border-b border-background-dark bg-background-light shadow-sm">
        <h2 className="text-xl font-semibold text-text-primary tracking-wide">
          # {channelInfo?.name || "Loading Channel..."}
        </h2>
      </header>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg: Doc<"messages"> & { authorName?: string, authorImage?: string }) => (
          <div key={msg._id} className={`flex items-start gap-3 ${msg.authorId === loggedInUser?._id ? "justify-end" : ""}`}>
            {msg.authorId !== loggedInUser?._id && (
              msg.authorImage ? (
                <img
                  src={msg.authorImage}
                  alt={msg.authorName || "User"}
                  className="w-10 h-10 rounded-full object-cover border-2 border-background-dark"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-background-dark flex items-center justify-center text-primary font-semibold text-lg">
                  {(msg.authorName || "?").substring(0, 1).toUpperCase()}
                </div>
              )
            )}
            <div className={`max-w-xl p-3 rounded-xl ${
              msg.authorId === loggedInUser?._id
                ? "bg-primary text-background-dark rounded-br-none"
                : "bg-background-light text-text-primary rounded-bl-none"
            }`}>
              {msg.authorId !== loggedInUser?._id && (
                <span className={`font-semibold text-sm mb-0.5 block ${msg.authorId === loggedInUser?._id ? "text-primary-light" : "text-primary"}`}>
                  {msg.authorName}
                </span>
              )}
              <p className="text-base whitespace-pre-wrap break-words">{msg.content}</p>
              <span className={`text-xs mt-1 block ${
                msg.authorId === loggedInUser?._id ? "text-primary-light opacity-70 text-right" : "text-text-secondary text-left"
              }`}>
                {new Date(msg._creationTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
             {msg.authorId === loggedInUser?._id && (
              msg.authorImage ? (
                <img
                  src={msg.authorImage}
                  alt={msg.authorName || "User"}
                  className="w-10 h-10 rounded-full object-cover border-2 border-background-dark"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-background-dark flex items-center justify-center text-primary font-semibold text-lg">
                  {(msg.authorName || "?").substring(0, 1).toUpperCase()}
                </div>
              )
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
        {messages.length === 0 && (
          <div className="text-center text-text-secondary pt-10">
            <p className="text-lg">No transmissions in this channel yet.</p>
            <p>Be the first to broadcast a message!</p>
          </div>
        )}
      </div>
      <div className="h-5 px-4 text-xs text-text-secondary italic">
        {typingUsers.length > 0 && (
          <span>
            {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
          </span>
        )}
      </div>
      <form onSubmit={handleSendMessage} className="p-4 border-t border-background-dark bg-background-light">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            placeholder={`Message #${channelInfo?.name || "channel"}...`}
            className="input-field flex-1 !py-2.5"
            aria-label="Message input"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="btn btn-primary !px-5 !py-2.5 rounded-lg disabled:opacity-60 disabled:shadow-none flex items-center justify-center"
            aria-label="Send message"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
