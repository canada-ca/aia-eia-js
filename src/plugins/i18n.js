import Vue from "vue";
import VueI18n from "vue-i18n";
import en from "./en.json";
import fr from "./fr.json";
Vue.use(VueI18n);
export default new VueI18n({
    locale: "en",
    fallbackLocale: "en",
    messages: {
        en: en,
        fr: fr
    }
});
//# sourceMappingURL=i18n.js.map