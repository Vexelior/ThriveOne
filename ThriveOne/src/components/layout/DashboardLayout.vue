<script setup lang="ts">
import SidebarNav from './SidebarNav.vue';
</script>

<template>
    <div class="d-flex vh-100 bg-light">
        <SidebarNav />
        <div class="flex-grow-1 d-flex flex-column">
            <!-- Router View Content -->
            <main class="flex-grow-1 p-4 overflow-auto">
                <RouterView />
            </main>
        </div>
    </div>
</template>
