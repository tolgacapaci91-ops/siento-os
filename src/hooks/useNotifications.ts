"use client";

import { useState, useEffect } from "react";
import { NotificationItem } from "@/types/database";
import { useAuth } from "@/contexts/AuthContext";

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { user } = useAuth();
  const userId = user?.id || "user_simulated_123";

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/v1/notifications");
      if (!res.ok) return;
      const json = await res.json();
      
      if (json && json.data) {
        // Filter out notifications that this user has read
        const unread = json.data.filter((n: NotificationItem) => {
          if (n.read_by && n.read_by.includes(userId)) return false;
          if (n.is_read) return false; // Legacy fallback
          return true;
        });
        setNotifications(unread);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const unreadCount = notifications.length;

  const markAsRead = async (id: string) => {
    // Optimistic UI update
    setNotifications((prev) => prev.filter((item) => item.id !== id));
    
    // API Call
    try {
      await fetch(`/api/v1/notifications/${id}/read`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    const currentNotifs = [...notifications];
    setNotifications([]);

    try {
      for (const n of currentNotifs) {
        await fetch(`/api/v1/notifications/${n.id}/read`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotification = (id: string) => {
    markAsRead(id); // Usually delete means mark as read in this context
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
}
