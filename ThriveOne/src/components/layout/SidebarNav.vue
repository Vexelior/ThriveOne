<script setup lang="ts">
</script>

<template>
    <div class="container-fluid">
        <div class="col-auto col-md-3 col-xl-2 px-sm-2 px-0 sidebar">
            <div class="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 h-100 w-100">
                <h1 class="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-decoration-none">
                    <span class="fs-5 d-none d-sm-inline">ThriveOne</span>
                </h1>
                <ul
                    class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start sidebar-menu">
                    <a href="/">
                        <li class="nav-item">
                            <font-awesome-icon :icon="['fas', 'gauge']" /><span>Dashboard</span>
                        </li>
                    </a>
                    <a href="/todo">
                        <li class="nav-item">
                            <font-awesome-icon :icon="['fas', 'clipboard-list']" /><span>Todo</span>
                        </li>
                    </a>
                </ul>
            </div>
        </div>
    </div>
</template>
