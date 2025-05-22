<script setup lang="ts">
import { defineProps, ref, computed } from 'vue'
import { useTodoStore } from '../store/useTodoStore'
import type { Todo } from '../types/todo'

const props = defineProps<{ todos: Todo[] }>()
const store = useTodoStore()
const isLoading = ref(false);
const search = ref('');

store.showCompleted = false;

const saveTodo = async (todo) => {
    isLoading.value = true;
    try {
        await store.updateTodo(todo.id, {
            id: todo.id,
            title: todo.title,
            description: todo.description,
            due: todo.due,
            isCompleted: todo.isCompleted,
        });
        todo.isEditing = false;
    } catch (error) {
        console.error('Error saving todo:', error);
    } finally {
        isLoading.value = false;
    }
};

const deleteTodo = async (id) => {
    isLoading.value = true;
    if (confirm("Are you sure you want to delete this todo?")) {
        await store.deleteTodo(id);
    }
    isLoading.value = false;
};

const cancelEdit = (todo, originalTodo) => {
    Object.assign(todo, originalTodo);
    todo.isEditing = false;
};

const filteredTodos = computed(() => {
    return store.todos.filter(todo => {
        if (!todo) return false;
        const matchesCompletion = todo.isCompleted === store.showCompleted;
        const matchesSearch = todo.title.toLowerCase().includes(search.value.toLowerCase());
        return matchesCompletion && matchesSearch;
    });
});

const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${month}/${day}/${year}`;
};
</script>

<template>
    <div class="container mt-5 mb-5">
        <div class="row">
            <div class="col-md-12 search-container">
                <div class="mb-3 d-flex float-end align-items-center">
                    <input type="text" v-model="search" class="form-control" placeholder="Search..." />
                    <button class="btn btn-primary ms-1 add-todo-button" data-bs-toggle="modal"
                        data-bs-target="#createTodoModal" title="Add Todo">
                        <font-awesome-icon :icon="['fas', 'plus']" />
                    </button>
                </div>
            </div>
        </div>
        <div class="row todo-items">
            <div v-if="isLoading" class="text-center mt-5">
                <font-awesome-icon :icon="['fas', 'spinner']" spin />
            </div>
            <div v-else>
                <ul class="nav nav-tabs mb-3">
                    <li class="nav-item">
                        <button class="nav-link" :class="{ active: !store.showCompleted }"
                            @click="store.showCompleted = false">
                            Active
                        </button>
                    </li>
                    <li class="nav-item">
                        <button class="nav-link" :class="{ active: store.showCompleted }"
                            @click="store.showCompleted = true">
                            Completed
                        </button>
                    </li>
                </ul>
                <span v-if="filteredTodos.length === 0" class="d-flex justify-content-center align-items-center mt-5">
                    No todos found. <font-awesome-icon :icon="['fas', 'frown']" class="ms-2 text-danger" />
                </span>
            </div>
            <div v-for="todo in filteredTodos" :key="todo.id" class="col-md-4 todo-item">
                <div class="card mb-4">
                    <div class="card-body align-items-center pb-1">
                        <div v-if="todo.isEditing">
                            <input type="text" v-model="todo.title" class="form-control mb-2" />
                            <textarea v-model="todo.description" class="form-control mb-2"></textarea>
                            <input type="date" v-model="todo.due" class="form-control mb-2" />
                            <button class="btn btn-success me-2" @click="saveTodo(todo)">Save</button>
                            <button class="btn btn-secondary" @click="cancelEdit(todo, { ...todo })">Cancel</button>
                        </div>
                        <div v-else>
                            <div class="d-flex align-items-center">
                                <div class="d-flex ">
                                    <input type="checkbox" :checked="todo.isCompleted"
                                        @change="(event) => {
                                            todo.isCompleted = event.target.checked;
                                            saveTodo(todo);
                                        }" />
                                    <span class="ms-2">{{ todo.title }}</span>
                                </div>
                                <div class="dropdown float-end ms-auto">
                                    <button class="btn dropdown-toggle" type="button" data-bs-toggle="dropdown"
                                        aria-expanded="false">
                                        <font-awesome-icon :icon="['fas', 'ellipsis-v']" />
                                    </button>
                                    <ul class="dropdown-menu">
                                        <a class="dropdown-item" @click="() => { todo.isEditing = true; }">
                                            Edit
                                        </a>
                                        <li><a class="dropdown-item text-danger" @click="deleteTodo(todo.id)">Delete</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="mb-2">
                                <div class="d-flex align-items-center">
                                    <span v-if="todo.description" class="me-2 mb-2">{{ todo.description }}</span>
                                    <span v-else class="me-2 mb-2">No description.</span>
                                </div>
                                <div class="d-flex align-items-center">
                                    <b>Due:</b><span class="ms-2 me-2">{{ formatDate(todo.due) }}</span>
                                </div>
                                <div v-if="todo.isCompleted" class="d-flex align-items-center">
                                    <b>Completed:</b><span class="ms-2 me-2">{{ formatDate(todo.completed) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
