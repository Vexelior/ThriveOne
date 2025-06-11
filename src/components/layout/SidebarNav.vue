<script setup lang="ts">
import { ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const sidebarOpen = ref(false);

function openSidebar() {
    sidebarOpen.value = true;
}
function closeSidebar() {
    sidebarOpen.value = false;
}
</script>

<template>
    <!-- Mobile Hamburger Button -->
    <button class="btn btn-primary d-md-none m-2 sidebar-toggle-button" type="button" @click="openSidebar" aria-label="Open sidebar">
        <font-awesome-icon :icon="['fas', 'bars']" />
    </button>

    <!-- Desktop Sidebar -->
    <div class="container-fluid">
        <div class="col-auto col-md-3 col-xl-2 px-sm-2 px-0 sidebar d-none d-md-block">
            <div class="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 h-100 w-100">
                <h1 class="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-decoration-none">
                    <img class="img img-fluid me-2" src="../../assets/images/favicon-32x32.png" alt="ThriveOne Logo" />
                    <span class="fs-5 d-none d-sm-inline">ThriveOne</span>
                </h1>
                <ul
                    class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start sidebar-menu">
                    <a href="/">
                        <li class="nav-item">
                            <font-awesome-icon :icon="['fas', 'gauge']" /><span>Dashboard</span>
                        </li>
                    </a>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle d-flex align-items-center p-0" href="#" id="debtDropdown"
                            role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <font-awesome-icon :icon="['fas', 'credit-card']" /><span>Debt</span>
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="debtDropdown">
                            <li>
                                <a class="dropdown-item" href="/debt">Overview</a>
                            </li>
                            <li>
                                <a class="dropdown-item" href="/debt/summary">Summary</a>
                            </li>
                        </ul>
                    </li>
                    <a href="/todo">
                        <li class="nav-item">
                            <font-awesome-icon :icon="['fas', 'clipboard-list']" /><span>Todo</span>
                        </li>
                    </a>
                    <a href="/worktasks">
                        <li class="nav-item">
                            <font-awesome-icon :icon="['fas', 'briefcase']" /><span>Work Tasks</span>
                        </li>
                    </a>
                </ul>
            </div>
        </div>
    </div>

    <!-- Mobile Offcanvas Sidebar -->
    <div class="offcanvas offcanvas-start sidebar d-md-none" tabindex="-1" :class="{ show: sidebarOpen }"
        :style="{ visibility: sidebarOpen ? 'visible' : 'hidden' }" @click.self="closeSidebar">
        <div class="offcanvas-header d-flex justify-content-end">
            <button type="button" class="btn sidebar-close-btn" @click="closeSidebar">
                <font-awesome-icon :icon="['fas', 'times']" aria-label="Close sidebar" class="text-light fs-2" />
            </button>
        </div>
        <div class="offcanvas-body">
            <ul class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start sidebar-menu">
                <a href="/">
                    <li class="nav-item">
                        <font-awesome-icon :icon="['fas', 'gauge']" /><span>Dashboard</span>
                    </li>
                </a>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle d-flex align-items-center p-0" href="#" id="debtDropdownMobile"
                        role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <font-awesome-icon :icon="['fas', 'credit-card']" /><span>Debt</span>
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="debtDropdownMobile">
                        <li>
                            <a class="dropdown-item" href="/debt">Overview</a>
                        </li>
                        <li>
                            <a class="dropdown-item" href="/debt/summary">Summary</a>
                        </li>
                    </ul>
                </li>
                <a href="/todo">
                    <li class="nav-item">
                        <font-awesome-icon :icon="['fas', 'clipboard-list']" /><span>Todo</span>
                    </li>
                </a>
                <a href="/worktasks">
                    <li class="nav-item">
                        <font-awesome-icon :icon="['fas', 'briefcase']" /><span>Work Tasks</span>
                    </li>
                </a>
            </ul>
        </div>
    </div>
</template>
