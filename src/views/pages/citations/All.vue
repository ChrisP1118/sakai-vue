<script setup>
import { FilterMatchMode } from '@primevue/core';
import { onMounted, ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import * as tableUtilities from '@/utilities/TableUtilities';
import { DateTime } from "luxon";

const router = useRouter()
const route = useRoute()
const tableUtils = tableUtilities.useTableUtilities();

const dt = ref();

const filters = ref({
    id: { value: null, matchMode: FilterMatchMode.EQUALS },
    phoneNumber: { value: null, matchMode: FilterMatchMode.STARTS_WITH, getValue: (x) => { return x.replace(/\D/g,'');; } },
});

onMounted(() => {
    tableUtils.init('/v1/citation/query', dt);
});

function onRowClick(event) {
    var item = tableUtils.pagedItems.value[event.index];
    router.push({ path: '/customers/' + item.customerId + '/citations/' + item.id });
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
            sortField="createdAt"
            :sortOrder="-1"
            @filter="tableUtils.onFilter"
            v-model:filters="filters"
            :paginator="true"
            :first="tableUtils.tableData.value.first"
            :rows="tableUtils.tableData.value.rows"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink CurrentPageReport RowsPerPageDropdown"
            :pageLinkSize="(tableUtils.tableData.value.first / tableUtils.tableData.value.rows) + 2"
            :rowsPerPageOptions="[5, 10, 25, 50, 100]"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} citations"
            :totalRecords="tableUtils.tableData.value.totalRecords"
            :loading="tableUtils.tableData.value.loading"
            filterDisplay="row"
            @row-click="onRowClick"
            resizableColumns columnResizeMode="fit" showGridlines :reorderableColumns="true" 
        >

            <!-- <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column> -->
            <!-- <Column field="id" header="ID" sortable style="min-width: 6rem"></Column> -->
            <Column field="status" header="Status" sortable></Column>
            <Column field="appearanceDate" header="Appearance Date" sortable></Column>
            <Column field="appearanceTime" header="Appearance Time" sortable></Column>
            <Column field="citationEstimatedPoints" header="Points" sortable></Column>
            <Column field="citationDeposit" header="Deposit" sortable></Column>

        </DataTable>
    </div>
</template>
