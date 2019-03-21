<template>
  <div>
    <div class="col-md-12">
      <strong>{{ data.title }}</strong
      ><br />
      {{ data.displayValue }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class TextResult extends Vue {
  @Prop() data: any;
}
</script>
