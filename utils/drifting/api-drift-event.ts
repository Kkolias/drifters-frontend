import type { IDriftEvent } from "~/interfaces/drift-event.interface";
import type { IDriftSeason } from "~/interfaces/drift-season.interface";

const DRIFT_EVENT_ENDPOINTS = {
  GET_ALL: "/drift-event/get-all",
  GET_BY_ID: "/drift-event/get-by-id",
  GET_BY_SLUG: "/drift-event/get-by-slug",
  CREATE: "/drift-event/create-drift-event",
  ADD_DRIVER_TO_SEASON: "/drift-event/add-qualifying-to-drift-event",
  HANDLE_QUALIFYING_SCORING: "/drift-event/handle-qualifying-scoring",
  HANDLE_COMPETITION_DAY_SCORING: "/drift-event/handle-competition-day-scoring",
};

export class DriftEventApi extends ApiUtil {
  async getAllDriftEvents(): Promise<IDriftEvent[]> {
    try {
      const events = await this.get({ url: DRIFT_EVENT_ENDPOINTS.GET_ALL });

      return events;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getDriftEventById(id: string): Promise<IDriftEvent | null> {
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

  async getDriftEventBySlug(slug: string): Promise<IDriftEvent | null> {
    try {
      const event = await this.get({
        url: DRIFT_EVENT_ENDPOINTS.GET_BY_SLUG,
        query: { slug },
      });

      return event;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async createDriftEvent(payload: {
    country: string;
    city: string;
    track: string;
    name: string;
    startsAt: string;
    endsAt: string;
    seasonId: string;
    slug: string
  }): Promise<IDriftEvent | null> {
    try {
      const event = await this.post({
        url: DRIFT_EVENT_ENDPOINTS.CREATE,
        payload,
      });

      return event;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async handleQualifyingScoring(eventId: string): Promise<IDriftEvent | null> {
    try {
      const event = await this.post({
        url: DRIFT_EVENT_ENDPOINTS.HANDLE_QUALIFYING_SCORING,
        payload: { eventId },
      });

      return event;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async handleCompetitionDayScoring(
    eventId: string
  ): Promise<IDriftEvent | null> {
    try {
      const event = await this.post({
        url: DRIFT_EVENT_ENDPOINTS.HANDLE_COMPETITION_DAY_SCORING,
        payload: { eventId },
      });

      return event;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

export default new DriftEventApi();
