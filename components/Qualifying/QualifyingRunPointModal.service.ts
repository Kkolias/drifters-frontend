import type {
  IQualifying,
  IQualifyingRun,
  IQualifyingResultItem
} from "~/interfaces/qualifying.interface";
import apiQualifying from "~/utils/drifting/api-qualifying";

export class QualifyingRunPointModalService {
  async updateQualifyingRuns(
    qualifyingId: string,
    resultItemId: string,
    runs: {
      run1?: any // IQualifyingRun;
      run2?: any // IQualifyingRun;
    }
  ): Promise<IQualifying> {
    return (await apiQualifying.updateQualifyingRuns(
      qualifyingId,
      resultItemId,
      runs
    )) as IQualifying;
  }

  // output type to be key of IQualifyingResultItem run1 or run2
  getRunNumber(selectedRun: number): 'run1' | 'run2'{
    return selectedRun === 1 ? "run1" : "run2";
  }
}

export default new QualifyingRunPointModalService();
