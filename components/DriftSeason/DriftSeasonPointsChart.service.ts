import type { IDriftEvent } from "~/interfaces/drift-event.interface";
import type { IDriver } from "~/interfaces/driver.interface";
import type { ScoreboardItem } from "~/interfaces/leaderboard.interface";
import { getChartColor } from "~/utils/chart/getChartColor";

interface IEventLight {
  _id: string;
  name: string;
}

const configs = {
  type: "line",
  options: {
    // add padding to the chart
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
    },

    plugins: {
      tooltip: {
        mode: "index", // Show all data points at the current X-axis value
        intersect: false, // Doesn't require the exact point to be hovered
      },
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#e8e8e8",
          usePointStyle: true,
          // make circle smaller
          pointStyle: "circle",
          boxHeight: 8,
          textAlign: "left",
        },
      },
    },
    hover: {
      mode: "index", // Hover over X-axis to show all points on that axis
      intersect: false, // Hover anywhere along X-axis to trigger
    },
    // set x and y axis colors
    scales: {
      x: {
        grid: {
          color: "#2f3335",
        },
        ticks: {
          color: "#e8e8e8",
        },
      },
      y: {
        grid: {
          color: "#2f3335",
        },
        ticks: {
          color: "#e8e8e8",
        },
      },
    },
    // canvas top text colors

    responsive: true,
    maintainAspectRatio: false,
  },
};

export class DriftSeasonPointsChartService {
  getEventScoresData(
    scoreboard: ScoreboardItem[],
    eventList: IDriftEvent[],
    selectedDriverIdList: string[]
  ): any {
    const eventNameList = this.parseEventList(eventList);
    const scoreboardTop3 = this.getScoreboardItems(scoreboard, selectedDriverIdList);

    const data = {
      labels: this.getLabels(eventNameList),
      datasets: this.getDataSets(scoreboardTop3, eventNameList),
    };

    return {
      ...configs,
      data,
    };
  }

  private getScoreboardItems(
    scoreboard: ScoreboardItem[],
    selectedDriverIdList: string[]
  ): ScoreboardItem[] {
    if(!selectedDriverIdList?.length) return []

    return this.filterSelectedScoreboard(scoreboard, selectedDriverIdList);
  }

  private filterSelectedScoreboard(
    scoreboard: ScoreboardItem[],
    selectedDriverIdList: string[]
  ): ScoreboardItem[] {
    return scoreboard.filter((scoreboardItem) => {
      const driver = scoreboardItem.driver as IDriver;

      return selectedDriverIdList.includes(driver?._id);
    });
  }

  private filterTop3(scoreboard: ScoreboardItem[]): ScoreboardItem[] {
    return scoreboard.filter((_, index) => index < 3);
  }

  getDataSets(scoreboard: ScoreboardItem[], eventNameList: IEventLight[]): any {
    const r = scoreboard.map((scoreboardItem, index) =>
      this.getDataset(scoreboardItem, eventNameList, index)
    );
    return r;
  }

  private getDataset(
    scoreboardItem: ScoreboardItem,
    eventNameList: IEventLight[],
    index: number
  ): any {
    const color = getChartColor(index);
    return {
      label: this.getDriverName(scoreboardItem.driver),
      data: this.getEventData(scoreboardItem, eventNameList),
      fill: false,
      borderColor: color,
      backgroundColor: color,
      tension: 0.1,
    };
  }

  private getDriverName(driver: IDriver | string): string {
    return typeof driver === "string"
      ? driver
      : `${driver.firstName} ${driver.lastName}`;
  }

  private getEventData(
    scoreboardItem: ScoreboardItem,
    eventNameList: IEventLight[]
  ): number[] {
    return eventNameList.map((event) => {
      const eventScore = scoreboardItem.eventScores.find(
        (eventScore) => eventScore.eventId === event._id
      );
      return eventScore ? eventScore.cumulativeScore : null;
    }) as number[];
  }

  getLabels(eventNameList: IEventLight[]): string[] {
    return eventNameList.map((event) => event.name);
  }

  private parseEventList(eventList: IDriftEvent[]): IEventLight[] {
    const sortedByStartsAt = eventList.sort(
      (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
    );
    return sortedByStartsAt.map((event, index) => ({
      _id: event._id,
      name: `Round ${index + 1}`,
    }));
  }

  driverOptionList(
    scoreboard: ScoreboardItem[]
  ): { value: string; label: string }[] {
    return scoreboard.map((scoreboardItem) => {
      const driver = scoreboardItem.driver as IDriver;
      return {
        value: driver?._id,
        label: this.getDriverName(driver),
      };
    });
  }
}

export default new DriftSeasonPointsChartService();
