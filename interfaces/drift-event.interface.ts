import type { ICompetitionDay } from "./competition-day.interface";
import type { IQualifyingShowdownItem } from "./qualifying-showdown.interface";
import type { IQualifying } from "./qualifying.interface";


export interface IDriftEvent {
    _id: string;
    name: string;
    country: string;
    city: string;
    track: string
    startsAt: string;
    endsAt: string;
    seasonId: string;
    qualifying: IQualifying;
    qualifyingShowdown: IQualifyingShowdownItem
    competitionDay: ICompetitionDay
    createdAt: string;
  }