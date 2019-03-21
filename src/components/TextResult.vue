<template>
  <div>
    <strong>{{ data.title }}</strong> {{ data.displayValue }}
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class TextResult extends Vue {
  @Prop() data : any;
}
</script>
