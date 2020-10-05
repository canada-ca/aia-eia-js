import { SurveyModel } from "survey-vue";

export interface RootState {
  version: string;
  answerData: any[];
  toolData: any;
  currentPageNo: number;
  result?: SurveyModel;
  questionNames: string[];
  removeNext: boolean;
}
