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
const description = ref('');
const error = ref('');

const addInterestCharge = async () => {
    try {
        await store.addInterestCharge(debtId.value, parseFloat(amount.value.toString()), date.value, description.value);
        router.push(`/debt/${debtId.value}`);
    } catch (err) {
        error.value = 'Failed to add interest charge. Please try again.';
        console.error('Error adding interest charge:', err);
    }
};
</script>

<template>
    <div class="container main-content py-4">
        <router-link :to="`/debt/${debtId}`" class="btn btn-secondary mb-3">
            <font-awesome-icon :icon="['fas', 'arrow-left']" />
        </router-link>
        <h1 class="my-4">Submit Charge</h1>
        <div v-if="error" class="alert alert-danger" role="alert">{{ error }}</div>
        <form @submit.prevent="addInterestCharge" class="debt-form">
            <div class="mb-3">
                <label for="amount" class="form-label">Amount</label>
                <input type="number" class="form-control" id="amount" step=".01" v-model="amount" required
                    placeholder="Enter amount" />
            </div>
            <div class="mb-3">
                <label for="date" class="form-label">Date</label>
                <input type="date" class="form-control" id="date" v-model="date" required />
            </div>
            <div class="mb-3">
                <label for="debtId" class="form-label">Description</label>
                <select class="form-select" id="description" v-model="description" required>
                    <option value="" disabled>Select description</option>
                    <option value="Interest Charge">Interest Charge</option>
                    <option value="Late Fee">Late Fee</option>
                    <option value="Adjustment">Adjustment</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <button type="submit" class="btn btn-primary" id="submit">Submit</button>
        </form>
    </div>
</template>