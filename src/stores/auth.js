import { defineStore, acceptHMRUpdate } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
        username: null,
        token: null
    }
  },
  actions: {
    logIn(username, token) {
        this.username = username
        this.token = token
    },
    logOut() {
        this.username = null
        this.token = null
    }
  },
  getters: {
  }
})
