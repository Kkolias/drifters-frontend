import type { ILeaderboard } from "~/interfaces/leaderboard.interface";

const DRFIT_LEADERBOARD_ENDPOINTS = {
  GET_ALL: "/leaderboard/get-all",
  GET_BY_ID: "/leaderboard/get-by-id",
  CREATE: "/leaderboard/create",
  ADD_DRIVER: "/leaderboard/add-driver",
};

export class CompetitionDayApi extends ApiUtil {
  async getAllCompetitionDays(): Promise<ILeaderboard[]> {
    try {
      const seasons = await this.get({
        url: DRFIT_LEADERBOARD_ENDPOINTS.GET_ALL,
      });

      return seasons;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getLeaderboardById(id: string): Promise<ILeaderboard | null> {
    try {
      const season = await this.get({
        url: DRFIT_LEADERBOARD_ENDPOINTS.GET_BY_ID,
        query: { id },
      });

      return season;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async createLeaderboard(seasonId: string): Promise<ILeaderboard | null> {
    try {
      const season = await this.post({
        url: DRFIT_LEADERBOARD_ENDPOINTS.CREATE,
        payload: { seasonId },
      });

      return season;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  async addDriverToLeaderboard(payload: {
    driverId: string;
    leaderboardId: string;
    score: number;
    numOfWins: number;
    numOfSeconds: number;
    numOfThirds: number;
  }): Promise<ILeaderboard | null> {
    try {
      const season = await this.post({
        url: DRFIT_LEADERBOARD_ENDPOINTS.CREATE,
        payload,
      });

      return season;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

export default new CompetitionDayApi();
