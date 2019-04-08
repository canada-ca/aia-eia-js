window.onload = function() {
  reloadTemplate();
};

function reloadTemplate(){
  var language = document.getElementsByTagName("html")[0].getAttribute('lang');
  var switchLanguage = language.startsWith('en') ? 'fr' : 'en';

  var defTop = document.getElementById("def-top");
  defTop.outerHTML = wet.builder.appTop({
    appName: [
      {
        href: "#",
        text: (switchLanguage === 'en' ? "Démo Évaluation de l'incidence Algorithmique" : 'Algorithmic Impact Assessment Demo')
      }
    ],
    search: false,
    lngLinks: [
      {
        lang: switchLanguage,
        href: "?lang=" + switchLanguage,
        text: (switchLanguage === 'en' ? 'English' : 'Français')
      }
    ],
    showPreContent: false,
    topSecMenu: false
  });

  var defPreFooter = document.getElementById("def-preFooter");
  defPreFooter.outerHTML = wet.builder.preFooter({
    dateModified: "2019-03-29",
    versionIdentifier: "0.0.4",
    showPostContent: false
  });

  var defFooter = document.getElementById("def-footer");
  defFooter.outerHTML = wet.builder.appFooter({
  });
}
