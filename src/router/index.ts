import { createRouter, createWebHistory } from 'vue-router';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import DashboardPage from '@/features/dashboard/pages/DashboardPage.vue';
import DebtTrackerPage from '@/features/debt/pages/DebtTrackerPage.vue';
import DebtAddPage from '@/features/debt/pages/DebtAddPage.vue';
import DebtDetailPage from '@/features/debt/pages/DebtDetailPage.vue';
import DebtEditPage from '@/features/debt/pages/DebtEditPage.vue';
import DebtAddPaymentPage from '@/features/debt/pages/DebtAddPaymentPage.vue';
import DebtInterestCharge from '@/features/debt/pages/DebtAddInterestCharge.vue';
import DebtSummaryPage from '@/features/debt/pages/DebtSummaryPage.vue';
import WorkTasksPage from '@/features/work/pages/WorkTasksPage.vue';
import TodoListPage from '@/features/todo/pages/TodoListPage.vue';
import { Router } from 'vue-router';


const routes = [
  {
    path: '/',
    component: DashboardLayout,
    children: [
      { path: '', component: DashboardPage, meta: { title: 'Dashboard' } },
      { path: '/todo', component: TodoListPage, meta: { title: 'Todo List' } },
      { path: '/work-tasks', component: WorkTasksPage, meta: { title: 'Work Tasks' } },
      { path: '/debt', component: DebtTrackerPage, meta: { title: 'Debt Tracker' } },
      { path: '/debt/add', component: DebtAddPage, meta: { title: 'Add Debt' } },
      { path: '/debt/:id', component: DebtDetailPage, meta: { title: 'Debt Details' } },
      { path: '/debt/edit/:id', component: DebtEditPage, props: true, meta: { title: 'Edit Debt' } },
      { path: '/debt/payment/add/:id', component: DebtAddPaymentPage, props: true, meta: { title: 'Add Payment' } },
      { path: '/debt/interest-charge/add/:id', component: DebtInterestCharge, props: true, meta: { title: 'Add Interest Charge' } },
      { path: '/debt/summary', component: DebtSummaryPage, meta: { title: 'Debt Summary' } },
    ],
  },
];

// Set document title after each route change

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
