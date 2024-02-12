import type { ICompetitionDay } from "~/interfaces/competition-day.interface";

const DRFIT_COMPETITION_DAY_ENDPOINTS = {
  GET_ALL: "/competition-day/get-all",
  GET_BY_ID: "/competition-day/get-by-id",
  CREATE: "/competition-day/create",
  CREATE_HEAT_TO_DAY: "/competition-day/create-heat-to-day",
  ADD_RUN_TO_HEAT: "/competition-day/add-run-to-heat",
  GIVE_JUDGE_POINTS: "/competition-day/give-judge-points",
};

export class CompetitionDayApi extends ApiUtil {
  async getAllCompetitionDays(): Promise<ICompetitionDay[]> {
    try {
      const seasons = await this.get({ url: DRFIT_COMPETITION_DAY_ENDPOINTS.GET_ALL });

      return seasons;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getCompetitionDayById(id: string): Promise<ICompetitionDay | null> {
    try {
      const season = await this.get({
        url: DRFIT_COMPETITION_DAY_ENDPOINTS.GET_BY_ID,
        query: { id },
      });

      return season;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async createCompetitionDay(eventId: string): Promise<ICompetitionDay | null> {
    try {
      const season = await this.post({
        url: DRFIT_COMPETITION_DAY_ENDPOINTS.CREATE,
        payload: { eventId },
      });

      return season;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

export default new CompetitionDayApi();
