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
        text: (switchLanguage === 'en' ? "Évaluation de l'incidence algorithmique" : 'Algorithmic Impact Assessment')
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
    breadcrumbs: [{
        title: (switchLanguage === 'en' ? "Accueil" : "Home"),
        href: (switchLanguage === 'en' ? "https://www.canada.ca/fr.html" : "https://www.canada.ca/en.html"),
      },{
        title: (switchLanguage === 'en' ? "Gouvernement ouvert" : "Open Government"),
        href: (switchLanguage === 'en' ? "https://ouvert.canada.ca/fr" : "https://open.canada.ca/en"),
      }]
  });

  var defPreFooter = document.getElementById("def-preFooter");
  defPreFooter.outerHTML = wet.builder.preFooter({
    dateModified: "2025-07-02",
    versionIdentifier: "1.0.0",
    showPostContent: false,
    showShare: false
  });

  var defFooter = document.getElementById("def-footer");
  defFooter.outerHTML = wet.builder.appFooter({
    "footerSections": [{
      "href": (switchLanguage === 'en' ? "/fr/formulaire/faites-nous-part-de-vos-commentaires" : "/en/forms/contact-us"),
      "text": (switchLanguage === 'en' ? "Contactez-nous du gouvernement ouvert" : "Open Government Contact")
    },{
      "href": (switchLanguage === 'en' ? "https://www.canada.ca/fr/gouvernement/min.html" : "https://www.canada.ca/en/government/dept.html"),
      "text": (switchLanguage === 'en' ? "Ministères et organismes" : "Departments and agencies")
    },{
      "href": (switchLanguage === 'en' ? "https://www.canada.ca/fr/gouvernement/fonctionpublique.html" : "https://www.canada.ca/en/government/publicservice.html"),
      "text": (switchLanguage === 'en' ? "Fonction publique et force militaire" : "Public service and military")
    },{
      "href": (switchLanguage === 'en' ? "http://nouvelles.gc.ca/" : "http://news.gc.ca/"),
      "text": (switchLanguage === 'en' ? "Nouvelles" : "News")
    },{
      "href": (switchLanguage === 'en' ? "https://www.canada.ca/fr/gouvernement/systeme/lois.html" : "https://www.canada.ca/en/government/system/laws.html"),
      "text": (switchLanguage === 'en' ? "Traités, lois et règlements" : "Treaties, laws and regulations")
    },{
      "href": (switchLanguage === 'en' ? "https://www.canada.ca/fr/transparence/rapports.html" : "https://www.canada.ca/en/transparency/reporting.html"),
      "text": (switchLanguage === 'en' ? "Rapports à l'échelle du gouvernement" : "Government-wide reporting")
    },{
      "href": (switchLanguage === 'en' ? "/fr/user" : "/en/user"),
      "text": (switchLanguage === 'en' ? "Ouverture de session Gouvernement ouvert" : "Open Government Log In")
    },{
      "href":(switchLanguage === 'en' ? "https://www.canada.ca/fr/gouvernement/systeme.html" : "https://www.canada.ca/en/government/system.html"),
      "text": (switchLanguage === 'en' ? "Comment le gouvernement fonctionne" : "How government works")
    }],
    "showFeatures": false
  });

  if(switchLanguage === 'en'){
    document.querySelector(".pagedetails a").innerText = "Signaler un problème sur cette page";
    document.querySelector(".pagedetails a").setAttribute("href", "https://www.canada.ca/fr/signaler-probleme.html");
    document.querySelector("#wb-dtmd dt").innerText = "Date de modification : ";
    document.querySelectorAll(".brand a")[0].innerText = "Contactez-nous";
    document.querySelectorAll(".brand a")[0].setAttribute("href", "https://www.canada.ca/fr/contact.html");
    document.querySelectorAll(".brand a")[1].innerText = "Avis";
    document.querySelectorAll(".brand a")[1].setAttribute("href", "https://www.canada.ca/fr/transparence/avis.html");
    document.querySelectorAll(".brand a")[2].innerText = "Confidentialité";
    document.querySelectorAll(".brand a")[2].setAttribute("href", "https://www.canada.ca/fr/transparence/confidentialite.html");
  }  
}
