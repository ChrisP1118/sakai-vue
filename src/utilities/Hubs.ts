import { ref, onMounted, onUnmounted, watch } from 'vue'
import { HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import { useAuthStore } from '@/stores/auth.js';

const testHubConnection = ref(null);
const testHubAccessToken = ref(null);

export function useTestHub() {
    return useHub('TestHub', '/test', testHubConnection, testHubAccessToken);
}

const workItemHubConnection = ref(null);
const workItemHubAccessToken = ref(null);

export function useWorkItemHub() {
    return useHub('WorkItemHub', '/workItem', workItemHubConnection, workItemHubAccessToken);
}

function useHub(name: string, path: string, connection, accessToken) {

    const restart = () => {
        if (connection.value && connection.value.state === HubConnectionState.Connected) {
            console.log(`Stopping ${name} connection`);
            connection.value.stop();
        }

        connection.value = getNewConnection();
        start();
    };

    const getNewConnection = () => {
        return new HubConnectionBuilder()
            .withUrl(import.meta.env.VITE_HUB_BASE_URL + path, { accessTokenFactory: () => {
                accessToken.value = authStore.token;
        
                return accessToken.value;
            } })
            .withAutomaticReconnect()
            .build();
    };

    async function start() {
        try {
            console.log(`Starting ${name} connection`);
            await connection.value.start();
            console.log(`Started ${name} connection`);
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