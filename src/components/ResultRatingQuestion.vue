<template>
  <div class="form-group">
    <label :for="questionId">{{ questionName }}</label>
    <p>Min: {{ ranges.min }}</p>
    <p>Max: {{ ranges.max }}</p>
    <p>Value: {{ this.questionValue ? this.questionValue : "Not Answered" }}</p>
    <input
      :id="questionId"
      :name="questionId"
      :value="value"
      type="range"
      :min="ranges.min"
      :max="ranges.max"
      disabled
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

interface RangeInterface {
  min: number;
  max: number;
}

@Component
export default class ResultRatingQuestion extends Vue {
  @Prop() public questionId!: string;
  @Prop() public questionName!: string;
  @Prop() public questionValue!: number;
  @Prop() public questionDefinition!: any;

  get ranges(): RangeInterface {
    let ranges: RangeInterface = {
      min: 0,
      max: 100
    };
    if (typeof this.questionDefinition === "object") {
      if (this.questionDefinition.hasOwnProperty("rateMin")) {
        ranges.min = this.questionDefinition.rateMin;
      }
      if (this.questionDefinition.hasOwnProperty("rateMax")) {
        ranges.max = this.questionDefinition.rateMax;
      }
    }
    return ranges;
  }

  get value(): number {
    return this.questionValue ? this.questionValue : this.ranges.min;
  }
}
</script>
