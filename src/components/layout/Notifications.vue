<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useTodoStore } from '@/features/todo/store/useTodoStore';
import { useWorkTaskStore } from '@/features/work/store/useWorkTaskStore';

const todoStore = useTodoStore();
const workTaskStore = useWorkTaskStore();

const overdueTodos = computed(() => Array.isArray(todoStore.todos) ? todoStore.todos.filter(t => !t.isCompleted && t.due && new Date(t.due).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) : []);
const overdueWorkTasks = computed(() => Array.isArray(workTaskStore.workTasks) ? workTaskStore.workTasks.filter(t => new Date(t.dueDate).setHours(0, 0, 0, 0) <= new Date().setHours(0, 0, 0, 0) && !t.isCompleted) : []);
const totalOverdue = computed(() => overdueTodos.value.length + overdueWorkTasks.value.length);

onMounted(() => {
    todoStore.fetchTodos();
    workTaskStore.fetchWorkTasks();
});
</script>
<template>
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
                    <li v-if="overdueTodos && overdueTodos.length" class="dropdown-header">Overdue Todos</li>
                    <li v-for="todo in overdueTodos" :key="'overdue-todo-' + todo.id"
                        class="dropdown-item d-flex align-items-center">
                        <FontAwesomeIcon :icon="['fas', 'triangle-exclamation']" class="me-2 text-warning" />
                        <span>{{ todo.title }}</span>
                    </li>
                    <li v-if="overdueWorkTasks && overdueWorkTasks.length" class="dropdown-header text-danger mt-2">
                        Overdue Work Tasks
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
</template>