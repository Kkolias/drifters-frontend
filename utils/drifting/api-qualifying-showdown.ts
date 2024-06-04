import type { JudgePoint } from "~/enums/judge-point.enum";
import type {
  IQualifying,
} from "~/interfaces/qualifying.interface";

const DRIFT_QUALIFYING_SHOWDOWN_PREFIX = "/qualifying-showdown";

const DRIFT_QUALIFYING_SHOWDOWN_ENDPOINTS = {
  GET_ALL: `${DRIFT_QUALIFYING_SHOWDOWN_PREFIX}/get-all`,
  CREATE_QUALIFYING_SHOWDOWN: `${DRIFT_QUALIFYING_SHOWDOWN_PREFIX}/create-qualifying-showdown`,
  GIVE_JUDGE_POINTS: `${DRIFT_QUALIFYING_SHOWDOWN_PREFIX}/give-judge-points`,
};

export class QualifyingShowdownApi extends ApiUtil {
  async getAllQualifyings(): Promise<IQualifying[]> {
    try {
      const qualifyingShowdowns = await this.get({
        url: DRIFT_QUALIFYING_SHOWDOWN_ENDPOINTS.GET_ALL,
      });

      return qualifyingShowdowns;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async createQualifyingShowdown(eventId: string): Promise<IQualifying | null> {
    try {
      const qualifyingShowdown = await this.post({
        url: DRIFT_QUALIFYING_SHOWDOWN_ENDPOINTS.CREATE_QUALIFYING_SHOWDOWN,
        payload: { eventId },
      });

      return qualifyingShowdown;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async giveJudgePointsToShowdownRun(
    showdownId: string,
    heatId: string,
    runId: string,
    {
      judgePoint1,
      judgePoint2,
      judgePoint3,
    }: {
      judgePoint1: JudgePoint;
      judgePoint2: JudgePoint;
      judgePoint3: JudgePoint;
    }
  ): Promise<IQualifying | null> {
    try {
      const qualifyingShowdown = await this.post({
        url: DRIFT_QUALIFYING_SHOWDOWN_ENDPOINTS.GIVE_JUDGE_POINTS,
        payload: {
          showdownId,
          heatId,
          runId,
          judgePoint1,
          judgePoint2,
          judgePoint3,
        },
      });

      return qualifyingShowdown;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

export default new QualifyingShowdownApi();
