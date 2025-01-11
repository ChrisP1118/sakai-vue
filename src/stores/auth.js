import { defineStore, acceptHMRUpdate } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
        username: null,
        token: null,
        userSettings: null
    }
  },
  actions: {
    logIn(username, token, userSettings) {
        this.username = username
        this.token = token
        this.userSettings = userSettings
    },
    logOut() {
        this.username = null
        this.token = null
        this.userSettings = null
    }
  },
  getters: {
    currentTenant() {
        if (!this.userSettings)
            return null;

        var tenant = this.userSettings.tenants.find(tenant => tenant.id === this.userSettings.defaultTenantId);
        return tenant.name;
    }
  }
})
