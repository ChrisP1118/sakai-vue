<script setup>
import { FilterMatchMode } from '@primevue/core';
import { onMounted, ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import * as tableUtilities from '@/utilities/TableUtilities.js';

const router = useRouter()
const route = useRoute()
const tableUtils = tableUtilities.useTableUtilities('/v1/user/query');

const dt = ref();

const filters = ref({
    id: { value: null, matchMode: FilterMatchMode.EQUALS },
    username: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
});

onMounted(() => {
    tableUtils.onMounted();
});

function onRowClick(event) {
    var item = tableUtils.pagedItems.value[event.index];
    router.push({ path: '/users/' + item.id });
}

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
                :rowsPerPageOptions="[1, 2, 3, 5, 10, 25, 50, 100]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
                :totalRecords="tableUtils.tableData.value.totalRecords"
                :loading="tableUtils.tableData.value.loading"
                filterDisplay="row"
                @row-click="onRowClick"
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

                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                <Column field="id" header="ID" sortable style="min-width: 6rem"></Column>
                <Column field="username" header="Username" sortable>
                    <template #filter="{ filterModel, filterCallback }">
                        <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by username" />
                    </template>
                </Column>
            </DataTable>
        </div>

    </div>
</template>
