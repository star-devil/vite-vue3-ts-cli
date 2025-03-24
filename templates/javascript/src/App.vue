<script setup lang="ts">
import VueView from '@assets/icons/vue.svg';
import ViteView from '@assets/icons/vite.svg';
</script>

<template>
  <div>
    <a href="https://vite.dev" target="_blank">
      <ViteView width="40" height="40" class="logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <VueView width="40" height="40" class="logo" />
    </a>
  </div>
  <router-view></router-view>
</template>

<style scoped lang="scss">
.logo {
  display: inline-block;
  margin: 20px;
}
</style>
