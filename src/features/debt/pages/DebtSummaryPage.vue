<script lang="ts" setup>
import { useDebtStore } from '@/features/debt/store/useDebtStore';
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'vue-chartjs';
Chart.register(ArcElement, Tooltip, Legend);
const store = useDebtStore();
const router = useRouter();
const debts = computed(() => store.debts);
const progressCompletionPercentage = computed(() => {
    const { totalDebt, totalOriginal } = debts.value.reduce(
        (totals, debt) => {
            totals.totalDebt += debt.remainingAmount;
            totals.totalOriginal += debt.amount;
            return totals;
        },
        { totalDebt: 0, totalOriginal: 0 }
    );
    return totalOriginal > 0 ? ((totalOriginal - totalDebt) / totalOriginal) * 100 : 0;
});
const pieChartData = computed(() => ({
    labels: debts.value.map(debt => debt.creditor),
    datasets: [
        {
            label: 'Debt Distribution',
            data: debts.value.map(debt => debt.remainingAmount),
            backgroundColor: debts.value.map(() => `hsl(${Math.random() * 360}, 70%, 70%)`),
            borderColor: '#fff',
            borderWidth: 1
        }
    ]
}));
const pieChartOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'bottom'
        }
    }
};
onMounted(async () => {
    await store.fetchDebts();
    const { totalDebt, totalOriginal } = debts.value.reduce(
        (totals, debt) => {
            totals.totalDebt += debt.remainingAmount;
            totals.totalOriginal += debt.amount;
            return totals;
        },
        { totalDebt: 0, totalOriginal: 0 }
    );
    progressCompletionPercentage.value = totalOriginal > 0 ? ((totalOriginal - totalDebt) / totalOriginal) * 100 : 0;
});
</script>
<template>
    <div class="container main-content py-4">
        <h1 class="mb-4">Summary</h1>
        <div class="row bg-light data-card" style="border-radius: 10px;">
            <div class="col-md-12 py-3">
                <h2 class="text-center">Overall Progress</h2>
                <p class="text-center">You have {{debts.reduce((total, debt) => total + debt.remainingAmount,
                    0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}} left. Keep going!</p>
                <div class="progress" role="progressbar" aria-label="Default striped example"
                    :aria-valuenow="progressCompletionPercentage.toFixed(0)" aria-valuemin="0" aria-valuemax="100">
                    <div class="progress-bar" :style="{ width: progressCompletionPercentage + '%' }">
                        {{ progressCompletionPercentage.toFixed(0) }}%
                    </div>
                </div>
            </div>
        </div>
        <div class="row bg-light data-card">
            <div class="col-md-6">
                <div class="card data-card mb-2">
                    <Pie :data="pieChartData" :options="pieChartOptions" />
                </div>
            </div>
            <div class="col-md-6 mb-5">
                <div class="card data-card">
                    <h3 class="text-center mt-4">Debts</h3>
                    <div class="card-body">
                        <ul class="list-group">
                            <li v-for="debt in debts" :key="debt.id"
                                class="list-group-item d-flex justify-content-between align-items-center">
                                <span>{{ debt.creditor }}</span>
                                <span>{{ debt.remainingAmount.toLocaleString('en-US', {
                                    style: 'currency', currency:
                                        'USD'
                                })
                                }}</span>
                            </li>
                        </ul>
                        <p class="mt-3">
                            <strong>Total Debt:</strong> {{debts.reduce((total, debt) => total + debt.amount,
                                0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}}
                        </p>
                        <p>
                            <strong>Total Paid:</strong> {{(debts.reduce((total, debt) => total + debt.amount, 0) -
                                debts.reduce((total, debt) => total + debt.remainingAmount, 0)).toLocaleString('en-US',
                                    {
                                        style:
                                            'currency', currency: 'USD'
                                    })}}
                        </p>
                        <blockquote class="blockquote">
                            <p class="mb-0 mt-2 justify-text">
                                "The journey of a thousand miles begins with one step."
                            </p>
                            <cite title="Confucius">
                                <p class="text-center"><em>- Confucius</em></p>
                            </cite>
                        </blockquote>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>