import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { toast } from "sonner";

// Updated Icon
function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
    </svg>
  );
}


interface ProfileEditorProps {
  onProfileUpdated: () => void;
}

export default function ProfileEditor({ onProfileUpdated }: ProfileEditorProps) {
  const currentUser = useQuery(api.auth.loggedInUser);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const updateProfile = useMutation(api.users.updateProfile);

  const [name, setName] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setAvatarPreview(currentUser.image || null);
    }
  }, [currentUser]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Basic client-side validation for image type and size (optional)
      if (!file.type.startsWith("image/")) {
        toast.error("Invalid file type. Please select an image.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("File is too large. Maximum 5MB allowed.");
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setIsSubmitting(true);

    let avatarStorageId: Id<"_storage"> | undefined = undefined;

    try {
      if (avatarFile) {
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": avatarFile.type },
          body: avatarFile,
        });
        const json = await result.json();
        if (!result.ok) {
          throw new Error(`Upload failed: ${JSON.stringify(json)}`);
        }
        avatarStorageId = json.storageId;
      }

      await updateProfile({
        name: name === currentUser.name ? undefined : name,
        avatarStorageId: avatarStorageId,
      });

      toast.success("Profile synchronized!");
      onProfileUpdated();
    } catch (error: any) {
      toast.error("Synchronization error: " + error.message);
      console.error("Profile update error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex-1 p-8 text-center text-text-secondary">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        Loading identity matrix...
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 md:p-8 lg:p-12 overflow-y-auto bg-background-DEFAULT">
      <div className="max-w-xl mx-auto bg-background-light p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-text-primary mb-8 tracking-wide">Identity Configuration</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">
              Designation (Name)
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field !py-2.5"
            />
          </div>
          <div>
            <label htmlFor="avatar" className="block text-sm font-medium text-text-secondary mb-1">
              Avatar Matrix (Image)
            </label>
            <div className="flex items-center gap-4 mt-2">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar preview" className="w-24 h-24 rounded-full object-cover border-2 border-primary shadow-glow-sm" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-background-dark flex items-center justify-center text-text-secondary">
                  <UserIcon className="w-12 h-12" />
                </div>
              )}
              <label htmlFor="avatar" className="cursor-pointer">
                <span className="btn btn-secondary text-sm">
                  Upload New Matrix
                </span>
                <input
                  type="file"
                  id="avatar"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="sr-only" // Hidden, triggered by label
                />
              </label>
            </div>
             {avatarFile && <p className="text-xs text-text-secondary mt-2">New matrix selected: {avatarFile.name}</p>}
          </div>
          <div className="flex justify-end gap-4 pt-6">
             <button
              type="button"
              onClick={onProfileUpdated}
              className="btn btn-ghost"
              disabled={isSubmitting}
            >
              Abort Sync
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || (name === (currentUser.name || "") && !avatarFile)}
            >
              {isSubmitting ? "Synchronizing..." : "Synchronize Identity"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
