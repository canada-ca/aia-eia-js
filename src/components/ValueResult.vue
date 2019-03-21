
<template>
  <div>
    <strong>{{ data.title }}</strong> {{ data.displayValue }} <strong>Modifier:</strong> {{ data.value }}
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class ValueResult extends Vue {
  @Prop() data : any;
}
</script>