<template>
  <div>
    <b-card-group deck>
      <div v-for="section in sections" :key="section.id">
        <HomeSectionCard :section="section" />
      </div>
    </b-card-group>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import HomeSectionCard from "@/components/HomeSectionCard.vue";
import { Section } from "@/types";
import { PageModel } from "survey-vue";

@Component({
  components: { HomeSectionCard },
  computed: {}
})
export default class HomeSectionsContainer extends Vue {
  @Prop() public sections!: PageModel[];
}
</script>
