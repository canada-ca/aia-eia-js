import { SurveyModel } from "survey-vue";

export interface SurveyScoring {
  sectionZeroScore?: number;
  sectionZeroTotal?: number;
  sectionOneScore?: number;
  sectionOneTotal?: number;
}

export interface RootState {
  sectionZeroEnabled: boolean;
  sectionOneEnabled: boolean;
  sectionTwoEnabled: boolean;
  sectionThreeEnabled: boolean;
  sectionFourEnabled: boolean;
  answerData: any[];
  scoring: SurveyScoring;
  surveyModel?: SurveyModel;
  toolData: any;
  currentPageNo: number;
}

export interface ResultsData {
  scoring: SurveyScoring;
  sectionsEnabled: any;
  data: any;
}
