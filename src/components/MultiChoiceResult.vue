<template>
  <div>
    <div> <strong>{{ data.title }}</strong> </div>
      <div>
        <div v-for="(str,index) in data.value"
            :key="index">
            {{ str }}
          </div>
      </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class MultiChoiceResult extends Vue {
  @Prop() data : any;
}
</script>
