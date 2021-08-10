<template>
  <div class="requirements">
    <div class="container-fluid">
      <div class="row">
        <h2 id="obligations">
          {{ $t("requirements.title", locale) }} {{ score[3] }}
        </h2>
      </div>
      <div
        class="row"
        v-for="requirement in $t('requirements.elements', locale)"
        :key="requirement.title"
      >
        <h3>{{ requirement.title }}</h3>
        <p>{{ requirement.elements[score[3] - 1].text }}</p>
      </div>
      <div class="row">
        <h3>{{ $t("otherRequirementsTitle", locale) }}</h3>
        <p>{{ $t("otherRequirements", locale) }}</p>
        <p>
          <a :href="$t('linkDirective', locale)" :title="$t('linkDirectiveText', locale)" target="_blank">{{ $t("linkDirectiveText", locale) }}</a>
        </p>
        <p>{{ $t("contactAtipForPia", locale) }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import i18n from "@/plugins/i18n";
import Component from "vue-class-component";

@Component({
  props: ["locale"],
  computed: {
    score: function() {
      return this.$store.getters.calcScore;
    }
  }
})
export default class Obligations extends Vue {}
</script>
