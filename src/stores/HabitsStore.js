import { create } from 'zustand'
import { getHabitsByUser, createHabit, updateHabit, deleteHabit } from '../autoBarrell'

export const useHabitsStore = create((set, get) => ({
  habits: [],
  loading: false,

  fetchHabits: async (user_id) => {
    set({ loading: true })
    try {
      const habits = await getHabitsByUser(user_id)
      set({ habits })
      return habits
    } finally {
      set({ loading: false })
    }
  },

  addHabit: async (payload) => {
    const h = await createHabit(payload)
    set({ habits: [h, ...get().habits] })
    return h
  },

  editHabit: async (id, changes) => {
    const updated = await updateHabit(id, changes)
    set({ habits: get().habits.map((h) => (h.id === id ? updated : h)) })
    return updated
  },

  removeHabit: async (id) => {
    await deleteHabit(id)
    set({ habits: get().habits.filter((h) => h.id !== id) })
  },
}))
