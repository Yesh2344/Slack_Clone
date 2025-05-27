import React from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id, Doc } from "../convex/_generated/dataModel";

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
    </svg>
  );
}

interface ChannelsPanelProps {
  selectedChannelId: Id<"channels"> | null;
  onSelectChannel: (channelId: Id<"channels">) => void;
  onShowCreateChannelModal: () => void;
  onNavigateToChat: () => void;
  unreadNotifications: Doc<"notifications">[];
}

export default function ChannelsPanel({
  selectedChannelId,
  onSelectChannel,
  onShowCreateChannelModal,
  onNavigateToChat,
  unreadNotifications,
}: ChannelsPanelProps) {
  const channels = useQuery(api.channels.list) || [];

  const handleSelectChannel = (channelId: Id<"channels">) => {
    onSelectChannel(channelId);
    onNavigateToChat();
    // Note: Marking as read is handled in MessagesPane when channel is viewed
  };

  const getUnreadCountForChannel = (channelId: Id<"channels">) => {
    return unreadNotifications.filter(n => n.channelId === channelId).length;
  };

  return (
    <div className="w-72 bg-background-light text-text-primary flex flex-col border-r border-background-dark shadow-lg">
      <div className="p-5 border-b border-background-dark flex justify-between items-center">
        <h2 className="text-2xl font-semibold tracking-wide">Channels</h2>
      </div>
      <nav className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {channels.map((channel) => {
          const unreadCount = getUnreadCountForChannel(channel._id);
          return (
            <button
              key={channel._id}
              onClick={() => handleSelectChannel(channel._id)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-base font-medium transition-all duration-150 ease-in-out group relative
                ${selectedChannelId === channel._id
                  ? "bg-primary text-background-dark shadow-md shadow-primary/30"
                  : "hover:bg-background-dark hover:text-primary"
                }`}
            >
              <span className="truncate group-hover:tracking-wider transition-all"># {channel.name}</span>
              {unreadCount > 0 && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
          );
        })}
        {channels.length === 0 && (
          <p className="px-4 py-2 text-sm text-text-secondary">No channels materialized.</p>
        )}
      </nav>
      <div className="p-4 border-t border-background-dark">
        <button
          onClick={onShowCreateChannelModal}
          className="btn btn-primary w-full flex items-center justify-center gap-2 text-base py-2.5 shadow-lg shadow-primary/20 hover:shadow-primary/40"
        >
          <PlusIcon className="w-5 h-5" />
          New Channel
        </button>
      </div>
    </div>
  );
}
