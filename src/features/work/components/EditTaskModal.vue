<script setup>
import { ref, watch, defineProps, defineEmits, onMounted } from 'vue';
import { useWorkTaskStore } from '../store/useWorkTaskStore'
import showdown from 'showdown';
import { Modal } from 'bootstrap';

const store = useWorkTaskStore();

const props = defineProps({
    selectedTask: {
        type: Object,
        default: null,
    },
});

const emit = defineEmits([
    'update:selected-task',
    'task-success',
    'task-error',
]);

const taskId = ref('');
const taskTitle = ref('');
const taskDescription = ref('');
const taskPriority = ref('');
const taskStatus = ref('');
const taskDueDate = ref('');
const taskMarkdown = ref('');
const taskCompletedDate = ref('');

const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
};

const updateTaskFields = (task) => {
    taskId.value = task?.id || '';
    taskTitle.value = task?.title || '';
    taskDescription.value = task?.description || '';
    taskPriority.value = task?.priority || '';
    taskStatus.value = task?.status || '';
    taskDueDate.value = formatDate(task?.dueDate) || '';
    taskMarkdown.value = task?.markdown || '';
    taskCompletedDate.value = formatDate(task?.completedAt) || '';
};

watch(
    () => props.selectedTask,
    (newTask) => {
        if (newTask) {
            updateTaskFields(newTask);
        }
    },
    { immediate: true }
);

const handleTaskEdit = async () => {
    const updatedTask = {
        id: taskId.value,
        title: taskTitle.value,
        description: taskDescription.value,
        priority: taskPriority.value,
        status: taskStatus.value,
        dueDate: taskDueDate.value,
        markdown: taskMarkdown.value,
        completedAt: taskCompletedDate.value,
    };
    const converter = new showdown.Converter();
    const html = converter.makeHtml(taskMarkdown.value);
    updatedTask.html = html;
    try {
        await store.updateWorkTask(updatedTask.id, updatedTask);
        emit('update:selected-task', updatedTask);
        emit('task-success', 'Task updated successfully!');
    } catch (error) {
        console.error('Error updating task:', error);
        emit('task-error', 'Failed to update task - ' + error.response.data.title);
        return;
    }
};

const handleTaskDelete = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
        try {
            await deleteTask(taskId.value);
            emit('update:selected-task', null);
            emit('task-success', 'Task deleted successfully!');
        } catch (error) {
            console.error('Error deleting task:', error);
            emit('task-error', 'Failed to delete task.');
        } finally {
            const modal = document.getElementById('edit-task-modal');
            if (modal) {
                const modalInstance = Modal.getInstance(modal) || new Modal(modal);
                modalInstance.hide();
                var backdrop = document.querySelector('.modal-backdrop');
                if (backdrop) {
                    backdrop.remove();
                }
            }
            resetForm();
        }
    }
};

const resetForm = () => {
    taskId.value = '';
    taskTitle.value = '';
    taskDescription.value = '';
    taskPriority.value = '';
    taskStatus.value = '';
    taskDueDate.value = '';
    taskMarkdown.value = '';
    taskCompletedDate.value = '';
};
</script>

<template>
    <div class="modal fade" id="edit-task-modal" tabindex="-1" aria-labelledby="edit-task-modalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-xl modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="card-title" id="task-modal-title">
                        {{ selectedTask ? 'Edit Task' : 'New Task' }}
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
                                        placeholder="Enter task title" v-model="taskTitle">
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