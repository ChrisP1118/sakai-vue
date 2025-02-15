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
    tableUtils.init('/v1/customer/query', dt);
});

function onRowClick(event) {
    var item = tableUtils.pagedItems.value[event.index];
    router.push({ path: '/customers/' + item.id });
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
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} customers"
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

                    <Button label="New Customer" icon="pi pi-plus-circle" severity="secondary" as="router-link" to="/customers/new" />
                </div>
            </template> -->

            <!-- <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column> -->
            <!-- <Column field="id" header="ID" sortable style="min-width: 6rem"></Column> -->
            <Column field="phoneNumber" header="Phone Number" sortable>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by name" />
                    <!-- <InputMask v-model="filterModel.value" @input="filterCallback()" placeholder="Search by phone number" mask="(999) 999-9999" /> -->
                </template>
                <template #body="slotProps">
                    {{ slotProps.data.phoneNumber.replace(/\D+/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3') }}
                </template>
            </Column>
            <Column field="createdAt" header="Created At" sortable>
                <template #body="slotProps">
                    {{ DateTime.fromISO(slotProps.data.createdAt).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY) }}
                    {{ DateTime.fromISO(slotProps.data.createdAt).toLocaleString(DateTime.TIME_WITH_SHORT_OFFSET) }}
                </template>
            </Column>
        </DataTable>
    </div>
</template>
