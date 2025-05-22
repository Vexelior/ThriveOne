<script setup lang="ts">
import { defineProps } from 'vue'
import { useTodoStore } from '../store/useTodoStore'
import type { Todo } from '../types/todo'

const props = defineProps<{ todo: Todo }>()
const store = useTodoStore()
</script>

<template>
    <label class="form-check d-flex align-items-center mb-2">
        <input type="checkbox" :checked="todo.isCompleted ?? false"
            @change="store.toggleTodo(todo.id, !todo.isCompleted)" class="form-check-input" />
        <span :class="{ 'text-decoration-line-through': todo.isCompleted }">
            {{ todo.title }}
        </span>
    </label>
    <button @click="store.deleteTodo(todo.id)" class="btn btn-link text-danger p-0">
        🗑️
    </button>
</template>