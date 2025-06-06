<script setup lang="ts">
import { useWorkTaskStore } from '../store/useWorkTaskStore'
import { onMounted, ref } from 'vue'
import EditTaskModal from '../components/EditTaskModal.vue'
import NewTaskModal from '../components/NewTaskModal.vue'
import CalendarModal from '../components/CalendarModal.vue'
import { WorkTask } from '../types/worktask';

const store = useWorkTaskStore()

const selectedTask = ref<WorkTask | null>(null);
const alertMessage = ref('');
const alertType = ref('');
const calendarModalRef = ref();

onMounted(() => {
    store.fetchWorkTasks()
    calendarModalRef.value?.updateCalendar();
});

function handleSuccess(message: string) {
    calendarModalRef.value?.updateCalendar();
    alertMessage.value = message;
    alertType.value = 'alert-success';
    store.fetchWorkTasks();
    selectedTask.value = null;
    setTimeout(() => {
        alertMessage.value = '';
        alertType.value = '';
    }, 3000);
}

function handleError(message: string) {
    alertMessage.value = message;
    alertType.value = 'alert-danger';
    setTimeout(() => {
        alertMessage.value = '';
        alertType.value = '';
    }, 3000);
}

function handleTaskSelection(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const taskId = selectElement.value;
    const foundTask = store.workTasks.find(task => task.id === taskId);
    if (foundTask) {
        selectedTask.value = foundTask;
    } else {
        selectedTask.value = null;
    }
}
</script>

<template>
    <div>
        <CalendarModal />
        <h1 class="display-4 text-center mt-3">Work Task Tracker</h1>
        <section class="container">
            <div class="row">
                <div id="alert-container">
                    <div v-if="alertMessage" :class="`alert ${alertType}`" role="alert">
                        {{ alertMessage }}
                    </div>
                </div>
            </div>
            <div class="row">
                <label for="task-list" class="form-label">Task List</label>
                <div class="col d-flex justify-content-between align-items-center">
                    <select class="form-select w-50" aria-label="Default select example" id="task-list"
                        @change="handleTaskSelection">
                        <option value="" v-if="!selectedTask" selected disabled>-- SELECT --</option>
                        <option value="" v-else>-- SELECT --</option>
                        <option v-for="task in store.workTasks" :key="task.id" :value="task.id">
                            {{ task.title }}
                        </option>
                    </select>
                    <button type="button" class="btn btn-warning float-end" id="calendar-button" data-bs-toggle="modal"
                        data-bs-target="#calendar-modal">
                        View Calendar
                    </button>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-lg-3">
                    <button v-if="!selectedTask" type="button" class="btn btn-primary me-1" data-bs-toggle="modal"
                        data-bs-target="#new-task-modal" @click="selectedTask = null">
                        New Task
                    </button>
                    <button v-if="selectedTask" type="button" class="btn btn-primary me-1" data-bs-toggle="modal"
                        data-bs-target="#new-task-modal" disabled>
                        New Task
                    </button>
                    <button v-if="selectedTask" type="button" class="btn btn-secondary" id="edit-modal-button"
                        data-bs-toggle="modal" data-bs-target="#edit-task-modal">
                        Edit
                    </button>
                    <button v-else type="button" class="btn btn-secondary" id="edit-modal-button" disabled>
                        Edit
                    </button>
                </div>
            </div>
            <EditTaskModal v-model:selectedTask="selectedTask" @task-success="handleSuccess"
                @task-error="handleError" />
            <NewTaskModal @task-success="handleSuccess" @task-error="handleError" />
        </section>
        <section class="container mt-3" id="app-area">
            <div class="row">
                <div class="col-lg-12 mb-2">
                    <div v-if="selectedTask">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title"><b>Description</b></h5>
                                <p class="card-text">
                                    <span v-if="selectedTask.description">
                                        {{ selectedTask.description }}
                                    </span>
                                    <span v-else>
                                        No description available
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-12">
                    <div v-if="selectedTask" class="markdown-body card" id="task-html">
                        <div class="card-body">
                            <div v-html="selectedTask.html"></div>
                        </div>
                    </div>
                    <div v-else class="card">
                        <div class="card-body">No task selected</div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>