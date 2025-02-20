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

const props = defineProps(['customerId'])

const filters = ref({
    id: { value: null, matchMode: FilterMatchMode.EQUALS },
    phoneNumber: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
});

onMounted(() => {
    tableUtils.init('/v1/customer/' + props.customerId + '/document/query', dt);
});

function onRowClick(event) {
    var item = tableUtils.pagedItems.value[event.index];
    router.push({ path: '/customers/' + props.customerId + '/documents/' + item.id });
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
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} documents"
                :totalRecords="tableUtils.tableData.value.totalRecords"
                :loading="tableUtils.tableData.value.loading"
                filterDisplay="row"
                @row-click="onRowClick"
                resizableColumns columnResizeMode="fit" showGridlines :reorderableColumns="true" 
            >

                <!-- <Column field="id" header="ID" sortable></Column> -->
                <Column header="Created At" sortable>
                    <template #body="{ data }">
                        {{ DateTime.fromISO(data.createdAt).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY) }}
                        {{ DateTime.fromISO(data.createdAt).toLocaleString(DateTime.TIME_WITH_SHORT_OFFSET) }}
                    </template>
                </Column>
                <Column header="Processing Started At" sortable>
                    <template #body="{ data }">
                        {{ DateTime.fromISO(data.processingStartedAt).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY) }}
                        {{ DateTime.fromISO(data.processingStartedAt).toLocaleString(DateTime.TIME_WITH_SHORT_OFFSET) }}
                    </template>
                </Column>
                <Column header="Processing Finished At" sortable>
                    <template #body="{ data }">
                        {{ DateTime.fromISO(data.processingFinishedAt).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY) }}
                        {{ DateTime.fromISO(data.processingFinishedAt).toLocaleString(DateTime.TIME_WITH_SHORT_OFFSET) }}
                    </template>
                </Column>
            </DataTable>

    </div>
</template>
