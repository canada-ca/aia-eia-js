import Vue from "vue";
import Vuex, { StoreOptions } from "vuex";
import VuexPersistence from "vuex-persist";
import { RootState } from "./types";
import {
  IQuestion,
  QuestionSelectBase,
  SurveyModel,
  IPanel,
  LocalizableString
} from "survey-vue";
import isEmpty from "lodash.isempty";

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  reducer: (state: RootState) => ({
    toolData: state.toolData,
    translationsOnResult: state.translationsOnResult,
    currentPageNo: state.currentPageNo
  })
});

function addItemsInArray(val: any[]) {
  let total = 0;
  val.forEach(item => {
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
  var lastHyphenIdx = val.lastIndexOf("-");
  if (lastHyphenIdx !== -1) {
    // Suffix after last "-" could be a number.
    var possibleValue = val.substr(lastHyphenIdx + 1);
    var value = Number(possibleValue);
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
  var result = getScoreTypeHelper(question.name);

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
  var questionType = question.getType();
  var max = 0;
  var value = 0;
  if (questionType == "radiogroup" || questionType == "dropdown") {
    question.choices.forEach((item: { itemValue: any; }) => {
      value = getValue(item.itemValue);
      if (max < value) {
        max = value;
      }
    });
  } else if (questionType == "checkbox") {
    question.choices.forEach((item: { itemValue: any; }) => {
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
  var retVal = {
    en: panel.locTitle.getLocaleText("default"),
    fr: panel.locTitle.getLocaleText("fr")
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
  let percentage = 0.8;
  let deduction = 0.15;
  let level = 0;
  let threshold1 = 0.25;
  let threshold2 = 0.5;
  let threshold3 = 0.75;

  questionNames.forEach(name => {
    var currentQuestion = survey.getQuestionByName(name);
    var currentQuestionType = getScoreType(currentQuestion);

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

function calculateSectionScore(
  survey: SurveyModel,
  questionNames: string[],
  section: string
): number[] {
  let projectScore = 0;
  let maximumScore = 0;
  let noOfQuesions = 0;

  let questionNamesBySection = questionNames.filter(name =>
    name.includes(section)
  );
  noOfQuesions = questionNamesBySection.length;
  questionNamesBySection.forEach(name => {
    var currentQuestion = survey.getQuestionByName(name);
    // eslint-disable-next-line security/detect-object-injection
    projectScore += getValue(survey.data[name]);
    maximumScore += getMaxScoreForQuestion(<QuestionSelectBase>currentQuestion);
  });

  return [noOfQuesions, projectScore, maximumScore];
}

//Toggles wheather the next button appears based on if it is located on the last page
function toggleButton(state: RootState): void {
  //When I do not include the btn class it prevents from the next button same for prev button from showing
  var noNextBtnClassIncluded = " sv_next_btn btn-primary";
  var nextButstr = "btn sv_next_btn btn-primary";
  var noPrevBtnClassIncluded = " sv_prev_btn btn-primary";
  var prevButstr = "btn sv_prev_btn btn-primary";
  var nextButton, prevButton;
  const MAX = 12;
  const FIRSTPAGE = 0;

  //Used to check if the next button and prev button is removed and directes to the proper classname that is shown currently on the DOM
  if (state.removeNext) {
    nextButton = document.getElementsByClassName(noNextBtnClassIncluded)[0];
  } else {
    nextButton = document.getElementsByClassName(nextButstr)[0];
  }

  if (nextButton != undefined) {
    // eslint-disable-next-line prettier/prettier
    //Checks to see if its on the last page, if so get rid of the next button by re-assigning classname.

    if (state.currentPageNo == MAX) {
      nextButton.setAttribute("class", noNextBtnClassIncluded);
      state.removeNext = true;
    } else {
      nextButton.setAttribute("class", nextButstr);
      state.removeNext = false;
    }
  }

  if (state.removePrev) {
    prevButton = document.getElementsByClassName(noPrevBtnClassIncluded)[0];
  } else {
    prevButton = document.getElementsByClassName(prevButstr)[0];
  }

  if (prevButton != undefined) {
    // eslint-disable-next-line prettier/prettier
    //Checks to see if the previous button is on the first page, if so get rid of the next previous by re-assigning classname.
    if (state.currentPageNo == FIRSTPAGE) {
      prevButton.setAttribute("class", noPrevBtnClassIncluded);
      state.removePrev = true;
    } else {
      prevButton.setAttribute("class", prevButstr);
      state.removePrev = false;
    }
  }
}

const store: StoreOptions<RootState> = {
  plugins: [vuexLocal.plugin],
  state: {
    //Added version variable to keep track of current version
    version: "v0.9.1",
    answerData: [],
    result: undefined,
    currentPageNo: 0,
    toolData: {},
    translationsOnResult: {},
    questionNames: [],
    removeNext: false,
    removePrev: false
  },
  mutations: {
    resetSurvey(state: RootState) {
      state.answerData = [];
      state.result = undefined;
      state.currentPageNo = 0;
      state.toolData = {};
      state.translationsOnResult = {};
      state.removeNext = false;
      state.removePrev = false;
    },
    updateResult(state: RootState, result: SurveyModel ) {
      //When it reaches the last page it will get rid of the button or add it back if the user decides to go back
      state.result = result;
      state.currentPageNo = result.currentPageNo;
      //freeze this data so we can load from localStorage
      state.toolData = Object.freeze(result.data);
      var resultData:any = result;
      state.translationsOnResult =
      resultData.translationsOnResult === undefined
          ? {}
          : resultData.translationsOnResult;
      state.answerData = result.getPlainData({
        includeEmpty: false
      });

      if (state.questionNames.length === 0) {
        state.questionNames = result
          .getAllQuestions()
          .filter(question => {
            return hasScore(question);
          })
          .map(question => {
            return question.name;
          });
      }
      toggleButton(state);
    },
    setTranslationsOnResult(state: RootState, { key, value }) {
      Vue.set(state.translationsOnResult, key, value);
    }
  },
  getters: {
    inProgress: state => {
      return !isEmpty(state.toolData);
    },
    calcScore: state => {
      if (state.result === undefined) return [0, 0, 0];
      return calculateFinalScore(state.result, state.questionNames);
    },
    getScoreBySection: state => (section: string) => {
      if (state.result === undefined) {
        return [0, 0, 0];
      }
      return calculateSectionScore(state.result, state.questionNames, section);
    },
    getTranslationsOnResult: state => {
      return state.translationsOnResult;
    },
    resultDataSections: state => {
      if (state.result === undefined) return {};

      var projectResults: any[] = [];
      var riskResults: any[] = [];
      var mitigationResults: any[] = [];
      var mitigationResultsYes: any[] = [];
      var lastHeader = "";

      state.answerData.forEach(function(result) {
        var question:any = state.result!.getQuestionByName(result.name);
        const scoreType = getScoreType(question);

        //Calculate the section header.
        var questionHeader = { en: "", fr: "" };
        var questionSubHeader = { en: "", fr: "" };
        if (question.parent.isPanel) {
          var panel = question.parent;
          if (panel.parent.isPage) {
            questionHeader = getTitleFromPanel(panel.parent);
            questionSubHeader = getTitleFromPanel(panel);
          }
        }

        var calculatedHeader = questionHeader.en;
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
          fr: question.locTitle.getLocaleText("fr")
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
              fr: question.selectedItem.locText.getLocaleText("fr")
            };
          }
        }

        if (question.getChoices !== undefined) {
          var choices = question.getChoices();
          result.choiceData = [];

          for (var i = 0; i < choices.length; i++) {
            result.choiceData.push({
              /* eslint-disable security/detect-object-injection */
              en: choices[i].locText.getLocaleText("default"),
              fr: choices[i].locText.getLocaleText("fr")
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
        mitigationResultsYes
      ];
    }
  },
  actions: {
    saveTranslationsOnResult(context, { key, value }) {
      context.commit("setTranslationsOnResult", { key, value });
    }
  }
};

export default new Vuex.Store<RootState>(store);
