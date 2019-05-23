import Vue from "vue";
import Vuex, { StoreOptions } from "vuex";
import { RootState } from "./types";
import { IQuestion, QuestionSelectBase, SurveyModel } from "survey-vue";

Vue.use(Vuex);

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

function getValue(val: any) {
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
    question.choices.forEach(item => {
      value = getValue(item.itemValue);
      if (max < value) {
        max = value;
      }
    });
  } else if (questionType == "checkbox") {
    question.choices.forEach(item => {
      value = getValue(item.itemValue);
      max += value;
    });
  }

  return max;
}

function calculateFinalScore(survey: SurveyModel): number[] {
  const valueNames = survey
    .getAllQuestions()
    .filter(question => {
      return hasScore(question);
    })
    .map(question => {
      return question.name;
    });

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

  valueNames.forEach(name => {
    var currentQuestion = survey.getQuestionByName(name);
    var currentQuestionType = getScoreType(currentQuestion);

    if (currentQuestionType === 2) {
      rawRiskScore += getValue(survey.data[name]);
      maxRawRiskScore += getMaxScoreForQuestion(<QuestionSelectBase>(
        currentQuestion
      ));
    } else if (currentQuestionType === 3) {
      mitigationScore += getValue(survey.data[name]);
      maxMitigationScore += getMaxScoreForQuestion(<QuestionSelectBase>(
        currentQuestion
      ));
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
  state: {
    plainData: [],
    result: undefined, 
    currentPageNo: 0,
    toolData: {},
  },
  mutations: {
    updateResult(state: RootState, result: SurveyModel) {
      state.result = result;
      state.currentPageNo = result.currentPageNo;
      state.toolData = result.data;
      state.plainData = result.getPlainData({
        includeEmpty: false
      });
    }
  },
  getters: {
    calcscore: state => {
      if (state.result === undefined) return [0, 0, 0];
      return calculateFinalScore(state.result);
    },
    resultDataSections: state => {
      if (state.result === undefined) return {};
      if (state.result.data === undefined) return {};
      var surveyResults = state.plainData;

      var projectResults: any[] = [];
      var riskResults: any[] = [];
      var mitigationResults: any[] = [];
      var mitigationResultsYes: any[] = [];

      surveyResults.forEach(function(result) {
        var question = state.result!.getQuestionByName(result.name);
        var scoreType = getScoreType(question);

        if (scoreType === 1 && question.parent.name === "panel-project-NS") {
          projectResults.push(result);
        } else if (scoreType === 2) {
          riskResults.push(result);
        } else if (scoreType === 3) {
          mitigationResults.push(result);
          if (result.value > 0) {
            mitigationResultsYes.push(result);
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
  }
};

export default new Vuex.Store<RootState>(store);
