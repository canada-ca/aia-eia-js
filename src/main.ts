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

function reloadTemplate() {
  // babel will handle transpilation to ES5
  const language = document
    .getElementsByTagName("html")[0]
    .getAttribute("lang");
  let switchLanguage = "fr";
  if (language === "fr") {
    switchLanguage = "en";
  }

  const defTop = document.getElementById("def-top");

  /* global wet */
  if (defTop) {
    // @ts-ignore
    defTop.innerHTML = wet.builder.appTop({
      appName: [
        {
          href: "#",
          text:
            switchLanguage === "en"
              ? "Évaluation de DORA DevOps"
              : "DORA Devops Assessment"
        }
      ],
      search: false,

      breadcrumbs: [
        {
          title: switchLanguage === "en" ? "Accueil" : "Home",
          href:
            switchLanguage === "en"
              ? "https://www.canada.ca/fr.html"
              : "https://www.canada.ca/en.html"
        },
        {
          title:
            switchLanguage === "en" ? "Gouvernement ouvert" : "Open Government",
          href:
            switchLanguage === "en"
              ? "https://ouvert.canada.ca/fr"
              : "https://open.canada.ca/en"
        }
      ]
    });
  }

  let defPreFooter = document.getElementById("def-preFooter");
  if (defPreFooter) {
    // @ts-ignore
    defPreFooter.innerHTML = wet.builder.preFooter({
      // see public index.html
      // get the build time which is injected into the root element at build time
      dateModified: "2020-06-03",
      versionIdentifier: "0.8.1",
      showPostContent: false,
      showShare: false
    });
  }
  let defFooter = document.getElementById("def-footer");
  if (defFooter) {
    // @ts-ignore
    defFooter.innerHTML = wet.builder.appFooter({
      footerSections: [
        {
          href:
            switchLanguage === "en"
              ? "/fr/formulaire/faites-nous-part-de-vos-commentaires"
              : "/en/forms/contact-us",
          text:
            switchLanguage === "en"
              ? "Contactez-nous du gouvernement ouvert"
              : "Open Government Contact"
        },
        {
          href:
            switchLanguage === "en"
              ? "https://www.canada.ca/fr/gouvernement/min.html"
              : "https://www.canada.ca/en/government/dept.html",
          text:
            switchLanguage === "en"
              ? "Ministères et organismes"
              : "Departments and agencies"
        },
        {
          href:
            switchLanguage === "en"
              ? "https://www.canada.ca/fr/gouvernement/fonctionpublique.html"
              : "https://www.canada.ca/en/government/publicservice.html",
          text:
            switchLanguage === "en"
              ? "Fonction publique et force militaire"
              : "Public service and military"
        },
        {
          href:
            switchLanguage === "en"
              ? "http://nouvelles.gc.ca/"
              : "http://news.gc.ca/",
          text: switchLanguage === "en" ? "Nouvelles" : "News"
        },
        {
          href:
            switchLanguage === "en"
              ? "https://www.canada.ca/fr/gouvernement/systeme/lois.html"
              : "https://www.canada.ca/en/government/system/laws.html",
          text:
            switchLanguage === "en"
              ? "Traités, lois et règlements"
              : "Treaties, laws and regulations"
        },
        {
          href:
            switchLanguage === "en"
              ? "https://www.canada.ca/fr/transparence/rapports.html"
              : "https://www.canada.ca/en/transparency/reporting.html",
          text:
            switchLanguage === "en"
              ? "Rapports à l'échelle du gouvernement"
              : "Government-wide reporting"
        },
        {
          href: switchLanguage === "en" ? "/fr/user" : "/en/user",
          text:
            switchLanguage === "en"
              ? "Ouverture de session Gouvernement ouvert"
              : "Open Government Log In"
        },
        {
          href:
            switchLanguage === "en"
              ? "https://www.canada.ca/fr/gouvernement/systeme.html"
              : "https://www.canada.ca/en/government/system.html",
          text:
            switchLanguage === "en"
              ? "Comment le gouvernement fonctionne"
              : "How government works"
        }
      ],
      showFeatures: false
    });
  }
}

// cdts language switching is built for static applications
// create a language button which will toggle the i18n locale from english to french
// such as the page does not need to reload  if a user switches the language
function generateLanguageToggle() {
  const htmlElement = document.getElementsByTagName("html")[0];
  const language = htmlElement.getAttribute("lang");
  let switchLanguage = "en";
  if (language === "fr") {
    switchLanguage = "fr";
  }

  // create language toggle
  let languageButton = document.createElement("button");
  languageButton.innerText = switchLanguage === "en" ? "Francais" : "English";
  languageButton.className =
    "btn btn-default fixed-top language-button position-absolute page-actions";
  languageButton.style["left"] = "unset";
  languageButton.addEventListener("click", e => {
    let currentLanguage = i18n.locale;

    if (currentLanguage === "fr") {
      i18n.locale = "en";

      if (e.target instanceof HTMLElement) {
        e.target.innerText = "Francais";
      }
      htmlElement.setAttribute("lang", "en");
      reloadTemplate();

      // once the template reloads we will need to mount the button back into the banner
      let wbBanner = document.getElementById("wb-bnr") as HTMLElement;
      wbBanner.appendChild(e.currentTarget as HTMLElement);
    } else {
      i18n.locale = "fr";
      if (e.target instanceof HTMLElement) {
        e.target.innerText = "English";
      }
      htmlElement.setAttribute("lang", "fr");
      reloadTemplate();

      let wbBanner = document.getElementById("wb-bnr") as HTMLElement;
      wbBanner.appendChild(e.currentTarget as HTMLElement);
    }

    // reload the cdts template
  });
  let wbBanner = document.getElementById("wb-bnr") as HTMLElement;

  wbBanner.appendChild(languageButton);
}

window.onload = function() {
  reloadTemplate();
  generateLanguageToggle();
};

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
