<script setup lang="ts">
import { watch, ref, defineProps, defineEmits, onMounted } from 'vue';
import { useWorkTaskStore } from '../store/useWorkTaskStore'
import { WorkTask } from '../types/worktask';
import showdown from 'showdown';
import { Modal } from 'bootstrap';

const store = useWorkTaskStore();

const props = defineProps<{
    selectedTask: WorkTask | null
}>();

const emit = defineEmits<{
    (e: 'update:selectedTask', task: WorkTask | null): void;
    (e: 'task-success', message: string): void;
    (e: 'task-error', message: string): void;
}>();

const taskId = ref(props.selectedTask ? props.selectedTask.id : '');
const taskTitle = ref(props.selectedTask ? props.selectedTask.title : '');
const taskDescription = ref(props.selectedTask ? props.selectedTask.description : '');
const taskPriority = ref(props.selectedTask ? props.selectedTask.priority : 'Low');
const taskStatus = ref(props.selectedTask ? props.selectedTask.status : 'Not Started');
const taskDueDate = ref(props.selectedTask ? props.selectedTask.dueDate : '');
const taskCompletedDate = ref(props.selectedTask ? props.selectedTask.completedAt : '');
const taskMarkdown = ref(props.selectedTask ? props.selectedTask.markdown : '');
const taskHtml = ref(props.selectedTask ? props.selectedTask.html : '');

onMounted(() => {
    if (props.selectedTask) {
        taskId.value = props.selectedTask.id;
        taskTitle.value = props.selectedTask.title;
        taskDescription.value = props.selectedTask.description;
        taskPriority.value = props.selectedTask.priority;
        taskStatus.value = props.selectedTask.status;
        taskDueDate.value = props.selectedTask.dueDate;
        taskCompletedDate.value = props.selectedTask.completedAt || '';
        taskMarkdown.value = props.selectedTask.markdown;
        taskHtml.value = props.selectedTask.html;
    }
});

watch(
    () => props.selectedTask,
    (task: WorkTask | null) => {
        if (task) {
            taskId.value = task.id;
            taskTitle.value = task.title;
            taskDescription.value = task.description;
            taskPriority.value = task.priority;
            taskStatus.value = task.status;
            taskDueDate.value = formatDate(task.dueDate);
            taskCompletedDate.value = formatDate(task.completedAt) || '';
            taskMarkdown.value = task.markdown;
            taskHtml.value = task.html;
        } else {
            taskId.value = '';
            taskTitle.value = '';
            taskDescription.value = '';
            taskPriority.value = 'Low';
            taskStatus.value = 'Not Started';
            taskDueDate.value = '';
            taskCompletedDate.value = '';
            taskMarkdown.value = '';
            taskHtml.value = '';
        }
    },
    { immediate: true }
);

const formatDate = (date: string | number | Date) => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
};

function handleTaskEdit() {
    const updatedTask: WorkTask = {
        id: taskId.value,
        title: taskTitle.value,
        description: taskDescription.value,
        priority: taskPriority.value,
        status: taskStatus.value,
        dueDate: taskDueDate.value,
        completedAt: taskCompletedDate.value,
        markdown: taskMarkdown.value,
        html: new showdown.Converter().makeHtml(taskHtml.value)
    };

    store.updateWorkTask(updatedTask.id, updatedTask)
        .then(() => {
            emit('task-success', 'Task updated successfully');
            emit('update:selectedTask', null);
        })
        .catch((error) => {
            emit('task-error', `Error updating task: ${error.message}`);
        });

    store.fetchWorkTasks().then(tasks => {
        store.workTasks = tasks;
    });

    // Reset the form fields after editing
    taskId.value = '';
    taskTitle.value = '';
    taskDescription.value = '';
    taskPriority.value = 'Low';
    taskStatus.value = 'Not Started';
    taskDueDate.value = '';
    taskCompletedDate.value = '';
    taskMarkdown.value = '';
    taskHtml.value = '';
    emit('update:selectedTask', null);
    const modal = document.getElementById('edit-task-modal');
    if (modal) {
        const bootstrapModal = Modal.getInstance(modal) || new Modal(modal);
        bootstrapModal.hide();
    }
}

function handleTaskDelete() {
    if (!taskId.value) return;

    store.deleteWorkTask(taskId.value)
        .then(() => {
            emit('task-success', 'Task deleted successfully');
            emit('update:selectedTask', null);
        })
        .catch((error) => {
            emit('task-error', `Error deleting task: ${error.message}`);
        });
}
</script>

<template>
    <div class="modal fade" id="edit-task-modal" tabindex="-1" aria-labelledby="edit-task-modalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-xl modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="card-title" id="task-modal-title">
                        Edit Task
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body w-100">
                    <div class="card mt-3">
                        <div class="card-body">
                            <form id="readmeForm">
                                <input type="hidden" id="task-id" v-model="taskId">
                                <div class="mb-3">
                                    <label for="titleInput" class="form-label">Title</label>
                                    <input type="text" class="form-control" id="task-title" required
                                        placeholder="Enter task title" v-model="taskTitle" />
                                </div>
                                <div class="mb-3">
                                    <label for="titleInput" class="form-label">Description</label>
                                    <textarea class="form-control" id="task-description" rows="5" required
                                        placeholder="Enter task description" v-model="taskDescription"></textarea>
                                </div>
                                <div class="row">
                                    <div class="col-lg-6">
                                        <div class="mb-3">
                                            <label for="titleInput" class="form-label">Priority</label>
                                            <select class="form-select" aria-label="Default select example"
                                                id="task-priority" required v-model="taskPriority">
                                                <option value="Low">Low</option>
                                                <option value="Medium">Medium</option>
                                                <option value="High">High</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-lg-6">
                                        <div class="mb-3">
                                            <label for="titleInput" class="form-label">Status</label>
                                            <select class="form-select" aria-label="Default select example"
                                                id="task-status" required v-model="taskStatus">
                                                <option value="Not Started">Not Started</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Completed">Completed</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-6">
                                        <div class="mb-3">
                                            <label for="titleInput" class="form-label">Due Date</label>
                                            <input type="date" class="form-control" id="task-due-date" required
                                                v-model="taskDueDate">
                                        </div>
                                    </div>
                                    <div class="col-lg-6" id="task-completed-date"
                                        :class="{ 'd-none': taskStatus !== 'Completed' }">
                                        <div class="mb-3">
                                            <label for="titleInput" class="form-label">Completed Date</label>
                                            <input type="date" class="form-control" id="task-completed-date"
                                                v-model="taskCompletedDate">
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="titleInput" class="form-label">Body</label>
                                    <textarea class="form-control" id="task-markdown" rows="20" required
                                        placeholder="Enter task body in markdown" v-model="taskMarkdown"></textarea>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" id="delete-button"
                        @click="handleTaskDelete">Delete</button>
                    <button type="button" class="btn btn-success" id="save-button" data-bs-dismiss="modal"
                        @click="handleTaskEdit">Save</button>
                </div>
            </div>
        </div>
    </div>
</template>