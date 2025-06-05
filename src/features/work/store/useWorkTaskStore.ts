import apiClient  from '../../../api/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { WorkTask } from '../types/worktask'

export const useWorkTaskStore = defineStore('WorkTask', () => {
  const workTasks = ref<WorkTask[]>([])

  async function fetchWorkTasks(): Promise<WorkTask[]> {
    try {
      const response = await apiClient.get('/WorkTask')
      workTasks.value = response as unknown as WorkTask[]
      return workTasks.value
    } catch (error) {
      console.error('Error fetching WorkTasks:', error)
      return []
    }
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

  function addWorkTask(workTask : WorkTask) {
    apiClient.post('/WorkTask', workTask)
      .then(() => {
        fetchWorkTasks()
      })
      .catch((error) => {
        console.error('Error adding WorkTask:', error)
      })
  }

  function updateWorkTask(id: string, worktask: WorkTask) {
    const updatedTask = apiClient.put(`/WorkTask/${id}`, worktask)
      .then(() => {
        fetchWorkTasks()
      })
      .catch((error) => {
        console.error('Error updating WorkTask:', error)
      })
    return updatedTask;
  }

  function deleteWorkTask(id: string) {
    const deletedTask = apiClient.delete(`/WorkTask/${id}`)
      .then(() => {
        fetchWorkTasks()
      })
      .catch((error) => {
        console.error('Error deleting WorkTask:', error)
      })
    return deletedTask;
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
