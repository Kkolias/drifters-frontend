import type { IDriver } from "./driver.interface";


export interface ScoreboardItem {
    _id: string;
    driver: IDriver | string;
    score: number;
    numOfWins: number;
    numOfSeconds: number;
    numOfThirds: number;
    placement?: number
    eventScores: IEventScoresItem[];
  }
  
  export interface ILeaderboard {
    _id: string;
    seasonId: string;
    scoreboard: ScoreboardItem[];
    createdAt: string;
  }

  export interface IEventScoresItem {
    eventId: string;
    scoreQualifying: number;
    scoreQualifyingShowdown: number | null;
    scoreBracket: number;
    cumulativeScore?: number;
    totalEventScore?: number;
  }