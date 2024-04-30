import { defineStore } from "pinia";
import type { IDriver } from "~/interfaces/driver.interface";
import apiDrivers from "~/utils/drifting/api-drivers";

export const useDriversStore = defineStore({
  id: "drivers",
  state: (): {
    drivers: IDriver[];
    loading: boolean;
    lastFetchTime: number;
  } => ({
    drivers: [],
    loading: true,
    lastFetchTime: 0,
  }),
  actions: {
    async fetchDrivers(): Promise<void> {
      if (this.getDoFetch) {
        this.setLoading(true);
        const r = await apiDrivers.getAllDrivers();
        this.drivers = r;
        this.setNewLastFetchTime();
        this.setLoading(false);
      }
    },
    setLoading(loading: boolean): void {
      this.loading = loading;
    },
    setNewLastFetchTime(): void {
      this.lastFetchTime = Date.now();
    },
  },
  getters: {
    getDoFetch(): boolean {
      if (this.drivers.length === 0) return true;

      const currentTime = Date.now();
      const timeToLive = 10 * 60 * 1000; // 10 minutes in milliseconds

      return currentTime - this.lastFetchTime >= timeToLive;
    },
    getDrivers(): IDriver[] {
      return this.drivers;
    },
    getLoading(): boolean {
      return this.loading;
    },
  },
});
