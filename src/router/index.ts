import AddData from '@/views/AddData.vue';
import Compare from '@/views/Compare.vue';
import FormTable from '@/views/FormTable.vue';
import Result from '@/views/Result.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'form-table',
            component: FormTable,
        },
        {
            path: '/add-data',
            name: 'add-data',
            component: AddData,
        },
        {
            path: '/result',
            name: 'result',
            component: Result,
        },
        {
            path: '/compare',
            name: 'compare',
            component: Compare,
        }
    ],
})

export default router;
