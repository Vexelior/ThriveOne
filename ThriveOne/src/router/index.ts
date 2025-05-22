import { createRouter, createWebHistory } from 'vue-router';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import DashboardPage from '@/features/dashboard/pages/DashboardPage.vue';

const routes = [
  {
    path: '/',
    component: DashboardLayout,
    children: [
      { path: '', component: DashboardPage },
      // { path: 'debt', component: () => import('@/features/debt/pages/DebtTrackerPage.vue') },
      { path: '/todo', component: () => import('@/features/todo/pages/TodoListPage.vue') },
      // { path: 'tasks', component: () => import('@/features/work/pages/WorkTasksPage.vue') },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
