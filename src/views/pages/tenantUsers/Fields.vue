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
    const errors = { 
        username: [],
        firstName: [],
        lastName: [],
        emailAddress: [],
        avatarLabel: [],
        avatarBackgroundColor: [],
    };

    if (!values.username)
        errors.username.push({ type: 'required', message: 'Username is required' });

    if (values.username && values.username.length < 3)
        errors.username.push({ type: 'Minimum', message: 'Username must be at least 3 characters' });

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
                    <Avatar :label="item.avatarLabel" class="mr-2" :style="'background-color: ' + item.avatarBackgroundColor" shape="circle" />
                    <span>{{ item.username }}</span>
                </h2>
            </div>
            <div class="text-right">
                <Button type="submit" label="Save" :loading="isSaving" :fluid="false" />
            </div>
        </div>

        <Divider />
        
        <div class="flex flex-col md:flex-row gap-8" v-if="item">
            <div class="md:w-1/2">
                <div class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl">User</div>
                    <div class="flex flex-col gap-2">
                        <FormField v-slot="$field" name="username">
                            <label for="username">Username</label>
                            <InputText id="username" name="username" type="text" />
                            <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
                        </FormField>
                        <FormField v-slot="$field" name="firstName">
                            <label for="firstName">First Name</label>
                            <InputText id="firstName" name="firstName" type="text" />
                            <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
                        </FormField>
                        <FormField v-slot="$field" name="lastName">
                            <label for="lastName">Last Name</label>
                            <InputText id="lastName" name="lastName" type="text" />
                            <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
                        </FormField>
                        <FormField v-slot="$field" name="emailAddress">
                            <label for="emailAddress">Email Address</label>
                            <InputText id="emailAddress" name="emailAddress" type="text" />
                            <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
                        </FormField>
                    </div>                    
                </div>
            </div>
            <div class="md:w-1/2">
                <div class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl">Avatar</div>
                    <div class="flex flex-col gap-2">
                        <FormField v-slot="$field" name="avatarLabel">
                            <label for="avatarLabel">Avatar Label</label>
                            <InputText id="avatarLabel" name="avatarLabel" type="text" />
                            <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
                        </FormField>
                        <FormField v-slot="$field" name="avatarBackgroundColor">
                            <label for="avatarBackgroundColor">Avatar Background Color</label>
                            <InputText id="avatarBackgroundColor" name="avatarBackgroundColor" type="text" />
                            <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
                        </FormField>
                    </div>
                </div>

            </div>
        </div>
    </Form>
</template>
