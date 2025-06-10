<script lang="ts" setup>
import { useDebtStore } from '@/features/debt/store/useDebtStore';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import type { Payment } from '../types/payment'

const store = useDebtStore();
const route = useRoute();
const router = useRouter();
const debtId = computed(() => {
    return route.params.id as string;
});
const amount = ref(0);
const date = ref('');
const error = ref('');
const success = ref('');

const addPayment = async () => {
    try {
        await store.addPayment(debtId.value, parseFloat(amount.value.toString()), date.value);
        router.push(`/debt/${debtId.value}`);
    } catch (err) {
        error.value = 'Failed to add payment. Please try again.';
        console.error('Error adding payment:', err);
    }
};
</script>

<template>
    <div class="container">
        <h1 class="my-4">Submit Payment</h1>
        <div v-if="error" class="alert alert-danger" role="alert">{{ error }}</div>
        <form @submit.prevent="addPayment" class="debt-form">
            <div class="mb-3">
                <label for="amount" class="form-label">Amount</label>
                <input type="number" class="form-control" id="amount" step=".01" v-model="amount" required
                    placeholder="Enter amount" />
            </div>
            <div class="mb-3">
                <label for="date" class="form-label">Date</label>
                <input type="date" class="form-control" id="date" v-model="date" required />
            </div>
            <button type="submit" class="btn btn-primary" id="submit">Submit</button>
            <router-link :to="'/debt/' + debtId" class="btn btn-secondary ms-2">Cancel</router-link>
        </form>
    </div>
</template>