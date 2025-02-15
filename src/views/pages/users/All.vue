<script setup lang="ts">
import { FilterMatchMode } from '@primevue/core';
import { onMounted, ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import * as tableUtilities from '@/utilities/TableUtilities';

const router = useRouter()
const route = useRoute()
const tableUtils = tableUtilities.useTableUtilities();

const dt = ref();

const filters = ref({
    username: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    firstName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    lastName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    emailAddress: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
});

onMounted(() => {
    tableUtils.init('/v1/user/query');
});

function onRowClick(event) {
    var item = tableUtils.pagedItems.value[event.index];
    router.push({ path: '/users/' + item.id });
}

</script>

<template>
    <div>
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
            <!-- <template #header>
                <div class="flex flex-wrap gap-2 items-center justify-between">
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText placeholder="Search..." />
                    </IconField>

                    <Button label="New User" icon="pi pi-plus-circle" severity="secondary" as="router-link" to="/users/new" />
                </div>
            </template> -->

            <!-- <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column> -->
            <!-- <Column field="id" header="ID" sortable style="min-width: 6rem"></Column> -->
            <!-- <Column field="username" :header="'Username' + (filters.username.value ? ': ' + filters.username.value : '')" sortable :showFilterMatchModes="false"> -->
            <Column field="username" header="Username" sortable :showFilterMatchModes="false">
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
            <Column field="emailAddress" header="Email" sortable>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by email" />
                </template>
            </Column>
            <Column field="firstName" header="First Name" sortable></Column>
            <Column field="lastName" header="Last Name" sortable></Column>
        </DataTable>
    </div>
</template>
