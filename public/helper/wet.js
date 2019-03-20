window.onload = function() {
  var defTop = document.getElementById("def-top");
  defTop.outerHTML = wet.builder.appTop({
    appName: [
      {
        href: "#",
        text: "Algorithmic Impact Assessment Demo"
      }
    ],
    search: false,
    lngLinks: [
      {
        lang: "fr",
        href: "#",
        text: "N/A"
      }
    ],
    showPreContent: false,
    topSecMenu: false
  });

  var defPreFooter = document.getElementById("def-preFooter");
  defPreFooter.outerHTML = wet.builder.preFooter({
    dateModified: "2018-02-15",
    versionIdentifier: "0.0.1",
    showPostContent: false
  });

  var defFooter = document.getElementById("def-footer");
  defFooter.outerHTML = wet.builder.appFooter({
  });
};
