import type { IDriver } from "./driver.interface";


export interface ScoreboardItem {
    _id: string;
    driver: IDriver | string;
    score: number;
    numOfWins: number;
    numOfSeconds: number;
    numOfThirds: number;
    placement?: number
  }
  
  export interface ILeaderboard {
    _id: string;
    seasonId: string;
    scoreboard: ScoreboardItem[];
    createdAt: string;
  }