import type { IDriverSeasonStats } from "~/interfaces/drift-season.interface";
import type { IDriver, ICar } from "~/interfaces/driver.interface";

const DRIFT_DRIVER = {
  GET_ALL: "/driver/get-all",
  GET_BY_ID: "/driver/get-by-id",
  GET_BY_NAME: "/driver/get-by-name",
  GET_DRIVER_STATS: "/driver/get-driver-stats",
  CREATE: "/driver/create",
  ADD_CAR: "/driver/add-car",
};

export class DriftDriversApi extends ApiUtil {
  async getAllDrivers(): Promise<IDriver[]> {
    try {
      const drivers = await this.get({ url: DRIFT_DRIVER.GET_ALL });

      return drivers;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getDriverById(id: string): Promise<IDriver | null> {
    try {
      const driver = await this.get({
        url: DRIFT_DRIVER.GET_BY_ID,
        query: { id },
      });

      return driver;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getDriverByName(name: string): Promise<IDriver | null> {
    try {
      const driver = await this.get({
        url: DRIFT_DRIVER.GET_BY_NAME,
        query: { name },
      });

      return driver;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  
  async getDriverStats(id: string): Promise<IDriverSeasonStats | null> {
    try {
      const driver = await this.get({
        url: DRIFT_DRIVER.GET_DRIVER_STATS,
        query: { id },
      });

      return driver;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async createDriver(payload: {
    firstName: string;
    lastName: string;
    birthday: string;
    cars: ICar[];
    raceNumber: number;
    nationality: string;
  }): Promise<IDriver | null> {
    try {
      const driver = await this.post({ url: DRIFT_DRIVER.CREATE, payload });

      return driver;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

export default new DriftDriversApi();
