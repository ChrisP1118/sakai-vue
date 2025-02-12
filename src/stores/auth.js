import { defineStore, acceptHMRUpdate } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
        username: null,
        token: null,
    }
  },
  actions: {
    logIn(username, token, remember) {
        this.username = username;
        this.token = token;

        if (remember) {
            localStorage.setItem('username', username);
            localStorage.setItem('token', token);
        }
    },
    logOut() {
        this.username = null;
        this.token = null;

        localStorage.removeItem('username');
        localStorage.removeItem('token');
    },
    reload() {
        if (!localStorage.getItem('username'))
            return;

        this.username = localStorage.getItem('username');
        this.token = localStorage.getItem('token');
    },
  },
  getters: {
    isLoggedIn() {
        return this.token != null;
    },
  }
})
