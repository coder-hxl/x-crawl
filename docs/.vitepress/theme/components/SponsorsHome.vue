<script setup lang="ts">
import { useData } from 'vitepress'

import sponsorData from './sponsors.json'

const { frontmatter } = useData()
</script>

<template>
  <div v-if="frontmatter.sponsors !== false" class="sponsors-home">
    <div class="title">Sponsors</div>

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
  </div>
</template>

<style scoped>
.sponsors-home {
  margin: 0 auto;
  max-width: 1152px;
}

.title {
  margin: 50px 0 10px;
  font-size: 19px;
  font-weight: 600;
}

.sponsor-item {
  padding: 12px 6px;
  display: block;
  border-radius: 2px;
  background-color: #f6f6f6;
}

.sponsor-item-img {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.sponsor-item-img img {
  width: 399px;
}

.sponsor-item-description {
  text-align: center;
  font-size: 14px;
  color: rgb(74, 74, 74);
}
</style>
