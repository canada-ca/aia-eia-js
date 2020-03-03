<template>
  <div class="results">
    <!--<PrintButton />-->
    <h1>{{ $t("resultTitle") }}</h1>

    <p>{{ $t("onThisPage") }}</p>
    <ul>
      <li>
        <a href="#score">{{ $t("riskLevel") }}</a>
      </li>
      <li>
        <a href="#obligations">{{ $t("requirements.title") }}</a>
      </li>
      <li>
        <a href="#mitigationMeasures">{{ $t("resultSectionMeasure") }}</a>
      </li>
      <li>
        <a href="#qA">{{ $t("resultSectionQA") }}</a>
        <ul>
          <li>
            <a href="#projectDetails">{{ $t("resultSectionPD") }}</a>
          </li>
          <li>
            <a href="#riskQA">{{ $t("resultSectionRQA") }}</a>
          </li>
          <li>
            <a href="#mitigationQA">{{ $t("resultSectionMQA") }}</a>
          </li>
        </ul>
      </li>
    </ul>

    <form>
      <ActionButtonBar
        v-on:fileLoaded="fileLoaded($event)"
        v-on:startAgain="startAgain"
      />
    </form>

    <br/>

    <div id="results-printable">

      <Score />
      <Obligations />

      <div class="container-fluid">
        <div class="row">
          <h2 id="mitigationMeasures">{{ $t("resultSectionMeasure") }}</h2>
        </div>
        <div class="row">
          <p v-for="result in myResults[3]" :key="result.name">
            {{ $t(result.name) }}
          </p>
        </div>

        <div class="row">
          <h2 id="qA">{{ $t("resultSectionQA") }}</h2>
        </div>

        <div class="row">
          <h3 id="projectDetails">{{ $t("resultSectionPD") }}</h3>
        </div>
        <div class="row" v-for="result in myResults[0]" :key="result.name">
          <Result :data="result"></Result>
        </div>

        <div class="row">
          <h3 id="riskQA">{{ $t("resultSectionRQA") }}</h3>
        </div>
        <div class="row" v-for="result in myResults[1]" :key="result.name">
          <Result :data="result"></Result>
        </div>

        <div class="row">
          <h3 id="mitigationQA">{{ $t("resultSectionMQA") }}</h3>
        </div>
        <div class="row" v-for="result in myResults[2]" :key="result.name">
          <Result :data="result"></Result>
        </div>
      </div>
    </div>
    <div>
      <button
        type="button"
        value="Export Results"
        class="btn btn-default"
        onclick="exportResults()"
      >
        {{ $t("exportResults") }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import { Model } from "survey-vue";

import showdown from "showdown";

import AssessmentTool from "@/components/AssessmentTool.vue"; // @ is an alias to /src
import Score from "@/components/Score.vue";
import ActionButtonBar from "@/components/ActionButtonBar.vue";
import Result from "@/components/Result.vue";
import Obligations from "@/components/Obligations.vue";
import SurveyFile from "@/interfaces/SurveyFile";
import i18n from "@/plugins/i18n";
import surveyJSON from "@/survey-enfr.json";

@Component({
  components: {
    ActionButtonBar,
    Result,
    Score,
    Obligations
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

  startAgain() {
    this.Survey.clear(true, true);
    window.localStorage.clear();
    this.$store.commit("resetSurvey");
  }
  fileLoaded($event: SurveyFile) {
    this.Survey.data = $event.data;
    this.Survey.currentPageNo = $event.currentPage;
    this.Survey.start();
    this.$store.commit("updateResult", this.Survey);
  }

  created() {
    this.Survey.onComplete.add(result => {
      this.$store.commit("updateResult", result);
    });

    this.Survey.onComplete.add(result => {
      this.$router.push("Results");
    });

    this.Survey.onValueChanged.add(result => {
      this.$store.commit("updateResult", result);
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

    // Remove the default required '*'.
    this.Survey.requiredText = "";

    // Fix all the question labels as they're using <H5> instead of <label>
    // as SurveyJS has open issue as per: https://github.com/surveyjs/surveyjs/issues/928
    this.Survey.onAfterRenderQuestion.add(function(sender, options) {
      let title = options.htmlElement.getElementsByTagName("H5")[0];
      if (title) {
        var questionRequiredHTML = "";

        if (options.question.isRequired) {
          // Should do localization mechanism
          var requiredText = sender.locale == "fr" ? "obligatoire" : "required";
          questionRequiredHTML =
            ' <strong class="required">(' + requiredText + ")</strong>";
        }

        title.outerHTML =
          '<label for="' +
          options.question.inputId +
          '" class="' +
          title.className +
          '"><span class="field-name">' +
          title.innerText +
          "</span>" +
          questionRequiredHTML +
          "</label>";
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
