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
    <div class="container py-4">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
            <div class="flex-fill d-flex justify-content-start">
                <h1 class="my-4">Debt Tracker</h1>
            </div>
            <router-link class="btn btn-primary ms-md-3" to="debt/add" style="height: auto;">
                <FontAwesomeIcon :icon="['fas', 'plus']" class="me-1" /> Add Debt
            </router-link>
        </div>
        <div v-if="debts.length > 0" class="debt-list-container">
            <div class="row g-4">
                <div v-for="debt in debts" :key="debt.id" class="col-12 col-md-6 col-lg-4">
                    <router-link :to="`/debt/${debt.id}`" class="text-decoration-none">
                        <div class="card h-100 shadow-sm border-0 debt-card position-relative">
                            <div class="card-body d-flex flex-column align-items-center">
                                <div class="mb-3 w-100 d-flex justify-content-center">
                                    <img v-if="debt.imageSource" :src="debt.imageSource"
                                        class="rounded-circle shadow-sm" alt="Creditor logo"
                                        style="width: 60px; height: 60px; object-fit: cover;" />
                                    <div v-else
                                        class="rounded-circle bg-secondary d-flex align-items-center justify-content-center"
                                        style="width: 60px; height: 60px;">
                                        <FontAwesomeIcon :icon="['fas', 'building-columns']" class="text-white fs-3" />
                                    </div>
                                </div>
                                <h5 class="card-title text-center mb-2">{{ debt.creditor }}</h5>
                                <div v-if="debt.remainingAmount > 0" class="mb-2">
                                    <span class="badge bg-warning text-dark px-3 py-2 fs-6">
                                        {{ debt.remainingAmount.toLocaleString('en-US', {
                                            style: 'currency', currency:
                                        'USD' }) }}
                                    </span>
                                </div>
                                <div v-else class="mb-2">
                                    <span class="badge bg-success px-3 py-2 fs-6">
                                        Paid In Full
                                        <FontAwesomeIcon :icon="['fas', 'check-circle']" class="ms-1" />
                                    </span>
                                </div>
                                <div class="w-100 mt-auto">
                                    <div class="progress" style="height: 8px;">
                                        <div class="progress-bar" role="progressbar"
                                            :style="{ width: debt.amount > 0 ? ((1 - debt.remainingAmount / debt.amount) * 100).toFixed(0) + '%' : '100%' }"
                                            :aria-valuenow="debt.amount > 0 ? ((1 - debt.remainingAmount / debt.amount) * 100).toFixed(0) : 100"
                                            aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                    <small class="text-muted d-block text-end mt-1">
                                        {{ debt.amount > 0 ? ((1 - debt.remainingAmount / debt.amount) * 100).toFixed(0)
                                        : 100 }}% paid
                                    </small>
                                </div>
                            </div>
                        </div>
                    </router-link>
                </div>
            </div>
        </div>
        <div v-else class="mt-5 text-center text-muted">
            <FontAwesomeIcon :icon="['fas', 'circle-info']" class="fs-1 mb-3" />
            <div>No debts found.</div>
        </div>
    </div>
</template>