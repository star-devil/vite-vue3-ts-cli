import { createApp } from 'vue';
import App from './App.vue';
import './styles/style.scss';
import './styles/tailwind.css';
import pinia from './stores';
import setupRouter from './router/ index';
import './utils/remUnit';
import './utils/globalPolyfills';
import { setupErrorHandler } from './utils/errorHandler';

const app = createApp(App);
setupErrorHandler(app);
app.use(pinia).use(setupRouter()).mount('#app');
