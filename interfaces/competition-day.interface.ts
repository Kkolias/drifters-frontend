import type { JudgePoint } from "~/enums/judge-point.enum";
import type { IDriver } from "./driver.interface";
import type { HeatType } from "~/enums/heat-type.enum";
import type { RunType } from "~/enums/run-type.enum";
import type { IDriftEvent } from "./drift-event.interface";


export interface IRunItem {
  leadDriverId: string;
  chaseDriverId: string;
}

export interface IRunPairItem {
  _id: string;
  type: RunType;
  runNumber: number;
  run1: IRunItem;
  run2: IRunItem;
  judgePoint1: JudgePoint | null;
  judgePoint2: JudgePoint | null;
  judgePoint3: JudgePoint | null;
}

export interface IHeat {
  _id: string;
  driver1: IDriver | string;
  driver2: IDriver | string;
  heatType: HeatType; // esim top32 top16 karsinnat
  bracketNumber: number; // vasen on 1-16 oikea 17-32 vasen 2 on 33-40 oikea 41-48 jne
  runList: IRunPairItem[];
}

export interface ICompetitionDay {
  _id: string;
  eventId: string;
  event?: IDriftEvent
  heatList: IHeat[];
  createdAt: string;
  date: string;
  scoreBoard?: IScoreBoardItem[]; // ScOrEbOaRd :D:D:D scoreboard*
}

export interface IScoreBoardItem {
  driver: IDriver | null;
  // points: number; // TODO
  placement: number;
}

export interface IRunPairOdds {
  driver1: number;
  driver2: number;
}