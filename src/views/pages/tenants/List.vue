<script setup>
import { FilterMatchMode } from '@primevue/core';
import { onMounted, ref } from 'vue';

const dt = ref();
const tenants = ref([
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
const loading = ref(false);
const totalRecords = ref(10);
const first = ref(0);
//const lazyParams = ref({});
const filters = ref({
    id: { value: null, matchMode: FilterMatchMode.EQUALS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
});

onMounted(() => {
    console.log('Mounted');
    loading.value = true;

    loadLazyData({
        first: dt.value.first,
        rows: dt.value.rows,
    });
});

function onPage(event) {
    console.log('Page');
    loadLazyData(event);
}

function onSort(event) {
    console.log('Page');
    loadLazyData(event);
}

function onFilter(event) {
    console.log('Filter');
    loadLazyData(event);
}

const loadLazyData = (event) => {
  console.log('Load lazy');
  console.log(event);

  loading.value = true;

  fetch('https://localhost:7067/api/v1/tenant?pageSize=10', {
    method: 'GET',
    headers: {
        'Authorization': 'Basic ' + btoa('cwilson:abcd1234')
    }
  })
  .then(response => response.json()).then(response => {
    console.log(response);
    tenants.value = response;
    //totalRecords.value = response.length;
    loading.value = false;
  });
};


</script>

<template>
    <div>
        <div class="card">

            <DataTable
                ref="dt"
                dataKey="id"
                lazy
                :value="tenants"
                @page="onPage"
                @sort="onSort"
                @filter="onFilter"
                v-model:filters="filters"
                :paginator="true"
                :rows="2"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[1, 2, 5]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                :totalRecords="totalRecords"
                :loading="loading"
                filterDisplay="row"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Tenants</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <!-- <InputText v-model="filters['global'].value" placeholder="Search..." /> -->
                        </IconField>
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
