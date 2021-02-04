<template>
  <b-card>
    <b-card-header>{{ sectionName }}</b-card-header>
    <b-card-title>
      <div v-for="question in questionsNames" :key="question.id"></div>
      Current score: {{ userScore }}<br />
    </b-card-title>
    <b-card-body>
      <ResultRecommendations
        :section-name="sectionName"
        :section-score-level="sectionScoreLevel"
        :my-recommendations="myRecommendations"
      />
    </b-card-body>
  </b-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Survey, Model, Question } from "survey-vue";
import i18n from "@/plugins/i18n";
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
}
</script>
