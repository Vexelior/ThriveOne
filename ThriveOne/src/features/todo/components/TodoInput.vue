<script setup lang="ts">
import { ref } from 'vue'
import { useTodoStore } from '../store/useTodoStore'

const store = useTodoStore()
const newTodo = ref('')

function handleSubmit() {
    if (newTodo.value.trim()) {
        store.addTodo(newTodo.value.trim(), 'default description')
        newTodo.value = ''
    }
}
</script>

<template>
    <form @submit.prevent="handleSubmit" class="d-flex gap-2">
        <input v-model="newTodo" placeholder="Add a todo..." class="form-control flex-grow-1" />
        <button type="submit" class="btn btn-primary">Add</button>
    </form>
</template>
