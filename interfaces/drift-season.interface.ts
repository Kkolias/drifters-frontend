import type { DriftSerie } from "~/enums/drift-serie.enum";
import type { IDriftEvent } from "./drift-event.interface";
import type { IDriver } from "./driver.interface";
import type { ILeaderboard } from "./leaderboard.interface";

export interface IDriftSeason {
  _id: string;
  serie: DriftSerie;
  year: number;
  name: string;
  slug: string;
  driftEvents: IDriftEvent[];
  driversOfSeason: IDriver[];
  leaderboard: ILeaderboard;
  createdAt: string;
}

export interface IDriverSeasonStats {
  driverId: string;
  leaderboards: ILeaderboardWithSeasonInfo[];
}

interface IDriftSeasonInfo {
  _id: string;
  name: string;
  serie: DriftSerie;
  slug: string;
  year: number;
}

export interface ILeaderboardWithSeasonInfo extends ILeaderboard {
  seasonInfo: IDriftSeasonInfo | null;
}