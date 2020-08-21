<script src="../main.ts"></script>
<template>
  <div class="results">
    <!--<PrintButton />-->
    <h1>{{ $t("resultTitle") }}</h1>
    <p class="page-actions">
      <a
        class="btn btn-default"
        role="button"
        :href="$t('linkProjectAnchor')"
        style="margin: 3px 2px; width: 290px"
      >
        <i class="fab fa-github"></i>
        {{ $t("linkProjectText") }}
      </a>
      <button
        type="button"
        value="Export Results"
        class="btn btn-default"
        style="margin: 3px 2px; width: 290px"
        v-on:click="exportResults"
      >
        <i class="fas fa-file-export"></i>
        {{ $t("toPDF") }}
      </button>
    </p>

    <form>
      <ActionButtonBar
        v-on:fileLoaded="fileLoaded($event)"
        v-on:startAgain="startAgain"
      />
    </form>

    <div v-if="$i18n.locale === 'en'" id="en-content">
      <ResultsContainer language="en" :survey="Survey" />
    </div>

    <div v-if="$i18n.locale === 'fr'" id="fr-content">
      <ResultsContainer language="fr" :survey="Survey" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Model } from "survey-vue";
import showdown from "showdown";
import ActionButtonBar from "@/components/ActionButtonBar.vue";
import ResultsContainer from "@/components/ResultsContainer.vue";
import SurveyFile from "@/interfaces/SurveyFile";
import i18n from "@/plugins/i18n";
import surveyJSON from "@/survey-enfr.json";

@Component({
  components: {
    ActionButtonBar,
    ResultsContainer
  },
  computed: {
    score: function() {
      return this.$store.getters.calcScore;
    }
  }
})
export default class Results extends Vue {
  myResults = this.$store.getters.resultDataSections;

  Survey: Model = new Model(surveyJSON);

  exportResults() {
    const source = window.document.getElementById(
      this.$i18n.locale + "-content"
    ) as HTMLElement;

    let pageActions = window.document.getElementsByClassName("page-actions");

    function beforePrint() {
      for (let i in pageActions) {
        if (pageActions[i].classList) {
          pageActions[i].classList.add("hidden");
        }
      }
    }

    function afterPrint() {
      for (let i in pageActions) {
        if (pageActions[i].classList) {
          pageActions[i].classList.remove("hidden");
        }
      }
    }

    window.addEventListener("beforeprint", beforePrint, false);
    window.addEventListener("afterprint", afterPrint, false);

    window.print();

    window.removeEventListener("beforeprint", beforePrint);
    window.removeEventListener("afterprint", afterPrint);
  }

  startAgain() {
    this.Survey.clear(true, true);
    window.localStorage.clear();
    this.$store.commit("resetSurvey");
    this.$router.push({ path: "/" });
  }
  fileLoaded($event: SurveyFile) {
    this.Survey.data = $event.data;
    this.Survey.currentPageNo = $event.currentPage;
    this.Survey.start();
    this.$store.commit("calculateResult", this.Survey);

    this.myResults = this.$store.getters.resultDataSections;
  }

  created() {
    this.Survey.onComplete.add(result => {
      this.$store.commit("updateSurveyData", result);
    });

    this.Survey.onValueChanged.add(result => {
      this.$store.commit("calculateResult", result);
    });

    const converter = new showdown.Converter();

    this.Survey.onTextMarkdown.add(function(survey, options) {
      //convert the markdown text to html
      var str = converter.makeHtml(options.text);
      //remove root paragraphs <p></p>
      str = str.substring(3);
      str = str.substring(0, str.length - 4);
      //set html
      options.html = str;
    });

    // Set locale
    this.Survey.locale = i18n.locale;

    // accessibility fix... aria-labelledby being needlessly generated for html question
    // TODO: make this dynamic by looping over questions and doing this for all html questions
    this.Survey.onAfterRenderQuestion.add(function(sender, options) {
      let welcomePage = document.getElementsByName("welcome1");
      if (welcomePage && welcomePage.length > 0) {
        let welcomePageElement = welcomePage[0];
        welcomePageElement.removeAttribute("aria-labelledby");
      }
    });

    //if survey is in progress reload from store
    if (this.$store.getters.inProgress) {
      this.fileLoaded({
        currentPage: this.$store.state.currentPageNo,
        data: this.$store.state.toolData
      } as SurveyFile);
    }
  }
}
</script>
