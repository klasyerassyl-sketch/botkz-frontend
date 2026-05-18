import { create } from 'zustand'
import api from '../api/client'

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  loading: true,

  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', data.token)
    set({ user: data.user, token: data.token })
  },

  register: async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password })
    localStorage.setItem('token', data.token)
    set({ user: data.user, token: data.token })
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null })
  },

  fetchMe: async () => {
    try {
      const { data } = await api.get('/auth/me')
      set({ user: data, loading: false })
    } catch {
      localStorage.removeItem('token')
      set({ user: null, token: null, loading: false })
    }
  }
}))

export const useBotsStore = create((set, get) => ({
  bots: [],
  currentBot: null,

  fetchBots: async () => {
    const { data } = await api.get('/bots')
    set({ bots: data })
    if (data.length && !get().currentBot) set({ currentBot: data[0] })
  },

  setCurrentBot: (bot) => set({ currentBot: bot }),

  createBot: async (payload) => {
    const { data } = await api.post('/bots', payload)
    set(s => ({ bots: [...s.bots, data] }))
    return data
  },

  updateBot: async (id, payload) => {
    const { data } = await api.put(`/bots/${id}`, payload)
    set(s => ({ bots: s.bots.map(b => b.id === id ? data : b), currentBot: data }))
    return data
  },

  deleteBot: async (id) => {
    await api.delete(`/bots/${id}`)
    set(s => ({ bots: s.bots.filter(b => b.id !== id), currentBot: null }))
  }
}))

export const useDialogsStore = create((set) => ({
  dialogs: [],
  currentDialog: null,
  messages: [],

  fetchDialogs: async (botId) => {
    const { data } = await api.get(`/dialogs/bot/${botId}`)
    set({ dialogs: data })
  },

  setCurrentDialog: async (dialog) => {
    set({ currentDialog: dialog })
    if (dialog) {
      const { data } = await api.get(`/dialogs/${dialog.id}/messages`)
      set({ messages: data })
    }
  },

  sendMessage: async (dialogId, text) => {
    const { data } = await api.post(`/dialogs/${dialogId}/send`, { text })
    set(s => ({ messages: [...s.messages, data] }))
  },

  addMessage: (message) => set(s => ({ messages: [...s.messages, message] }))
}))
