"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCheck, Trash2, X, Info, CheckCircle2, AlertTriangle } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { formatDate } from "@/lib/utils";

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationDrawer({ isOpen, onClose }: NotificationDrawerProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } =
    useNotifications();
  const [selectedNotification, setSelectedNotification] = React.useState<any>(null);

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      default:
        return <Info className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="w-screen max-w-md glass-sidebar p-6 flex flex-col justify-between shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-indigo-500" />
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                      Bildirimler
                    </h3>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                        {unreadCount} yeni
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        title="Tümünü Okundu İşaretle"
                        className="p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-400 transition-colors"
                      >
                        <CheckCheck className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={onClose}
                      className="p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-3 overflow-y-auto max-h-[calc(100vh-140px)] pr-1">
                  {notifications.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 text-sm">
                      Bildiriminiz bulunmuyor.
                    </div>
                  ) : (
                    notifications.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedNotification(item)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer hover:border-indigo-500/50 ${
                          item.is_read
                            ? "bg-slate-100/40 dark:bg-slate-900/30 border-slate-200/40 dark:border-slate-800/40 opacity-70"
                            : "bg-white/80 dark:bg-slate-900/80 border-indigo-500/30 shadow-sm"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5">
                            <div className="mt-0.5">{getIcon(item.type)}</div>
                            <div>
                              <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                                {item.title}
                              </h4>
                              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                                {item.message}
                              </p>
                              <span className="text-[10px] text-slate-400 block mt-1.5">
                                {formatDate(item.created_at)}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(item.id);
                            }}
                            className="text-slate-400 hover:text-rose-500 p-1 opacity-0 hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Modal Popup */}
          <AnimatePresence>
            {selectedNotification && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedNotification(null)}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800"
                >
                  <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      {getIcon(selectedNotification.type)}
                      Bildirim Detayı
                    </h3>
                    <button
                      onClick={() => setSelectedNotification(null)}
                      className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      {selectedNotification.title}
                    </h4>
                    <span className="text-xs text-slate-400 block mb-4">
                      {formatDate(selectedNotification.created_at)}
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
                      {selectedNotification.message}
                    </p>
                    
                    <button
                      onClick={() => {
                        markAsRead(selectedNotification.id);
                        setSelectedNotification(null);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
                    >
                      <CheckCheck className="w-5 h-5" />
                      Okudum
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
}
