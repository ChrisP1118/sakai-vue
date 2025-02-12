<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast';
import { useFetchApi } from '@/utilities/ApiFetch';
import { useAuthStore } from '@/stores/auth.js';
import CitationsList from './citations/All.vue';
import MessagesList from './messages/All.vue';
import DocumentsList from './documents/All.vue';
import { DateTime } from "luxon";

const router = useRouter()
const route = useRoute()
const toast = useToast();
const { isFetching, fetchGet, fetchPut, fetchPost } = useFetchApi();
const authStore = useAuthStore();
const item = ref();
const id = ref(route.params.id);
const citation = ref(null);
const messages = ref(null);

onMounted(() => {
    loadItem();
    loadMessages();
});

function loadItem() {
    fetchGet('/v1/customer/' + id.value)
    .then(response => {
        item.value = response.body;

        if (item.value.activeCitationId)
            loadCitation(item.value.activeCitationId);
    })
}

function loadCitation(citationId) {
    fetchGet('/v1/customer/' + id.value + '/citation/' + citationId)
    .then(response => {
        citation.value = response.body;
    })
}

function loadMessages() {
    fetchPost('/v1/customer/' + id.value + '/message/query', {
        sortField: 'timestamp',
        sortOrder: 1,
        pageSize: 100
    })
    .then(response => {
        messages.value = response.body.items;
    })
}

</script>

<template>
    <Fluid>
        <div class="card">
            <Tabs value="0">
                <TabList>
                    <Tab value="0" as="div" class="flex items-center gap-2">
                        <i class="pi pi-fw pi-user" />
                        <span class="font-bold whitespace-nowrap">Customer</span>
                    </Tab>
                    <Tab value="1" as="div" class="flex items-center gap-2">
                        <i class="pi pi-fw pi-ticket" />
                        <span class="font-bold whitespace-nowrap">Citations</span>
                    </Tab>
                    <Tab value="2" as="div" class="flex items-center gap-2">
                        <i class="pi pi-fw pi-inbox" />
                        <span class="font-bold whitespace-nowrap">Messages</span>
                    </Tab>
                    <Tab value="3" as="div" class="flex items-center gap-2">
                        <i class="pi pi-fw pi-file" />
                        <span class="font-bold whitespace-nowrap">Documents</span>
                    </Tab>
                </TabList>
                <TabPanels>
                    <TabPanel value="0" as="p" class="m-0">
                        <Card class="mb-4" v-if="item">
                            <template #title>Customer</template>
                            <template #content>
                                <dl class="grid grid-cols-[repeat(2,auto)] gap-x-4 w-max">
                                    <dt>Phone Number:</dt><dd>{{ item.phoneNumber }}</dd>
                                </dl>
                            </template>
                        </Card>
                        <Card class="mb-4" v-if="citation">
                            <template #title>Active Citation</template>
                            <template #content>
                                <dl class="grid grid-cols-[repeat(2,auto)] gap-x-4 w-max">
                                    <dt>Status:</dt><dd>{{ citation.status }}</dd>
                                    <dt>Appearance Date:</dt><dd>{{ citation.appearanceDate }}</dd>
                                    <dt>Appearance Time:</dt><dd>{{ citation.appearanceTime }}</dd>
                                    <dt>Points:</dt><dd>{{ citation.citationEstimatedPoints }}</dd>
                                    <dt>Fine:</dt><dd>{{ citation.citationDeposit }}</dd>
                                </dl>
                            </template>
                        </Card>
                        <Card class="mb-4">
                            <template #title>Messages</template>
                            <template #content>
                                <Timeline :value="messages" class="w-full">
                                    <template #opposite="slotProps">
                                        <small class="text-surface-500 dark:text-surface-400">
                                            <div>{{ DateTime.fromISO(slotProps.item.timestamp).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY) }}</div>
                                            <div>{{ DateTime.fromISO(slotProps.item.timestamp).toLocaleString(DateTime.TIME_WITH_SHORT_OFFSET	) }}</div>
                                        </small>
                                    </template>
                                    <template #content="slotProps">
                                        <Message :severity="slotProps.item.messageType == 'Outbound' ? 'secondary' : 'info'">
                                            <div>
                                                {{ slotProps.item.text }}
                                            </div>
                                        </Message>                                
                                    </template>
                                </Timeline>
                            </template>
                        </Card>
                    </TabPanel>
                    <TabPanel value="1" as="p" class="m-0">
                        <CitationsList :customerId="id" />
                    </TabPanel>
                    <TabPanel value="2" as="p" class="m-0">
                        <MessagesList :customerId="id" />
                    </TabPanel>
                    <TabPanel value="3" as="p" class="m-0">
                        <DocumentsList :customerId="id" />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>
    </Fluid>
</template>
