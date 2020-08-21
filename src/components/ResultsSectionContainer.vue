<template>
  <div class="row">
    <div class="col">
      <div class="row">
        <div class="col">
          <h2>{{ sectionName }}</h2>
          <p v-if="sectionDescription">
            {{ sectionDescription }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Model } from "survey-vue";

@Component
export default class ResultsSectionContainer extends Vue {
  @Prop({ required: true }) public language!: string;
  @Prop({ required: true }) public sectionName!: string;
  @Prop({ required: true }) public sectionsQuestions!: Array<String>;
  @Prop({ required: true }) public sectionScore!: number;
  @Prop({ required: true }) public survey!: Model;
  @Prop({ required: true }) public sectionTotalScore!: number;
  @Prop({ required: false }) public sectionDescription?: string;
}
</script>
