<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import { Form } from '@primevue/forms';
import { useToast } from 'primevue/usetoast';

const router = useRouter()
const route = useRoute()
const toast = useToast();

const item = ref();
const isSaving = ref(false);

onMounted(() => {
    console.log(route.params.id);

    loadItem();
});

function loadItem() {
    fetch('https://localhost:7067/api/v1/tenant/' + route.params.id, {
        method: 'GET',
        headers: {
            'Authorization': 'Basic ' + btoa('cwilson:abcd1234')
        }
    })
    .then(response => response.json())
    .then(response => {
        console.log(response);
        item.value = response;
    });
}

const onFormSubmit = (e) => {
    if (!e.valid)
        return;

    Object.assign(item.value, e.values);

    isSaving.value = true;

    fetch('https://localhost:7067/api/v1/tenant/' + route.params.id, {
        method: 'PUT',
        body: JSON.stringify(item.value),
        headers: {
            'Authorization': 'Basic ' + btoa('cwilson:abcd1234'),
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(response => {
        console.log(response);
        item.value = response;

        isSaving.value = false;

        toast.add({
            severity: 'success',
            summary: 'Item successfully saved.',
            life: 3000
        });        
    });
};

const formResolver = ({ values }) => {
    const errors = { name: [] };

    if (!values.name)
        errors.name.push({ type: 'required', message: 'Name is required' });

    if (values.name && values.name.length < 3)
        errors.name.push({ type: 'Minimum', message: 'Name must be at least 3 characters' });

    return {
        errors,
        values // This has to be included due to a bug in PrimeVue: https://github.com/primefaces/primevue/issues/7031
    };
}

</script>

<template>
    <Fluid>
        {{ item }}
        <div class="flex flex-col md:flex-row gap-8" v-if="item">
            <div class="md:w-1/2">
                <div class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl">Tenant</div>
                    <div class="flex flex-col gap-2">
                        <label for="name1">Name</label>
                        <InputText id="name1" type="text" v-model="item.name" />
                    </div>                    
                    <div class="flex flex-col gap-2">
                        <label for="age1">Active</label>
                        <ToggleSwitch id="isActive" v-model="item.isActive" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <Button label="Save" />
                    </div>
                </div>
            </div>

            <div class="md:w-1/2">
                <Form v-slot="$form" :initialValues="item" :resolver="formResolver" @submit="onFormSubmit">
                    <div class="card flex flex-col gap-4">
                        <div class="font-semibold text-xl">Tenant</div>
                        <div class="flex flex-col gap-2">
                            <FormField v-slot="$field" name="name">
                                <label for="name">Name</label>
                                <InputText id="name" name="name" type="text" />
                                <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
                            </FormField>
                        </div>                    
                        <!-- <div class="flex flex-col gap-2">
                            <label for="isActive">Active</label>
                            <ToggleSwitch id="isActive" v-model="item.isActive" />
                        </div> -->
                        <div class="flex flex-col gap-2">
                            <Button type="submit" label="Save" :loading="isSaving" />
                        </div>
                    </div>
                </Form>
            </div>
        </div>

    </Fluid>
</template>
