<template>
  <div class="results">
    <h1>{{ $t("appTitle") }}</h1>
    <p>
      <a
        class="btn btn-default pull-right"
        role="button"
        :href="$t('linkProjectAnchor')"
      >
        {{ $t("linkProjectText") }}
      </a>
    </p>

    <div class="alert alert-info">
      <p class="small">{{ $t("localSaveWarning") }}</p>
    </div>
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
  created() {
    this.Survey.onComplete.add(result => {
      this.$store.commit("calculateResult", result);
      this.$router.push("/results");
    });

    this.Survey.currentPageNo = this.$store.getters.returnCurrentPageNumber;
  }
}
</script>
