import { createApp } from 'vue';
import App from './App.vue';
import './tailwind.css';
import './scss/style.scss';
import '../lib/remUnit';
import pinia from './stores';
import router from './router/ index';

createApp(App).use(pinia).use(router).mount('#app');
