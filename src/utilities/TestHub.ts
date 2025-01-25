import { ref, onMounted, onUnmounted } from 'vue'
import { HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import { useAuthStore } from '@/stores/auth.js';

const connection = ref(null);

export function useTestHub() {

    if (connection.value != null)
        return { connection };

    const authStore = useAuthStore();

    connection.value = new HubConnectionBuilder()
        .withUrl(import.meta.env.VITE_HUB_BASE_URL + "/test", { accessTokenFactory: () => {
            console.log(`Using token: ${authStore.token}`);
    
            return authStore.token;
        } })
        .build();

    connection.value.onclose(async () => {
        await startSignalR();
    });

    async function startSignalR() {
        try {
            await connection.value.start();
            console.log("SignalR Connected.");
        } catch (err) {
            console.log(err);
            setTimeout(startSignalR, 5000);
        }
    };
    
    if (connection.value.state === HubConnectionState.Disconnected)
        startSignalR();

    function start() {
        if (connection.value.state === HubConnectionState.Disconnected)
            startSignalR();
    }
  
    return { connection }
}