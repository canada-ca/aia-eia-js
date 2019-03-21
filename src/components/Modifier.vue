<template>
  <div><strong>Modifier:</strong> {{ str }}</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class Modifier extends Vue {
  @Prop() data: any;
  private str: String = this.getModifiedData();

  getModifiedData(): string {
    if (this.data == 0) return "0";
    if (this.data < 0) return this.data.toString();
    return "+" + this.data;
  }
}
</script>
