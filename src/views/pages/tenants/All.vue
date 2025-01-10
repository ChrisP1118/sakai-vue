<script setup>
import { FilterMatchMode } from '@primevue/core';
import { onMounted, ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js';
import { useFetchApi } from '@/utilities/ApiFetch.js';

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore();
const { isFetching, fetchPost } = useFetchApi();

const dt = ref();
const tableData = ref({
    loading: false,
    totalRecords: 0,
    first: 0,
    rows: 3,
    continuationToken: null,
});
const items = ref([
    {
        id: 1,
        name: 'Tenant 1',
        isActive: true
    },
    {
        id: 2,
        name: 'Tenant 2',
        isActive: true
    },
    {
        id: 3,
        name: 'Tenant 3',
        isActive: false
    },
    {
        id: 4,
        name: 'Tenant 4',
        isActive: true
    },
])
const pagedItems = computed(() => {
    if (!items.value)
        return null;
    
    return items.value.slice(tableData.value.first, tableData.value.first + tableData.value.rows);
});

const filters = ref({
    id: { value: null, matchMode: FilterMatchMode.EQUALS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
});

onMounted(() => {
    tableData.value.loading = true;

    loadQuery({
        first: dt.value.first,
        rows: dt.value.rows,
    });
});

function onPage(event) {
    if (event.first >= items.value.length) {
        loadQuery(event, true);
    } else if (event.rows != tableData.value.rows) {
        tableData.value.rows = event.rows;
        tableData.value.first = 0;
        loadQuery(event, true);
    } else {
        tableData.value.first = event.first;
    }
}

function onSort(event) {
    loadQuery(event);
}

function onFilter(event) {
    console.log('Filter');
    loadQuery(event);
}

const loadQuery = (event, appendResults) => {
  tableData.value.loading = true;

  if (!appendResults)
    tableData.value.continuationToken = null;

  fetchPost('/v1/tenant/query', {
    continuationToken: tableData.value.continuationToken,
    sortField: event.sortField,
    sortOrder: event.sortOrder,
    pageSize: tableData.value.rows
  })
  .then(response => {
    if (appendResults) {
        items.value = items.value.concat(response.body.items);
        tableData.value.first += tableData.value.rows;
    } else {
        items.value = response.body.items;
        tableData.value.first = 0;
        tableData.value.totalRecords = response.body.totalResults;
    }
    tableData.value.continuationToken = response.body.continuationToken;
    tableData.value.loading = false;
  });
};

function onRowClick(event) {
    var item = pagedItems.value[event.index];
    router.push({ path: '/tenants/' + item.id });
}

</script>

<template>
    <div>
        <div class="card">

            <DataTable
                ref="dt"
                dataKey="id"
                lazy
                :value="pagedItems"
                @page="onPage"
                @sort="onSort"
                @filter="onFilter"
                v-model:filters="filters"
                :paginator="true"
                :first="tableData.first"
                :rows="tableData.rows"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink CurrentPageReport RowsPerPageDropdown"
                :pageLinkSize="(tableData.first / tableData.rows) + 2"
                :rowsPerPageOptions="[1, 2, 3, 5, 10, 25, 50, 100]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                :totalRecords="tableData.totalRecords"
                :loading="tableData.loading"
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

                        <Button label="New Tenant" icon="pi pi-plus-circle" severity="secondary" as="router-link" to="/tenants/new" />
                    </div>
                </template>

                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                <Column field="id" header="ID" sortable style="min-width: 6rem"></Column>
                <Column field="name" header="Name" sortable>
                    <template #filter="{ filterModel, filterCallback }">
                        <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by name" />
                    </template>
                </Column>
                <Column field="isActive" header="Active" sortable></Column>
            </DataTable>
        </div>

    </div>
</template>
