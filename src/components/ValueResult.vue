<template>
  <div>
    <div class="col-md-10">
      <strong>{{ data.title }}</strong>
      <br />
      {{ data.displayValue }}
    </div>
    <div class="col-md-2"><Modifier :data="data.value" /></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import Modifier from "@/components/Modifier.vue";

@Component({
  components: {
    Modifier
  }
})
export default class ValueResult extends Vue {
  @Prop() data: any;
}
</script>
