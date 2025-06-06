<script lang="ts" setup>
import { useDebtStore } from '@/features/debt/store/useDebtStore';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const store = useDebtStore();
const route = useRoute();
const debtId = computed(() => {
    return route.params.id as string;
});
const creditor = ref('');
const amount = ref(0);
const minimumPayment = ref(0);
const interestRate = ref(0);
const type = ref('');
const notes = ref('');
const image = ref('');
const showFileInput = ref(false);
const allImages = computed(() => store.images);
const error = ref('');
const success = ref('');
const imageInput = ref(null);
const images = ref([]);

onMounted(async () => {
    try {
        store.images = await store.getAllImages();
        for (const img of store.images) {
            images.value.push({
                id: img.id,
                name: img.name,
                source: img.source,
                uploaded: new Date(img.uploaded).toLocaleDateString()
            });
        }
        await store.fetchDebtById(debtId.value).then(debt => {
            creditor.value = debt.creditor;
            amount.value = debt.amount;
            minimumPayment.value = debt.minimumPayment;
            interestRate.value = debt.interestRate;
            type.value = debt.type;
            notes.value = debt.notes;
            image.value = debt.imageSource || '';
        });
    } catch (err) {
        error.value = 'Failed to load images. Please try again.';
        console.error('Error loading images:', err);
    }
});

const updateDebt = async () => {
    try {
        const selectedImage = allImages.value.find(img => img.source === image.value);
        const newDebt = {
            id: debtId.value,
            creditor: creditor.value,
            amount: amount.value,
            minimumPayment: minimumPayment.value,
            interestRate: interestRate.value,
            type: type.value,
            notes: notes.value,
            image: selectedImage.name,
            remainingAmount: amount.value,
            percentageChange: 0,
            lastPayment: 0,
            imageSource: selectedImage.source,
            imageId: selectedImage.id
        }
        await store.updateDebt(debtId.value, newDebt);
        success.value = 'Debt updated successfully!';
        resetForm();
    } catch (err) {
        error.value = 'Failed to add debt. Please try again.';
        console.error('Error adding debt:', err);
    }
};

const resetForm = () => {
    creditor.value = '';
    amount.value = 0;
    minimumPayment.value = 0;
    interestRate.value = 0;
    type.value = '';
    notes.value = '';
    image.value = '';
    showFileInput.value = false;
};

const toggleFileInput = () => {
    showFileInput.value = !showFileInput.value;
    if (showFileInput.value) {
        image.value = '';
        imageInput.value.value = '';
    } else {
        image.value = '';
        imageInput.value.value = '';
    }
};

const onImageChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
        const file = event.target.files[0];
        image.value = URL.createObjectURL(file);
    } else {
        image.value = event.target.value;
    }
};

const addImage = async () => {
    if (imageInput.value && imageInput.value.files.length > 0) {
        const file = imageInput.value.files[0];
        try {
            const img = {
                name: file.name,
                source: await convertFileToBase64(file),
                uploaded: new Date().toISOString()
            };
            await store.uploadImage(img);
            success.value = 'Image uploaded successfully!';
            resetForm();
            await store.getAllImages();
        } catch {
            error.value = 'Failed to upload image. Please try again.';
        }
    } else {
        error.value = 'Please select an image to upload.';
    }
    if (imageInput.value) imageInput.value.value = '';
    showFileInput.value = false;
    try {
        store.images = await store.getAllImages();
        allImages.value = store.images;
    } catch (err) {
        error.value = 'Failed to load images after upload. Please try again.';
    }
};

const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};
</script>
<template>
    <div class="container">
        <h1 class="my-4">Edit Debt</h1>
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
        <form @submit.prevent="updateDebt" class="add-debt-form">
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
                    <input id="image" ref="imageInput" type="file" class="form-file-input w-100" accept="image/*"
                        required @change="onImageChange" />
                </div>
            </div>
            <div class="mb-3">
                <img v-if="image" :src="image" alt="Selected Image" class="img img-fluid" width="250px" />
            </div>
            <div class="d-flex justify-content-start">
                <button type="submit" class="btn btn-primary me-2">Submit</button>
                <router-link to="/debt" class="btn btn-secondary">Back</router-link>
            </div>
        </form>
    </div>
</template>