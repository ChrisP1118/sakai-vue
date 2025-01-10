import { ref } from "vue";
import { useAuthStore } from '@/stores/auth.js';

const authStore = useAuthStore();

export function useFetchApi() {
     const isFetching = ref(false);

     const fetchGet = async (url) => {
          const fullUrl = import.meta.env.VITE_API_BASE_URL + url;
          const requestOptions = {
               method: 'GET',
               headers: {
                    'Authorization': 'Bearer ' + authStore.token,
               }
          }

          isFetching.value = true;
          return fetch(fullUrl, requestOptions)
               .then(response => response.json().then(data => ({status: response.status, body: data})))
               .then(response => {
                    if (response.status == 403) {
                         console.log('We should reauthenticate!');
                    }

                    isFetching.value = false;

                    return response;
               });

     };

     const fetchPost = async (url, payload) => {
          const fullUrl = import.meta.env.VITE_API_BASE_URL + url;
          const requestOptions = {
               method: 'POST',
               headers: {
                    'Authorization': 'Bearer ' + authStore.token,
                    'Content-Type': 'application/json'
               },
               body: JSON.stringify(payload),
          }

          isFetching.value = true;
          return fetch(fullUrl, requestOptions)
               .then(response => response.json().then(data => ({status: response.status, body: data})))
               .then(response => {
                    if (response.status == 403) {
                         console.log('We should reauthenticate!');
                    }

                    isFetching.value = false;

                    return response;
               });

     };

     const fetchPut = async (url, payload) => {
          const fullUrl = import.meta.env.VITE_API_BASE_URL + url;
          const requestOptions = {
               method: 'PUT',
               headers: {
                    'Authorization': 'Bearer ' + authStore.token,
                    'Content-Type': 'application/json'
               },
               body: JSON.stringify(payload),
          }

          isFetching.value = true;
          return fetch(fullUrl, requestOptions)
               .then(response => response.json().then(data => ({status: response.status, body: data})))
               .then(response => {
                    if (response.status == 403) {
                         console.log('We should reauthenticate!');
                    }

                    isFetching.value = false;

                    return response;
               });

     };

     return {
          isFetching,
          fetchGet,
          fetchPost,
          fetchPut
     };
}
