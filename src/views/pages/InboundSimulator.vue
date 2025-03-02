<script setup lang="ts">
import { onMounted, ref, computed, watch, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js';
import { Form } from '@primevue/forms';

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore();

const file = ref();
const formFields = ref({
    phoneNumber: '5555550010',
    message: '',
    files: null
})

const formResolver = ({ values }) => {
    const errors = { name: [] };

    return {
        errors,
        values // This has to be included due to a bug in PrimeVue: https://github.com/primefaces/primevue/issues/7031
    };
}

const onSend = (e) => {
    if (!e.valid)
        return;

    const formData = new FormData();
    formData.append("phoneNumber", e.values.phoneNumber);
    formData.append("text", e.values.message);

    formData.append("file", file.value.files[0]);

    console.log(formData);

    fetch(import.meta.env.VITE_API_BASE_URL + '/v1/intake/inbound', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        file.value.files.clear();
    });

}

</script>

<template>
    <div>
        <div class="card">
            <h1>Simulate Inbound SMS Message</h1>
        </div>

        <Fluid>
            <Form v-slot="$form" :initialValues="formFields" :resolver="formResolver" @submit="onSend">

                <FormField v-slot="$field" name="phoneNumber">
                    <label for="phoneNumber" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Phone Number</label>
                    <InputText id="phoneNumber" name="phoneNumber" type="text" placeholder="Phone Number" class="w-full md:w-[30rem] mb-8" />
                    <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
                </FormField>

                <FormField v-slot="$field" name="message">
                    <label for="message" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Message</label>
                    <InputText id="message" name="message" type="text" placeholder="Message" class="w-full md:w-[30rem] mb-8" />
                    <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
                </FormField>

                <FormField v-slot="$field" name="file">
                    <label for="file" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">File</label>
                    <!-- <FileUpload id="file" mode="basic" ref="file" accept="image/*" :maxFileSize="10000000" /> -->
                    <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
                </FormField>

                <FileUpload ref="file" :multiple="false" accept="image/*" :maxFileSize="10000000">
                    <template #empty>
                        <span>Drag and drop files to here to upload.</span>
                    </template>
                </FileUpload>

                <Button type="submit" label="Send" class="w-full"></Button>
            </Form>

        </Fluid>     
    </div>
</template>
