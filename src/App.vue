<!-- @format -->

<!--
 * @Author: wangqiaoling
 * @Date: 2024-11-05 11:23:42
 * @LastEditTime: 2024-11-08 17:12:19
 * @LastEditors: wangqiaoling
 * @Description: 
-->
<!-- @format -->

<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue';
let count = 0;
</script>

<template>
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
