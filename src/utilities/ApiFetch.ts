import { ref } from "vue";
import { useAuthStore } from '@/stores/auth.js';

export function useFetchApi() {
     const authStore = useAuthStore();

     const isFetching = ref(false);

     const fetchGet = async (url) => {
          isFetching.value = true;

          const fullUrl = import.meta.env.VITE_API_BASE_URL + url;
          const requestOptions = {
               method: 'GET',
               headers: {
                    'Authorization': 'Bearer ' + authStore.token,
               }
          }

          return fetch(fullUrl, requestOptions)
               .then(response => response.json().then(data => ({status: response.status, body: data})))
               .then(response => {
                    checkToken(response);

                    isFetching.value = false;

                    return response;
               });

     };

     const fetchPost = async (url, payload) => {
          isFetching.value = true;

          const fullUrl = import.meta.env.VITE_API_BASE_URL + url;
          const requestOptions = {
               method: 'POST',
               headers: {
                    'Authorization': 'Bearer ' + authStore.token,
                    'Content-Type': 'application/json'
               },
               body: JSON.stringify(payload),
          }

          return fetch(fullUrl, requestOptions)
               .then(response => response.json().then(data => ({status: response.status, body: data})))
               .then(response => {
                    checkToken(response);

                    isFetching.value = false;

                    return response;
               });

     };

     const fetchPut = async (url, payload) => {
          isFetching.value = true;
          
          const fullUrl = import.meta.env.VITE_API_BASE_URL + url;
          const requestOptions = {
               method: 'PUT',
               headers: {
                    'Authorization': 'Bearer ' + authStore.token,
                    'Content-Type': 'application/json'
               },
               body: JSON.stringify(payload),
          }

          return fetch(fullUrl, requestOptions)
               .then(response => response.json().then(data => ({status: response.status, body: data})))
               .then(response => {
                    checkToken(response);

                    isFetching.value = false;

                    return response;
               });

     };

     const checkToken = (response) => {
          if (response.status == 403) {
               if (!authStore.token) {
                    console.log('You are not logged in.');
               } else if (isTokenExpired(authStore.token)) {
                    console.log('Your session expired.');
               } else {
                    console.log('Access Denied');
               }
          }
     };

     const isTokenExpired = (token => {
          const base64Url = token.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split("")
              .map(function (c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
              })
              .join("")
          );
        
          const { exp } = JSON.parse(jsonPayload);
        
          return Date.now() >= (exp * 1000);
     });   

     return {
          isFetching,
          fetchGet,
          fetchPost,
          fetchPut
     };
}
