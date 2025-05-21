<script setup lang="ts">
</script>

<template>
    <div class="d-flex">
        <nav class="bg-light border-end vh-100 p-3" id="sidebar" style="width: 250px; position: fixed;">
            <div id="sidebarMenu">
                <ul class="nav flex-column">
                    <li class="nav-item mb-2">
                        <RouterLink to="/" class="nav-link text-dark">
                            🏠 Dashboard
                        </RouterLink>
                    </li>
                    <li class="nav-item mb-2">
                        <RouterLink to="/debt" class="nav-link text-dark">
                            💰 Debt Tracker
                        </RouterLink>
                    </li>
                    <li class="nav-item mb-2">
                        <RouterLink to="/todo" class="nav-link text-dark">
                            📝 Todo List
                        </RouterLink>
                    </li>
                    <li class="nav-item mb-2">
                        <RouterLink to="/tasks" class="nav-link text-dark">
                            🧠 Work Tasks
                        </RouterLink>
                    </li>
                </ul>
            </div>
        </nav>
    </div>
</template>
