<template>
  <div>
    <div class="col-md-12">
      <strong v-if="locale == undefined">{{ num + ". " + data.title }}</strong>
      <strong v-if="locale !== undefined">{{
        num + ". " + data.titleData[locale]
      }}</strong>
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
            <span style="white-space: pre-wrap">{{ data.displayValue }}</span>
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
              :value="this.$store.getters.getTranslationsOnResult[this.data.name]"
              @blur="saveTranslation($event.target.value)"
            ></textarea>
          </div>
        </div>
      </div>
      <div v-if="locale !== undefined">
        <div v-if="locale == $root.$i18n.locale" class="valueResultPDF">
          <span style="white-space: pre-wrap">{{ data.displayValue }}</span>
        </div>
        <div v-if="locale != $root.$i18n.locale" class="valueResultPDF">
          <span style="white-space: pre-wrap">{{ this.$store.getters.getTranslationsOnResult[this.data.name] }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class TextResult extends Vue {
  @Prop() data: any;
  @Prop() locale: any;
  @Prop() num!: number;
  saveTranslation(displayValueAlt: string) {
    this.$store.dispatch("saveTranslationsOnResult", {
      key: this.data.name,
      value: displayValueAlt
    });
  }
}
</script>
