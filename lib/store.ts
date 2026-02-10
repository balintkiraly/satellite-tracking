import { create } from "zustand"

type Store = {
  time: Date
  setTime: (t: Date) => void
}

export const useStore = create<Store>((set) => ({
  time: new Date(),
  setTime: (time) => set({ time }),
}))
