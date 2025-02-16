<script setup>
import { onMounted, ref, computed, useTemplateRef } from 'vue';
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
const { isFetching, fetchGet, fetchPut, fetchPost, fetchGetAsObjectUrl } = useFetchApi();
const authStore = useAuthStore();
const item = ref();
const id = ref(route.params.customerId);
const citationId = ref(route.params.citationId);
const citation = ref(null);
const messages = ref(null);
const documentSrcs = ref({});
const newMessageText = ref("");

onMounted(() => {
    loadItem();
    loadMessages();
});

function loadItem() {
    fetchGet('/v1/customer/' + id.value)
    .then(response => {
        item.value = response.body;

        if (!citationId.value && item.value.activeCitationId)
            citationId.value = item.value.activeCitationId;

        loadCitation(citationId.value);
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

        messages.value.forEach(message => {
            if (message.documentId)
                loadDocumentAsUrl(message.documentId);
        })
    })
}

function loadDocumentAsUrl(documentId) {
    fetchGetAsObjectUrl('/v1/customer/' + id.value + '/document/' + documentId + '/file')
    .then(response => {
        documentSrcs.value[documentId] = response;
    })
}

function onSendMessage() {
    fetchPost('/v1/intake/outbound', {
        customerId: id.value,
        text: newMessageText.value
    })
    .then(response => {
        newMessageText.value = "";

        loadMessages();
    })
}

function viewDocument(documentId) {
    router.push('/customers/' + id.value + '/documents/' + documentId);
}

</script>

<template>
    <Fluid>
        <Tabs value="0">
            <TabList>
                <Tab value="0" as="div" class="flex items-center gap-2">
                    <i class="pi pi-fw pi-user" />
                    <span class="font-bold whitespace-nowrap">Customer</span>
                </Tab>
                <Tab value="1" as="div" class="flex items-center gap-2">
                    <i class="pi pi-fw pi-inbox" />
                    <span class="font-bold whitespace-nowrap">Messages</span>
                </Tab>
                <Tab value="2" as="div" class="flex items-center gap-2">
                    <i class="pi pi-fw pi-ticket" />
                    <span class="font-bold whitespace-nowrap">Citations</span>
                </Tab>
                <Tab value="3" as="div" class="flex items-center gap-2">
                    <i class="pi pi-fw pi-inbox" />
                    <span class="font-bold whitespace-nowrap">Messages</span>
                </Tab>
                <Tab value="4" as="div" class="flex items-center gap-2">
                    <i class="pi pi-fw pi-file" />
                    <span class="font-bold whitespace-nowrap">Documents</span>
                </Tab>
            </TabList>
            <TabPanels>
                <TabPanel value="0" as="p" class="m-0">
                    <Card class="mb-4" v-if="item">
                        <template #title><i class="pi pi-fw pi-user" /> Customer</template>
                        <template #content>
                            <dl class="grid grid-cols-[repeat(2,auto)] gap-x-4 w-max">
                                <dt>Phone Number:</dt><dd>{{ item.phoneNumber }}</dd>
                            </dl>
                        </template>
                    </Card>
                    <Card class="mb-4" v-if="citation">
                        <template #title><i class="pi pi-fw pi-ticket" /> {{ item && citationId == item.activeCitationId ? 'Active Citation' : 'Citation' }}</template>
                        <template #content>
                            <div class="grid grid-cols-3 gap-4">
                                <div>
                                    <span class="text-lg">Citation</span>
                                    <hr />
                                    <dl class="grid grid-cols-[repeat(2,auto)] gap-x-4 w-max">
                                        <dt>Status:</dt><dd>{{ citation.status }}</dd>
                                        <dt>Citation Number:</dt><dd>{{ citation.citationNumber }}</dd>
                                        <dt>Points:</dt><dd>{{ citation.citationEstimatedPoints }}</dd>
                                        <dt>Fine:</dt><dd>{{ citation.citationDeposit }}</dd>
                                        <dt>Cash:</dt><dd>{{ citation.citationCash }}</dd>
                                        <dt>Card:</dt><dd>{{ citation.citationCard }}</dd>
                                    </dl>
                                </div>
                                <div>
                                    <span class="text-lg">Defendant</span>
                                    <hr />
                                    <dl class="grid grid-cols-[repeat(2,auto)] gap-x-4 w-max">
                                        <dt>Name:</dt><dd>{{ citation.defendantName }}</dd>
                                        <dt>Address:</dt>
                                        <dd>
                                            {{ citation.defendantAddress1 }}<br />
                                            {{ citation.defendantCity }}, {{ citation.defendantState }} {{ citation.defendantZipCode }}
                                        </dd>
                                        <dt>Birth Date:</dt><dd>{{ citation.defendantBirthDate }}</dd>
                                        <dt>Sex:</dt><dd>{{ citation.defendantSex }}</dd>
                                        <dt>Race:</dt><dd>{{ citation.defendantRace }}</dd>
                                        <dt>Height:</dt><dd>{{ citation.defendantHeight }}</dd>
                                        <dt>Weight:</dt><dd>{{ citation.defendantWeight }}</dd>
                                        <dt>Hair:</dt><dd>{{ citation.defendantHair }}</dd>
                                        <dt>Eyes:</dt><dd>{{ citation.defendantEyes }}</dd>
                                    </dl>
                                </div>
                                <div>
                                    <span class="text-lg">Court Appearance</span>
                                    <hr />
                                    <dl class="grid grid-cols-[repeat(2,auto)] gap-x-4 w-max">
                                        <dt>Appearance Required:</dt><dd>{{ (citation.appearanceRequired ? 'Yes' : 'No') }}</dd>
                                        <dt>Appearance Date:</dt><dd>{{ citation.appearanceDate }}</dd>
                                        <dt>Appearance Time:</dt><dd>{{ citation.appearanceTime }}</dd>
                                        <dt>Appearance Location:</dt>
                                        <dd>
                                            {{ citation.appearanceLocation }}<br />
                                            {{ citation.appearanceAddress1 }}<br />
                                            {{ citation.appearanceCity }}, {{ citation.appearanceState }} {{ citation.appearanceZipCode }}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </template>
                    </Card>
                </TabPanel>
                <TabPanel value="1" as="p" class="m-0">
                    <Timeline :value="messages" class="w-full">
                        <template #opposite="slotProps">
                            <small class="text-surface-500 dark:text-surface-400">
                                <div>{{ DateTime.fromISO(slotProps.item.timestamp).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY) }}</div>
                                <div>{{ DateTime.fromISO(slotProps.item.timestamp).toLocaleString(DateTime.TIME_WITH_SHORT_OFFSET	) }}</div>
                            </small>
                        </template>
                        <template #content="slotProps">
                            <Message :severity="slotProps.item.messageType == 'Outbound' ? 'secondary' : 'info'" class="mb-4">
                                <div>
                                    {{ slotProps.item.text }}
                                    <div v-if="slotProps.item.documentId">
                                        <img :src="documentSrcs[slotProps.item.documentId]" @click="viewDocument(slotProps.item.documentId)" />
                                    </div>
                                </div>
                            </Message>                                
                        </template>
                    </Timeline>
                    <div class="justify-center mb-4 mt-4">
                        <hr />
                    </div>
                    <Form @submit="onSendMessage">
                        <div class="flex justify-center">
                            <InputGroup>
                                <InputText v-model="newMessageText" />
                                <InputGroupAddon>
                                    <Button type="submit" icon="pi pi-send" severity="info" />
                                </InputGroupAddon>
                            </InputGroup>
                        </div>
                    </Form>
                </TabPanel>
                <TabPanel value="2" as="p" class="m-0">
                    <CitationsList :customerId="id" />
                </TabPanel>
                <TabPanel value="3" as="p" class="m-0">
                    <MessagesList :customerId="id" />
                </TabPanel>
                <TabPanel value="4" as="p" class="m-0">
                    <DocumentsList :customerId="id" />
                </TabPanel>
            </TabPanels>
        </Tabs>
    </Fluid>
</template>

<style lang="scss">
    .p-timeline-event-content {
        flex: 3 !important;
    }
</style>
