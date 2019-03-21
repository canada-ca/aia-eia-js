<template>
  <div>
    <div class="col-md-12">
      <strong>{{ data.title }}</strong>
      <br />
      <ul>
        <div v-for="(str, index) in data.value" :key="index">
          <div class="row">
            <div class="col-md-10">
              {{ data.displayValue.split(", ")[index] }}
            </div>
            <div class="col-md-2">
              <Modifier :data="parseInt(str)" />
            </div>
          </div>
        </div>
      </ul>
    </div>
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
export default class MultiChoiceValueResult extends Vue {
  @Prop() data: any;
  getValueList() {
    return this.data.displayValue.split(", ");
  }
}
</script>
