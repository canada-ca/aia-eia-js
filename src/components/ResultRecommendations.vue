<template>
  <div>
    Section name {{ sectionName }} t {{ myRecommendations }}

    <div v-for="recommendation in recommendations" :key="recommendation.id">
      <div v-if="recommendation.level == '1'">
        {{ recommendation.title.en }}
      </div>
    </div>
    <b-card-body>
      <div></div>
    </b-card-body>
  </div>
</template>
<script lang="ts">
import i18n from "@/plugins/i18n";
import { Vue, Component, Prop } from "vue-property-decorator";
import { Recommendations } from "@/types";
@Component({
  components: {
    ResultRecommendations
  },
  computed: {
    locale() {
      return i18n.locale;
    },
    recommendations() {
      return this.$store.state.recommendations.sectionsRecommendations
        .recommendations;
    }
  },
  methods: {}
})
export default class ResultRecommendations extends Vue {
  @Prop() public myRecommendations!: Recommendations;
  @Prop() public sectionName!: string;
}
</script>
