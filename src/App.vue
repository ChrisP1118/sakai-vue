<script setup>
import { onMounted, ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth.js';

const authStore = useAuthStore();

onMounted(() => {
    authStore.reload();
});

</script>

<template>
    <router-view />
</template>

<style scoped></style>
