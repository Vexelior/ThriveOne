import apiClient  from '../../../api/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Debt } from '../types/debt'
import type { Image } from '../types/image'
import type { Payment } from '../types/payment'
import type { InterestCharge } from '../types/interestcharge'

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
  
  async function fetchDebtById(id: string) {
    try {
      const response = await apiClient.get(`/debt/${id}`)
      return response
    } catch (error) {
      console.error('Error fetching debt:', error)
      throw error
    }
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

  function updateDebt(id: string, debt: Debt) {
    apiClient.put(`/debt/${id}`, debt)
      .then(() => {
        fetchDebts()
      })
      .catch((error) => {
        console.error('Error updating debt:', error)
      })
  }

  function deleteDebt(id: string) {
    apiClient.delete(`/debt/${id}`)
      .then(() => {
        fetchDebts()
      })
      .catch((error) => {
        console.error('Error deleting debt:', error)
      })
  }

  function fetchPayments(id: string) {
    return apiClient.get(`/debtpayment/${id}`)
      .then((response) => {
        return response
      })
      .catch((error) => {
        console.error('Error fetching payments:', error)
        throw error
      })
  }

  function fetchDebtPreviousAmounts(id: string) {
    return apiClient.get(`/debtpreviousamount/${id}`)
      .then((response) => {
        return response     
      })
      .catch((error) => {
        console.error('Error fetching previous amounts:', error)
        throw error
      })
  }

  function fetchDebtHistory(id: string) {
    return apiClient.get(`/debthistory/${id}`)
      .then((response) => {
        return response
      })
      .catch((error) => {
        console.error('Error fetching debt history:', error)
        throw error
      })
  }

  function fetchPreviousPercentages(id: string) {
    return apiClient.get(`/debtpreviouspercentage/${id}`)
      .then((response) => {
        return response     
      })
      .catch((error) => {
        console.error('Error fetching previous percentages:', error)
        throw error
      })
  }

  function fetchCharges(id: string) {
    return apiClient.get(`/debtinterestcharge/${id}`)
      .then((response) => {
        return response     
      })
      .catch((error) => {
        console.error('Error fetching charges:', error)
        throw error
      })
  }

  function uploadImage(imageObject: Image) {
    return apiClient.post('/debtimage', imageObject)
      .then((response) => {
        return response
      })
      .catch((error) => {
        console.error('Error uploading image:', error)
        throw error
      })
  }

  function getAllImages() {
    return apiClient.get('/debtimage')
      .then((response) => {
        return response as unknown as Image[]
      })
      .catch((error) => {
        console.error('Error fetching images:', error)
        throw error
      })
  }

  async function getImageByName(imageName: string) {
    try {
      const response = await apiClient.get(`/debtimage/GetByName?name=${imageName}`)
      return response as unknown as Image
    } catch (error) {
      console.error('Error fetching image by name:', error)
      throw error
    }
  }

  async function addPayment(debtId: string, amount: number, date: string) {
    const payment: Payment = {
      id: '',
      debtId: debtId,
      amount: amount,
      date: date
    }
    return apiClient.post('/debtpayment', payment)
      .then((response) => {
        return response
      })
      .catch((error) => {
        console.error('Error adding payment:', error)
        throw error
      })
  }

  async function addInterestCharge(debtId: string, amount: number, date: string, description: string) {
    const interestCharge: InterestCharge = {
      id: '',
      debtId: debtId,
      amount: amount,
      date: date,
      description: description
    }
    return apiClient.post('/debtinterestcharge', interestCharge)
      .then((response) => {
        return response
      })
      .catch((error) => {
        console.error('Error adding interest charge:', error)
        throw error
      })
  }

  function calculateProgressCompletionPercentage(debt: Debt): number {
    if (debt.amount === 0) return 100;
    return Math.min((1 - (debt.remainingAmount / debt.amount)) * 100, 100);
  }

  return {
    debts,
    fetchDebts,
    fetchDebtById,
    addDebt,
    updateDebt,
    deleteDebt,
    fetchPayments,
    fetchDebtPreviousAmounts,
    fetchDebtHistory,
    fetchPreviousPercentages,
    fetchCharges,
    uploadImage,
    getAllImages,
    getImageByName,
    addPayment,
    addInterestCharge,
    calculateProgressCompletionPercentage
  }
})
