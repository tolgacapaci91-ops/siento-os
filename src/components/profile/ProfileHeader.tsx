"use client";

import React, { useRef, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { User } from "@/types/database";
import { Camera, Loader2 } from "lucide-react";

interface ProfileHeaderProps {
  user: User | null;
  onAvatarUpdate?: (url: string) => void;
}

export const ProfileHeader = React.memo(function ProfileHeader({ user, onAvatarUpdate }: ProfileHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onAvatarUpdate) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "image");

      const res = await fetch("/api/v1/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data?.file_url) {
          onAvatarUpdate(json.data.file_url);
        }
      }
    } catch (err) {
      console.error("Avatar upload error", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-slate-500/10 dark:from-indigo-900/40 dark:via-purple-900/30 dark:to-slate-900/60 border-indigo-500/20 dark:border-indigo-500/30">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          <Avatar src={user?.avatar_url} name={user?.name} size="xl" />
          <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            {isUploading ? (
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            ) : (
              <Camera className="w-6 h-6 text-white" />
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <div className="text-center md:text-left space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{user?.name}</h1>
          <p className="text-sm text-indigo-600 dark:text-indigo-400 font-bold">{user?.title || "SientoOps User"}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{user?.email}</p>
        </div>
      </div>
    </Card>
  );
});
