import { createApp } from 'vue';
import App from './App.vue';
import './tailwind.css';
import './scss/style.scss';
import '../lib/remUnit';
import pinia from './stores';

createApp(App).use(pinia).mount('#app');
