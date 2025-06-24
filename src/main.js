import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css'
import './assets/main.css'
import router from './router';
import { createPinia } from "pinia";
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App);
library.add(fas, far, fab);
app.component('font-awesome-icon', FontAwesomeIcon);
app.use(createPinia());
app.use(router);
app.mount("#app");

const preloader = document.getElementById('preloader');
document.addEventListener('DOMContentLoaded', () => {
    if (preloader) {
        preloader.style.display = 'none';
    }
}, false);