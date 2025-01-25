<script setup>
import { onMounted, ref, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import Fields from './Fields.vue';
import { useRouter, useRoute } from 'vue-router'
import { useFetchApi } from '@/utilities/ApiFetch';

const router = useRouter()
const route = useRoute()
const toast = useToast();
const { isFetching, fetchPost } = useFetchApi();

const tenantId = ref(route.params.tenantId);
const item = ref({
    name: 'New Work Item'
});

onMounted(() => {
});

function onFormSubmit(values) {
    Object.assign(item.value, values);

    fetchPost(`/v1/tenant/${tenantId.value}/workItem`, item.value)
    .then(response => 
    {
        console.log(response);
        if (response.status >= 200 && response.status < 300) {
            item.value = response.body;

            toast.add({
                severity: 'success',
                summary: 'Item successfully saved.',
                life: 3000
            });

            router.push({ path: `/tenants/${tenantId.value}/workItems/${item.value.id}` });
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error saving item.',
                life: 3000
            });
        }
    });    
}

</script>

<template>
    <Fluid>
        <Fields :item="item" :isSaving="isFetching" @form-submit="onFormSubmit"></Fields>
    </Fluid>
</template>
