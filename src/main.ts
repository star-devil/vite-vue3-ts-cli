import { createApp } from 'vue';
import App from './App.vue';
import './styles/style.scss';
import './styles/tailwind.css';
import '../lib/remUnit';
import pinia from './stores';
import router from './router/ index';

createApp(App).use(pinia).use(router).mount('#app');
