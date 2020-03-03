<template>
  <div>
    <strong>{{ $t("modifier", locale) }}:</strong> {{ str }}
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class Modifier extends Vue {
  @Prop() data: any;
  @Prop() locale: any;
  private str: String = this.getModifiedData();

  getModifiedData(): string {
    //Added similar logic than parseEmbeddedValue from $store
    if (typeof this.data === "string") {
      const lastHyphenIdx = this.data.lastIndexOf("-");
      if (lastHyphenIdx !== -1) {
        // Suffix after last "-" could be a number.
        const possibleValue = this.data.substr(lastHyphenIdx + 1);
        const value = Number(possibleValue);
        if (typeof value === "number") {
          return "+" + value.toString();
        }
      }
      return "0";
    }
    if (this.data == 0) return "0";
    if (this.data < 0) return this.data.toString();
    return "+" + this.data;
  }
}
</script>
