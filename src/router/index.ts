import { createRouter, createWebHistory } from 'vue-router';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import DashboardPage from '@/features/dashboard/pages/DashboardPage.vue';
import DebtTrackerPage from '@/features/debt/pages/DebtTrackerPage.vue';
import DebtAddPage from '@/features/debt/pages/DebtAddPage.vue';
import DebtDetailPage from '@/features/debt/pages/DebtDetailPage.vue';
import DebtEditPage from '@/features/debt/pages/DebtEditPage.vue';
import DebtAddPaymentPage from '@/features/debt/pages/DebtAddPaymentPage.vue';
import DebtInterestCharge from '@/features/debt/pages/DebtAddInterestCharge.vue';
import WorkTasksPage from '@/features/work/pages/WorkTasksPage.vue';
import TodoListPage from '@/features/todo/pages/TodoListPage.vue';


const routes = [
  {
    path: '/',
    component: DashboardLayout,
    children: [
      { path: '', component: DashboardPage },
      { path: '/debt', component: DebtTrackerPage },
      { path: '/debt/add', component: DebtAddPage },
      { path: '/debt/:id', component: DebtDetailPage, props: true },
      { path: '/debt/edit/:id', component: DebtEditPage, props: true },
      { path: '/debt/payment/add/:id', component: DebtAddPaymentPage, props: true },
      { path: '/debt/interest-charge/add/:id', component: DebtInterestCharge, props: true },
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
