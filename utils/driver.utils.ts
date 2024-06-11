import type { IDriver } from "~/interfaces/driver.interface";

export interface IParsedDriver extends IDriver {
  name: string;
  _id: string;
  selected: boolean;
}

export function parsedDriverList(
  drivers: IDriver[],
  selectedDriverIdList?: string[]
): IParsedDriver[] {
  return (
    drivers?.map((d) => {
      return {
        ...d,
        name: `${d.firstName} ${d.lastName}`,
        _id: d._id,
        selected: selectedDriverIdList?.includes(d?._id) || false,
      };
    }) || []
  );
}

export function parsedDriverListWithEmptySelection(
  drivers: IDriver[],
  selectedDriverIdList?: string[]
): IParsedDriver[] {
  const emptyDriver = { _id: null, firstName: "-", lastName: ""} as unknown as IDriver
  const listWithEmpty = [emptyDriver, ...drivers]
  return parsedDriverList(listWithEmpty, selectedDriverIdList)
}