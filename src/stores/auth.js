import { defineStore, acceptHMRUpdate } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
        username: null,
        token: null,
        userSettings: null,
        currentTenantId: null,
        allTenants: null
    }
  },
  actions: {
    logIn(username, token, userSettings, remember) {
        this.username = username;
        this.token = token;
        this.userSettings = userSettings;
        this.currentTenantId = userSettings.defaultTenantId;
        this.allTenants = userSettings.allTenants;

        if (remember) {
            localStorage.setItem('username', username);
            localStorage.setItem('token', token);
            localStorage.setItem('userSettings', JSON.stringify(userSettings));
            localStorage.setItem('currentTenantId', userSettings.defaultTenantId);
            localStorage.setItem('allTenants', userSettings.allTenants);
        }
    },
    logOut() {
        this.username = null;
        this.token = null;
        this.userSettings = null;
        this.currentTenantId = null;
        this.allTenants = null;

        localStorage.removeItem('username');
        localStorage.removeItem('token');
        localStorage.removeItem('userSettings');
        localStorage.removeItem('currentTenantId');
        localStorage.removeItem('allTenants');
    },
    reload() {
        if (!localStorage.getItem('username'))
            return;

        this.username = localStorage.getItem('username');
        this.token = localStorage.getItem('token');
        this.userSettings = JSON.parse(localStorage.getItem('userSettings'));
        this.currentTenantId = localStorage.getItem('currentTenantId');
        this.allTenants = localStorage.getItem('allTenants');
    },
    setCurrentTenantId(tenantId) {
        if (this.currentTenantId == tenantId)
            return;

        // We can't use ApiFetch here, because it has a circular dependency with authStore
        const fullUrl = import.meta.env.VITE_API_BASE_URL + '/v1/account/defaultTenant';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + this.token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: tenantId}),
        }
        
        return fetch(fullUrl, requestOptions)
            .then(response => response.json().then(data => ({status: response.status, body: data})))
            .then(response => {
                if (response.status == 200) {
                    this.userSettings = response.body.userSettings;
                    this.currentTenantId = tenantId;

                    if (localStorage.getItem('username')) {
                        localStorage.setItem('userSettings', JSON.stringify(this.userSettings));
                        localStorage.setItem('currentTenantId', this.userSettings.defaultTenantId);            
                    }
                }
            });
    },
    getCurrentTenantId() {
        return this.currentTenantId;
    },
  },
  getters: {
    isLoggedIn() {
        return this.token != null;
    },
    currentTenantName() {
        if (!this.userSettings)
            return null;

        var tenant = this.userSettings.tenants.find(tenant => tenant.id === this.currentTenantId);

        if (!tenant)
            return null;

        return tenant.name;
    }
  }
})
