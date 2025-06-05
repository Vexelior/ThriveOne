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
        <h1 class="display-4 text-center mt-3">Todo</h1>
        <TodoInput />
        <TodoItem :todos="store.todos" />
    </div>
</template>