<script setup>
import { defineProps, defineEmits, onMounted, ref, computed } from 'vue';
import { Form } from '@primevue/forms';

defineProps(['item', 'isSaving']);
const emit = defineEmits('form-submit')

const onFormSubmit = (e) => {
    if (!e.valid)
        return;

    emit('form-submit', e.values);
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
    <Form v-slot="$form" :initialValues="item" :resolver="formResolver" @submit="onFormSubmit">
        <div class="grid grid-cols-2 m-0">
            <div>
                <h2 class="text-xl" v-if="item">
                    <span>{{ item.name }}</span>
                </h2>
            </div>
            <div class="text-right">
                <ButtonGroup>
                    <slot name="buttons" />
                    <Button type="submit" label="Save" :loading="isSaving" :fluid="false" />
                </ButtonGroup>
            </div>
        </div>

        <Divider />

        <div class="flex flex-col md:flex-row gap-8" v-if="item">
            <div class="md:w-1/2">
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
                        <FormField v-slot="$field" name="eTag">
                            <label for="eTag">eTag</label>
                            <InputText id="eTag" name="eTag" type="text" />
                            <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
                        </FormField>
                    </div>                     -->
                    <!-- <div class="flex flex-col gap-2">
                        <label for="isActive">Active</label>
                        <ToggleSwitch id="isActive" v-model="item.isActive" />
                    </div> -->
                </div>
            </div>
        </div>
    </Form>
</template>
