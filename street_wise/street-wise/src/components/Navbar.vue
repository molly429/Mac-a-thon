<template>
    <header class="nav">
        <div class="nav-inner">
            <div class="brand">
                <div class="logo">SW</div>
                <div class="brandText">
                    <div class="brandName">Street Wise</div>
                    <div class="brandTag">Calm Route Scorer</div>
                </div>
            </div>

            <div class="navLinks">
                <a class="navLink" href="#about">About</a>
                <a class="navLink" href="#how">How to use</a>
                <RouterLink class="navBtn" to="/application">Try Demo</RouterLink>
            </div>
        </div>
    </header>
</template>

<script setup>
import { RouterLink } from 'vue-router'

defineOptions({
    name: "Navbar"
});
</script>