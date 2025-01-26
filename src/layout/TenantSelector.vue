<script setup>
import { ref, computed, onMounted, defineEmits } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import * as tableUtilities from '@/utilities/TableUtilities';
import { FilterMatchMode } from '@primevue/core';

const emit = defineEmits('tenant-selected')

const router = useRouter()
const route = useRoute()
const tableUtils = tableUtilities.useTableUtilities();

const tenantListTable = ref();

const filters = ref({
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
});

function onTenantListRowClick(event) {
    var item = tableUtils.pagedItems.value[event.index];
    emit('tenant-selected', item.id);
}

onMounted(() => {
    tableUtils.init('/v1/tenant/query');
});

</script>

<template>
    <DataTable
        ref="tenantListTable"
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
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} tenants"
        :totalRecords="tableUtils.tableData.value.totalRecords"
        :loading="tableUtils.tableData.value.loading"
        filterDisplay="row"
        @row-click="onTenantListRowClick"
        resizableColumns columnResizeMode="fit" showGridlines :reorderableColumns="true" 
    >
        <template #header>
        </template>

        <Column field="name" header="Name" sortable>
            <template #filter="{ filterModel, filterCallback }">
                <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by name" />
            </template>
        </Column>
    </DataTable>
</template>
