import { createRouter, createWebHashHistory } from 'vue-router';
import index from '@/pages/index/index.vue';
const routes: any = [
    {
        path: '/',
        readirect: '/index',
        children: [
            {
                path: '/index',
                component: index,
                name: 'index'
            }
        ],
    }
];
const router = createRouter({
    history: createWebHashHistory(),
    routes
});
export default router;