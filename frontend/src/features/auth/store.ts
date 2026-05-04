import { create } from 'zustand'

import type { ManagementAuthState } from './types'

const STORAGE_KEY = 'rusuh.management-secret'

export const useManagementAuthStore = create<ManagementAuthState>((set, get) => ({
  secret: '',
  isUnlocked: false,
  initialized: false,
  init: () => {
    if (get().initialized) {
      return
    }

    if (typeof window === 'undefined') {
      set({ initialized: true })
      return
    }

    const saved = window.sessionStorage.getItem(STORAGE_KEY) ?? ''
    set({
      secret: saved,
      isUnlocked: saved.trim().length > 0,
      initialized: true,
    })
  },
  setSecret: (value, persist = true) => {
    const nextValue = value ?? ''
    if (persist && typeof window !== 'undefined') {
      window.sessionStorage.setItem(STORAGE_KEY, nextValue)
    }

    set({ secret: nextValue, isUnlocked: nextValue.trim().length > 0 })
  },
  clearSecret: () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(STORAGE_KEY)
    }
    set({ secret: '', isUnlocked: false })
  },
}))
