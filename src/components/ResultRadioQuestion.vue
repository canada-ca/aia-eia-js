<template>
  <div class="form-group">
    <label>{{ questionName }}</label>
    <p>Value: {{ questionValue ? questionValue : "Not Answered" }}</p>
    <label
      v-for="choice in choices"
      :key="choice.value"
      class="radio-container"
    >
      {{ choice.text }}
      <input type="radio" :checked="choice.value === questionValue" disabled />
      <div class="radio-checkmark"></div>
    </label>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

interface QuestionChoices {
  value: string;
  text: string;
}

@Component
export default class ResultRadioQuestion extends Vue {
  @Prop() public questionId!: string;
  @Prop() public questionName!: string;
  @Prop() public questionValue!: string;
  @Prop() public questionDefinition!: any;

  get choices(): QuestionChoices[] {
    if (this.questionDefinition.hasOwnProperty("choices")) {
      return this.questionDefinition.choices;
    }

    return [];
  }
}
</script>

<style scoped>
/* The container */
.radio-container {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Hide the browser's default radio button */
.radio-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

/* Create a custom radio button */
.radio-checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: #eee;
  border-radius: 50%;
}

/* On mouse-over, add a grey background color */
.radio-container:hover input ~ .radio-checkmark {
  background-color: #ccc;
}

/* When the radio button is checked, add a blue background */
.radio-container input:checked ~ .radio-checkmark {
  background-color: #2196f3;
}

/* Create the indicator (the dot/circle - hidden when not checked) */
.radio-checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the indicator (dot/circle) when checked */
.radio-container input:checked ~ .radio-checkmark:after {
  display: block;
}

/* Style the indicator (dot/circle) */
.radio-container .radio-checkmark:after {
  top: 9px;
  left: 9px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
}
@media print {
  /* When the radio button is checked, add a blue background */

  .radio-checkmark {
    border: 1px solid black;
  }
  .radio-container input:checked ~ .radio-checkmark {
    box-shadow: 0 0 0 1000px #2196f3 inset !important;
  }
}
</style>
