import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import i18n from "@/plugins/i18n";
import "./registerServiceWorker";
import { StylesManager } from "survey-vue";

Vue.config.productionTip = false;

StylesManager.applyTheme("bootstrap");

new Vue({
  created() {
    const html = document.documentElement;
    var lang = <string>this.$route.query["lang"];
    if (!lang) {
      lang = i18n.availableLocales[0];
    }
    i18n.locale = lang;
    html.setAttribute("lang", this.$i18n.t("htmlCode").toString());
  },
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");
