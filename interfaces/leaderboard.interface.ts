import type { IDriver } from "./driver.interface";


export interface ScoreboardItem {
    _id: string;
    driver: string;
    score: number;
    numOfWins: number;
    numOfSeconds: number;
    numOfThirds: number;
  }
  
  export interface ILeaderboard {
    _id: string;
    seasonId: string;
    scoreboard: ScoreboardItem[];
    createdAt: string;
  }