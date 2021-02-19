<template>
  <div class="results">
    <h1>{{ $t("appTitle") }}</h1>
    <BaseNavigation />
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
            {{ $t("navigation.goBack") }}
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
    ActionButtonBar,
    BaseNavigation
  }
})
export default class Questions extends Vue {
  @Prop() public currentPageNo!: number;
  Survey: Model = new Model(surveyJSON);

  startAgain() {
    this.Survey.clear(true, true);
    window.localStorage.clear();
    this.$store.commit("resetSurvey");
    this.$router.push("/");
  }

  fileLoaded($event: SurveyFile) {
    this.Survey.data = $event.data;
    this.Survey.currentPageNo = $event.currentPage;
    this.Survey.start();
    this.$store.commit("updateSurveyData", this.Survey);
    this.$router.push("/");
  }

  goToHomePage() {
    this.$store.commit("updateSurveyData", this.Survey);
    this.$router.push("/");
  }

  goToSectionResults() {
    this.$store.commit("updateSurveyData", this.Survey);
    this.$router.push("/sections");
  }
  @Watch("$i18n.locale")
  changeLanguage(value: string, oldValue: string) {
    this.Survey.locale = value;
    this.Survey.render();
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
