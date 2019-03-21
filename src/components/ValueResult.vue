<template>
  <div>
    <div class="col-md-10">
      <strong>{{ data.title }}</strong>
      <br />
      {{ data.displayValue }}
    </div>
    <div class="col-md-2"><strong>Modifier:</strong> {{ modifier() }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class ValueResult extends Vue {
  @Prop() data: any;
  modifier = (): string => {
    if (this.data.value == 0) return "0";
    if (this.data.value < 0) return this.data.value.toString();
    return "+" + this.data.value;
  };
}
</script>
