<template>
  <button @click="onClick" class="Button">
    <slot>{{ $t("Print")}}</slot>
  </button>
</template>

<script lang="ts">
import Vue from "vue";
import print from "@/plugins/PrintButton.vue";
export default Vue.extend({
  props: {
    onClick: {
      type: Function,
      required: true
    }
  }
});
</script>
