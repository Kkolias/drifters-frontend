import type { ICompetitionDay } from "./competition-day.interface";
import type { IQualifyingShowdownItem } from "./qualifying-showdown.interface";
import type { IQualifying } from "./qualifying.interface";

export interface IDriftEvent {
  _id: string;
  name: string;
  slug: string;
  country: string;
  city: string;
  track: string;
  startsAt: string;
  endsAt: string;
  seasonId: string;
  qualifying: IQualifying;
  qualifyingShowdown: IQualifyingShowdownItem;
  competitionDay: ICompetitionDay;
  isFinished: boolean;
  createdAt: string;
  timetable: IDayScheduleSchema[];
  liveUpdates: boolean
}

export interface ITimetableEntrySchema {
  _id?: string;
  timeUTC: string;
  name: {
    en: string;
    fi: string;
  };
}

export interface IDayScheduleSchema {
  _id?: string;
  date: string;
  entries: ITimetableEntrySchema[];
}
