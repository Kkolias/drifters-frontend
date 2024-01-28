import type { IDriver } from "./driver.interface"


export interface IQualifyingRun {
    _id: string
    line: number | null
    angle: number | null
    style: number | null
  }
  
  export interface IQualifyingResultItem {
    _id: string
    driver: IDriver
    run1: IQualifyingRun | null
    run2: IQualifyingRun | null
  }
  
  export interface IQualifying {
    _id: string
    eventId: string
    resultList: IQualifyingResultItem[]
    createdAt: string
  }