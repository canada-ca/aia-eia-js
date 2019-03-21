import Vue from "vue";
import Vuex, { StoreOptions } from "vuex";
import { RootState } from "./types";
import { IQuestion, SurveyModel, PageModel, Survey } from "survey-vue";

Vue.use(Vuex);

function addItemsInArray(val: any[]) {
  let total = 0;
  val.forEach(item => {
    if (typeof item === "number") {
      total = total + item;
    }
  });
  return total;
}
function hasScore(question: IQuestion): boolean {
  if (
    question.getType() === "radiogroup" ||
    question.getType() === "checkbox" ||
    question.getType() === "dropdown"
  ) {
    return true;
  }
  return false;
}

function getValue(val: any) {
  if (val === undefined) {
    return 0;
  }

  if (Array.isArray(val)) {
    return addItemsInArray(val);
  }

  return val;
}

function calculateFinalScore(survey: SurveyModel): number {
  const valueNames = survey
    .getAllQuestions()
    .filter(question => {
      return hasScore(question);
    })
    .map(question => {
      return question.name;
    });

  let total = 0;

  valueNames.forEach(name => {
    total = total + getValue(survey.data[name]);
  });

  return total;
}

const store: StoreOptions<RootState> = {
  state: {
    result: undefined
  },
  mutations: {
    updateResult(state: RootState, result: SurveyModel) {
      state.result = result;
    }
  },
  getters: {
    calcscore: state => {
      if (state.result === undefined) return 0;
      return calculateFinalScore(state.result);
    },
    toolData: state => {
      if (state.result === undefined) return {};
      return state.result.data;
    },
    plainData: state => {
      if (state.result === undefined) return {};
      if (state.result.data === undefined) return {};
      return state.result.getPlainData({
        includeEmpty: false
      });
    }
  }
};

export default new Vuex.Store<RootState>(store);
