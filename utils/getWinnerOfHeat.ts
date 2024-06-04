import type {
  IHeat,
  IRunPairItem,
} from "~/interfaces/competition-day.interface";
import type { IShowdownHeat } from "~/interfaces/qualifying-showdown.interface";

export function getWinnerIdOfHeat(heat: IHeat | IShowdownHeat): string | null {
  if (!heat) return null;
  const runList = heat?.runList || [];
  if(runList.length === 0) return null;
  const driver1 = heat?.driver1 as string;
  const driver2 = heat?.driver2 as string;

  for (const run of runList) {
    if (!driver1 || !driver2) {
      return null;
    }
    const winner = getWinnerIdOfRun(run, driver1, driver2);

    if (winner) {
      return winner;
    } else {
      continue;
    }
  }

  return null; // No winner yet
}

function getWinnerIdOfRun(
  run: IRunPairItem,
  driver1: string,
  driver2: string
): string | null {
  const driver1Count = [
    run.judgePoint1,
    run.judgePoint2,
    run.judgePoint3,
  ].filter((point) => point === "driver1").length;
  const driver2Count = [
    run.judgePoint1,
    run.judgePoint2,
    run.judgePoint3,
  ].filter((point) => point === "driver2").length;
  const omtCount = [run.judgePoint1, run.judgePoint2, run.judgePoint3].filter(
    (point) => point === "omt"
  ).length;

  if (driver1Count >= 2) {
    return driver1;
  }
  if (driver2Count >= 2) {
    return driver2;
  }
  if (omtCount === 2 || omtCount === 3) {
    return null;
  }
  return null; // No winner yet
}
