import { SurveyModel } from "survey-vue";

export interface RootState {
  answerData: any[];
  toolData: any;
  currentPageNo: number;
  result?: SurveyModel;
  questionNames: string[];
}
