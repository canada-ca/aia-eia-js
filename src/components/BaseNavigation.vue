<template>
  <div class="page-actions">
    <div class="row no-gutters" style="padding: 0 15px">
      <div class="col-3 col-sm-2 col-md-3">
        <button
          type="button"
          class="btn survey-button"
          style="width: inherit"
          v-on:click="goToHomepage()"
        >
          {{ $t("navigation.viewSectionResults") }}
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Model } from "survey-vue";
import { Vue, Prop } from "vue-property-decorator";
export default class BaseNavigation extends Vue {
  @Prop() public survey!: Model;
  goToHomepage() {}
}
</script>
