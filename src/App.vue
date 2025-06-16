<script setup>
import DashboardLayout from './components/layout/DashboardLayout.vue';
import SidebarNav from './components/layout/SidebarNav.vue';
import Notifications from './components/layout/Notifications.vue';
import { useRequestStore } from './store/useRequestStore';
const requestStore = useRequestStore();

</script>

<template>
    <div class="content-wrapper">
        <div v-if="requestStore.show" :class="['alert', 'alert-' + requestStore.type, 'alert-dismissible', 'fade', 'show']"
            role="alert">
            {{ requestStore.message }}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        <SidebarNav />
        <Notifications />
        <DashboardLayout />
    </div>
</template>
