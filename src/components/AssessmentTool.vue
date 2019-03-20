<template>
  <div>
    <h2>Assessment Tool</h2>
    <div id="surveyContainer">
      <survey v-bind:survey="survey"></survey>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Model } from "survey-vue";

@Component
export default class AssessmentTool extends Vue {
  @Prop() public survey!: Model;
}
</script>
