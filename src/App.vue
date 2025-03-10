<script setup lang="ts">
import VueView from '@assets/icons/vue.svg?view';
import ViteView from '@assets/icons/vite.svg?view';
</script>

<template>
  <div>
    <a href="https://vite.dev" target="_blank">
      <ViteView class="logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <VueView class="logo" />
    </a>
  </div>
  <router-view></router-view>
</template>

<style scoped lang="scss">
.logo {
  display: inline-block;
  width: 42px;
  margin: 20px;
}
</style>
