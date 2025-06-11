<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useTodoStore } from '@/features/todo/store/useTodoStore';
import { useDebtStore } from '@/features/debt/store/useDebtStore';
import { useWorkTaskStore } from '@/features/work/store/useWorkTaskStore';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const todoStore = useTodoStore();
const debtStore = useDebtStore();
const workTaskStore = useWorkTaskStore();

const showAlert = ref(true);

onMounted(() => {
    todoStore.fetchTodos?.();
    debtStore.fetchDebts?.();
    workTaskStore.fetchWorkTasks?.();

    setTimeout(() => {
        showAlert.value = false;
    }, 5000);
});

const userName = ref('Alex');
const greeting = computed(() => {
    const hour = new Date().getHours();
    if (hour < 12) return `Good morning${userName.value ? ', ' + userName.value : ''}!`;
    if (hour < 18) return `Good afternoon${userName.value ? ', ' + userName.value : ''}!`;
    return `Good evening${userName.value ? ', ' + userName.value : ''}!`;
});

// Quick Stats
const totalTodos = computed(() => todoStore.todos?.length ?? 0);
const completedTodos = computed(() => todoStore.todos?.filter(t => t.isCompleted).length ?? 0);
const totalDebt = computed(() => debtStore.debts?.reduce((sum, d) => sum + d.remainingAmount, 0) ?? 0);
const totalWorkTasks = computed(() => workTaskStore.workTasks?.length ?? 0);

// Today’s Focus (example: first incomplete todo, next work task, next debt payment)
const todaysTodo = computed(() => todoStore.todos?.find(t => !t.isCompleted && new Date(t.due) <= new Date()) ?? null);
const todaysWorkTask = computed(() => workTaskStore.workTasks?.find(t => !t.dueDate || new Date(t.dueDate) <= new Date()) ?? null);

// Motivational Section
const motivationalQuotes = [
    "The journey of a thousand miles begins with one step.",
    "Small steps every day lead to big results.",
    "Stay positive, work hard, make it happen.",
    "Believe you can and you're halfway there.",
    "Success is not the key to happiness. Happiness is the key to success.",
    "Your limitation—it's only your imagination.",
    "Push yourself, because no one else is going to do it for you.",
    "Great things never come from comfort zones.",
    "Dream it. Wish it. Do it.",
    "Success doesn't just find you. You have to go out and get it.",
    "The harder you work for something, the greater you'll feel when you achieve it.",
    "Dream bigger. Do bigger.",
    "Don't stop when you're tired. Stop when you're done.",
    "Wake up with determination. Go to bed with satisfaction.",
    "Do something today that your future self will thank you for.",
    "Little things make big days.",
    "It's going to be hard, but hard does not mean impossible.",
    "Don't wait for opportunity. Create it.",
];
const quoteOfTheDay = computed(() => motivationalQuotes[new Date().getDate() % motivationalQuotes.length]);

// Alerts & Reminders (example: overdue todos or payments)
const overdueTodos = computed(() => todoStore.todos?.filter(t => !t.isCompleted && new Date(t.due) < new Date()) ?? []);
const overdueWorkTasks = computed(() => workTaskStore.workTasks?.filter(t => new Date(t.dueDate) <= new Date() && new Date(t.completedAt) > new Date()) ?? []);
const totalOverdue = computed(() => overdueTodos.value.length + overdueWorkTasks.value.length);

// Recent Activity Feed (example: last 5 completed todos or payments)
const recentTodos = computed(() => todoStore.todos?.filter(t => t.isCompleted && new Date(t.completed) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).slice(-5) ?? []);
const recentWorkTasks = computed(() => workTaskStore.workTasks?.filter(t => new Date(t.completedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).slice(-5) ?? []);
</script>

<template>
    <div class="dashboard container py-4">
        
        <!-- Notification Bell -->
        <div class="position-absolute top-0 end-0 mt-3 me-3" style="z-index: 10;">
            <div class="dropdown notification-dropdown">
                <button class="btn position-relative p-2 dropdown-toggle notification-icon" type="button"
                    id="notificationDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                    <FontAwesomeIcon :icon="['fas', 'bell']" size="lg" />
                    <span v-if="totalOverdue > 0"
                        class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                        style="font-size: 0.8rem;">
                        {{ totalOverdue }}
                    </span>
                </button>
                <ul class="dropdown-menu dropdown-menu-end p-2" aria-labelledby="notificationDropdown"
                    style="min-width: 300px;">
                    <li v-if="totalOverdue === 0" class="dropdown-item text-muted">
                        No overdue items 🎉
                    </li>
                    <template v-else>
                        <li v-if="overdueTodos.length" class="dropdown-header">Overdue Todos</li>
                        <li v-for="todo in overdueTodos" :key="'overdue-todo-' + todo.id"
                            class="dropdown-item d-flex align-items-center">
                            <FontAwesomeIcon :icon="['fas', 'triangle-exclamation']" class="me-2 text-warning" />
                            <span>{{ todo.title }}</span>
                        </li>
                        <li v-if="overdueWorkTasks.length" class="dropdown-header text-danger mt-2">Overdue Work Tasks
                        </li>
                        <li v-for="task in overdueWorkTasks" :key="'overdue-task-' + task.id"
                            class="dropdown-item d-flex align-items-center">
                            <FontAwesomeIcon :icon="['fas', 'briefcase']" class="me-2 text-info" />
                            <span>{{ task.title }}</span>
                        </li>
                    </template>
                </ul>
            </div>
        </div>

        <!-- Personalized Greeting -->
        <div class="mb-4">
            <h2 class="fw-bold greeting">{{ greeting }}</h2>
        </div>

        <!-- Alerts & Reminders -->
        <div v-if="showAlert && (overdueTodos.length || overdueWorkTasks.length)"
            class="alert alert-warning d-flex align-items-center gap-3 alert-dismissible fade show mb-4" role="alert">
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            <ul class="list-unstyled mb-0">
                <li v-if="overdueTodos.length">
                    <FontAwesomeIcon :icon="['fas', 'triangle-exclamation']" class="me-2 text-warning" />
                    You have <b>{{ overdueTodos.length }}</b> overdue todo(s)!
                </li>
                <li v-if="overdueWorkTasks.length">
                    <FontAwesomeIcon :icon="['fas', 'briefcase']" class="me-2 text-info" />
                    You have <b>{{ overdueWorkTasks.length }}</b> overdue work task(s)!
                </li>
            </ul>
        </div>

        <!-- Motivational Section -->
        <blockquote class="blockquote text-center my-4">
            <p class="mb-0 fst-italic">{{ quoteOfTheDay }}</p>
        </blockquote>

        <!-- Quick Stats Cards -->
        <div class="row g-3 mb-4 stats-cards">
            <div class="col-md-4">
                <div class="card text-bg-primary shadow-sm h-100">
                    <div class="card-body text-center">
                        <h5 class="card-title">Todos</h5>
                        <p class="display-6">{{ completedTodos }}/{{ totalTodos }}</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card text-bg-secondary shadow-sm h-100">
                    <div class="card-body text-center">
                        <h5 class="card-title">Total Debt</h5>
                        <p class="display-6">{{ totalDebt.toLocaleString('en-US', {
                            style: 'currency', currency: 'USD'
                        }) }}</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card text-bg-tertiary shadow-sm h-100">
                    <div class="card-body text-center">
                        <h5 class="card-title">Work Tasks</h5>
                        <p class="display-6">{{ totalWorkTasks }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Today’s Focus -->
        <div class="todays-focus mb-4">
            <h3 class="mb-3">Today's Focus</h3>
            <ul class="list-group">
                <li v-if="todaysTodo" class="list-group-item">
                    <FontAwesomeIcon :icon="['fas', 'square-check']" class="me-2 text-primary" />
                    Todo: <b>{{ todaysTodo.title }}</b>
                </li>
                <li v-if="todaysWorkTask" class="list-group-item">
                    <FontAwesomeIcon :icon="['fas', 'briefcase']" class="me-2 text-info" />
                    Work Task: <b>{{ todaysWorkTask.title }}</b>
                </li>
                <li v-if="!todaysTodo && !todaysWorkTask" class="list-group-item text-muted">
                    All caught up for today!
                </li>
            </ul>
        </div>

        <!-- Recent Activity Feed -->
        <div class="recent-activity">
            <h3 class="mb-3">Recent Activity</h3>
            <ul class="list-group">
                <li v-for="todo in recentTodos" :key="'todo-' + todo.id" class="list-group-item">
                    <FontAwesomeIcon :icon="['fas', 'check-circle']" class="text-success me-2" />
                    Completed Todo: <b>{{ todo.title }}</b>
                </li>
                <li v-for="task in recentWorkTasks" :key="'task-' + task.id" class="list-group-item">
                    <FontAwesomeIcon :icon="['fas', 'check-circle']" class="text-success me-2" />
                    Completed Work Task: <b>{{ task.title }}</b>
                </li>
                <li v-if="recentTodos.length === 0 && recentWorkTasks.length === 0" class="list-group-item text-muted">
                    No recent activity.
                </li>
            </ul>
        </div>
    </div>
</template>