<script setup lang="ts">
import sponsorData from './sponsors.json'
</script>

<template>
  <div class="sponsor-container">
    <a
      v-for="{ url, img, name, description } in sponsorData"
      class="sponsor-item"
      :href="url"
      target="_blank"
      rel="sponsored noopener"
    >
      <div class="sponsor-item-img">
        <img :src="img" :alt="name" />
      </div>
      <div class="sponsor-item-description">🎁{{ description }}</div>
    </a>

    <a href="/sponsor/" class="sponsor-item-action">成为赞助商</a>
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

/* dark mode */
.dark .aside .sponsor-item {
  background-color: var(--vt-c-bg-soft);
}
.aside .sponsor-item img {
  transition: filter 0.2s ease;
}
.dark .aside .sponsor-item img {
  filter: grayscale(1) invert(1);
}
.dark .aside .sponsor-item:hover {
  color: var(--vt-c-indigo);
  background-color: var(--vt-c-white-mute);
}
.dark .sponsor-item:hover img {
  filter: none;
}
</style>
