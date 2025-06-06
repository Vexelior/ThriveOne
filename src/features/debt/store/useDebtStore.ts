import apiClient  from '../../../api/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Debt } from '../types/debt'

export const useDebtStore = defineStore('debt', () => {
  const debts = ref<Debt[]>([])

  function fetchDebts() {
    apiClient.get('/debt')
      .then((response) => {
        debts.value = response as unknown as Debt[];
      })
      .catch((error) => {
        console.error('Error fetching debts:', error);
      });
  }
  
  function fetchDebtById(id: string) {
    apiClient.get(`/debt/${id}`)
      .then((response) => {
        const debt = response.data as Debt
        const index = debts.value.findIndex(t => t.id === id)
        if (index !== -1) {
          debts.value[index] = debt
        } else {
          debts.value.push(debt)
        }
      })
      .catch((error) => {
        console.error('Error fetching debt:', error)
      })
  }

  function addDebt(debt: Debt) {
    const newDebt: Debt = {
        id: '',
        creditor: debt.creditor,
        amount: debt.amount,
        remainingAmount: debt.remainingAmount,
        previousAmount: debt.previousAmount,
        notes: debt.notes,
        dateAdded: new Date().toISOString(),
        dateEdited: new Date().toISOString(),
        percentageChange: debt.percentageChange,
        type: debt.type,
        image: debt.image,
        imageId: debt.imageId,
        imageSource: debt.imageSource,
        interestRate: debt.interestRate,
        lastPayment: debt.lastPayment,
        lastPaymentDate: debt.lastPaymentDate,
        minimumPayment: debt.minimumPayment
    }
    apiClient.post('/debt', newDebt)
      .then(() => {
        fetchDebts()
      })
      .catch((error) => {
        console.error('Error adding debt:', error)
      })
  }

  function updateTodo(id: string, debt: Debt) {
    apiClient.put(`/debt/${id}`, debt)
      .then(() => {
        fetchDebts()
      })
      .catch((error) => {
        console.error('Error updating debt:', error)
      })
  }

  function deleteTodo(id: string) {
    apiClient.delete(`/debt/${id}`)
      .then(() => {
        fetchDebts()
      })
      .catch((error) => {
        console.error('Error deleting debt:', error)
      })
  }

  return {
    debts,
    fetchDebts,
    fetchDebtById,
    addDebt,
    updateTodo,
    deleteTodo,
  }
})
