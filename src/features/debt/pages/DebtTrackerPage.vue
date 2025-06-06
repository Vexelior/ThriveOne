<script lang="ts" setup>
import { useDebtStore } from '@/features/debt/store/useDebtStore';

const store = useDebtStore();
</script>
<template>
    <div class="debt-list">
        <h1>Debt List</h1>
        <p>This is the debt list page.</p>
    </div>
</template>