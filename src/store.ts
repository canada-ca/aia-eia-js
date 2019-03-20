import Vue from "vue";
import Vuex, { StoreOptions } from "vuex";
import { RootState } from "./types";
import { IQuestion, SurveyModel, PageModel, Survey } from "survey-vue";

Vue.use(Vuex);

function hasScore(question: IQuestion): boolean {
  if (
    question.getType() === "radiogroup" ||
    question.getType() === "dropdown"
  ) {
    return true;
  }

  return false;
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
    if (survey.data[name] === undefined) {
      return total;
    }
    total = total + survey.data[name];
  });

  return total;
}

const store: StoreOptions<RootState> = {
  state: {
    score: 1,
    result: undefined
  },
  mutations: {
    updateResult(state: RootState, result: SurveyModel) {
      state.result = result;
    }
  },
  getters: {
    calcscore: state => {
      if (state.result === undefined) {
        return 0;
      }
      return calculateFinalScore(state.result);
    },
    toolData: state => {
      if (state.result === undefined) {
        return {};
      }
      return state.result.data;
    }
  }
};

export default new Vuex.Store<RootState>(store);
