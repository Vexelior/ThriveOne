<script lang="ts" setup>
import { computed, onMounted } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useDebtStore } from '@/features/debt/store/useDebtStore';

const store = useDebtStore();

const debts = computed(() => store.debts);
onMounted(() => {
    store.fetchDebts();
});

</script>
<template>
    <div class="container">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
            <div class="flex-fill d-flex justify-content-center">
                <h1 class="display-4 text-center mt-3 mb-3 mb-md-0">Debt</h1>
            </div>
            <router-link class="btn btn-primary ms-md-3" to="debt/add" style="height: auto;">
                Add
            </router-link>
        </div>
        <div v-if="debts.length > 0" class="debt-list-container scrollable">
            <div class="row">
                <div v-for="debt in store.debts" :key="debt.id" class="col-md-4 mb-4">
                    <router-link :to="`/debt/${debt.id}`">
                        <div class="card h-100">
                            <div class="card-body">
                                <h5 class="card-title">{{ debt.creditor }}</h5>
                                <div v-if="debt.imageSource != null">
                                    <img :src="debt.imageSource" class="card-img-top" alt="Creditor logo" />
                                </div>
                                <div v-if="debt.remainingAmount > 0">
                                    <p class="card-text mt-2">
                                        <strong>Balance:</strong> {{
                                            debt.remainingAmount.toLocaleString('en-US', {
                                                style: 'currency',
                                                currency: 'USD'
                                            }) }}<br>
                                    </p>
                                </div>
                                <div v-else class="d-flex justify-content-between align-items-center">
                                    <p class="card-text mt-2 mb-0">
                                        Paid In Full
                                    </p>
                                    <span class="text-success">
                                        <font-awesome-icon :icon="['fas', 'check-circle']" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </router-link>
                </div>
            </div>
        </div>
        <div v-else-if="debts.length === 0">
            <div class="mt-5">
                No debts found.
            </div>
        </div>
    </div>
</template>