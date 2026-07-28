"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { User as UserIcon, Shield, Award, Bell } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Tabs } from "@/components/ui/Tabs";
import { useAuth } from "@/contexts/AuthContext";
import {
  ProfileHeader,
  ProfileCompletionWidget,
  ProfileInfoTab,
  ProfileSecurityTab,
  ProfileBadgesTab,
  ProfilePreferencesTab,
} from "@/components/profile";
import { useAchievementEngine } from "@/hooks/useAchievementEngine";
import { BadgeCelebrationModal } from "@/components/ui/BadgeCelebrationModal";

function ProfileContent() {
  const { user, updateUser } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const { celebrationBadge, closeCelebrationModal, updateProfile } = useAchievementEngine(user?.id);

  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabParam || "info");

  useEffect(() => {
    if (tabParam && ["info", "security", "badges", "preferences"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    router.push(`/profile?tab=${newTab}`, { scroll: false });
  };

  return (
    <div className="space-y-6">
      <ProfileHeader 
        user={user} 
        onAvatarUpdate={async (url) => {
          await updateUser({ avatar_url: url });
          await updateProfile("avatar");
        }}
      />
      
      <ProfileCompletionWidget user={user} />

      <Card className="p-6 space-y-6">
        <Tabs
          items={[
            { id: "info", label: "Profil Bilgileri", icon: <UserIcon className="w-4 h-4" /> },
            { id: "security", label: "Şifre & Güvenlik", icon: <Shield className="w-4 h-4" /> },
            { id: "badges", label: "Rozetler & Başarılar", icon: <Award className="w-4 h-4" /> },
            { id: "preferences", label: "Tercihler & Tema", icon: <Bell className="w-4 h-4" /> },
          ]}
          activeTab={activeTab}
          onChange={handleTabChange}
        />

        {activeTab === "info" && (
          <ProfileInfoTab
            initialName={user?.name}
            initialTitle={user?.title}
            initialBio={user?.bio}
            onSave={async (data) => {
              await updateUser(data);
              // Trigger gamification for bio and title
              if (data.bio && data.bio.trim() !== "") {
                await updateProfile("bio");
              }
              if (data.title && data.title.trim() !== "") {
                await updateProfile("title");
              }
            }}
          />
        )}

        {activeTab === "security" && <ProfileSecurityTab />}

        {activeTab === "badges" && <ProfileBadgesTab />}

        {activeTab === "preferences" && <ProfilePreferencesTab />}
      </Card>
      
      <BadgeCelebrationModal
        badge={celebrationBadge}
        onClose={closeCelebrationModal}
      />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Profil Yükleniyor...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
