<template>
  <div>
    <b-card-group deck>
      <HomeSectionCard
        v-for="section in sections"
        :key="section.id"
        :section="section"
        :survey="survey"
      ></HomeSectionCard>
    </b-card-group>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import HomeSectionCard from "@/components/HomeSectionCard.vue";
import { PageModel, SurveyModel } from "survey-vue";

@Component({
  components: { HomeSectionCard }
})
export default class HomeSectionsContainer extends Vue {
  @Prop() public sections!: PageModel[];
  @Prop() public survey!: SurveyModel;
}
</script>
