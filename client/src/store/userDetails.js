"use client"
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'


export const userDetailsStore = create(
  persist(
    (set, get) => ({
      userDetails: {},
      addUserDetails: (userDetail) => set((state) => ({ userDetails: userDetail })),
      getUserDetails: () => get().userDetails
    }),  {
      name: 'userDetails-storage',
      storage: createJSONStorage(() => sessionStorage), 
    },
  )
)

export const propertyStore = create(
  persist(
    (set, get) => ({
      property: {},
      addPropertyDetails: (property) => set((state) => ({ property: property })),
      getPropertyDetails: () => get().property
    }),  {
      name: 'property-storage', 
      storage: createJSONStorage(() => sessionStorage), 
    },
  )
)

