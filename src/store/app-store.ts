import { create } from 'zustand'

interface AppState {
  // UI 状态
  sidebarOpen: boolean
  theme: 'light' | 'dark' | 'system'
  
  // 加载状态
  globalLoading: boolean
  
  // 错误状态
  error: string | null
  
  // Actions
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setGlobalLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

export const useAppStore = create<AppState>((set, get) => ({
  // 初始状态
  sidebarOpen: false,
  theme: 'system',
  globalLoading: false,
  error: null,

  // Actions
  setSidebarOpen: (open: boolean) => {
    set({ sidebarOpen: open })
  },

  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }))
  },

  setTheme: (theme: 'light' | 'dark' | 'system') => {
    set({ theme })
  },

  setGlobalLoading: (loading: boolean) => {
    set({ globalLoading: loading })
  },

  setError: (error: string | null) => {
    set({ error })
  },

  clearError: () => {
    set({ error: null })
  },
}))
