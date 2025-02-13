<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast';
import { useFetchApi } from '@/utilities/ApiFetch';

const router = useRouter()
const route = useRoute()
const toast = useToast();
const { isFetching, fetchGet, fetchPut, fetchGetAsObjectUrl } = useFetchApi();
const item = ref();
const props = defineProps(['id', 'customerId'])
const documentSrc = ref(null);

onMounted(() => {
    loadItem();
});

function loadItem() {
    fetchGet('/v1/customer/' + props.customerId + '/document/' + props.id)
    .then(response => {
        item.value = response.body;
    })

    fetchGetAsObjectUrl('/v1/customer/' + props.customerId + '/document/' + props.id + '/file')
    .then(response => {
        documentSrc.value = response;
    })
}


</script>

<template>
    <Fluid>
        <Card class="mb-4" v-if="item">
            <template #title><i class="pi pi-fw pi-file" /> Document</template>
            <template #content>
                <img :src="documentSrc" />
            </template>
        </Card>
        <Card class="mb-4" v-if="item">
            <template #title><i class="pi pi-fw pi-file" /> IDP Response</template>
            <template #content>
                <pre>{{ JSON.stringify(JSON.parse(item.idpResponse), null, 2) }}</pre>
            </template>
        </Card>
    </Fluid>
</template>
