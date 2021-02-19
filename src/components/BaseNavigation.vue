<template>
  <div>
    <div class="alert alert-info">
      <details>
        <summary>{{ $t("notice.localSaveWarningSummary") }}</summary>
        <p class="small">{{ $t("notice.localSaveWarningParagraph") }}</p>
      </details>
    </div>
    <p class="page-actions">
      <button
        v-if="this.$router.history.current['path'] == '/results'"
        type="button"
        value="Export Results"
        class="btn btn-default"
        style="margin: 3px 2px; width: 290px"
        v-on:click="$emit('exportResults')"
      >
        <i class="fas fa-file-export"></i>
        {{ $t("toPDF") }}
      </button>
    </p>
  </div>
</template>
<script lang="ts">
import { Model } from "survey-vue";
import { Component, Vue, Prop } from "vue-property-decorator";
@Component
export default class BaseNavigation extends Vue {
  @Prop() public survey!: Model;
}
</script>
