import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import { StylesManager } from "survey-vue";

Vue.config.productionTip = false;

StylesManager.applyTheme("bootstrap");

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
