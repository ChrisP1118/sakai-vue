<script setup lang="ts">
import { FilterMatchMode } from '@primevue/core';
import { onMounted, ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import * as tableUtilities from '@/utilities/TableUtilities';
import { useAuthStore } from '@/stores/auth.js';

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore();
const dt = ref();
const tenantId = ref(route.params.tenantId);
const tableUtils = tableUtilities.useTableUtilities();

const filters = ref({
    id: { value: null, matchMode: FilterMatchMode.EQUALS },
    username: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
});

onMounted(() => {
    tableUtils.init('/v1/tenant/' + tenantId.value + '/user/query');
});

function onRowClick(event) {
    var item = tableUtils.pagedItems.value[event.index];
    router.push({ path: '/tenants/' + tenantId.value + '/users/' + item.id });
}

watch(
  () => route.params.tenantId,
  (newValue) => {
    tenantId.value = route.params.tenantId;
    tableUtils.init('/v1/tenant/' + tenantId.value + '/user/query');
  }
);

</script>

<template>
    <div>
        <div class="card">

            <DataTable
                ref="dt"
                dataKey="id"
                lazy
                :value="tableUtils.pagedItems.value"
                @page="tableUtils.onPage"
                @sort="tableUtils.onSort"
                @filter="tableUtils.onFilter"
                v-model:filters="filters"
                :paginator="true"
                :first="tableUtils.tableData.value.first"
                :rows="tableUtils.tableData.value.rows"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink CurrentPageReport RowsPerPageDropdown"
                :pageLinkSize="(tableUtils.tableData.value.first / tableUtils.tableData.value.rows) + 2"
                :rowsPerPageOptions="[5, 10, 25, 50, 100]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
                :totalRecords="tableUtils.tableData.value.totalRecords"
                :loading="tableUtils.tableData.value.loading"
                filterDisplay="row"
                @row-click="onRowClick"
                resizableColumns columnResizeMode="fit" showGridlines :reorderableColumns="true" 
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText placeholder="Search..." />
                        </IconField>

                        <Button label="New User" icon="pi pi-plus-circle" severity="secondary" as="router-link" to="/users/new" />
                    </div>
                </template>

                <!-- <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column> -->
                <!-- <Column field="id" header="ID" sortable style="min-width: 6rem"></Column> -->
                <Column field="username" header="Username" sortable>
                    <template #filter="{ filterModel, filterCallback }">
                        <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by username" />
                    </template>
                    <template #body="{ data }">
                        <div class="flex items-center gap-2">
                            <Avatar :label="data.avatarLabel" class="mr-2" :style="'background-color: ' + data.avatarBackgroundColor" shape="circle" />
                            <span>{{ data.username }}</span>
                        </div>
                    </template>
                </Column>
                <Column field="emailAddress" header="Email" sortable></Column>
                <Column field="firstName" header="First Name" sortable></Column>
                <Column field="lastName" header="Last Name" sortable></Column>
            </DataTable>
        </div>

    </div>
</template>
