import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/customers',
                    name: 'allCustomers',
                    component: () => import('@/views/pages/customers/All.vue')
                },
                {
                    path: '/customers/:id',
                    name: 'viewCustomer',
                    component: () => import('@/views/pages/customers/View.vue'),
                    meta: {
                        appMenuItemName: 'customers'
                    }
                },
                {
                    path: '/customers/:customerId/citations',
                    name: 'allCustomerCitations',
                    props: true,
                    component: () => import('@/views/pages/customers/citations/All.vue'),
                    meta: {
                        appMenuItemName: 'customers'
                    }
                },
                {
                    path: '/customers/:customerId/messages',
                    name: 'allCustomerMessages',
                    props: true,
                    component: () => import('@/views/pages/customers/messages/All.vue'),
                    meta: {
                        appMenuItemName: 'customers'
                    }
                },
                {
                    path: '/customers/:customerId/documents',
                    name: 'allCustomerDocuments',
                    props: true,
                    component: () => import('@/views/pages/customers/documents/All.vue'),
                    meta: {
                        appMenuItemName: 'customers'
                    }
                },
                {
                    path: '/customers/:customerId/documents/:id',
                    name: 'viewCustomerDocuments',
                    props: true,
                    component: () => import('@/views/pages/customers/documents/View.vue'),
                    meta: {
                        appMenuItemName: 'customers'
                    }
                },
                // {
                //     path: '/tenants/:tenantId/workItems/new',
                //     name: 'newWorkItem',
                //     component: () => import('@/views/pages/workItems/New.vue'),
                //     meta: {
                //         appMenuItemName: 'workItems'
                //     }
                // },
                // {
                //     path: '/tenants/:tenantId/workItems/:id',
                //     name: 'editWorkItem',
                //     component: () => import('@/views/pages/workItems/Edit.vue'),
                //     meta: {
                //         appMenuItemName: 'workItems'
                //     }
                // },
                // {
                //     path: '/tenants/:tenantId/users',
                //     name: 'allTenantUsers',
                //     component: () => import('@/views/pages/tenantUsers/All.vue'),
                //     meta: {
                //         appMenuItemName: 'users'
                //     }
                // },
                // {
                //     path: '/tenants/:tenantId/users/:id',
                //     name: 'editTenantUser',
                //     component: () => import('@/views/pages/tenantUsers/Edit.vue'),
                //     meta: {
                //         appMenuItemName: 'users'
                //     }
                // },
                {
                    path: '/users',
                    name: 'allUsers',
                    component: () => import('@/views/pages/users/All.vue')
                },
                {
                    path: '/users/:id',
                    name: 'editUser',
                    component: () => import('@/views/pages/users/Edit.vue')
                },
                // {
                //     path: '/tenants',
                //     name: 'allTenants',
                //     component: () => import('@/views/pages/tenants/All.vue')
                // },
                // {
                //     path: '/tenants/new',
                //     name: 'newTenant',
                //     component: () => import('@/views/pages/tenants/New.vue')
                // },
                // {
                //     path: '/tenants/:id',
                //     name: 'editTenant',
                //     component: () => import('@/views/pages/tenants/Edit.vue')
                // },
                {
                    path: '/debug',
                    name: 'debug',
                    component: () => import('@/views/pages/Debug.vue')
                }
            ]
        },
        {
            path: '/landing',
            name: 'landing',
            component: () => import('@/views/pages/Landing.vue')
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },

        {
            path: '/auth/logIn',
            name: 'login',
            component: () => import('@/views/pages/auth/LogIn.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        }
    ]
});

export default router;
