import type { IParsedQualifyingResultItem } from "~/components/DriftEvent/AdminViewQualifyingDataTable.service";
import type { IQualifyingResultItem } from "~/interfaces/qualifying.interface";

export function sortResultListByOrderNumber(
  resultList: IQualifyingResultItem[] | IParsedQualifyingResultItem[]
): IQualifyingResultItem[] | IParsedQualifyingResultItem[] {
  return resultList?.sort((a, b) => a?.orderNumber - b?.orderNumber) || [];
}
