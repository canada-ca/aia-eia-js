<template>
  <div class="requirements">
    <div class="container-fluid">
      <div class="row">
        <h2 id="obligations">{{ $t("requirements.title") }} {{ score[3] }}</h2>
      </div>
      <div
        class="row"
        v-for="requirement in $t('requirements.elements')"
        :key="requirement.title"
      >
        <h3>{{ requirement.title }}</h3>
        <p>{{ requirement.elements[score[3] - 1].text }}</p>
      </div>
      <p class="row">
        <a :href="$t('linkDirective')" target="_blank">
          {{ $t("linkDirectiveText") }}
        </a>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import i18n from "@/plugins/i18n";
import Component from "vue-class-component";

@Component({
  computed: {
    score: function() {
      return this.$store.getters.calcScore;
    }
  }
})
export default class Obligations extends Vue {}
</script>
