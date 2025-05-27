import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner"; // Removed toast import as it's not used here directly
import React, { useState, useEffect } from "react";
import { Id } from "../convex/_generated/dataModel";

import ChannelsPanel from "./ChannelsPanel";
import MessagesPane from "./MessagesPane";
import ProfileEditor from "./ProfileEditor";
import CreateChannelModal from "./CreateChannelModal";

// Icons
function UserCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
    </svg>
  );
}

function MessageSquareIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 0 1 4.5 21.75a6.75 6.75 0 0 1-6.75-6.75V9.75A6.75 6.75 0 0 1 4.5 3h15A6.75 6.75 0 0 1 26.25 9.75v5.25a6.75 6.75 0 0 1-6.75 6.75h-.94l-2.867 2.15a.75.75 0 0 1-.943-.053l-2.06-1.648a6.721 6.721 0 0 0-3.06-.753H9.75A6.707 6.707 0 0 1 4.804 21.644Zm2.25-6.394a.75.75 0 0 0-.75-.75H4.5a5.25 5.25 0 0 0-5.25 5.25v.193A5.232 5.232 0 0 0 4.5 20.25h2.55a8.223 8.223 0 0 1 3.75-.917l2.563 2.051a2.25 2.25 0 0 0 2.83 0l2.563-2.051a8.22 8.22 0 0 1 3.75.917h2.55a5.25 5.25 0 0 0 5.25-5.25v-5.25a5.25 5.25 0 0 0-5.25-5.25h-15a5.25 5.25 0 0 0-5.25 5.25v5.25a5.25 5.25 0 0 0 5.25 5.25h1.8a.75.75 0 0 0 .75-.75V15.25Z" clipRule="evenodd" />
    </svg>
  );
}

function BellIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M11.49 3.002a.75.75 0 0 1 .02 0c.99.06 1.934.312 2.802.728s1.673.96 2.348 1.634c.676.675 1.222 1.478 1.635 2.348.416.868.668 1.811.727 2.802a.75.75 0 0 1-1.499.042c-.05-.853-.26-1.668-.617-2.421a4.903 4.903 0 0 0-1.42-2.034 4.903 4.903 0 0 0-2.033-1.42c-.753-.358-1.568-.568-2.42-.618a.75.75 0 0 1 .041-1.5ZM12 2.25A9.75 9.75 0 0 0 2.25 12c0 2.629.992 5.024 2.626 6.87L3.63 20.7a.75.75 0 0 0 1.06 1.06l1.875-1.874A9.702 9.702 0 0 0 12 21.75a9.75 9.75 0 0 0 9.75-9.75c0-5.385-4.365-9.75-9.75-9.75Zm-.22 5.03a.75.75 0 0 0-1.06 0l-2.5 2.5a.75.75 0 0 0 1.06 1.06L11 9.06l3.72 3.72a.75.75 0 1 0 1.06-1.06l-4.25-4.25a.75.75 0 0 0-1.06 0Z" clipRule="evenodd" />
    </svg>
  );
}


export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background-DEFAULT text-text-primary">
      <Toaster position="top-center" theme="dark" toastOptions={{
        classNames: {
          toast: 'bg-background-light border-background-dark text-text-primary',
          success: '!bg-primary !text-background-dark',
          error: '!bg-red-600 !text-text-primary',
          info: '!bg-blue-500 !text-text-primary',
          warning: '!bg-yellow-500 !text-background-dark',
        }
      }} />
      <Authenticated>
        <AppContent />
      </Authenticated>
      <Unauthenticated>
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-full max-w-md mx-auto bg-background-light shadow-xl rounded-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-primary mb-2">Futuristic Chat</h1>
              <p className="text-lg text-text-secondary">Sign in to experience the future</p>
            </div>
            <SignInForm />
          </div>
        </div>
      </Unauthenticated>
    </div>
  );
}

function AppContent() {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const [currentView, setCurrentView] = useState<"chat" | "profile">("chat");
  const [selectedChannelId, setSelectedChannelId] = useState<Id<"channels"> | null>(null);
  const [isCreateChannelModalOpen, setIsCreateChannelModalOpen] = useState(false);

  const channels = useQuery(api.channels.list);
  const unreadNotifications = useQuery(api.notifications.getUnreadNotifications) || [];
  const hasUnread = unreadNotifications.length > 0;

  useEffect(() => {
    if (!selectedChannelId && channels && channels.length > 0) {
      setSelectedChannelId(channels[0]._id);
    }
    if (selectedChannelId && channels && !channels.find(c => c._id === selectedChannelId)) {
      setSelectedChannelId(channels.length > 0 ? channels[0]._id : null);
    }
  }, [channels, selectedChannelId]);


  if (loggedInUser === undefined) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary shadow-glow-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-background-dark text-text-primary h-16 flex justify-between items-center px-6 shadow-lg">
        <h1 className="text-3xl font-bold tracking-wider text-primary">ChatVerse</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentView("profile")}
            className="relative p-2 rounded-full hover:bg-background-light transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark"
            aria-label="Edit Profile"
          >
            {loggedInUser?.image ? (
              <img src={loggedInUser.image} alt="My Profile" className="w-9 h-9 rounded-full object-cover border-2 border-primary"/>
            ) : (
              <UserCircleIcon className="w-8 h-8 text-text-secondary hover:text-primary" />
            )}
            {hasUnread && (
              <span className="absolute top-0 right-0 block h-3 w-3 rounded-full ring-2 ring-background-dark bg-red-500 animate-pulse" />
            )}
          </button>
          <SignOutButton />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <ChannelsPanel
          selectedChannelId={selectedChannelId}
          onSelectChannel={setSelectedChannelId}
          onShowCreateChannelModal={() => setIsCreateChannelModalOpen(true)}
          onNavigateToChat={() => setCurrentView("chat")}
          unreadNotifications={unreadNotifications}
        />
        <main className="flex-1 flex flex-col bg-background-DEFAULT overflow-hidden">
          {currentView === "chat" ? (
            selectedChannelId ? (
              <MessagesPane key={selectedChannelId} channelId={selectedChannelId} />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-text-secondary p-8">
                <MessageSquareIcon className="w-28 h-28 mb-6 text-background-light opacity-50" />
                <h2 className="text-3xl font-semibold mb-3">No Channel Selected</h2>
                <p className="text-center max-w-md">
                  Select a channel from the quantum entanglement panel on the left, or materialize a new one to begin your trans-dimensional communication.
                </p>
                 {channels?.length === 0 && <p className="mt-4 text-primary animate-pulse">It appears the channel-verse is empty. Forge a new connection!</p>}
              </div>
            )
          ) : (
            <ProfileEditor onProfileUpdated={() => setCurrentView("chat")} />
          )}
        </main>
      </div>
      {isCreateChannelModalOpen && (
        <CreateChannelModal
          onClose={() => setIsCreateChannelModalOpen(false)}
          onChannelCreated={(newChannelId) => {
            setSelectedChannelId(newChannelId);
            setCurrentView("chat");
          }}
        />
      )}
    </div>
  );
}
