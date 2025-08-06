<script setup>
import VueView from '@assets/icons/vue.svg';
import ViteView from '@assets/icons/vite.svg';
</script>

<template>
  <div class="logo-container">
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
.logo-container {
  width: 100%;
  margin: 0 auto;
  margin-top: 20vh;
  text-align: center;

  .logo {
    display: inline-block;
    margin: 20px;
  }
}
</style>
