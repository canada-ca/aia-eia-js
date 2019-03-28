<template>
  <div>
    <div class="col-md-12">
      <strong>{{ data.title }}</strong>
      <br />
      <ul>
        <div v-for="(str, index) in data.value" :key="index">
          <li>{{ getValue(str) }}</li>
        </div>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class MultiChoiceResult extends Vue {
  @Prop() data: any;
  getValue(str: string): string {
    const matches = this.data.data.filter((item: any) => item.value === str);
    if (matches.length === 0) return "ERROR: No Matches found";
    return matches[0].displayValue;
  }
}
</script>
