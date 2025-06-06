import { createRouter, createWebHistory } from 'vue-router';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import DashboardPage from '@/features/dashboard/pages/DashboardPage.vue';
import DebtTrackerPage from '@/features/debt/pages/DebtTrackerPage.vue';
import WorkTasksPage from '@/features/work/pages/WorkTasksPage.vue';
import TodoListPage from '@/features/todo/pages/TodoListPage.vue';


const routes = [
  {
    path: '/',
    component: DashboardLayout,
    children: [
      { path: '', component: DashboardPage },
      { path: '/debt', component: DebtTrackerPage },
      { path: '/todo', component: TodoListPage },
      { path: '/worktasks', component: WorkTasksPage },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
