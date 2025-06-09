import type { IDriver } from "~/interfaces/driver.interface";
import type { IQualifying } from "~/interfaces/qualifying.interface";
import apiDrivers from "~/utils/drifting/api-drivers";
import qualifyingApi from "~/utils/drifting/api-qualifying";

class AddDriversToResultListService {
  constructor() {}

  async addDriversToResultList(
    qualifyingId: string,
    driverList: { id: string; orderNumber: number }[]
  ): Promise<IQualifying | null> {
    if (!driverList?.length) return null;
    return (await qualifyingApi.createResultItemListToQualifying(
      qualifyingId,
      driverList
    )) as IQualifying;
  }

  async updateDriverResultListOrder(
    qualifyingId: string,
    orderList: { id: string; orderNumber: number }[]
  ): Promise<IQualifying | null> {
    if (!orderList?.length) return null;
    return await qualifyingApi.updateResultListOrder(qualifyingId, orderList);
  }

  async getAllDrivers(): Promise<IDriver[]> {
    return await apiDrivers.getAllDrivers();
  }

  async deleteResultList(
    qualifyingId: string,
    driverIdList: string[]
  ): Promise<IQualifying | null> {
    if (!driverIdList?.length) return null;
    return await qualifyingApi.deleteResultsByDriverIds(
      qualifyingId,
      driverIdList
    );
  }

  getDriverIdListToDelete(
    currentSelectedDriverIdList: string[],
    newSelectedDriverIdList: string[]
  ): string[] {
    return currentSelectedDriverIdList.filter(
      (id) => !newSelectedDriverIdList.includes(id)
    );
  }
}

export default new AddDriversToResultListService();
