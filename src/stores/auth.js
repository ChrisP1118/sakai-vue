import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
        username: null,
        token: null
    }
  },
  actions: {
    logIn(username, token) {
        console.log(username);
        console.log(token);
        this.username = username
        this.token = token
    },
    logOut() {
        this.username = null
        this.token = null
    }
  },
  getters: {
    // username() {
    //     return this.username;
    // }
  }
})