<template>
  <div></div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
@Component({
  components: {
    Recommendations
  }
})
export default class Recommendations extends Vue {
  @Prop() public recommendation!: string;
}
</script>
