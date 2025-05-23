<script setup lang="ts">
import TodoInput from '../components/TodoInput.vue'
import TodoItem from '../components/TodoItem.vue'
import { useTodoStore } from '../store/useTodoStore'
import { onMounted } from 'vue'

const store = useTodoStore()

onMounted(() => {
    store.fetchTodos()
})
</script>

<template>
    <div>
        <h2>Todo</h2>
        <TodoInput />
        <TodoItem :todos="store.todos" />
    </div>
</template>