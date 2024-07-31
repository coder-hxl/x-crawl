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
.sponsor-container {
  --max-width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--max-width), 1fr));
  column-gap: 4px;
}

.sponsor-item {
  margin: 2px 0;
  padding: 10px 6px;
  display: block;
  border-radius: 2px;
  color: rgba(60, 60, 60, 0.5);
  background-color: #f6f6f6;
}

.sponsor-item-img {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.sponsor-item img {
  max-width: calc(var(--max-width) - 30px);
  max-height: calc(var(--max-width) / 2 - 20px);
}
.sponsor-item-description {
  text-align: center;
  font-size: 13px;
  color: rgb(74, 74, 74);
}

.sponsor-item-action {
  margin: 2px 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-radius: 2px;
  height: 30px;
  font-size: 11px;
  color: rgba(60, 60, 60, 0.5);
  background-color: #f6f6f6;
}
</style>
