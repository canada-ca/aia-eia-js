import Vue from "vue";
import Vuex, { StoreOptions } from "vuex";
import { RootState } from "./types";
import { IQuestion, QuestionSelectBase, SurveyModel } from "survey-vue";

enum ScoreType {
  Not,
  Raw,
  Mitigation,
  Unknown
}

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
    const scoreType = getScoreType(question);
    return scoreType === ScoreType.Raw || scoreType === ScoreType.Mitigation;
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

function parseScoreType(name: String): ScoreType {
  // 1 - Not Scored, 2 - Raw Score, 3 - Mitigation Score
  if (name) {
    if (name.endsWith("-RS")) {
      return ScoreType.Raw;
    } else if (name.endsWith("-MS")) {
      return ScoreType.Mitigation;
    } else if (name.endsWith("-NS")) {
      return ScoreType.Not;
    }
  }

  return ScoreType.Unknown;
}

function getScoreType(question: IQuestion): ScoreType {
  let result = parseScoreType(question.name);

  if (result !== ScoreType.Unknown) {
    return result;
  }

  result = parseScoreType(question.parent.name);

  if (result == ScoreType.Unknown) {
    // Treat at no score.
    return ScoreType.Not;
  }

  return result;
}

function getMaxScoreForQuestion(question: QuestionSelectBase): number {
  const questionType = question.getType();

  if (
    questionType != "radiogroup" &&
    questionType != "dropdown" &&
    questionType != "checkbox"
  ) {
    return 0;
  }

  if (questionType == "checkbox") {
    let max = 0;
    let value = 0;
    question.choices.forEach(item => {
      value = getValue(item.itemValue);
      max += value;
    });
    return max;
  }
  //otherwise we have a radiogroup or a dropdown

  let max = 0;
  let value = 0;
  question.choices.forEach(item => {
    value = getValue(item.itemValue);
    if (max < value) {
      max = value;
    }
  });
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
  let maxMitigationScore = 0;
  let mitigationScore = 0;

  valueNames.forEach(name => {
    const currentQuestion = survey.getQuestionByName(name);
    const currentQuestionType = getScoreType(currentQuestion);

    if (currentQuestionType === ScoreType.Raw) {
      rawRiskScore += getValue(survey.data[name]);
    } else if (currentQuestionType === ScoreType.Mitigation) {
      mitigationScore += getValue(survey.data[name]);
      maxMitigationScore += getMaxScoreForQuestion(<QuestionSelectBase>(
        currentQuestion
      ));
    }
  });

  let total = 0;
  const percentage = 0.8;
  const deduction = 10;
  if (mitigationScore >= percentage * maxMitigationScore) {
    total = rawRiskScore - deduction;
  } else {
    total = rawRiskScore;
  }

  let level = 0;
  if (total <= 18) {
    level = 1;
  } else if (total > 18 && total <= 36) {
    level = 2;
  } else if (total > 36 && total <= 54) {
    level = 3;
  } else {
    level = 4;
  }

  return [rawRiskScore, mitigationScore, total, level];
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
      if (state.result === undefined) return [0, 0, 0];
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
    },
    resultDataSections: state => {
      if (state.result === undefined) return {};
      if (state.result.data === undefined) return {};

      const surveyResults = state.result.getPlainData({
        includeEmpty: false
      });

      const projectResults: any[] = [];
      const riskResults: any[] = [];
      const mitigationResults: any[] = [];
      const mitigationResultsYes: any[] = [];

      surveyResults.forEach(function(result) {
        const question = state.result!.getQuestionByName(result.name);
        const scoreType = getScoreType(question);

        if (
          scoreType === ScoreType.Not &&
          question.parent.name === "panel-project-NS"
        ) {
          projectResults.push(result);
        } else if (scoreType === ScoreType.Raw) {
          riskResults.push(result);
        } else if (scoreType === ScoreType.Mitigation) {
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
