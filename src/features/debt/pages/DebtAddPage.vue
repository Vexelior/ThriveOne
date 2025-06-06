<script lang="ts" setup>
import { useDebtStore } from '@/stores/debt';
import { computed, onMounted } from 'vue';
</script>
<template>
    <div class="container">
        <h1 class="my-4">New Debt</h1>
        <!--ERROR MESSAGES-->
        <div class="alert alert-warning alert-dismissible" role="alert" v-if="error">
            <font-awesome-icon :icon="['fas', 'exclamation-triangle']" class="me-2" />
            {{ error }}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        <div class="alert alert-success alert-dismissible" role="alert" v-if="success">
            <font-awesome-icon :icon="['fas', 'check-circle']" class="me-2" />
            {{ success }}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        <form @submit.prevent="addDebt">
            <div class="mb-3">
                <label for="creditor" class="form-label">Creditor</label>
                <input id="creditor" v-model="creditor" type="text" class="form-control" placeholder="Creditor"
                    required />
            </div>
            <div class="mb-3">
                <label for="amount" class="form-label">Amount</label>
                <input id="amount" v-model.number="amount" type="number" class="form-control" placeholder="Amount"
                    step=".01" required />
            </div>
            <div class="mb-3">
                <label for="amount" class="form-label">Minimum Payment</label>
                <input id="amount" v-model.number="minimumPayment" type="number" class="form-control"
                    placeholder="Minimum Payment" step=".01" required />
            </div>
            <div class="mb-3">
                <label for="interest" class="form-label">Interest</label>
                <input id="interest" v-model.number="interestRate" type="number" class="form-control"
                    placeholder="Interest" step=".01" required />
            </div>
            <div class="mb-3">
                <label for="type" class="form-label">Debt Type</label>
                <select id="type" v-model="type" class="form-select" required>
                    <option value="" disabled>-- Select Type --</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Loan">Loan</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="notes" class="form-label">Notes</label>
                <textarea id="notes" v-model="notes" class="form-control" placeholder="Notes"></textarea>
            </div>
            <p class="text-muted">Select an image from the dropdown menu or upload a new image by clicking the button
                below.</p>
            <div class="mb-3 d-flex justify-content-start">
                <button type="button" class="btn btn-secondary btn-sm" @click="toggleFileInput">
                    {{ showFileInput ? 'Hide' : 'Show' }} File Upload
                </button>
            </div>
            <div v-if="showFileInput == false" class="mb-3">
                <label for="type" class="form-label">Image</label>
                <select class="form-select" v-model="image" id="image" required @change="onImageChange">
                    <option value="" disabled selected>-- Select Type --</option>
                    <option v-for="image in allImages" :key="image.id" :value="image.source">{{ image.name }}</option>
                </select>
            </div>
            <div v-if="showFileInput" class="d-flex justify-content-start mb-3">
                <button type="button" class="btn btn-primary btn-sm me-2" @click="addImage">Upload</button>
                <div class="form-file w-50">
                    <input id="image" ref="image" type="file" class="form-file-input w-100" accept="image/*" required />
                </div>
            </div>
            <div class="mb-3">
                <img v-if="image" :src="image" alt="Selected Image" class="img img-fluid" width="250px" />
            </div>
            <div class="d-flex justify-content-start">
                <button type="submit" class="btn btn-primary me-2">Submit</button>
                <router-link to="/" class="btn btn-secondary">Back</router-link>
            </div>
        </form>
    </div>
</template>