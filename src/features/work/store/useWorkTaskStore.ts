import apiClient  from '../../../api/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { WorkTask } from '../types/worktask'

export const useWorkTaskStore = defineStore('WorkTask', () => {
  const workTasks = ref<WorkTask[]>([])

  function fetchWorkTasks(): Promise<WorkTask[]> {
    return apiClient.get('/WorkTask')
      .then((response) => {
        workTasks.value = response as unknown as WorkTask[];
        return workTasks.value;
      })
      .catch((error) => {
        console.error('Error fetching WorkTasks:', error);
        return [];
      });
  }
  
  function fetchWorkTaskById(id: string) {
    apiClient.get(`/WorkTask/${id}`)
      .then((response) => {
        const todo = response.data as unknown as WorkTask
        const index = workTasks.value.findIndex(t => t.id === id)
        if (index !== -1) {
          workTasks.value[index] = todo
        } else {
          workTasks.value.push(todo)
        }
      })
      .catch((error) => {
        console.error('Error fetching WorkTask:', error)
      })
  }

  function addWorkTask(title: string, description: string, completedAt: string, dueDate: string, priority: string, status: string, markdown: string, html: string) {
    const newWorkTask: WorkTask = {
      id: '',
      title: title,
      description: description,
      completedAt: completedAt,
      dueDate: dueDate,
      priority: priority,
      status: status,
      markdown: markdown,
      html: html,
    }
    apiClient.post('/WorkTask', newWorkTask)
      .then(() => {
        fetchWorkTasks()
      })
      .catch((error) => {
        console.error('Error adding WorkTask:', error)
      })
  }

  function updateWorkTask(id: string, worktask: WorkTask) {
    apiClient.put(`/WorkTask/${id}`, worktask)
      .then(() => {
        fetchWorkTasks()
      })
      .catch((error) => {
        console.error('Error updating WorkTask:', error)
      })
  }

  function deleteWorkTask(id: string) {
    apiClient.delete(`/WorkTask/${id}`)
      .then(() => {
        fetchWorkTasks()
      })
      .catch((error) => {
        console.error('Error deleting WorkTask:', error)
      })
  }

  return {
    workTasks,
    fetchWorkTasks,
    fetchWorkTaskById,
    addWorkTask,
    updateWorkTask,
    deleteWorkTask,
  }
})
