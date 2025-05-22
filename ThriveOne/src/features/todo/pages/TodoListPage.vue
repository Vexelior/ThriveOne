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
        <h2 >📝 Todo List</h2>
        <TodoInput />
        <div>
            <TodoItem v-for="todo in store.todos" :key="todo.id" :todo="todo" />
        </div>
    </div>
</template>