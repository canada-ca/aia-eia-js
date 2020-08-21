<template>
  <ResultRatingQuestion
    v-if="questionType === 'rating'"
    :question-id="questionId"
    :question-name="questionName"
    :question-value="questionValue"
    :question-definition="questionJSON"
  />
  <ResultRadioQuestion
    v-else-if="questionType === 'radiogroup'"
    :question-id="questionId"
    :question-name="questionName"
    :question-value="questionValue"
    :question-definition="questionJSON"
  />
  <ResultBooleanQuestion
    v-else-if="questionType === 'boolean'"
    :question-id="questionId"
    :question-name="questionName"
    :question-value="questionValue"
    :question-definition="questionJSON"
  />
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import ResultRatingQuestion from "@/components/ResultRatingQuestion.vue";
import ResultRadioQuestion from "@/components/ResultRadioQuestion.vue";
import ResultBooleanQuestion from "@/components/ResultBooleanQuestion.vue";

@Component({
  components: {
    ResultRatingQuestion,
    ResultRadioQuestion,
    ResultBooleanQuestion
  }
})
export default class ResultQuestionContainer extends Vue {
  @Prop() public questionId!: string;
  @Prop() public questionName!: string;
  @Prop() public questionType!: string;
  @Prop() public questionValue!: number | string | boolean;
  @Prop() public questionJSON!: any;
}
</script>

<style scoped></style>
