<script setup lang="ts">
</script>

<template>
    <nav class="h-screen p-6">
        <div class="text-2xl font-bold mb-10 text-purple-600">ThriveOne</div>
        <ul class="space-y-4">
            <li>
                <RouterLink to="/" class="text-gray-700 hover:text-purple-600 font-medium">🏠 Dashboard</RouterLink>
            </li>
            <li>
                <RouterLink to="/debt" class="text-gray-700 hover:text-purple-600 font-medium">💰 Debt Tracker
                </RouterLink>
            </li>
            <li>
                <RouterLink to="/todo" class="text-gray-700 hover:text-purple-600 font-medium">📝 Todo List</RouterLink>
            </li>
            <li>
                <RouterLink to="/tasks" class="text-gray-700 hover:text-purple-600 font-medium">🧠 Work Tasks
                </RouterLink>
            </li>
        </ul>
    </nav>
</template>