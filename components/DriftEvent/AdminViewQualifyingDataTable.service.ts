import type { IDriver } from "~/interfaces/driver.interface";
import type {
  IQualifyingResultItem,
  IQualifyingRun,
} from "~/interfaces/qualifying.interface";
import apiDrivers from "~/utils/drifting/api-drivers";
import { sortResultListByOrderNumber } from "~/utils/drifting/qualifying.util";

export interface IParsedQualifyingResultItem extends IQualifyingResultItem {
  driverName: string;
  run1Points: string;
  run2Points: string;
}

export class AdminViewQualifyingDataTableService {
  async getAllDrivers(): Promise<IDriver[]> {
    return await apiDrivers.getAllDrivers();
  }

  parsedDataList(
    qualifyingResultList: IQualifyingResultItem[],
    parsedDriverList: IParsedDriver[]
  ): IParsedQualifyingResultItem[] {
    const r = sortResultListByOrderNumber(
      qualifyingResultList.map((q) => {
        return {
          ...q,
          driverName: this.getDriverName(q?.driver as string, parsedDriverList),
          run1Points: this.parsePointsOfRun(q.run1),
          run2Points: this.parsePointsOfRun(q.run2),
          run1Summary: this.getRunSummary(q.run1),
          run2Summary: this.getRunSummary(q.run2),
        };
      }) || []
    ) as IParsedQualifyingResultItem[];
    console.log("Parsed Data List:", r);
    return r;
  }

  private getDriverName(
    driverId: string,
    parsedDriverList: IParsedDriver[]
  ): string {
    const driver = parsedDriverList.find((d) => d._id === driverId);
    return driver ? driver.name : "N/A";
  }

  private parsePointsOfRun(run: IQualifyingRun | null): string {
    // returns in format "line | angle | style"
    if (!run) return "N/A";
    return `${run.line ?? "N/A"} | ${run.angle ?? "N/A"} | ${
      run.style ?? "N/A"
    }`;
  }

  private getRunSummary(run: IQualifyingRun | null): number {
    if (!run) return 0;
    return (run?.line ?? 0) + (run?.angle ?? 0) + (run?.style ?? 0);
  }
}

export default new AdminViewQualifyingDataTableService();
