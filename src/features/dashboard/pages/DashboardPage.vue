<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useTodoStore } from '@/features/todo/store/useTodoStore';
import { useWorkTaskStore } from '@/features/work/store/useWorkTaskStore';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const todoStore = useTodoStore();
const workTaskStore = useWorkTaskStore();

const showAlert = ref(true);

onMounted(() => {
    todoStore.fetchTodos?.();
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

// Quick Stats
const today = new Date();
today.setHours(0, 0, 0, 0);

const todosDueTodayOrOverdue = computed(() => {
    if (!Array.isArray(todoStore.todos)) return 0;
    return todoStore.todos.filter(t => {
        const dueDate = new Date(t.due);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate.getTime() <= today.getTime();
    }).length;
});
const totalTodosNotCompletedToday = computed(() => {
    if (!Array.isArray(todoStore.todos)) return 0;
    return todoStore.todos.filter(t => t.isCompleted && new Date(t.completed).setHours(0, 0, 0, 0) >= today).length;
});
const totalCompletedWorkTasks = computed(() => Array.isArray(workTaskStore.workTasks) ? workTaskStore.workTasks.filter(t => t.isCompleted).length : 0);
const totalWorkTasks = computed(() => Array.isArray(workTaskStore.workTasks) ? workTaskStore.workTasks.length : 0);

// Today’s Focus (example: first incomplete todo, next work task, next debt payment)
const todaysTodo = computed(() => {
    if (!Array.isArray(todoStore.todos)) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return todoStore.todos.filter(t => !t.isCompleted && (!t.due || new Date(t.due).setHours(0, 0, 0, 0) <= today));
});

const todaysWorkTask = computed(() => {
    if (!Array.isArray(workTaskStore.workTasks)) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return workTaskStore.workTasks.find(t => !t.isCompleted && (new Date(t.dueDate).setHours(0, 0, 0, 0) == today));
});

// This week’s Focus (example: first incomplete todo, next work task, next debt payment)
const upcomingWorkTasks = computed(() => {
    if (!Array.isArray(workTaskStore.workTasks)) return [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekFromToday = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    weekFromToday.setHours(0, 0, 0, 0);
    return workTaskStore.workTasks.filter(t =>
        !t.isCompleted &&
        t.dueDate &&
        (() => {
            const due = new Date(t.dueDate);
            due.setHours(0, 0, 0, 0);
            return due >= today && due <= weekFromToday;
        })()
    );
});

// Motivational Section
const quoteOfTheDay = computed(() => motivationalQuotes[new Date().getDate() % motivationalQuotes.length]);

// Recent Activity Feed (example: last 5 completed todos or payments)
const recentTodos = computed(() => Array.isArray(todoStore.todos) ? todoStore.todos.filter(t => t.isCompleted && new Date(t.completed) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).slice(-5) : []);
const recentWorkTasks = computed(() => Array.isArray(workTaskStore.workTasks) ? workTaskStore.workTasks.filter(t => new Date(t.completedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).slice(-5) : []);
</script>

<template>
    <div class="dashboard container py-4">
        <!-- Personalized Greeting -->
        <div class="mb-4">
            <h2 class="fw-bold greeting">{{ greeting }}</h2>
        </div>

        <!-- Motivational Section -->
        <blockquote class="blockquote text-center my-4">
            <p class="mb-0 fst-italic">{{ quoteOfTheDay }}</p>
        </blockquote>

        <!-- Quick Stats Cards -->
        <div class="row g-3 mb-4 stats-cards">
            <div class="col-md-6">
                <div class="card text-bg-primary shadow-sm h-100">
                    <div class="card-body text-center">
                        <h5 class="card-title">Todos</h5>
                        <p class="display-6">{{ totalTodosNotCompletedToday }}/{{ todosDueTodayOrOverdue }}</p>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card text-bg-tertiary shadow-sm h-100">
                    <div class="card-body text-center">
                        <h5 class="card-title">Work Tasks</h5>
                        <p class="display-6">{{ totalCompletedWorkTasks }}/{{ totalWorkTasks }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="row mb-4">
            <!-- Today’s Focus -->
            <div class="col-md-6 mb-4 mb-md-0">
                <h3 class="mb-3">Today's Focus</h3>
                <div v-if="todaysTodo && todaysTodo.length > 0 || todaysWorkTask" class="todays-focus h-100">
                    <ul class="list-group">
                        <li v-for="todo in (Array.isArray(todaysTodo) ? todaysTodo : (todaysTodo ? [todaysTodo] : []))"
                            :key="'todays-todo-' + todo.id" class="list-group-item">
                            <FontAwesomeIcon :icon="['fas', 'square-check']" class="me-2 text-primary" />
                            Todo: <b>{{ todo.title }}</b>
                        </li>
                        <li v-for="task in (Array.isArray(todaysWorkTask) ? todaysWorkTask : (todaysWorkTask ? [todaysWorkTask] : []))"
                            :key="'todays-worktask-' + task.id" class="list-group-item">
                            <FontAwesomeIcon :icon="['fas', 'briefcase']" class="me-2 text-info" />
                            Work Task: <b>{{ task.title }}</b>
                        </li>
                    </ul>
                </div>
                <div v-else class="todays-focus h-100">
                    <p>No tasks for today! 🎉</p>
                </div>
            </div>

            <div class="col-md-6">
                <!-- This Week’s Focus -->
                <h3 class="mb-3">This Week's Work Focus</h3>
                <div v-if="upcomingWorkTasks && upcomingWorkTasks.length > 0" class="this-week-focus mb-4">
                    <ul class="list-group">
                        <li v-for="task in (Array.isArray(upcomingWorkTasks) ? upcomingWorkTasks : (upcomingWorkTasks ? [upcomingWorkTasks] : []))"
                            :key="'thisweek-worktask-' + task.id" class="list-group-item">
                            <FontAwesomeIcon :icon="['fas', 'briefcase']" class="me-2 text-info" />
                            Work Task: <b>{{ task.title }}</b>
                        </li>
                    </ul>
                </div>
                <p v-else>No upcoming work tasks this week! 🎉</p>
            </div>
        </div>

        <!-- Recent Activity Feed -->
        <div class="row mb-4">
            <div class="col">
                <h3 class="mb-3">Recent Activity</h3>
                <div v-if="recentTodos && recentWorkTasks && (recentTodos.length > 0 || recentWorkTasks.length > 0)"
                    class="recent-activity h-100">
                    <ul class="list-group">
                        <li v-for="todo in recentTodos" :key="'todo-' + todo.id" class="list-group-item">
                            <FontAwesomeIcon :icon="['fas', 'check-circle']" class="text-success me-2" />
                            Completed Todo: <b>{{ todo.title }}</b>
                        </li>
                        <li v-for="task in recentWorkTasks" :key="'task-' + task.id" class="list-group-item">
                            <FontAwesomeIcon :icon="['fas', 'check-circle']" class="text-success me-2" />
                            Completed Work Task: <b>{{ task.title }}</b>
                        </li>
                    </ul>
                </div>
                <p v-else>No recent activity.</p>
            </div>
        </div>
    </div>
</template>