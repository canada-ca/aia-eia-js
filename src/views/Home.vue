<template>
  <div class="home">
    <h1>{{ $t("appTitle") }}</h1>
    <div class="alert alert-info">
      <p>{{ $t("localSaveWarning") }}</p>
    </div>
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
    </p>
    <form>
      <ActionButtonBar
        v-on:fileLoaded="fileLoaded($event)"
        v-on:startAgain="startAgain"
      />
    </form>
    <div>
      <HomeSectionsContainer :sections="sections" :survey="Survey" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Model, PageModel, PanelModel } from "survey-vue";
import showdown from "showdown";

import AssessmentTool from "@/components/AssessmentTool.vue"; // @ is an alias to /src
import ActionButtonBar from "@/components/ActionButtonBar.vue";
import HomeSectionsContainer from "@/components/HomeSectionsContainer.vue";
import SurveyFile from "@/interfaces/SurveyFile";
import i18n from "@/plugins/i18n";
import surveyJSON from "@/survey-enfr.json";
import { Section } from "@/types";
import resultsData from "@/survey-results.json";
import { returnAllSectionsByPrefix } from "@/store";

@Component({
  components: {
    AssessmentTool,
    ActionButtonBar,
    HomeSectionsContainer
  }
})
export default class Home extends Vue {
  Survey: Model = new Model(surveyJSON);
  currentPage: string = "section_three";
  sections: PageModel[] = returnAllSectionsByPrefix(this.Survey, "section_");

  startAgain() {
    this.Survey.clear(true, true);
    window.localStorage.clear();
    this.$store.commit("resetSurvey");
  }

  fileLoaded($event: SurveyFile) {
    this.Survey.data = $event.data;
    this.Survey.currentPageNo = $event.currentPage;
    this.Survey.start();
    this.$store.commit("updateSurveyData", this.Survey);
  }

  @Watch("$i18n.locale")
  changeLanguage(value: string, oldValue: string) {
    this.Survey.locale = value;
    this.Survey.render();
  }

  created() {
    this.Survey.css = {
      navigationButton: "btn survey-button"
    };

    this.Survey.onComplete.add(result => {
      this.$store.commit("calculateResult", result);
      this.$router.push("/results");
    });

    /*this.Survey.onComplete.add(result => {
      this.$router.push("Results");
    });*/

    this.Survey.onValueChanged.add(result => {
      this.$store.commit("updateSurveyData", result);
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
