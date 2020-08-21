<template>
  <div class="row">
    <div class="col">
      <div class="row">
        <div class="col">
          <h2>{{ sectionName }}</h2>

          <h3 v-if="sectionDescription">What This Section is About</h3>
          <p v-if="sectionDescription">
            {{ sectionDescription }}
          </p>
        </div>
      </div>
      <h3>Here Are the Metrics</h3>
      <ResultScoreBreakdown
        :section-score="sectionScore"
        :section-total-score="sectionTotalScore"
      />
      <div class="row" v-if="resultDefinition.name !== ''">
        <div class="col">
          <h3>What This Means Exactly</h3>
          <p>
            In this section you have achieved the result of
            <b>{{ resultDefinition.name }}</b
            >. The minimum percentage to achieve this result is
            <b>{{ resultDefinition.minPercentage }}%</b> and the maximum
            percentage is <b>{{ resultDefinition.maxPercentage }}%</b>
          </p>
          <p>{{ resultDefinition.description }}</p>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <h3>Your Answers</h3>
          <ResultQuestionContainer
            v-for="question in questionsData"
            :key="question.questionId"
            :question-id="question.questionId"
            :question-name="question.questionName"
            :question-type="question.questionType"
            :question-j-s-o-n="question.questionJSON"
            :question-value="question.questionValue"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Model } from "survey-vue";
import { QuestionData } from "@/interfaces/QuestionData";
import ResultQuestionContainer from "@/components/ResultQuestionContainer.vue";
import ResultScoreBreakdown from "@/components/ResultScoreBreakdown.vue";

interface ResultDefinition {
  name: string;
  description: string;
  minPercentage: number;
  maxPercentage: number;
}

@Component({
  components: {
    ResultScoreBreakdown,
    ResultQuestionContainer
  }
})
export default class ResultsSectionContainer extends Vue {
  @Prop({ required: true }) public language!: string;
  @Prop({ required: true }) public sectionName!: string;
  @Prop({ required: true }) public sectionsQuestions!: Array<string>;
  @Prop({ required: true }) public sectionScore!: number;
  @Prop({ required: true }) public survey!: Model;
  @Prop({ required: true }) public sectionTotalScore!: number;
  @Prop({ required: false }) public sectionDescription?: string;
  @Prop() public sectionResults!: any;

  created() {
    this.survey.locale = this.language;
  }

  get questionsData(): QuestionData[] {
    let questions: QuestionData[] = [];
    for (let i in this.sectionsQuestions) {
      /* eslint-disable-next-line security/detect-object-injection */
      let questionName = this.sectionsQuestions[i];
      let questionData = this.survey.getQuestionByName(questionName);
      questions.push({
        questionId: questionName,
        questionName: questionData.title,
        questionType: questionData.getType(),
        questionValue: questionData.value,
        questionJSON: questionData.toJSON()
      });
    }
    return questions;
  }

  get resultDefinition(): ResultDefinition {
    let percentage = (this.sectionScore / this.sectionTotalScore) * 100;
    percentage = Number.isNaN(percentage) ? 0 : percentage;

    console.log(this.sectionResults);
    let resultDef: ResultDefinition = {
      name: "",
      description: "",
      maxPercentage: 0,
      minPercentage: 0
    };

    for (let i in this.sectionResults) {
      if (this.sectionResults.hasOwnProperty(i)) {
        /* eslint-disable-next-line security/detect-object-injection */
        let resultSection = this.sectionResults[i];
        console.log(resultSection);
        if (
          typeof resultSection.minPercentage === "number" &&
          typeof resultSection.maxPercentage === "number"
        ) {
          console.log(resultSection.minPercentage);
          if (
            percentage >= resultSection.minPercentage &&
            percentage <= resultSection.maxPercentage
          ) {
            if (resultSection.hasOwnProperty("name")) {
              if (resultSection.name.hasOwnProperty(this.language)) {
                resultDef.name = resultSection.name[this.language];
              } else if (typeof resultSection.name === "string") {
                resultDef.name = resultSection.name;
              }
            }

            resultDef.minPercentage = resultSection.minPercentage;
            resultDef.maxPercentage = resultSection.maxPercentage;

            if (resultSection.hasOwnProperty("description")) {
              if (resultSection.description.hasOwnProperty(this.language)) {
                resultDef.description =
                  resultSection.description[this.language];
              } else if (typeof resultSection.description === "string") {
                resultDef.description = resultSection.description;
              }
            }
          }
        }
      }
    }

    return resultDef;
  }
}
</script>
