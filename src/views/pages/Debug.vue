<script setup lang="ts">
import { onMounted, ref, computed, watch, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js';
import { Form } from '@primevue/forms';

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore();
const dt = ref();

onMounted(() => {
});

onUnmounted(() => {
});




</script>

<template>
    <div>
        <div class="card">
            <h1>Debug</h1>
        </div>

        <Fluid>

        </Fluid>     
    </div>
</template>
