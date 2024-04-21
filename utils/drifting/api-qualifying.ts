import type {
  IQualifying,
  IQualifyingRun,
} from "~/interfaces/qualifying.interface";

const DRIFT_SEASON_ENDPOINTS = {
  GET_ALL: "/qualifying/get-all",
  GET_BY_ID: "/qualifying/get-by-id",
  CREATE: "/qualifying/create",
  CREATE_RESULT_ITEM: "/qualifying/create-result-item",
  CREATE_RESULT_ITEM_LIST: "/qualifying/create-result-item-list",
  ADD_RUN_TO_RESULT: "/qualifying/add-run-to-result",
  DELETE_RESULTS: "/qualifying/delete-results-by-driver-ids",
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

  async createQualifying(eventId: string, date: string): Promise<IQualifying | null> {
    try {
      const season = await this.post({
        url: DRIFT_SEASON_ENDPOINTS.CREATE,
        payload: { eventId, date },
      });

      return season;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async createResultItemListToQualifying(
    qualifyingId: string,
    driverList: { id: string; orderNumber: number }[]
  ): Promise<IQualifying | null> {
    try {
      const season = await this.post({
        url: DRIFT_SEASON_ENDPOINTS.CREATE_RESULT_ITEM_LIST,
        payload: { qualifyingId, driverList },
      });

      return season;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async updateQualifyingRuns(
    qualifyingId: string,
    resultItemId: string,
    runs: {
      run1?: IQualifyingRun;
      run2?: IQualifyingRun;
    }
  ): Promise<IQualifying | null> {
    try {
      const qualifying = await this.post({
        url: DRIFT_SEASON_ENDPOINTS.ADD_RUN_TO_RESULT,
        payload: { qualifyingId, resultItemId, runs },
      });

      return qualifying;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async deleteResultsByDriverIds(
    qualifyingId: string,
    driverIdList: string[]
  ): Promise<IQualifying | null> {
    try {
      const qualifying = await this.post({
        url: DRIFT_SEASON_ENDPOINTS.DELETE_RESULTS,
        payload: { qualifyingId, driverIdList },
      });

      return qualifying;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

export default new QualifyingApi();
