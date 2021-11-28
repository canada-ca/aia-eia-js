<template>
  <div>
    <div class="col-md-12">
      <strong v-if="locale == undefined">{{ data.title }}</strong>
      <strong v-if="locale !== undefined">{{ data.titleData[locale] }}</strong>
      <br />
      <div v-if="locale == undefined">
        <div>
          <strong v-if="$root.$i18n.locale == 'en'" class="label label-default"
            >{{ $t("englishContent") }} :
          </strong>
          <strong v-if="$root.$i18n.locale == 'fr'" class="label label-default"
            >{{ $t("frenchContent") }} :
          </strong>
          <p>
            <span style="white-space: pre">{{ data.displayValue }}</span>
          </p>
        </div>
        <div>
          <strong v-if="$root.$i18n.locale == 'en'" class="label label-default"
            >{{ $t("frenchContent") }} :
          </strong>
          <strong v-if="$root.$i18n.locale == 'fr'" class="label label-default"
            >{{ $t("englishContent") }} :
          </strong>
          <div>
            <textarea
              v-model="data.displayValueAlt"
              @blur="saveTranslation($event.target.value)"
            ></textarea>
          </div>
        </div>
      </div>
      <div v-if="locale !== undefined">
        <p v-if="locale == $root.$i18n.locale">
          <span style="white-space: pre">{{ data.displayValue }}</span>
        </p>
        <p v-if="locale != $root.$i18n.locale">
          <span style="white-space: pre">{{ data.displayValueAlt }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component
export default class TextResult extends Vue {
  @Prop() data: any;
  @Prop() locale: any;
  // displayValueAlt: string = "";
  // created() {
  //   let displayValueAlt: string = this.$store.getters.getTranslationsOnResult[this.data.name];
    // if(Object.keys(this.$store.getters.getTranslationsOnResult).length === 0 ||this.$store.getters.getTranslationsOnResult[this.dat.name]===undefined){
    //   this.$store.dispatch("saveTranslationsOnResult", {
    //     key: this.data.name,
    //     value: ""
    //   });
    // }
  // }
  saveTranslation(displayValueAlt: string) {
    this.$store.dispatch("saveTranslationsOnResult", {
      key: this.data.name,
      value: displayValueAlt
    });
  }
}
</script>
