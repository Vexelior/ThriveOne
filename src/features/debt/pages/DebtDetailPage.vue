<script lang="ts" setup>
import { useDebtStore } from '@/features/debt/store/useDebtStore';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { Modal } from 'bootstrap';

const route = useRoute();
const store = useDebtStore();
const debtId = computed(() => {
    return route.params.id as string;
});

const debt = ref(null);
const payments = ref(null);
const debtPreviousAmounts = ref(null);
const previousPercentages = ref(null);
const charges = ref(null);
const progressCompletionPercentage = ref(0);

onMounted(async () => {
    debt.value = await store.fetchDebtById(debtId.value);
    payments.value = await store.fetchPayments(debtId.value) ?? [];
    debtPreviousAmounts.value = await store.fetchDebtPreviousAmounts(debtId.value) ?? [];
    previousPercentages.value = await store.fetchPreviousPercentages(debtId.value) ?? [];
    charges.value = await store.fetchCharges(debtId.value) ?? [];

    if (debt.value) {
        progressCompletionPercentage.value = store.calculateProgressCompletionPercentage(debt.value);
        if (progressCompletionPercentage.value >= 100) {
            const paymentCompleteModal = new Modal(document.getElementById('paymentCompleteModal') as HTMLElement);
            paymentCompleteModal.show();
        }

    }

    if (debt.value && debt.value.percentageChange !== null && debt.value.percentageChange !== undefined) {
        if (isNaN(debt.value.percentageChange)) {
            debt.value.percentageChange = 0;
        } else {
            if (debt.value.percentageChange % 1 === 0) {
                debt.value.percentageChange = debt.value.percentageChange;
            } else {
                debt.value.percentageChange = parseFloat(debt.value.percentageChange.toFixed(2));
            }
        }
    } else {
        debt.value.percentageChange = 0;
    }
});

const formattedDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
};

const formattedAmount = (amount: number) => {
    return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

const formattedPercentage = (percentage: number) => {
    return percentage.toFixed(2) + '%';
};
</script>

<template>
    <div class="container debt-detail main-content py-4">
        <router-link to="/debt" class="btn btn-secondary mt-3" title="Go Back">
            <font-awesome-icon :icon="['fas', 'arrow-left']" />
        </router-link>
        <div class="overflow-auto debt-tabs" style="white-space: nowrap;">
            <ul class="nav nav-tabs mt-3" id="debtTabs" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="details-tab" data-bs-toggle="tab" data-bs-target="#details"
                        type="button" role="tab" aria-controls="details" aria-selected="true">Details</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="payments-tab" data-bs-toggle="tab" data-bs-target="#payments"
                        type="button" role="tab" aria-controls="payments" aria-selected="true">Payments</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="charges-tab" data-bs-toggle="tab" data-bs-target="#charges"
                        type="button" role="tab" aria-controls="charges" aria-selected="true">Charges</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="previous-amounts-tab" data-bs-toggle="tab"
                        data-bs-target="#previous-amounts" type="button" role="tab" aria-controls="previous-amounts"
                        aria-selected="false">Previous Amounts</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="previous-percentages-tab" data-bs-toggle="tab"
                        data-bs-target="#previous-percentages" type="button" role="tab"
                        aria-controls="previous-percentages" aria-selected="false">Previous Percentages</button>
                </li>
            </ul>
        </div>
        <div class="tab-content debt-list-container" id="debtTabsContent">
            <div class="tab-pane fade show active" id="details" role="tabpanel" aria-labelledby="details-tab">
                <div class="row">
                    <div class="col">
                        <div v-if="debt" class="card">
                            <h1 class="card-header">Details</h1>
                            <div class="d-flex d-inline">
                                <div class="dropdown pe-4 ps-2 pt-3">
                                    <button class="btn btn-secondary dropdown-toggle" type="button"
                                        id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                                        Options
                                    </button>
                                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        <li>
                                            <router-link :to="`/debt/edit/${debt.id}`"
                                                class="dropdown-item">Edit</router-link>
                                        </li>
                                        <li>
                                            <router-link :to="`/debt/payment/add/${debt.id}`" class="dropdown-item">Add
                                                Payment</router-link>
                                        </li>
                                        <li>
                                            <router-link :to="`/debt/interest-charge/add/${debt.id}`"
                                                class="dropdown-item">Add
                                                Interest Charge</router-link>
                                        </li>
                                    </ul>
                                </div>
                                <p class="text-muted mt-3">Progress:</p>
                                <div class="progress w-100 mt-4 me-2" role="progressbar" aria-label="Progress bar"
                                    aria-valuenow="progressCompletionPercentage" aria-valuemin="0" aria-valuemax="100">
                                    <div class="progress-bar" :class="{
                                        'bg-success': progressCompletionPercentage >= 100,
                                        'bg-danger': progressCompletionPercentage < 35,
                                        'bg-warning': progressCompletionPercentage >= 35 && progressCompletionPercentage < 100,
                                    }" :style="{ width: progressCompletionPercentage + '%' }"
                                        :aria-valuenow="progressCompletionPercentage">
                                        {{ progressCompletionPercentage.toFixed(2) }}%
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="card-body">
                                        <div class="debt-detail d-flex align-items-center">
                                            <h5 class="card-title me-2">{{ debt.creditor }}</h5>
                                            <span
                                                v-if="isNaN(debt.percentageChange) || debt.percentageChange === null || debt.percentageChange === undefined"
                                                class="badge bg-secondary">N/A</span>
                                            <span v-else-if="debt.percentageChange === 0" class="badge bg-secondary">{{
                                                debt.percentageChange.toFixed(2) }}%</span>
                                            <span v-else-if="debt.percentageChange > 0" class="badge bg-danger">+{{
                                                debt.percentageChange.toFixed(2) }}%</span>
                                            <span v-else-if="debt.percentageChange < 0" class="badge bg-success">{{
                                                debt.percentageChange.toFixed(2) }}%</span>
                                        </div>
                                        <table class="table table-hover mt-3 debt-details-table">
                                            <tbody>
                                                <tr>
                                                    <th>Original Balance:</th>
                                                    <td>{{ debt.amount.toLocaleString('en-US', {
                                                        style: 'currency',
                                                        currency: 'USD'
                                                    }) }}</td>
                                                </tr>
                                                <tr>
                                                    <th>Remaining Balance:</th>
                                                    <td>{{ debt.remainingAmount.toLocaleString('en-US', {
                                                        style:
                                                            'currency', currency: 'USD'
                                                    })
                                                    }}</td>
                                                </tr>
                                                <tr>
                                                    <th>Interest:</th>
                                                    <td>{{ debt.interestRate }}%</td>
                                                </tr>
                                                <tr>
                                                    <th>Minimum Payment:</th>
                                                    <td>{{ debt.minimumPayment.toLocaleString('en-US', {
                                                        style:
                                                            'currency', currency: 'USD'
                                                    }) }}</td>
                                                </tr>
                                                <tr>
                                                    <th>Last Payment:</th>
                                                    <td>{{ debt.lastPayment.toLocaleString('en-US', {
                                                        style:
                                                            'currency', currency: 'USD'
                                                    }) }}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>Last Payment Date:</th>
                                                    <td>{{ formattedDate(debt.lastPaymentDate) }}</td>
                                                </tr>
                                                <tr>
                                                    <th>Type:</th>
                                                    <td>{{ debt.type }}</td>
                                                </tr>
                                                <tr>
                                                    <th>Notes:</th>
                                                    <td>{{ debt.notes ? debt.notes : 'No current note.' }}</td>
                                                </tr>
                                                <tr>
                                                    <th>Date Added:</th>
                                                    <td>{{ formattedDate(debt.dateAdded) }}</td>
                                                </tr>
                                                <tr>
                                                    <th>Last Edit:</th>
                                                    <td>{{ formattedDate(debt.dateEdited) }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="card-body">
                                        <img v-if="debt.image" :src="debt.imageSource" alt="Debt Image"
                                            class="img img-fluid w-100 h-100">
                                        <div v-else class="text-center">
                                            <p>No image available.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tab-pane fade" id="previous-amounts" role="tabpanel" aria-labelledby="previous-amounts-tab">
                <div class="row">
                    <div class="col">
                        <div v-if="debtPreviousAmounts" class="card">
                            <h1 class="card-header">Previous Amounts</h1>
                            <div class="card-body">
                                <div v-if="debtPreviousAmounts && debtPreviousAmounts.length === 0">
                                    <span class="list-group-item">No previous amounts available.</span>
                                </div>
                                <div v-else class="scrollable-list">
                                    <ul class="list-group">
                                        <li v-for="amount in debtPreviousAmounts" :key="amount.id"
                                            class="list-group-item">
                                            <div class="d-flex justify-content-between">
                                                <span>{{ formattedAmount(amount.amount) }}</span>
                                                <span>{{ formattedDate(amount.dateAdded) }}</span>
                                                <span v-if="amount.percentageChange > 0" class="badge text-bg-danger">
                                                    {{ formattedPercentage(amount.percentageChange) }}
                                                </span>
                                                <span v-else-if="amount.percentageChange === 0"
                                                    class="badge text-bg-secondary">
                                                    {{ formattedPercentage(amount.percentageChange) }}
                                                </span>
                                                <span v-else class="badge text-bg-success">
                                                    {{ formattedPercentage(amount.percentageChange) }}
                                                </span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tab-pane fade" id="payments" role="tabpanel" aria-labelledby="payments-tab">
                <div class="row">
                    <div class="col">
                        <div class="card">
                            <h1 class="card-header">Payments</h1>
                            <div class="card-body">
                                <div v-if="payments && payments.length === 0">
                                    <span class="list-group-item">No payments available.</span>
                                </div>
                                <div v-else-if="payments && payments.length > 0">
                                    <ul class="list-group scrollable-list">
                                        <li v-for="payment in payments" :key="payment.id || payment._id"
                                            class="list-group-item">
                                            <div class="d-flex justify-content-between">
                                                <span>{{ formattedDate(payment.date) }}</span>
                                                <span>{{ formattedAmount(payment.amount) }}</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div v-else>
                                    <span>Loading payments...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tab-pane fade" id="previous-percentages" role="tabpanel"
                aria-labelledby="previous-percentages-tab">
                <div class="row">
                    <div class="col">
                        <div class="card">
                            <h1 class="card-header">Previous Percentages</h1>
                            <div class="card-body">
                                <div v-if="previousPercentages && previousPercentages.length === 0">
                                    <span>
                                        No previous percentages available.
                                    </span>
                                </div>
                                <div v-else-if="previousPercentages && previousPercentages.length > 0">
                                    <ul class="list-group scrollable-list">
                                        <li v-for="percentage in previousPercentages" :key="percentage.id"
                                            class="list-group-item">
                                            <div class="d-flex justify-content-between">
                                                <span>{{ formattedDate(percentage.date) }}</span>
                                                <span v-if="percentage.percent > 0" class="badge text-bg-danger">
                                                    {{ formattedPercentage(percentage.percent) }}
                                                </span>
                                                <span v-else-if="percentage.percent === 0"
                                                    class="badge text-bg-secondary">
                                                    {{ formattedPercentage(percentage.percent) }}
                                                </span>
                                                <span v-else class="badge text-bg-success">
                                                    {{ formattedPercentage(percentage.percent) }}
                                                </span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tab-pane fade" id="charges" role="tabpanel" aria-labelledby="charges-tab">
                <div class="row">
                    <div class="col">
                        <div class="card">
                            <h1 class="card-header">Charges</h1>
                            <div class="card-body">
                                <div v-if="charges && charges.length === 0">
                                    <span class="list-group-item">No charges available.</span>
                                </div>
                                <ul class="list-group scrollable-list">
                                    <li v-for="charge in charges" :key="charge.id" class="list-group-item">
                                        <div class="d-flex justify-content-between">
                                            <span>{{ formattedDate(charge.date) }}</span>
                                            <span>{{ charge.description }}</span>
                                            <span>{{ formattedAmount(charge.amount) }}</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="paymentCompleteModal" tabindex="-1" aria-labelledby="paymentCompleteModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header" style="border-bottom: none !important">
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body text-center">
                    <h1>Congratulations!</h1>
                    <p>This debt has been paid off!</p>
                    <h1>&#127881;</h1>
                </div>
            </div>
        </div>
    </div>
</template>