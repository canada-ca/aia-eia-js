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
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Model } from "survey-vue";
import showdown from "showdown";

import AssessmentTool from "@/components/AssessmentTool.vue"; // @ is an alias to /src
import ActionButtonBar from "@/components/ActionButtonBar.vue";
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

  created() {
    this.Survey.onComplete.add(result => {
      this.$store.commit("calculateResult", result);
      this.$router.push("/results");
    });

    this.Survey.currentPageNo = this.$store.getters.returnCurrentPageNumber;
  }
}
</script>
