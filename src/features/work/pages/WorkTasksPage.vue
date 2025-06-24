<script setup lang="ts">
import { useWorkTaskStore } from '../store/useWorkTaskStore'
import { onMounted, watch, ref, nextTick } from 'vue';
import EditTaskModal from '../components/EditTaskModal.vue'
import NewTaskModal from '../components/NewTaskModal.vue'
import CalendarModal from '../components/CalendarModal.vue'
import { WorkTask } from '../types/worktask';

const store = useWorkTaskStore()

const taskHtmlRef = ref<HTMLElement | null>(null);

const selectedTask = ref<WorkTask | null>(null);
const alertMessage = ref('');
const alertType = ref('');
const calendarModalRef = ref();

async function handleCheckboxChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target && target.type === 'checkbox') {
        const checkboxes = taskHtmlRef.value?.querySelectorAll('input[type="checkbox"]');
        let html = selectedTask.value?.html || '';
        if (checkboxes && selectedTask.value) {
            const checkboxArray = Array.from(checkboxes);
            const clickedIndex = checkboxArray.indexOf(target);
            let currentIndex = -1;
            html = html.replace(/<input[^>]*type="checkbox"[^>]*>/gi, (match) => {
                currentIndex++;
                if (currentIndex === clickedIndex) {
                    let updated = match.replace(/\schecked(="")?/i, '');
                    if (target.checked) {
                        updated = updated.replace(/<input/i, '<input checked');
                    }
                    return updated;
                }
                return match;
            });

            selectedTask.value.html = html;
            await store.updateWorkTask(selectedTask.value.id, selectedTask.value);
        }
    }
}

watch(
    () => selectedTask.value?.html,
    async () => {
        await nextTick();
        if (selectedTask.value && selectedTask.value.html) {
            selectedTask.value.html = selectedTask.value.html.replace(/\sdisabled(="")?/gi, '');
        }
        if (taskHtmlRef.value) {
            const checkboxes = taskHtmlRef.value.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(cb => cb.removeAttribute('disabled'));
            taskHtmlRef.value.removeEventListener('change', handleCheckboxChange);
            taskHtmlRef.value.addEventListener('change', handleCheckboxChange);
        }
    },
    { immediate: true }
);

onMounted(() => {
    store.fetchWorkTasks()
    calendarModalRef.value?.updateCalendar();
});

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
    <div class="container main-content py-4">
        <CalendarModal />
        <section class="container">
            <h1 class="mb-4">Work Task Tracker</h1>
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
                    <button type="button" class="btn btn-warning float-end text-light" id="calendar-button"
                        data-bs-toggle="modal" data-bs-target="#calendar-modal">
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
            <EditTaskModal v-model:selectedTask="selectedTask" />
            <NewTaskModal />
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
                        <div class="card-body ps-0 pt-0 pb-0">
                            <div ref="taskHtmlRef" v-html="selectedTask.html"></div>
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