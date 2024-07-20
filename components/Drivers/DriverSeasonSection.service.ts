import { DRIFT_SERIES_LABEL } from "~/constants/drift-series";
import { DriftSerie } from "~/enums/drift-serie.enum";
import type {
  IDriverSeasonStats,
  ILeaderboardWithSeasonInfo,
} from "~/interfaces/drift-season.interface";
import type { IDriver } from "~/interfaces/driver.interface";
import type { ScoreboardItem } from "~/interfaces/leaderboard.interface";

export interface ISeasonsOfSerie {
  serie: DriftSerie;
  serieName: string;
  seasons: ISerieSeasonWithLeaderboard[];
}

export interface ISerieSeasonWithLeaderboard {
  year: number;
  slug: string;
  _id: string;
  scoreboard: ScoreboardItem[];
}

export class DriverSeasonSectionService {
  parseSeriesWithSeasons(
    driverSeasonStats: IDriverSeasonStats,
    selectedDriverId: string
  ): ISeasonsOfSerie[] {
    const serieList = Object.values(DriftSerie);

    const output = serieList?.map((serie) => {
      const seasons = this.parseSeasonListOfSerie(
        serie,
        driverSeasonStats.leaderboards,
        selectedDriverId
      );
      const serieName = DRIFT_SERIES_LABEL?.[serie] || "";
      return { serie, serieName, seasons };
    });
    return this.filterSeries(output);
  }

  private filterSeries(serieList: ISeasonsOfSerie[]): ISeasonsOfSerie[] {
    return serieList?.filter(serie => serie?.seasons?.length > 0);
  }

  private parseSeasonListOfSerie(
    serie: DriftSerie,
    leaderboards: ILeaderboardWithSeasonInfo[],
    selectedDriverId: string
  ): ISerieSeasonWithLeaderboard[] {
    const seasonsOfSerie = leaderboards?.filter(
      (leaderboards) => leaderboards.seasonInfo?.serie === serie
    );

    return seasonsOfSerie?.map((leaderboard) => {
      return {
        year: leaderboard.seasonInfo?.year as number,
        slug: leaderboard.seasonInfo?.slug as string,
        _id: leaderboard._id,
        scoreboard: this.getDriverAndTwoAroundFromScoreboard(leaderboard.scoreboard, selectedDriverId),
      };
    });
  }

  private getDriverAndTwoAroundFromScoreboard(scoreboard: ScoreboardItem[], driverId: string): ScoreboardItem[] {
    return scoreboard.filter((item, index) => {
        const driver = item?.driver as IDriver
        const driverOneBefore = scoreboard[index - 1]?.driver as IDriver
        const driverOneAfter = scoreboard[index + 1]?.driver as IDriver
        const driverTwoBefore = scoreboard[index - 2]?.driver as IDriver
        const driverTwoAfter = scoreboard[index + 2]?.driver as IDriver
        return (
            driver?._id === driverId ||
            driverOneBefore?._id === driverId ||
            driverOneAfter?._id === driverId ||
            driverTwoBefore?._id === driverId ||
            driverTwoAfter?._id === driverId
        );
    })
  }

}

export default new DriverSeasonSectionService();
