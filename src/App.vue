<script setup>
import { onMounted, ref, computed, onUnmounted } from 'vue';
import { useAuthStore } from '@/stores/auth.js';
import { useTestHub } from '@/utilities/TestHub';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const authStore = useAuthStore();
const testHub = useTestHub();

const onAlert = (alert) => {
    console.log('App OnAlert');
    console.log(alert);
    toast.add({ severity: alert.severity, summary: alert.title, detail: alert.message, life: 3000 });
};

onMounted(() => {
    authStore.reload();

    testHub.connection.value.on('OnAlert', onAlert);
});

onUnmounted(() => {
    testHub.connection.value.off('OnAlert', onAlert);
});

</script>

<template>
    <router-view />
</template>

<style scoped></style>
