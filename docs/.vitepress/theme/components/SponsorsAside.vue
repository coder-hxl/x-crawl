<script setup lang="ts">
import SponsorsGroup from './SponsorsGroup.vue'
import { useData } from 'vitepress'
const { frontmatter } = useData()
</script>

<template>
  <div v-if="frontmatter.sponsors !== false">
    <a class="sponsors-aside-text" href="/sponsor/">赞助位</a>
    <SponsorsGroup />
  </div>
</template>

<style scoped>
a.sponsors-aside-text {
  color: rgba(60, 60, 60, 0.5);
  display: block;
  margin: 3em 0 1em;
  font-weight: 700;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}
</style>
