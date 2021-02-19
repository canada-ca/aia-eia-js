<template>
  <b-card class="mt-2">
    <b-card-header>
      {{ getSectionName(thisSurveyData, sectionName) }}</b-card-header
    >
    <b-card-body>
      <p>
        {{ $t("currentScore") }}: {{ sectionScoreLevel(userScore, maxScore) }}%
      </p>
      <p></p>
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
import { Question, SurveyModel } from "survey-vue";
import { Recommendations } from "@/types";
import ResultRecommendations from "@/components/ResultRecommendations.vue";
@Component({
  components: { ResultsCard, ResultRecommendations },
  computed: {
    //TODO:sectionScoreLevel--> returns score based on userScore/maxScore
  },
  methods: {
    getSectionName(surveyData: SurveyModel, sectionName: string) {
      //TODO: validate if surveyData is undefined
      let page = surveyData.getPageByName(sectionName);
      return page.title;
    },
    sectionScoreLevel(userScore: number, maxScore: number) {
      return new Intl.NumberFormat("en-CA", {
        style: "decimal",
        maximumFractionDigits: 0
      }).format((userScore / maxScore) * 100);
    }
  }
})
export default class ResultsCard extends Vue {
  @Prop() public sectionName!: string;
  @Prop() public userScore!: number;
  @Prop() public maxScore!: number;
  @Prop() public myRecommendations!: Recommendations;
  @Prop() public locale!: any;
  thisSurveyData = this.$store.getters.returnSurveyModel;
}
</script>
