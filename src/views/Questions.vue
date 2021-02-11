<template>
  <div class="results">
    <h1>{{ $t("appTitle") }}</h1>
    <div class="alert alert-info">
      <details>
        <summary>{{ $t("notice.localSaveWarningSummary") }}</summary>
        <p class="small">{{ $t("notice.localSaveWarningParagraph") }}</p>
      </details>
    </div>
    <p class="page-actions">
      <a
        class="btn btn-default pull-right"
        role="button"
        :href="$t('linkProjectAnchor')"
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
    <AssessmentTool :survey="Survey" />
    <div class="page-actions">
      <div class="row" style="padding: 0 5px">
        <div class="col-3 col-sm-2 col-md-3">
          <button
            type="button"
            class="btn survey-button"
            style="width: inherit"
            v-on:click="goToHomePage()"
          >
            {{ $t("navigation.chooseAnotherSection") }}
          </button>
        </div>
        <div class="col-3 col-sm-2 col-md-3">
          <button
            type="button"
            class="btn survey-button"
            style="width: inherit"
            v-on:click="goToSectionResults()"
          >
            {{ $t("navigation.viewSectionResults") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Model } from "survey-vue";
import showdown from "showdown";

import AssessmentTool from "@/components/AssessmentTool.vue"; // @ is an alias to /src
import ActionButtonBar from "@/components/ActionButtonBar.vue";
import BaseNavigation from "@/components/BaseNavigation.vue";
import SurveyFile from "@/interfaces/SurveyFile";
import i18n from "@/plugins/i18n";
import surveyJSON from "@/survey-enfr.json";

@Component({
  components: {
    AssessmentTool,
    ActionButtonBar
  }
})
export default class Questions extends Vue {
  @Prop() public currentPageNo!: number;
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
    this.$store.commit("updateSurveyData", this.Survey);
  }

  goToHomePage() {
    this.$store.commit("updateSurveyData", this.Survey);
    this.$router.push("/");
  }

  goToSectionResults() {
    this.$store.commit("updateSurveyData", this.Survey);
    this.$router.push("/results");
  }

  created() {
    this.Survey.onComplete.add(result => {
      this.$store.commit("calculateResult", result);
      this.$router.push("/results");
    });

    this.Survey.currentPageNo = this.$store.getters.returnCurrentPageNumber;
    this.Survey.data = this.$store.getters.resultsDataSections;
  }
}
</script>
