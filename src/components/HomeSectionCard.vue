<template>
  <b-card
    :title="section.title"
    img="../assets/logo.png"
    img-alt="Image"
    img-top
  >
    <b-card-text>Start this section!</b-card-text>
    <b-card-footer>This section's status will be displayed here</b-card-footer>
  </b-card>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { PageModel } from "survey-vue";

@Component({
  components: {}
})
export default class HomeSectionCard extends Vue {
  @Prop() public section!: PageModel;
}
</script>
