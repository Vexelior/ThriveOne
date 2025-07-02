<script setup lang="ts">
import { ref } from 'vue'
import { useTodoStore } from '../store/useTodoStore'
import { Modal } from 'bootstrap'

const store = useTodoStore()
const newTodo = ref('')
const title = ref('')
const description = ref('')
const due = ref('')
const timeOfDay = ref('')
const isLoading = ref(false)

const handleSubmit = () => {
    isLoading.value = true
    store.addTodo(title.value, description.value, due.value, timeOfDay.value)
    title.value = ''
    description.value = ''
    due.value = ''
    timeOfDay.value = ''
    isLoading.value = false
    const modal = document.getElementById('createTodoModal')
    if (modal) {
        const bsModal = Modal.getInstance(modal) || new Modal(modal)
        bsModal.hide()
    } else {
        console.error('Modal element not found')
    }
}

const formatDate = (date) => {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${month}/${day}/${year}`
}
</script>

<template>
    <div class="modal fade" id="createTodoModal" tabindex="-1" aria-labelledby="createTodoModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-dark" id="createTodoModalLabel">Create Todo</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="handleSubmit">
                        <div class="mb-3">
                            <label for="todoTitle" class="form-label">Title</label>
                            <input type="text" class="form-control" id="todoTitle" required v-model="title" />
                        </div>
                        <div class="mb-3">
                            <label for="todoDescription" class="form-label">Description</label>
                            <textarea class="form-control" id="todoDescription" rows="3"
                                v-model="description"></textarea>
                        </div>
                        <div class="mb-3">
                            <label for="todoDueDate" class="form-label">Due Date</label>
                            <input type="date" class="form-control" id="todoDueDate" required v-model="due" />
                        </div>
                        <div class="mb-3">
                            <label for="todoTimeOfDay" class="form-label">Time of Day</label>
                            <select class="form-select" id="todoTimeOfDay" v-model="timeOfDay">
                                <option value="" disabled selected>Select time of day</option>
                                <option value="Morning">Morning</option>
                                <option value="Afternoon">Afternoon</option>
                                <option value="Evening">Evening</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary">Save</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
