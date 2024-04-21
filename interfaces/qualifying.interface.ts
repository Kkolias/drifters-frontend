import type { IDriftEvent } from "./drift-event.interface";
import type { IDriver } from "./driver.interface";

export interface IQualifyingRun {
  _id: string;
  line: number | null;
  angle: number | null;
  style: number | null;
}

export interface IQualifyingResultItem {
  _id: string;
  orderNumber: number;
  driver: IDriver | string;
  run1: IQualifyingRun | null;
  run2: IQualifyingRun | null;
  run1Points?: number;
  run2Points?: number;
  highestPoints?: number;
}

export interface IQualifying {
  _id: string;
  eventId: string;
  event?: IDriftEvent | null;
  resultList: IQualifyingResultItem[];
  date: string;
  createdAt: string;
}
