import { createApp } from 'vue';
import App from './App.vue';
import './styles/style.scss';
import './styles/tailwind.css';
import pinia from './stores';
import router from './router/ index';
import './utils/remUnit';
import './utils/globalPolyfills';

createApp(App).use(pinia).use(router).mount('#app');
