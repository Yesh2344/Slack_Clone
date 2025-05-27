import React, { useState, FormEvent } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { toast } from "sonner";

interface CreateChannelModalProps {
  onClose: () => void;
  onChannelCreated: (newChannelId: Id<"channels">) => void;
}

export default function CreateChannelModal({ onClose, onChannelCreated }: CreateChannelModalProps) {
  const [channelName, setChannelName] = useState("");
  const createChannel = useMutation(api.channels.create);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (channelName.trim() === "") {
      toast.error("Channel name cannot be void.");
      return;
    }
    setIsLoading(true);
    try {
      const newChannelId = await createChannel({ name: channelName });
      toast.success(`Channel "${channelName}" materialized!`);
      onChannelCreated(newChannelId);
      onClose();
    } catch (error: any) {
      toast.error("Failed to materialize channel: " + error.message);
      console.error("Create channel error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content transform scale-100 opacity-100">
        <h2 className="text-2xl font-semibold mb-6 text-text-primary">Materialize New Channel</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            placeholder="Enter channel designation (e.g., quantum-feed)"
            className="input-field mb-6 !py-3"
            autoFocus
          />
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading || !channelName.trim()}
            >
              {isLoading ? "Materializing..." : "Materialize"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
