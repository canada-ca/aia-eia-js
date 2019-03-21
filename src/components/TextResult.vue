<template>
  <div>
    <div v-if="data.value == data.displayValue">
      <TextResult :data=data />
    </div>
    <div v-else>
      <strong>{{ data.title }}</strong> {{ data.displayValue }} Modifier: <strong>{{ data.value }}</strong>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class TextResult extends Vue {
  @Prop() data : any;
}
</script>
