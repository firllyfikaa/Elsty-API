import { createApp } from 'vue';
import App from './App.vue';
import './assets/style.css';
import router from './router'; // Import router
import 'aos/dist/aos.css';
import AOS from 'aos';

AOS.init({
  duration: 800,
  offset: 100,
  once: false,
  easing: 'ease-in-out',
});

createApp(App).use(router).mount('#app');
