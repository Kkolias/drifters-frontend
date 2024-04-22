import type { DriftSerie } from "~/enums/drift-serie.enum";
import type { IDriftEvent } from "./drift-event.interface";
import type { IDriver } from "./driver.interface";
import type { ILeaderboard } from "./leaderboard.interface";

export interface IDriftSeason {
  _id: string;
  serie: DriftSerie;
  year: number;
  name: string;
  driftEvents: IDriftEvent[];
  driversOfSeason: IDriver[];
  leaderboard: ILeaderboard;
  createdAt: string;
}
