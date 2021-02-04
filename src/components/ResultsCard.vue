<template>
  <b-card class="mt-2">
    <b-card-header>
      {{ getSectionName(thisSurveyData, sectionName) }}</b-card-header
    >
    <b-card-title>
      {{ $t("currentScore") }}: {{ userScore }}<br />
    </b-card-title>
    <b-card-body>
      <ResultRecommendations
        :section-name="sectionName"
        :section-score-level="sectionScoreLevel"
        :section-recommendations="myRecommendations.sectionRecommendations"
        :locale="locale"
      />
    </b-card-body>
  </b-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { SurveyModel } from "survey-vue";
import { Recommendations } from "@/types";
import ResultRecommendations from "@/components/ResultRecommendations.vue";
@Component({
  components: { ResultsCard, ResultRecommendations },
  computed: {
    //TODO:sectionScoreLevel--> returns score based on userScore/maxScore
    sectionScoreLevel() {
      return 0;
    }
  },
  methods: {
    getSectionName(surveyData: SurveyModel, sectionName) {
      let page = surveyData.getPageByName(sectionName.toString());
      return page.title;
    }
  }
})
export default class ResultsCard extends Vue {
  @Prop() public sectionName!: string;
  @Prop() public userScore!: number;
  @Prop() public myRecommendations!: Recommendations;
  @Prop() public locale!: any;
  thisSurveyData = this.$store.getters.returnSurveyModel;
}
</script>
