import Vue from "vue";
import Vuex, { StoreOptions } from "vuex";
import VuexPersistence from "vuex-persist";
import { RootState, SurveyScoring } from "./types";
import {
  IQuestion,
  QuestionSelectBase,
  SurveyModel,
  IPanel,
  LocalizableString
} from "survey-vue";
import isEmpty from "lodash.isempty";
import * as resultsCalculationFile from "./survey-results.json"

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  reducer: (state: RootState) => ({
    toolData: state.toolData,
    currentPageNo: state.currentPageNo
  })
});

/**
 * Helper functions which determines which sections are enabled based on Survey Data
 * @param state
 * @param surveyData
 */
const determineSectionsEnabled = (state: RootState, surveyData: SurveyModel) => {
  // TODO: refactor later on to loop over array of question names for section enabling flags
  // sections zero and one are the only ones we have currently
  let sectionZeroEnabledFlag = surveyData.getValue("section_zero_enable");
  if(typeof sectionZeroEnabledFlag === "boolean"){
    state.sectionZeroEnabled = sectionZeroEnabledFlag;
  }
  else if(sectionZeroEnabledFlag === "false"){
    state.sectionZeroEnabled = false;
  }
  else state.sectionZeroEnabled = sectionZeroEnabledFlag === "true";

  let sectionOneEnabledFlag = surveyData.getValue("section_one_enable")
  if (typeof  sectionOneEnabledFlag === "boolean"){
    state.sectionOneEnabled = sectionOneEnabledFlag;
  }
  else if(sectionOneEnabledFlag === "false"){
    state.sectionOneEnabled = false;
  }
  else state.sectionOneEnabled = sectionOneEnabledFlag === "true"
}

/**
 * Helper function which will update the store's data based on survey data
 * @param state
 * @param surveyData
 */
const updateSurveyData = (state: RootState, surveyData: SurveyModel) => {
  determineSectionsEnabled(state, surveyData);
  state.surveyModel = surveyData;
  state.currentPageNo = surveyData.currentPageNo;
  //freeze this data so we can load from localStorage
  state.toolData = Object.freeze(surveyData.data);
  state.answerData = surveyData.getPlainData({
    includeEmpty: false
  });
}


const calculateScoreForQuestion = (
    currentSectionTotal: number,
    currentSectionScore: number,
    sectionName: string,
    questionName: string,
    questionValue: any,
    questionType: string,
    questionData?: any
):{
  sectionTotal: number,
  sectionScore: number
} => {
  let sectionScore = currentSectionScore
  let sectionTotal = currentSectionTotal

  // @ts-ignore
  let questionResultsObj = resultsCalculationFile["sections"][sectionName]
  if (typeof questionResultsObj !== "undefined"){
    questionResultsObj = questionResultsObj["questions"][questionName]
    if( typeof questionResultsObj !== "undefined"){
      let points = questionResultsObj.points
      let scoring = questionResultsObj.scoring

      /* boolean questions point calculation
      * 1 - Matches the value for the correctAnswer key if it exists in the scoring map
      * 2 - If the scoring map does not exist, assign full points if the answer is true
      * */
      if( questionType === "boolean"){
        sectionTotal += points
        if(scoring){
          if(scoring.correctAnswer && `${scoring.correctAnswer}` === `${questionValue}`){
            sectionScore += points
          }
        }
        else if ( `${questionValue}` === "true"){
          sectionScore += points
        }
      }

      /* rating question point calculation
      * 1 - If there is a scoring map
      *   a) If the inverse flag is specified as true
      *     * minimum will be awarded full points
      *     * maximum will be awarded no points
      *     * in between will be calculated as (rateMax - score)/rateMax * points
      * 2 - If there is no scoring map
      *   a) maximum will be awarded full points
      *   b) minimum will be awarded no points
      *   c) in between will be calculated as score/rateMax * points
      *
      * */
      else if (questionType === "rating"){
        if(typeof questionData !== "undefined"){
          let rateMin = questionData["rateMin"]
          let rateMax = questionData["rateMax"]
          if (typeof rateMin === "number" && typeof  rateMax === "number"){
            sectionTotal += points
            if(scoring){
              if(scoring.inverse === true){
                if (questionValue === rateMin){
                  sectionScore += points
                }
                else if (typeof questionValue === "string" && !isNaN(Number.parseInt(questionValue))){
                  sectionScore += (rateMax - Number.parseInt(questionValue))/rateMax * points
                }
              }
            }
            else if(questionValue === rateMax){
              sectionScore += points
            }
            else if (typeof questionValue === "string" && !isNaN(Number.parseInt(questionValue))){
              sectionScore += Number.parseInt(questionValue)/rateMax * points
            }
          }
          else{
            throw new Error(`rateMin and rateMax must be numbers provided in questionData to calculate score for question ${questionName}`)
          }
        }
        else{
          throw new Error(`rateMin and rateMax must be numbers provided in questionData to calculate score for question ${questionName}`)
        }
      }


      /* radiogroup question point calculation
      * !!! scoring section must be provided otherwise no point calculation will be awarded nor points added to the total !!!
      * 1) points will be multiplied by a percentage based on the answer selected
      * 2) if the answer does not exist in the scoring map then no points will be awarded
      */
      else if(questionType === "radiogroup"){
        if(typeof scoring !== "undefined"){
          sectionTotal += points
          if(typeof scoring[questionValue] === "number" && scoring[questionValue] <= 100 && scoring[questionValue] >= 0){
            sectionScore += points * (scoring[questionValue]/100)
          }
        }
      }

    }
    else{
      throw new Error(`question ${questionName} for section ${sectionName} does not exist in survey-results.json`)
    }
  }
  else{
    throw new Error(`section ${sectionName} does not exist in survey-results.json`)
  }
  return {
    sectionScore: sectionScore,
    sectionTotal: sectionTotal
  }
}

/**
 * Helper function that will calculate the result for the survey
 * @param state
 * @param surveyData
 */
const calculateSurveyResult = (state: RootState, surveyData: SurveyModel) => {
  const resultsMap = resultsCalculationFile
  let scoring: SurveyScoring = {}
  let surveyAnswersArray = surveyData.getPlainData({
    includeEmpty: true
  })

  if(state.sectionZeroEnabled){
    scoring = {
      sectionZeroScore: 0,
      sectionZeroTotal: 0
    }
  }

  if(state.sectionOneEnabled){
    scoring = {
      sectionOneScore: 0,
      sectionOneTotal: 0
    }
  }

  if(surveyAnswersArray.length === 0){
    state.scoring = scoring
  }
  else{
    // loop over each question, determine what section it belongs to
    // refer to the resultsMap to award points

    for (let i in surveyAnswersArray){
      let questionObj = surveyAnswersArray[i]
      let questionName = questionObj.name
      let questionValue = questionObj.value

      // section zero question
      if(
          questionName.startsWith("sectionZero") &&
          state.sectionZeroEnabled
      ){
        let newScores = calculateScoreForQuestion(
           // @ts-ignore
           scoring.sectionZeroTotal,
           scoring.sectionZeroScore,
           "sectionZero",
           questionName,
           questionValue,
           surveyData.getQuestionByName(questionName).getType(),
           surveyData.getQuestionByName(questionName)
         )
        scoring.sectionZeroScore = newScores.sectionScore
        scoring.sectionZeroTotal = newScores.sectionTotal

      }

      // section one question
      else if(
          questionName.startsWith("sectionOne") &&
          state.sectionOneEnabled
      ){
        let newScores = calculateScoreForQuestion(
            // @ts-ignore
            scoring.sectionOneTotal,
            scoring.sectionOneScore,
            "sectionOne",
            questionName,
            questionValue,
            surveyData.getQuestionByName(questionName).getType(),
            surveyData.getQuestionByName(questionName)
        )

        scoring.sectionOneScore = newScores.sectionScore
        scoring.sectionOneTotal = newScores.sectionTotal

      }
    }

    state.scoring = scoring
  }
}


const store: StoreOptions<RootState> = {
  plugins: [vuexLocal.plugin],
  state: {
    answerData: [],
    scoring: {},
    sectionZeroEnabled: false,
    sectionOneEnabled: false,
    sectionTwoEnabled: false,
    sectionThreeEnabled: false,
    sectionFourEnabled: false,
    surveyModel: undefined,
    toolData: undefined,
    currentPageNo: 0
  },
  mutations: {
    // mutation to reset the state when a user resets the survey
    resetSurvey(state: RootState) {
      state.answerData = [];
      state.surveyModel = undefined;
      state.currentPageNo = 0;
      state.toolData = {};
      state.scoring = {}
      state.sectionZeroEnabled = false
      state.sectionOneEnabled = false
      state.sectionTwoEnabled = false
      state.sectionThreeEnabled = false
      state.sectionFourEnabled = false
    },

    // update state with results from survey
    // every time a value has changed or survey completed
    updateSurveyData(state: RootState, result: SurveyModel) {
      updateSurveyData(state, result)
    },

    calculateResult(state: RootState, result: SurveyModel){
      updateSurveyData(state, result)
      calculateSurveyResult(state, result)

    }


  },
  getters: {
    inProgress: state => {
      return !isEmpty(state.toolData);
    }
  }
};

export default new Vuex.Store<RootState>(store);
