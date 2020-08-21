<template>
  <div class="row numberSectionContainer">
    <div class="col-md-12 col-lg-4 numberSection">
      Your Score: {{ sectionScore.toFixed(2) }}
    </div>
    <div class="col-md-12 col-lg-4 numberSection">
      Total Possible Score: {{ sectionTotalScore }}
    </div>
    <div class="col-md-12 col-lg-4 numberSection">
      Percentage: {{ sectionPercentage }}%
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class ResultScoreBreakdown extends Vue {
  @Prop() public sectionScore!: number;
  @Prop() public sectionTotalScore!: number;

  get sectionPercentage(): string {
    let per = (this.sectionScore / this.sectionTotalScore) * 100;
    return per.toFixed(2);
  }
}
</script>

<style scoped>
.numberSectionContainer {
  width: 100%;
}
.numberSection {
  font-size: 26px;
  font-weight: 500;
  text-align: center;
}

@media screen and (max-width: 800px) {
  .numberSection {
    font-size: 22px;
    text-align: left;
  }
}
</style>
