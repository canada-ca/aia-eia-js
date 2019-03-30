import Vue from "vue";
import VueI18n from "vue-i18n";

Vue.use(VueI18n);

export default new VueI18n({
  locale: "en", // set locale
  fallbackLocale: "en", // set fallback locale
  messages: {
    'en': { swtchLang: "Français", htmlCode: "en-CA" },
    'fr': { swtchLang: "English", htmlCode: "fr-CA" }
  }
});
