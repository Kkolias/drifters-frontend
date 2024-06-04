import type { JudgePoint } from "~/enums/judge-point.enum";
import type { RunType } from "~/enums/run-type.enum";
import type { IDriver } from "./driver.interface";
import type { IDriftEvent } from "./drift-event.interface";
import type { IScoreBoardItem } from "./competition-day.interface";

export enum ShowDownHeatType {
  Top2 = "Top2",
  Top4 = "Top4",
}

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

export interface IShowdownHeat {
  _id: string;
  driver1: string | IDriver;
  driver2: string | IDriver;
  heatType: ShowDownHeatType;
  bracketNumber: number; // 1 tai 2
  runList: IRunPairItem[];
  winner?: string | IDriver | null;
}

export interface IQualifyingShowdownItem {
  _id: string;
  eventId: string;
  event?: IDriftEvent | null;
  heatList: IShowdownHeat[];
  date: Date | null;
  createdAt: Date;
  scoreBoard?: IScoreBoardItem[];
}



