<template>
  <div class="form-group">
    <label>{{ questionName }}</label>
    <p>Value: {{ questionValue ? questionValue : "Not Answered" }}</p>
    <label class="boolean-container">
      <input
        type="checkbox"
        :id="questionId"
        :checked="questionValue"
        disabled
      />
      {{ trueValue }}
    </label>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class ResultBooleanQuestion extends Vue {
  @Prop() public questionId!: string;
  @Prop() public questionName!: string;
  @Prop() public questionValue!: string;
  @Prop() public questionDefinition!: any;

  get trueValue(): string {
    if (this.questionDefinition.labelTrue) {
      return this.questionDefinition.labelTrue;
    }
    return "";
  }
}
</script>

<style scoped>
.boolean-container {
  display: block;
  position: relative;
  margin-bottom: 18px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 300;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

input[type="checkbox"] {
  transform: scale(2);
  margin-right: 10px;
}
</style>
