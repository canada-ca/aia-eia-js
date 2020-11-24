import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import i18n from "@/plugins/i18n";
import "./registerServiceWorker";
import { StylesManager } from "survey-vue";
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.config.productionTip = false;
Vue.use(BootstrapVue);

StylesManager.applyTheme("bootstrapmaterial");

new Vue({
  created() {
    const html = document.documentElement;
    let lang = <string>this.$route.query["lang"];
    if (!lang) {
      lang = i18n.availableLocales[0];
    }
    i18n.locale = lang;
    html.setAttribute("lang", this.$i18n.t("htmlCode").toString());
  },
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
