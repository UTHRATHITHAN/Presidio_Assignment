"use client"
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const LoginInfoStore = create(
  persist(
    (set, get) => ({
      loading: false,
      updateLoading: (loading) => set((state) => ({ loading: loading })),
      getLoading: () => get().loading
    }),  {
      name: 'loginInfo-storage', 
      storage: createJSONStorage(() => sessionStorage), 
    },
  )
)