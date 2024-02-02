import type { IDriftEvent } from "~/interfaces/drift-event.interface";
import type { IDriftSeason } from "~/interfaces/drift-season.interface";

const DRIFT_EVENT_ENDPOINTS = {
  GET_ALL: "/drift-event/get-all",
  GET_BY_ID: "/drift-event/get-by-id",
  CREATE: "/drift-event/create-drift-event",
  ADD_DRIVER_TO_SEASON: "/drift-event/add-qualifying-to-drift-event",
};

export class DriftEventApi extends ApiUtil {
  async getAllDriftSeasons(): Promise<IDriftEvent[]> {
    try {
      const events = await this.get({ url: DRIFT_EVENT_ENDPOINTS.GET_ALL });

      return events;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getDriftSeasonById(id: string): Promise<IDriftEvent | null> {
    try {
      const event = await this.get({
        url: DRIFT_EVENT_ENDPOINTS.GET_BY_ID,
        query: { id },
      });

      return event;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

export default new DriftEventApi();
