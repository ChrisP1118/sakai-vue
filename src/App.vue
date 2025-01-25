<script setup>
import { onMounted, ref, computed, onUnmounted, watch } from 'vue';
import { useAuthStore } from '@/stores/auth.js';
import { useTestHub } from '@/utilities/TestHub';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const authStore = useAuthStore();
const testHub = useTestHub();

const onAlert = (alert) => {
    toast.add({ severity: alert.severity, summary: alert.title, detail: alert.message, life: 3000 });
};

onMounted(() => {
    authStore.reload();

    registerTestHubEvents(testHub.connection.value);
});

onUnmounted(() => {
    unregisterTestHubEvents(testHub.connection.value);
});

function registerTestHubEvents(connection) {
    connection.on('OnAlert', onAlert);
}

function unregisterTestHubEvents(connection) {
    connection.off('OnAlert', onAlert);
}

watch(testHub.connection, (newVal, oldVal) => {
    // Most pages don't need to do anything when the connection changes because the connection won't change. However, the connection changes when the user changes, which
    // could happen within App.
    unregisterTestHubEvents(oldVal);
    registerTestHubEvents(newVal);
});

</script>

<template>
    <router-view />
</template>

<style scoped></style>
