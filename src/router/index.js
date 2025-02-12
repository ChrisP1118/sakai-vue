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
                },
                {
                    path: '/uikit/formlayout',
                    name: 'formlayout',
                    component: () => import('@/views/uikit/FormLayout.vue')
                },
                {
                    path: '/uikit/input',
                    name: 'input',
                    component: () => import('@/views/uikit/InputDoc.vue')
                },
                {
                    path: '/uikit/button',
                    name: 'button',
                    component: () => import('@/views/uikit/ButtonDoc.vue')
                },
                {
                    path: '/uikit/table',
                    name: 'table',
                    component: () => import('@/views/uikit/TableDoc.vue')
                },
                {
                    path: '/uikit/list',
                    name: 'list',
                    component: () => import('@/views/uikit/ListDoc.vue')
                },
                {
                    path: '/uikit/tree',
                    name: 'tree',
                    component: () => import('@/views/uikit/TreeDoc.vue')
                },
                {
                    path: '/uikit/panel',
                    name: 'panel',
                    component: () => import('@/views/uikit/PanelsDoc.vue')
                },

                {
                    path: '/uikit/overlay',
                    name: 'overlay',
                    component: () => import('@/views/uikit/OverlayDoc.vue')
                },
                {
                    path: '/uikit/media',
                    name: 'media',
                    component: () => import('@/views/uikit/MediaDoc.vue')
                },
                {
                    path: '/uikit/message',
                    name: 'message',
                    component: () => import('@/views/uikit/MessagesDoc.vue')
                },
                {
                    path: '/uikit/file',
                    name: 'file',
                    component: () => import('@/views/uikit/FileDoc.vue')
                },
                {
                    path: '/uikit/menu',
                    name: 'menu',
                    component: () => import('@/views/uikit/MenuDoc.vue')
                },
                {
                    path: '/uikit/charts',
                    name: 'charts',
                    component: () => import('@/views/uikit/ChartDoc.vue')
                },
                {
                    path: '/uikit/misc',
                    name: 'misc',
                    component: () => import('@/views/uikit/MiscDoc.vue')
                },
                {
                    path: '/uikit/timeline',
                    name: 'timeline',
                    component: () => import('@/views/uikit/TimelineDoc.vue')
                },
                {
                    path: '/pages/empty',
                    name: 'empty',
                    component: () => import('@/views/pages/Empty.vue')
                },
                {
                    path: '/pages/crud',
                    name: 'crud',
                    component: () => import('@/views/pages/Crud.vue')
                },
                {
                    path: '/documentation',
                    name: 'documentation',
                    component: () => import('@/views/pages/Documentation.vue')
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
