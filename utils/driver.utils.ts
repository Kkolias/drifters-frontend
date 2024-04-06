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
