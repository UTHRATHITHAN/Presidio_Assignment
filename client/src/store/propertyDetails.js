"use client"
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'


export const propertyDetailsStore = create(
  persist(
    (set, get) => ({
      propertyDetails: [],
      addPropertyDetails: (properties) => set((state) => ({ propertyDetails: properties })),
      getPropertyDetails: () => get().propertyDetails
    }),  {
      name: 'propertyDetailsStore-storage', 
      storage: createJSONStorage(() => sessionStorage),
    },
  )
)