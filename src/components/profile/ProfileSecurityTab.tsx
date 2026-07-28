"use client";

import React, { useState } from "react";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function ProfileSecurityTab() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isUpdated, setIsUpdated] = useState(false);

  const handleUpdatePassword = () => {
    setIsUpdated(true);
    setCurrentPassword("");
    setNewPassword("");
    setTimeout(() => setIsUpdated(false), 2000);
  };

  return (
    <div className="space-y-4 max-w-xl">
      <Input
        type="password"
        label="Mevcut Şifre"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />
      <Input
        type="password"
        label="Yeni Şifre"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <Button variant="primary" onClick={handleUpdatePassword} leftIcon={<Shield className="w-4 h-4" />}>
        {isUpdated ? "Şifre Güncellendi!" : "Şifreyi Güncelle"}
      </Button>
    </div>
  );
}
