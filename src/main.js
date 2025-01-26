import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

import Aura from '@primevue/themes/aura';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';

import { useAuthStore } from '@/stores/auth.js';

import '@/assets/styles.scss';
import '@/assets/tailwind.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark'
        }
    }
});
app.use(ToastService);
app.use(ConfirmationService);

const authStore = useAuthStore();

router.beforeEach(async (to, from) => {
    if (!authStore.isLoggedIn && !to.fullPath.startsWith('/auth')) {
        return { name: 'login' }
    }

    if (to.params && to.params.tenantId) {
        if (to.params.tenantId != authStore.getCurrentTenantId()) {
            console.log('Switching tenant!')
            authStore.setCurrentTenantId(to.params.tenantId);
        }
    }
});

app.mount('#app');
