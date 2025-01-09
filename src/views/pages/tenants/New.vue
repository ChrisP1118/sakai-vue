<script setup>
import { onMounted, ref, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import Fields from './Fields.vue';
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const toast = useToast();

const item = ref({
    name: 'New Tenant'
});
const isSaving = ref(false);

onMounted(() => {
});

function onFormSubmit(values) {
    console.log('Fields form submit');
    console.log(item.value);
    console.log(values);

    Object.assign(item.value, values);

    isSaving.value = true;

    fetch(import.meta.env.VITE_API_BASE_URL + '/v1/tenant', {
        method: 'POST',
        body: JSON.stringify(item.value),
        headers: {
            'Authorization': 'Basic ' + btoa('cwilson:abcd1234'),
            'Content-Type': 'application/json'
        }
    })
    .then(response =>  response.json().then(data => ({status: response.status, body: data})))
    .then(response => 
    {
        console.log(response);
        if (response.status >= 200 && response.status < 300) {
            item.value = response.body;

            isSaving.value = false;

            toast.add({
                severity: 'success',
                summary: 'Item successfully saved.',
                life: 3000
            });

            router.push({ path: '/tenants/' + item.value.id });
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
        <Fields :item="item" :isSaving="isSaving" @form-submit="onFormSubmit"></Fields>
    </Fluid>
</template>
