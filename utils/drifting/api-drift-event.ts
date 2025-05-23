import type { IDriftEvent } from "~/interfaces/drift-event.interface";
import type { IDriftSeason } from "~/interfaces/drift-season.interface";

const DRIFT_EVENT_ENDPOINTS = {
  GET_ALL: "/drift-event/get-all",
  GET_BY_ID: "/drift-event/get-by-id",
  GET_BY_SLUG: "/drift-event/get-by-slug",
  CREATE: "/drift-event/create-drift-event",
  UPDATE: "/drift-event/update-drift-event",
  ADD_DRIVER_TO_SEASON: "/drift-event/add-qualifying-to-drift-event",
  HANDLE_QUALIFYING_SCORING: "/drift-event/handle-qualifying-scoring",
  HANDLE_COMPETITION_DAY_SCORING: "/drift-event/handle-competition-day-scoring",
  SET_IS_FINISHED: "/drift-event/set-is-finished",
  ADD_DAY_SCHEDULE: "/drift-event/add-day-schedule",
  SET_LIVE_UPDATES: "/drift-event/set-live-updates",
  UPDATE_IS_CANCELLED: "/drift-event/update-is-cancelled",
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
    slug: string;
    isFinished: boolean;
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

  async updateDriftEvent(
    payload: Partial<IDriftEvent>
  ): Promise<IDriftEvent | null> {
    try {
      const event = await this.post({
        url: DRIFT_EVENT_ENDPOINTS.UPDATE,
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

  async updateEventIsFinished(
    eventId: string,
    isFinished: boolean
  ): Promise<boolean> {
    try {
      const event = await this.post({
        url: DRIFT_EVENT_ENDPOINTS.SET_IS_FINISHED,
        payload: { eventId, isFinished },
      });

      return event;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async addDaySchedule(
    eventId: string,
    daySchedules: any
  ): Promise<IDriftEvent | null> {
    try {
      const event = await this.post({
        url: DRIFT_EVENT_ENDPOINTS.ADD_DAY_SCHEDULE,
        payload: {
          eventId,
          daySchedules,
        },
      });

      return event;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async setLiveUpdates(
    eventId: string,
    liveUpdates: boolean
  ): Promise<boolean> {
    try {
      const r = await this.post({
        url: DRIFT_EVENT_ENDPOINTS.SET_LIVE_UPDATES,
        payload: {
          eventId,
          liveUpdates,
        },
      });

      return r;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async updateIsCancelled(
    eventId: string,
    isCancelled: boolean
  ): Promise<boolean> {
    try {
      const r = await this.post({
        url: DRIFT_EVENT_ENDPOINTS.UPDATE_IS_CANCELLED,
        payload: {
          eventId,
          isCancelled,
        },
      });

      return r;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}

export default new DriftEventApi();
