<template>
  <b-card class="mt-2">
    <b-card-header>{{ sectionName }}</b-card-header>
    <b-card-title>
      <div v-for="question in questionsNames" :key="question.id"></div>
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
import { Question } from "survey-vue";
import { Section, Recommendations } from "@/types";
import ResultRecommendations from "@/components/ResultRecommendations.vue";
@Component({
  components: { ResultsCard, ResultRecommendations },
  computed: {
    //TODO:sectionScoreLevel--> returns score based on userScore/maxScore
    sectionScoreLevel() {
      return 0;
    }
  },
  methods: {}
})
export default class ResultsCard extends Vue {
  @Prop() public sectionName!: string;
  @Prop() public enabled!: boolean;
  @Prop() public questionsNames!: string[];
  @Prop() public userScore!: number;
  @Prop() public questions!: Question[];
  @Prop() public section!: Section;
  @Prop() public myRecommendations!: Recommendations;
  @Prop() public locale!: any;
}
</script>
