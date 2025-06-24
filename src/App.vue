<script setup>
import DashboardLayout from './components/layout/DashboardLayout.vue';
import SidebarNav from './components/layout/SidebarNav.vue';
import Notifications from './components/layout/Notifications.vue';
import { useRequestStore } from './store/useRequestStore';
const requestStore = useRequestStore();

</script>

<template>
    <div class="content-wrapper">
        <div class="toast-container position-fixed mt-2 top-0 start-50 translate-middle-x" style="z-index: 1100">
            <div
            v-if="requestStore.show"
            :class="['toast', 'align-items-center', `bg-${requestStore.type}`, 'border-0', 'show', 'text-light']"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            >
            <div class="d-flex">
                <div class="toast-body">
                {{ requestStore.message }}
                </div>
                <button
                type="button"
                class="btn-close btn-close-white me-2 m-auto"
                data-bs-dismiss="toast"
                aria-label="Close"
                ></button>
            </div>
            </div>
        </div>
        <SidebarNav />
        <Notifications />
        <DashboardLayout />
    </div>
</template>
