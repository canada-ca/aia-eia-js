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
          <p>{{ data.displayValue }}</p>
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
              aria-label="value"
              v-model="data.displayValueAlt"
            ></textarea>
          </div>
        </div>
      </div>
      <div v-if="locale !== undefined">
        <p v-if="locale == $root.$i18n.locale">
          {{ data.displayValue }}
        </p>
        <p v-if="locale != $root.$i18n.locale">
          {{ data.displayValueAlt }}
        </p>
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
}
</script>
