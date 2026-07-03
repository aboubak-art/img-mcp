<script setup lang="ts">
import { computed } from "vue";
import { useData } from "vitepress";
import DefaultTheme from "vitepress/theme";
import LandingPage from "./LandingPage.vue";

const { frontmatter } = useData();
const isLanding = computed(() => frontmatter.value.layout === "landing");
</script>

<template>
  <LandingPage v-if="isLanding" />
  <DefaultTheme.Layout v-else />
</template>
