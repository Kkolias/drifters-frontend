import { defineStore } from "pinia";
import type { ILeaderboard } from "~/interfaces/leaderboard.interface";
import apiDriftLeaderboard from "~/utils/drifting/api-drift-leaderboard";

export const userLeaderboardStore = defineStore({
  id: "leaderboard",
  state: (): {
    leaderboard: ILeaderboard | null;
    loading: boolean;
    lastFetchTime: number;
  } => ({
    leaderboard: null,
    loading: true,
    lastFetchTime: 0,
  }),
  actions: {
    async fetchLeaderboard(id: string): Promise<void> {
      if (this.getDoFetch(id)) {
        this.setLoading(true);
        const r = await apiDriftLeaderboard.getLeaderboardById(id);
        this.leaderboard = r;
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
    getDoFetch: (state) => {
      return (id: string): boolean => {
        if (state.leaderboard?._id !== id) return true;

        const currentTime = Date.now();
        const timeToLive = 10 * 60 * 1000; // 10 minutes in milliseconds

        return currentTime - state.lastFetchTime >= timeToLive;
      };
    },
    getLeaderboardById: (state) => {
        return (id: string): ILeaderboard | null => {
            if (state.leaderboard?._id === id) return state.leaderboard;
            
            return null;
        };
    },
    // getLeaderboard(): ILeaderboard | null {
    //   return this.leaderboard;
    // },
    getLoading(): boolean {
      return this.loading;
    },
  },
});
