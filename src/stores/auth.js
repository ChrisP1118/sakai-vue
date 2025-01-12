import { defineStore, acceptHMRUpdate } from 'pinia'
import { isShallow } from 'vue';

export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
        username: null,
        token: null,
        userSettings: null,
        currentTenantId: null
    }
  },
  actions: {
    logIn(username, token, userSettings, remember) {
        this.username = username;
        this.token = token;
        this.userSettings = userSettings;
        this.currentTenantId = userSettings.defaultTenantId;

        if (remember) {
            console.log('remembering user');
            localStorage.setItem('username', username);
            localStorage.setItem('token', token);
            localStorage.setItem('userSettings', JSON.stringify(userSettings));
            localStorage.setItem('currentTenantId', userSettings.defaultTenantId);
        }
    },
    logOut() {
        this.username = null;
        this.token = null;
        this.userSettings = null;
        this.currentTenantId = null;

        localStorage.removeItem('username');
        localStorage.removeItem('token');
        localStorage.removeItem('userSettings');
        localStorage.removeItem('currentTenantId');
    },
    reload() {
        this.username = localStorage.getItem('username');
        this.token = localStorage.getItem('token');
        this.userSettings = JSON.parse(localStorage.getItem('userSettings'));
        this.currentTenantId = localStorage.getItem('currentTenantId');
    },
    setCurrentTenant(tenantId) {
        this.currentTenantId = tenantId;
    }
  },
  getters: {
    isLoggedIn() {
        return this.token != null;
    },
    currentTenant() {
        if (!this.userSettings)
            return null;

        var tenant = this.userSettings.tenants.find(tenant => tenant.id === this.currentTenantId);
        return tenant.name;
    }
  }
})
