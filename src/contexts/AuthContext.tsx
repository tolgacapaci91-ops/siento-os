"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/types/database";
import { API_CONFIG } from "@/config/apiConfig";

const MOCK_USER: User = {
  id: "usr_101",
  uuid: "550e8400-e29b-41d4-a716-446655440000",
  name: "Tolga Çapacı",
  email: "tolga@sientoops.com",
  avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
  role: "admin",
  title: "Senior Fullstack Software Architect",
  bio: "SientoOps Platform & Cloud DevOps mimarilerini tasarlıyor.",
  status: "active",
  organization_id: "org_siento_01",
  created_at: "2026-01-15T09:00:00Z",
  updated_at: "2026-07-20T12:00:00Z",
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email?: string, password?: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updatedFields: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const res = await fetch("/api/v1/users");
        if (res.ok) {
          const json = await res.json();
          const users: User[] = json.data;

          const storedUserStr = localStorage.getItem(API_CONFIG.STORAGE_KEYS.USER_DATA);
          if (storedUserStr) {
            try {
              const storedUser = JSON.parse(storedUserStr);
              const dbUser = users.find(u => u.id === storedUser.id);
              if (dbUser) {
                setUser(dbUser);
                localStorage.setItem(API_CONFIG.STORAGE_KEYS.USER_DATA, JSON.stringify(dbUser));
              } else {
                setUser(null);
                localStorage.removeItem(API_CONFIG.STORAGE_KEYS.USER_DATA);
              }
            } catch (e) {
              setUser(null);
              localStorage.removeItem(API_CONFIG.STORAGE_KEYS.USER_DATA);
            }
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Failed to fetch user session from DB", err);
        const storedUser = localStorage.getItem(API_CONFIG.STORAGE_KEYS.USER_DATA);
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch {
            setUser(MOCK_USER);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email?: string, password?: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/v1/users");
      if (res.ok) {
        const json = await res.json();
        const users: User[] = json.data;
        
        const foundUser = users.find(u => u.email === email);

        // Fallback for demo admin/student account on Cloudflare Workers (where DB is empty)
        if (email === "tolga@sientoops.com" || email === "admin@sientoops.com" || foundUser) {
          const userObj = foundUser || { ...MOCK_USER, email, role: email?.includes("admin") ? "admin" : "student" };
          
          if (!foundUser && password !== "password123") {
            alert("Hatalı e-posta veya şifre!");
            return false;
          }

          setUser(userObj);
          localStorage.setItem(API_CONFIG.STORAGE_KEYS.USER_DATA, JSON.stringify(userObj));
          localStorage.setItem(API_CONFIG.STORAGE_KEYS.AUTH_TOKEN, "mock_jwt_token_siento_2026");
          return true;
        } else {
          alert("Hatalı e-posta veya şifre!");
          return false;
        }
      }
    } catch (err) {
      console.error("Giriş hatası:", err);
      alert("Giriş işlemi sırasında sunucuya bağlanılamadı!");
    } finally {
      setIsLoading(false);
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(API_CONFIG.STORAGE_KEYS.USER_DATA);
    localStorage.removeItem(API_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
  };

  const updateUser = async (updatedFields: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updatedFields, updated_at: new Date().toISOString() };
    setUser(updated);
    localStorage.setItem(API_CONFIG.STORAGE_KEYS.USER_DATA, JSON.stringify(updated));

    try {
      await fetch(`/api/v1/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });
    } catch (err) {
      console.error("Failed to persist user update", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
