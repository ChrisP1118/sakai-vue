import { ref } from "vue";
import { useAuthStore } from '@/stores/auth.js';
import { useToast } from 'primevue/usetoast';
import {app} from '@/main';

//const toast = useToast();
const authStore = useAuthStore();

console.log(app.config.globalProperties.$toast);

export function useFetchApi() {
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
                    // if (response.status == 403) {
                    //      //isTokenExpired(authStore.token);

                    //      app.config.globalProperties.$toast.add({
                    //           severity: 'error',
                    //           summary: 'You\'ve been logged out. Please log back in.',
                    //           life: 3000
                    //       });
                    //      // toast.add({
                    //      //      severity: 'error',
                    //      //      summary: 'You\'ve been logged out. Please log back in.',
                    //      //      life: 3000
                    //      //  });
                    // }

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
                    if (response.status == 403) {
                         console.log('We should reauthenticate!');
                    }

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
                    if (response.status == 403) {
                         console.log('We should reauthenticate!');
                    }

                    isFetching.value = false;

                    return response;
               });

     };

     const checkToken = (response) => {
          if (response.status == 403) {
               if (!authStore.token) {
                    app.config.globalProperties.$toast.add({
                         severity: 'error',
                         summary: 'You are not logged in.',
                         detail: 'Please log in to continue.',
                         life: 3000
                    });
               } else if (isTokenExpired(authStore.token)) {
                    app.config.globalProperties.$toast.add({
                         severity: 'error',
                         summary: 'Your session expired.',
                         detail: 'Please log back in to continue.',
                         life: 3000
                    });
               } else {
                    app.config.globalProperties.$toast.add({
                         severity: 'error',
                         summary: 'Access Denied',
                         summary: 'Sorry, you do not have access.',
                         life: 3000
                    });
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
