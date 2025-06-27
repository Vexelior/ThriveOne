import { createRouter, createWebHistory } from 'vue-router';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import DashboardPage from '@/features/dashboard/pages/DashboardPage.vue';
import WorkTasksPage from '@/features/work/pages/WorkTasksPage.vue';
import TodoListPage from '@/features/todo/pages/TodoListPage.vue';

const routes = [
  {
    path: '/',
    component: DashboardLayout,
    children: [
      { path: '', component: DashboardPage, meta: { title: 'Dashboard' } },
      { path: '/todo', component: TodoListPage, meta: { title: 'Todo List' } },
      { path: '/work-tasks', component: WorkTasksPage, meta: { title: 'Work Tasks' } },
    ],
  },
];

function setTitle(to: any) {
  const nearestWithTitle = to.matched.slice().reverse().find((r: any) => r.meta && r.meta.title);
  if (nearestWithTitle) {
    document.title = nearestWithTitle.meta.title;
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.afterEach((to) => {
  setTitle(to);
});

export default router;
