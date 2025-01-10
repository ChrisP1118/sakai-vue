<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast';
import { useFetchApi } from '@/utilities/ApiFetch.js';
import Fields from './Fields.vue';

const router = useRouter()
const route = useRoute()
const toast = useToast();
const { isFetching, fetchGet, fetchPut } = useFetchApi();

const item = ref();

onMounted(() => {
    loadItem();
});

function loadItem() {
    fetchGet('/v1/tenant/' + route.params.id)
    .then(response => {
        item.value = response.body;
    })
}

function onFormSubmit(values) {
    Object.assign(item.value, values);

    fetchPut('/v1/tenant/' + route.params.id, item.value)
    .then(response => 
    {
        if (response.status >= 200 && response.status < 300) {
            item.value = response.body;

            toast.add({
                severity: 'success',
                summary: 'Item successfully saved.',
                life: 3000
            });        
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
