import type { DriftSerie } from "~/enums/drift-serie.enum";
import type {
  IDriftSeason,
  ISeasonAverageQualifyingResult,
} from "~/interfaces/drift-season.interface";

const DRIFT_SEASON_ENDPOINTS = {
  GET_ALL: "/drift-season/get-all",
  GET_ALL_LIGHT: "/drift-season/find-all-light",
  GET_ALL_BY_DRIVER_ID: "/drift-season/find-all-by-driver-id",
  GET_BY_ID: "/drift-season/get-by-id",
  GET_BY_SLUG: "/drift-season/get-by-slug",
  CREATE: "/drift-season/create-drift-season",
  ADD_DRIVER_TO_SEASON: "/drift-season/add-driver-to-season",
  ADD_MANY_DRIVERS_TO_SEASON: "/drift-season/add-many-drivers-to-season",
  ADD_LEADERBOARD_TO_SEASON: "/drift-season/add-leaderboard-to-season",
  ADD_EVENT_TO_SEASON: "/drift-season/add-event-to-season",
  SET_IS_FINISHED: "/drift-season/set-is-finished",
  GET_AVERAGE_QUALIFYING_RESULTS:
    "/drift-season/get-season-average-qualifying-results",
};

export class DriftSeasonApi extends ApiUtil {
  async getAllDriftSeasons(): Promise<IDriftSeason[]> {
    try {
      const seasons = await this.get({ url: DRIFT_SEASON_ENDPOINTS.GET_ALL });

      return seasons;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getAllLight(): Promise<IDriftSeason[]> {
    try {
      const seasons = await this.get({
        url: DRIFT_SEASON_ENDPOINTS.GET_ALL_LIGHT,
      });

      return seasons;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getAllByDriverId(id: string): Promise<IDriftSeason[]> {
    try {
      const seasons = await this.get({
        url: DRIFT_SEASON_ENDPOINTS.GET_ALL_BY_DRIVER_ID,
        query: { id },
      });

      return seasons;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getDriftSeasonById(id: string): Promise<IDriftSeason | null> {
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

  async getDriftSeasonBySlug(slug: string): Promise<IDriftSeason | null> {
    try {
      const season = await this.get({
        url: DRIFT_SEASON_ENDPOINTS.GET_BY_SLUG,
        query: { slug },
      });

      return season;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async createDriftSeason(payload: {
    serie: DriftSerie;
    name: string;
    slug: string;
    year: number;
  }): Promise<IDriftSeason | null> {
    try {
      const season = await this.post({
        url: DRIFT_SEASON_ENDPOINTS.CREATE,
        payload,
      });

      return season;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async updateSeasonIsFinished(
    seasonId: string,
    isFinished: boolean
  ): Promise<boolean> {
    try {
      const season = await this.post({
        url: DRIFT_SEASON_ENDPOINTS.SET_IS_FINISHED,
        payload: { seasonId, isFinished },
      });

      return season;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async getSeasonAverageQualifyingResults(
    seasonSlug: string
  ): Promise<ISeasonAverageQualifyingResult[]> {
    try {
      const results = await this.get({
        url: DRIFT_SEASON_ENDPOINTS.GET_AVERAGE_QUALIFYING_RESULTS,
        query: { seasonSlug },
      });

      return results;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  // async addDriverToDriftSeason(payload:
  //     { permitId: string, specie: string, weightInGrams: number }): Promise<IFishingPermit | null> {
  //     try {
  //         const permit = await this.post({ url: DRIFT_SEASON_ENDPOINTS.ADD_DRIVER_TO_SEASON, payload })

  //         return permit
  //     } catch (error) {
  //         console.error(error)
  //         return null
  //     }

  // }
}

export default new DriftSeasonApi();
