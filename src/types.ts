import { SurveyModel } from "survey-vue";

export interface RootState {
  translationsOnResult: any;
  version: string;
  answerData: any[];
  toolData: any;
  currentPageNo: number;
  result?: SurveyModel;
  questionNames: string[];
  removeNext: boolean;
  removePrev: boolean;
}
