import { ref, onMounted, onUnmounted, watch } from 'vue'
import { HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import { useAuthStore } from '@/stores/auth.js';

const connection = ref(null);
const accessToken = ref(null);

export function useTestHub() {

    const restart = () => {
        if (connection.value && connection.value.state === HubConnectionState.Connected) {
            console.log("Stopping TestHub connection");
            connection.value.stop();
        }

        connection.value = getNewConnection();
        start();
    };

    const getNewConnection = () => {
        return new HubConnectionBuilder()
            .withUrl(import.meta.env.VITE_HUB_BASE_URL + "/test", { accessTokenFactory: () => {
                accessToken.value = authStore.token;
        
                return accessToken.value;
            } })
            .withAutomaticReconnect()
            .build();
    };

    async function start() {
        try {
            console.log("Starting TestHub connection");
            await connection.value.start();
            console.log("Started TestHub connection");
        } catch (err) {
            console.log(err);
            setTimeout(start, 5000);
        }
    };
    
    const authStore = useAuthStore();

    authStore.$subscribe((mutation, state) => {
        if (state.token != accessToken.value)
            restart();
    })

    if (connection.value && connection.value.state === HubConnectionState.Disconnected)
        restart();

    if (!connection.value)
        connection.value = getNewConnection();

    return { connection, restart }
}