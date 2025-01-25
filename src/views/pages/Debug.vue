<script setup lang="ts">
import { onMounted, ref, computed, watch, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js';
import { useTestHub } from '@/utilities/Hubs';
import { Form } from '@primevue/forms';

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore();
const dt = ref();
const testHub = useTestHub();

const onAlert = (alert) => {
    console.log('Debug OnAlert');
    console.log(alert);
};

const sendAlertItem = ref({
    severity: 'info',
    title: 'Test Alert',
    message: 'This is a test alert'
});

onMounted(() => {
    testHub.connection.value.on('OnAlert', onAlert);
});

onUnmounted(() => {
    testHub.connection.value.off('OnAlert', onAlert);
});


const onSendAlertFormSubmit = (e) => {
    if (!e.valid)
        return;

    Object.assign(sendAlertItem.value, e.values);

    console.log('Submit Send Alert Form');

    testHub.connection.value.invoke("SendAlert", sendAlertItem.value);
};

const sendAlertFormResolver = ({ values }) => {
    const errors = { 
        name: [],
        description: []
    };

    return {
        errors,
        values // This has to be included due to a bug in PrimeVue: https://github.com/primefaces/primevue/issues/7031
    };
}



</script>

<template>
    <div>
        <div class="card">
            <h1>Debug</h1>
        </div>

        <Fluid>

            <Form v-slot="$form" :initialValues="sendAlertItem" :resolver="sendAlertFormResolver" @submit="onSendAlertFormSubmit">

                <div class="flex flex-col md:flex-row gap-8">
                    <div class="md:w-1/2">
                        <div class="card flex flex-col gap-4">
                            <div class="font-semibold text-xl">Send Alert</div>
                            <div class="flex flex-col gap-2">
                                <FormField v-slot="$field" name="severity">
                                    <label for="severity">Severity</label>
                                    <InputText id="severity" name="severity" type="text" />
                                    <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
                                </FormField>
                            </div>                    
                            <div class="flex flex-col gap-2">
                                <FormField v-slot="$field" name="title">
                                    <label for="title">Title</label>
                                    <InputText id="title" name="title" type="text" />
                                    <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
                                </FormField>
                            </div>                    
                            <div class="flex flex-col gap-2">
                                <FormField v-slot="$field" name="message">
                                    <label for="message">Message</label>
                                    <InputText id="message" name="message" type="text" />
                                    <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
                                </FormField>
                            </div>                    
                            <div class="flex flex-col gap-2">
                                <ButtonGroup>
                                    <slot name="buttons" />
                                    <Button type="submit" label="Send Alert" :fluid="false" />
                                </ButtonGroup>
                            </div>

                        </div>
                    </div>
                </div>
            </Form>   
        </Fluid>     
    </div>
</template>
@/utilities/Hubs