<script setup lang="ts">
import SidebarNav from './SidebarNav.vue';
</script>

<template>
    <div class="flex min-h-screen bg-gray-100">
        <!-- Sidebar -->
        <SidebarNav class="w-64 bg-white shadow-md" />

        <!-- Main Content -->
        <div class="flex-1 flex flex-col">
            <!-- Topbar -->
            <header class="h-16 bg-white shadow px-6 flex items-center justify-between">
                <h1 class="text-xl font-semibold text-gray-800">ThriveOne</h1>
                <div>
                    <!-- Placeholder for profile/settings buttons -->
                </div>
            </header>

            <!-- Router View Content -->
            <main class="flex-1 p-6 overflow-auto">
                <RouterView />
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
  import SidebarNav from './SidebarNav.vue';
  </script>