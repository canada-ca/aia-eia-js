<!-- on the results page, used to output the requirements with multiple elements as list items.
     For example, for the peer review, they can consult a federal expert, a corporation, a university, etc.

     To do this, the text attribute uses \n characters as markers. If none are present, the text
     is outputted as-is. The list elements are reach separated by \n, and the list starts after \n\n.

     Using the example above, the input could be 
     "Consulting the appropriate experts, which can include:\n\nA federal expert\nA corporation\nA university"

     which would be outputted as
          Consulting the appropriate experts, which can include:
          * A federal expert
          * A corporation
          * A university
      
      If you only want simple paragraphs, simply separate them with \n, without \n\n (marker for list).
      You can include multiple paragraph/list groups by separating them with \n\n\n.
-->

<template>
  <div>
    <div v-for="(section, index) in sections" :key="index">
      <p v-html="section.title"></p>
      <div v-if="section.list.length > 1">
        <ul>
          <li
            v-for="(item, index) in section.list"
            :key="index"
            v-html="item"
          ></li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

interface Section {
  title: String;
  list: string[];
}

@Component
export default class ListItem extends Vue {
  @Prop() text!: string;
  private sections: Section[] = [];
  mounted() {
    if (this.text.indexOf("\n") < 0) {
      this.sections.push({ title: this.text, list: [] });
    } else {
      for (let s of this.text.split("\n\n\n")) {
        if (s.indexOf("\n\n") < 0) {
          // only basic paragraphs, no list...
          for (let p of s.split("\n")) {
            this.sections.push({ title: p, list: [] });
          }
        } else {
          let t = s.split("\n\n")[0];
          let l = s.split("\n\n")[1].split("\n");
          this.sections.push({ title: t, list: l });
        }
      }
    }
  }
}
</script>
