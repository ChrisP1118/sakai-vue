<script setup>
import { onMounted, ref, computed, onUnmounted, watch } from 'vue';
import { useAuthStore } from '@/stores/auth.js';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const authStore = useAuthStore();

onMounted(() => {
    authStore.reload();
});
</script>

<template>
    <router-view />
</template>

<style scoped></style>
