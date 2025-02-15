import { ref, computed } from "vue";
import { useAuthStore } from '@/stores/auth.js';
import { useFetchApi } from '@/utilities/ApiFetch';
import debounce from "./Debounce";

export function useTableUtilities() {
    const { isFetching, fetchPost } = useFetchApi();
    const authStore = useAuthStore();
    
    const tableData = ref({
         loading: false,
         totalRecords: 0,
         first: 0,
         rows: 25,
         continuationToken: null
     });
     const items = ref([]);
     const pagedItems = computed(() => {
         if (!items.value)
             return null;
     
         return items.value.slice(tableData.value.first, tableData.value.first + tableData.value.rows);
     }); 
     const queryUrl = ref();

     const loadQuery = (event, appendResults) => {
        tableData.value.loading = true;
      
        if (!appendResults)
          tableData.value.continuationToken = null;
        
        let filters = [];

        for (const prop in event.filters)
            if (event.filters[prop].value)
            {
                let val = event.filters[prop].value;
                if (event.filters[prop].getValue)
                    val = event.filters[prop].getValue(val);

                filters.push( { field: prop, value: val } );
            }

        fetchPost(queryUrl.value, {
          continuationToken: tableData.value.continuationToken,
          sortField: event.sortField,
          sortOrder: event.sortOrder,
          pageSize: tableData.value.rows,
          filters: filters
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

    const init = (newQueryUrl, dt) => {
        if (newQueryUrl)
            queryUrl.value = newQueryUrl;
        items.value = [];
        tableData.value.loading = true;
    
        loadQuery({
            first: tableData.value.first,
            rows: tableData.value.rows,
            sortField: dt?.value?.sortField,
            sortOrder: dt?.value?.sortOrder,
        }, false);
    };
    
    const onPage = (event) => {
        if (event.first >= items.value.length) {
            loadQuery(event, true);
        } else if (event.rows != tableData.value.rows) {
            tableData.value.rows = event.rows;
            tableData.value.first = 0;
            loadQuery(event, true);
        } else {
            tableData.value.first = event.first;
        }
    };
    
    const onSort = (event) => {
        loadQuery(event, false);
    }
    
    // const onFilter = (event) => {
    //     console.log('Filter');
    //     loadQuery(event, false);
    // }

    const onFilter = debounce((event) => {
        console.log('Filter');
        loadQuery(event, false);
    }, 300);

    return {
          tableData,
          items,
          pagedItems,
          queryUrl,
          init,
          loadQuery,
          onPage,
          onSort,
          onFilter
     };
}
