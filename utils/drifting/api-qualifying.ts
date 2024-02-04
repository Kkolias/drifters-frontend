import type { IQualifying } from "~/interfaces/qualifying.interface";

const DRIFT_SEASON_ENDPOINTS = {
  GET_ALL: "/qualifying/get-all",
  GET_BY_ID: "/qualifying/get-by-id",
  CREATE: "/qualifying/create",
  CREATE_RESULT_ITEM: "/qualifying/create-result-item",
  ADD_RUN_TO_RESULT: "/qualifying/add-run-to-result",
};

export class QualifyingApi extends ApiUtil {
  async getAllQualifyings(): Promise<IQualifying[]> {
    try {
      const seasons = await this.get({ url: DRIFT_SEASON_ENDPOINTS.GET_ALL });

      return seasons;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getQualifyingById(id: string): Promise<IQualifying | null> {
    try {
      const season = await this.get({
        url: DRIFT_SEASON_ENDPOINTS.GET_BY_ID,
        query: { id },
      });

      return season;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async createQualifying(eventId: string): Promise<IQualifying | null> {
    try {
      const season = await this.post({
        url: DRIFT_SEASON_ENDPOINTS.CREATE,
        payload: { eventId },
      });

      return season;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

export default new QualifyingApi();
