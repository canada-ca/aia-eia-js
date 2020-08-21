<template>
  <div class="row" style="padding: 0 15px;">
    <ResultsSectionContainer
      v-if="$store.state.sectionZeroEnabled"
      :survey="survey"
      :language="language"
      :section-name="ResultsJSON.sections.sectionZero.title[language]"
      :section-description="
        ResultsJSON.sections.sectionZero.description[language]
      "
      :section-score="$store.state.scoring.sectionZeroScore"
      :section-total-score="$store.state.scoring.sectionZeroTotal"
      :sections-questions="
        Object.keys(ResultsJSON.sections.sectionZero.questions)
      "
    />
    <ResultsSectionContainer
      v-if="$store.state.sectionOneEnabled"
      :survey="survey"
      :language="language"
      :section-name="ResultsJSON.sections.sectionOne.title[language]"
      :section-description="
        ResultsJSON.sections.sectionOne.description[language]
      "
      :section-score="$store.state.scoring.sectionOneScore"
      :section-total-score="$store.state.scoring.sectionOneTotal"
      :sections-questions="
        Object.keys(ResultsJSON.sections.sectionOne.questions)
      "
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Model } from "survey-vue";
import ResultsSectionContainer from "@/components/ResultsSectionContainer.vue";
import ResultsJSON from "../survey-results.json";

@Component({
  components: {
    ResultsSectionContainer
  }
})
export default class ResultsContainer extends Vue {
  @Prop() public language!: string;
  @Prop() public survey!: Model;
  ResultsJSON = ResultsJSON;
}
</script>
