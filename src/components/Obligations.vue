<template>
  <section>
    <h2>{{ $t("requirements.title") }}</h2>
    <ul class="list-unstyled">
      <li>
        <div
          class="row"
          v-for="requirement in $t('requirements.elements')"
          :key="requirement.title"
        >
          <h3>{{ requirement.title }}</h3>
          <p>{{ requirement.elements[score[3] - 1].text }}</p>
        </div>
      </li>
    </ul>
  </section>
</template>

<script lang="ts">
//Display the obligations related to the score level
//See http://www.tbs-sct.gc.ca/pol/doc-fra.aspx?id=32592#appC for obligations
import Vue from "vue";
import i18n from "@/plugins/i18n";
import Component from "vue-class-component";

@Component({
  computed: {
    score: function() {
      return this.$store.getters.calcscore;
    }
  }
})
export default class Obligations extends Vue {}
</script>
