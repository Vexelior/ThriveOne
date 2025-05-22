import apiClient  from '../../../api/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Todo } from '../types/todo'

export const useTodoStore = defineStore('todo', () => {
  const todos = ref<Todo[]>([])

  function fetchTodos() {
    apiClient.get('/todo')
      .then((response) => {
        todos.value = response as unknown as Todo[];
      })
      .catch((error) => {
        console.error('Error fetching todos:', error);
      });
  }
  
  function fetchTodoById(id: string) {
    apiClient.get(`/todo/${id}`)
      .then((response) => {
        const todo = response.data as Todo
        const index = todos.value.findIndex(t => t.id === id)
        if (index !== -1) {
          todos.value[index] = todo
        } else {
          todos.value.push(todo)
        }
      })
      .catch((error) => {
        console.error('Error fetching todo:', error)
      })
  }

  function addTodo(title: string, description: string, due: string) {
    const newTodo: Todo = {
      id: '',
      title: title,
      description: description,
      created: new Date().toISOString(),
      completed: null,
      due: due,
      isCompleted: false,
    }
    apiClient.post('/todo', newTodo)
      .then(() => {
        fetchTodos()
      })
      .catch((error) => {
        console.error('Error adding todo:', error)
      })
  }

  function updateTodo(id: string, todo: Todo) {
    apiClient.put(`/todo/${id}`, todo)
      .then(() => {
        fetchTodos()
      })
      .catch((error) => {
        console.error('Error updating todo:', error)
      })
  }

  function deleteTodo(id: string) {
    apiClient.delete(`/todo/${id}`)
      .then(() => {
        fetchTodos()
      })
      .catch((error) => {
        console.error('Error deleting todo:', error)
      })
  }

  return {
    todos,
    fetchTodos,
    fetchTodoById,
    addTodo,
    updateTodo,
    deleteTodo,
  }
})
