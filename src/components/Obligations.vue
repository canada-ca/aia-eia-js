<template>
  <section>
    <p></p>
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
    text: function() {
      return NaN;
    }
  }
})
export default class Obligations extends Vue {}
</script>
