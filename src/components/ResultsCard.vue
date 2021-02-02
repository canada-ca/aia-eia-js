<template>
  <b-card>
    <b-card-title>{{ section.sectionName }}</b-card-title>
    <b-card-text>
      <div v-for="question in section.questionsNames" :key="question.id">
        {{ question }}<br />
      </div>
      Current score: {{ section.userScore }}
    </b-card-text>
  </b-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Survey, Model, Question } from "survey-vue";
import i18n from "@/plugins/i18n";
import { Section } from "@/types";

@Component({
  components: { ResultsCard },
  computed: {}
})
export default class ResultsCard extends Vue {
  @Prop() public section!: Section;
}
</script>
