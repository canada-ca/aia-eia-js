import Vue from "vue";
import Vuex, { StoreOptions } from "vuex";
import VuexPersistence from "vuex-persist";
import { RootState } from "./types";
import {
  IQuestion,
  QuestionSelectBase,
  SurveyModel,
  ItemValue,
} from "survey-vue";
import isEmpty from "lodash.isempty";

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  reducer: (state: RootState) => ({
    toolData: state.toolData,
    currentPageNo: state.currentPageNo,
  }),
});

function addItemsInArray(val: any[]) {
  let total = 0;
  val.forEach((item) => {
    if (typeof item === "number") {
      total = total + item;
    } else if (typeof item === "string") {
      total = total + parseEmbeddedValue(item);
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
    // Check the suffix for "-RS" or "-MS" for valid score questions.
    return getScoreType(question) > 1;
  }
  return false;
}

function parseEmbeddedValue(val: String): number {
  const lastHyphenIdx = val.lastIndexOf("-");
  if (lastHyphenIdx !== -1) {
    // Suffix after last "-" could be a number.
    const possibleValue = val.substr(lastHyphenIdx + 1);
    const value = Number(possibleValue);
    return isNaN(value) ? 0 : value;
  }

  return 0;
}

export function getValue(val: any) {
  if (val === undefined) {
    return 0;
  }

  if (Array.isArray(val)) {
    return addItemsInArray(val);
  }

  if (typeof val === "string") {
    return parseEmbeddedValue(val);
  }

  if (typeof val !== "number") {
    return 0;
  }

  return val;
}

function getScoreTypeHelper(name: String): Number {
  // 1 - Not Scored, 2 - Raw Score, 3 - Mitigation Score
  if (name) {
    if (name.endsWith("-RS")) {
      return 2;
    } else if (name.endsWith("-MS")) {
      return 3;
    } else if (name.endsWith("-NS")) {
      return 1;
    }
  }

  return 0;
}

function getScoreType(question: IQuestion): Number {
  let result = getScoreTypeHelper(question.name);

  if (result > 0) {
    return result;
  }

  result = getScoreTypeHelper(question.parent.name);

  if (result == 0) {
    // Treat at no score.
    return 1;
  }

  return result;
}

function getMaxScoreForQuestion(question: QuestionSelectBase): number {
  const questionType = question.getType();
  let max = 0;
  let value = 0;
  if (questionType == "radiogroup" || questionType == "dropdown") {
    question.choices.forEach((item) => {
      value = getValue(item.itemValue);
      if (max < value) {
        max = value;
      }
    });
  } else if (questionType == "checkbox") {
    question.choices.forEach((item) => {
      value = getValue(item.itemValue);
      max += value;
    });
  }

  return max;
}

type LanguageString = {
  en: string;
  fr: string;
};

function getTitleFromPanel(panel: any): LanguageString {
  const retVal = {
    en: panel.locTitle.getLocaleText("default"),
    fr: panel.locTitle.getLocaleText("fr"),
  };
  return retVal;
}

function calculateFinalScore(
  survey: SurveyModel,
  questionNames: string[]
): number[] {
  let rawRiskScore = 0;
  let maxRawRiskScore = 0;
  let maxMitigationScore = 0;
  let mitigationScore = 0;
  let total = 0;
  const percentage = 0.8;
  const deduction = 0.15;
  let level = 0;
  const threshold1 = 0.25;
  const threshold2 = 0.5;
  const threshold3 = 0.75;

  questionNames.forEach((name) => {
    const currentQuestion = survey.getQuestionByName(name);
    const currentQuestionType = getScoreType(currentQuestion);

    if (currentQuestionType === 2) {
      // no real risk of injection since we are just getting a value, worst case it breaks our score
      // eslint-disable-next-line security/detect-object-injection
      rawRiskScore += getValue(survey.data[name]);
      maxRawRiskScore += getMaxScoreForQuestion(
        <QuestionSelectBase>currentQuestion
      );
    } else if (currentQuestionType === 3) {
      // no real risk of injection since we are just getting a value, worst case it breaks our score
      // eslint-disable-next-line security/detect-object-injection
      mitigationScore += getValue(survey.data[name]);
      maxMitigationScore += getMaxScoreForQuestion(
        <QuestionSelectBase>currentQuestion
      );
    }
  });

  //maxMitigationScore is divided by 2 because of Design/Implementation fork
  if (mitigationScore >= percentage * (maxMitigationScore / 2)) {
    total = Math.round((1 - deduction) * rawRiskScore);
  } else {
    total = rawRiskScore;
  }

  if (total <= maxRawRiskScore * threshold1) {
    level = 1;
  } else if (
    total > maxRawRiskScore * threshold1 &&
    total <= maxRawRiskScore * threshold2
  ) {
    level = 2;
  } else if (
    total > maxRawRiskScore * threshold2 &&
    total <= maxRawRiskScore * threshold3
  ) {
    level = 3;
  } else {
    level = 4;
  }

  return [rawRiskScore, mitigationScore, total, level];
}

const store: StoreOptions<RootState> = {
  plugins: [vuexLocal.plugin],
  state: {
    answerData: [],
    result: undefined,
    currentPageNo: 0,
    toolData: {},
    questionNames: [],
  },
  mutations: {
    resetSurvey(state: RootState) {
      state.answerData = [];
      state.result = undefined;
      state.currentPageNo = 0;
      state.toolData = {};
    },
    updateResult(state: RootState, result: SurveyModel) {
      state.result = result;
      state.currentPageNo = result.currentPageNo;
      //freeze this data so we can load from localStorage
      state.toolData = Object.freeze(result.data);
      state.answerData = result.getPlainData({
        includeEmpty: false,
      });

      if (state.questionNames.length === 0) {
        state.questionNames = result
          .getAllQuestions()
          .filter((question) => {
            return hasScore(question);
          })
          .map((question) => {
            return question.name;
          });
      }
    },
  },
  getters: {
    inProgress: (state) => {
      return !isEmpty(state.toolData);
    },
    calcScore: (state) => {
      if (state.result === undefined) return [0, 0, 0];
      return calculateFinalScore(state.result, state.questionNames);
    },
    resultDataSections: (state) => {
      if (state.result === undefined) return {};

      const projectResults: any[] = [];
      const riskResults: any[] = [];
      const mitigationResults: any[] = [];
      const mitigationResultsYes: any[] = [];
      let lastHeader = "";

      state.answerData.forEach(function (result) {
        const question = state.result!.getQuestionByName(result.name);
        const scoreType = getScoreType(question);

        //Calculate the section header.
        let questionHeader = { en: "", fr: "" };
        let questionSubHeader = { en: "", fr: "" };
        if (question.parent.constructor.name === "PanelModel") {
          if (question.parent.parent.constructor.name == "PageModel") {
            questionHeader = getTitleFromPanel(question.parent.parent);
            questionSubHeader = getTitleFromPanel(question.parent);
          }
        }

        let calculatedHeader = questionHeader.en;
        if (questionSubHeader.en != "") {
          calculatedHeader += " - " + questionSubHeader.en;
        }
        if (lastHeader != calculatedHeader) {
          result.questionHeader = questionHeader;

          if (questionSubHeader.en != "") {
            result.questionHeader.en += " - " + questionSubHeader.en;
            result.questionHeader.fr += " - " + questionSubHeader.fr;
          }

          lastHeader = calculatedHeader;
        }

        //Add Localized results.
        result.titleData = {
          en: question.locTitle.getLocaleText("default"),
          fr: question.locTitle.getLocaleText("fr"),
        };

        if (
          question.selectedItem !== undefined &&
          question.selectedItem !== null
        ) {
          if (
            question.selectedItem.locText !== undefined &&
            question.selectedItem.locText !== null
          ) {
            result.selectedItem = {
              en: question.selectedItem.locText.getLocaleText("default"),
              fr: question.selectedItem.locText.getLocaleText("fr"),
            };
          }
        }

        if (question.getChoices !== undefined) {
          const choices: Array<ItemValue> = question.getChoices();
          result.choiceData = [];

          for (const choice of choices) {
            result.choiceData.push({
              en: choice.locText.getLocaleText("default"),
              fr: choice.locText.getLocaleText("fr"),
            });
          }
        }

        //Profile Scores
        if (
          scoreType === 1 &&
          (question.parent.name === "projectDetailsPanel-NS" ||
            question.parent.name === "businessDriversPanel-NS" ||
            question.parent.name === "aboutSystemPanel-NS")
        ) {
          projectResults.push(result);
        } else if (scoreType === 2) {
          riskResults.push(result);
        } else if (scoreType === 3) {
          mitigationResults.push(result);
          if (result.value > 0) {
            mitigationResultsYes.push(result);
          }
          if (typeof result.value === "string") {
            const val = getValue(result.value);
            if (val > 0) {
              mitigationResultsYes.push(result);
            }
          }
        }
      });

      return [
        projectResults,
        riskResults,
        mitigationResults,
        mitigationResultsYes,
      ];
    },
  },
};

export default new Vuex.Store<RootState>(store);
