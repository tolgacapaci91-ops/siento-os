/**
 * Centralized API & Platform Configuration
 * Managed according to Development Constitution Rule #5.
 */
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.sientoops.com/v1",
  TIMEOUT: 15000,
  IS_MOCK_MODE: true, // Toggle true for rich mock data, false for production Laravel API
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/auth/login",
      LOGOUT: "/auth/logout",
      REFRESH: "/auth/refresh",
      ME: "/auth/me",
      FORGOT_PASSWORD: "/auth/forgot-password",
      UPDATE_PASSWORD: "/auth/password",
    },
    COURSES: {
      LIST: "/courses",
      DETAIL: (id: string) => `/courses/${id}`,
      LESSON: (courseId: string, lessonId: string) => `/courses/${courseId}/lessons/${lessonId}`,
      PROGRESS: (id: string) => `/courses/${id}/progress`,
    },
    WORKSHOPS: {
      LIST: "/workshops",
      DETAIL: (id: string) => `/workshops/${id}`,
      FAVORITE: (id: string) => `/workshops/${id}/favorite`,
    },
    DOCUMENTS: {
      LIST: "/documents",
      DETAIL: (id: string) => `/documents/${id}`,
      DOWNLOAD: (id: string) => `/documents/${id}/download`,
    },
    NOTIFICATIONS: {
      LIST: "/notifications",
      MARK_READ: (id: string) => `/notifications/${id}/read`,
      MARK_ALL_READ: "/notifications/read-all",
    },
    USERS: {
      PROFILE: "/user/profile",
      AVATAR: "/user/avatar",
      BADGES: "/user/badges",
      PREFERENCES: "/user/preferences",
    },
    ADMIN: {
      STATS: "/admin/stats",
      USERS: "/admin/users",
      ROLES: "/admin/roles",
      COURSES: "/admin/courses",
      WORKSHOPS: "/admin/workshops",
      DOCUMENTS: "/admin/documents",
      AUDIT_LOGS: "/admin/audit-logs",
    },
    AI: {
      CHAT: "/ai/chat",
      SUGGESTIONS: "/ai/suggestions",
    },
  },
  STORAGE_KEYS: {
    AUTH_TOKEN: "sientoops_jwt_token",
    USER_DATA: "sientoops_user_data",
    THEME: "sientoops_theme",
    WIDGET_CONFIG: "sientoops_widget_layout",
    BOOKMARKS: "sientoops_bookmarks",
  },
};
