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
                    <i class="pi pi-fw pi-ticket" />
                    <span class="font-bold whitespace-nowrap">{{ item && citationId == item.activeCitationId ? 'Active Citation' : 'Citation' }}</span>
                </Tab>
                <Tab value="2" as="div" class="flex items-center gap-2">
                    <i class="pi pi-fw pi-inbox" />
                    <span class="font-bold whitespace-nowrap">Messages</span>
                </Tab>
                <Tab value="3" as="div" class="flex items-center gap-2">
                    <i class="pi pi-fw pi-file" />
                    <span class="font-bold whitespace-nowrap">Documents</span>
                </Tab>
                <Tab value="4" as="div" class="flex items-center gap-2">
                    <i class="pi pi-fw pi-ticket" />
                    <span class="font-bold whitespace-nowrap">All Citations</span>
                </Tab>
                <Tab value="5" as="div" class="flex items-center gap-2">
                    <i class="pi pi-fw pi-inbox" />
                    <span class="font-bold whitespace-nowrap">All Messages</span>
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
                </TabPanel>
                <TabPanel value="1" as="p" class="m-0">
                    <div v-if="citation">
                        <div class="grid grid-cols-3 gap-4">
                            <Card>
                                <template #title>
                                    Citation
                                    <hr />
                                </template>
                                <template #content>
                                    <dl class="grid grid-cols-[repeat(2,auto)] gap-x-4 w-max">
                                        <dt>Status:</dt><dd>{{ citation.status }}</dd>
                                        <dt>Citation Number:</dt><dd>{{ citation.citationNumber }}</dd>
                                        <dt>Points:</dt><dd>{{ citation.citationEstimatedPoints }}</dd>
                                        <dt>Fine:</dt><dd>{{ citation.citationDeposit }}</dd>
                                        <dt>Cash:</dt><dd>{{ citation.citationCash }}</dd>
                                        <dt>Card:</dt><dd>{{ citation.citationCard }}</dd>
                                    </dl>
                                </template>
                            </Card>                                
                            <Card>
                                <template #title>
                                    Court Appearance
                                    <hr />
                                </template>
                                <template #content>
                                    <dl class="grid grid-cols-[repeat(2,auto)] gap-x-4 w-max">
                                        <dt>Plaintiff:</dt><dd> {{ citation.plaintiff }}</dd>
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
                                </template>
                            </Card>
                            <div class="row-span-3">
                                <div v-if="citation.documentId">
                                    <img :src="documentSrcs[citation.documentId]" @click="viewDocument(citation.documentId)" />
                                </div>
                            </div>
                            <Card>
                                <template #title>
                                    Violation
                                    <hr />
                                </template>
                                <template #content>
                                    <dl class="grid grid-cols-[repeat(2,auto)] gap-x-4 w-max">
                                        <dt>Ordinance:</dt><dd>{{ citation.violationOrdinance }}</dd>
                                        <dt>Statute:</dt><dd>{{ citation.violationStatute }}</dd>
                                        <dt>Description:</dt><dd>{{ citation.violationDescription }}</dd>
                                        <dt>Weekday:</dt><dd>{{ citation.violationWeekday }}</dd>
                                        <dt>Date:</dt><dd>{{ citation.violationDate }}</dd>
                                        <dt>Time:</dt><dd>{{ citation.violationTime }}</dd>
                                        <dt>Actual Speed:</dt><dd>{{ citation.violationActualSpeed }}</dd>
                                        <dt>Legal Speed:</dt><dd>{{ citation.violationLegalSpeed }}</dd>
                                        <dt>Over Speed:</dt><dd>{{ citation.violationOverSpeed }}</dd>
                                        <dt>BAC:</dt><dd>{{ citation.violationBac }}</dd>
                                        <dt>County:</dt><dd>{{ citation.violationCounty }}</dd>
                                        <dt>Municipality:</dt><dd>{{ citation.violationMunicipality }}</dd>
                                        <dt>Street Name:</dt><dd>{{ citation.violationStreetName }}</dd>
                                        <dt>From Street Name:</dt><dd>{{ citation.violationFromStreet }}</dd>
                                        <dt>Estimated Distance:</dt><dd>{{ citation.violationDistance }}</dd>
                                        <dt>Latitude:</dt><dd>{{ citation.violationLatitude }}</dd>
                                        <dt>Longitude:</dt><dd>{{ citation.violationLongitude }}</dd>
                                    </dl>
                                </template>
                            </Card>                                
                            <Card>
                                <template #title>
                                    Defendant
                                    <hr />
                                </template>
                                <template #content>
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
                                </template>
                            </Card>
                            <Card>
                                <template #title>
                                    License
                                    <hr />
                                </template>
                                <template #content>
                                    <dl class="grid grid-cols-[repeat(2,auto)] gap-x-4 w-max">
                                        <dt>Number:</dt><dd>{{ citation.licenseNumber }}</dd>
                                        <dt>State:</dt><dd>{{ citation.licenseState }}</dd>
                                        <dt>Expiration Year:</dt><dd>{{ citation.licenseExpYear }}</dd>
                                    </dl>
                                </template>
                            </Card>
                            <Card>
                                <template #title>
                                    Plate
                                    <hr />
                                </template>
                                <template #content>
                                    <dl class="grid grid-cols-[repeat(2,auto)] gap-x-4 w-max">
                                        <dt>Number:</dt><dd>{{ citation.plateNumber }}</dd>
                                        <dt>State:</dt><dd>{{ citation.plateState }}</dd>
                                        <dt>Expiration Year:</dt><dd>{{ citation.plateExpYear }}</dd>
                                        <dt>Type:</dt><dd>{{ citation.plateType }}</dd>
                                    </dl>
                                </template>
                            </Card>
                            <Card>
                                <template #title>
                                    Vehicle
                                    <hr />
                                </template>
                                <template #content>
                                    <dl class="grid grid-cols-[repeat(2,auto)] gap-x-4 w-max">
                                        <dt>VIN:</dt><dd>{{ citation.vehicleNumber }}</dd>
                                        <dt>Make:</dt><dd>{{ citation.vehicleMake }}</dd>
                                        <dt>Type:</dt><dd>{{ citation.vehicleType }}</dd>
                                        <dt>Color:</dt><dd>{{ citation.vehicleColor }}</dd>
                                        <dt>Year:</dt><dd>{{ citation.vehicleYear }}</dd>
                                    </dl>
                                </template>
                            </Card>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel value="2" as="p" class="m-0">
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
                <TabPanel value="3" as="p" class="m-0">
                    <DocumentsList :customerId="id" />
                </TabPanel>
                <TabPanel value="4" as="p" class="m-0">
                    <CitationsList :customerId="id" />
                </TabPanel>
                <TabPanel value="5" as="p" class="m-0">
                    <MessagesList :customerId="id" />
                </TabPanel>
            </TabPanels>
        </Tabs>
    </Fluid>
</template>

<style lang="scss">
    .p-timeline-event-content {
        flex: 3 !important;
    }

    .p-card.p-component {
        background-color: #fafafa;
    }
</style>
