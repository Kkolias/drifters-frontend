import type { ICompetitionDay } from "./competition-day.interface";
import type { IQualifying } from "./qualifying.interface";


export interface IDriftEvent {
    _id: string;
    seasonId: string;
    qualifying: IQualifying;
    competitionDay: ICompetitionDay
    createdAt: string;
  }