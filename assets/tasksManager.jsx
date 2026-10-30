"use strict";
/** @typedef {{ daily_exercise_dur_min: number, mondayApiUrl: string, headers: Record<string, string>, repetitive_threshold: number, category_aggr_days_range: number, end_day_yymmdd_date: number, quarters_of_hour_weekdays: number, quarters_of_hour_weekends: number, totalHPerWeek: number, tasksByCategoryWidth: number, tasksByCategoryHeight: number, monday_key: string, addMondayMeta: Function, aggrTasksByCategoryAndDay: Function, aggrTasksByDay: Function, filterTasks: Function, offsetNDay: Function, setBgBasedOnDDiff: Function, d3: any, [key: string]: any }} GlobalThisExtended */
/** @type {typeof globalThis & GlobalThisExtended} */
const _gx = /** @type {any} */ (globalThis);
// @ts-ignore
class tasksManager extends _gx.React.Component {
  //#region Constructor
  // @ts-ignore
  constructor(props) {
    super(props);
    this.state = {
      colors: {
        "0.➕": "#c2b0b066",
        "1.🍏": "#edc949",
        "2.🏠": "#b5bd68",
        "3.💰": "#9c755f",
        "4.🚩": "#f28e2c",
        "5.🔬": "#ff9da7",
        "5.🌿": "#59a14f",
        "6.📺": "#af7aa1",
        "7.🎮": "#4e79a7",
        "8.🌐": "#76b7b2",
        "9.➕": "#bab0ab66"
      },
      durationValue: 0.5,
      durColors: {
        "0.02": "#bab0ab88",
        "0.1": "#59a14f88",
        "0.2": "#b5bd6888",
        "0.5": "#edc94988",
        "0.8": "#e2bc3488",
        "1": "#c2a02688",
        "1.5": "#ca8b4c88",
        "2": "#e1575988"
      },
      freqColors: {
        "999-Once": "#bab0ab88",
        "400->1y": "#5891ce88",
        "360-Yearly": "#6fdda688",
        "180-Every 6 mo": "#78d76c88",
        "090-Every 3 mo": "#c6d15d88",
        "030-Monthly": "#edc94988",
        "014-BiWeekly": "#caa04c88",
        "004-times": "#ca8b4c88",
        "003-/week": "#f28e2c88",
        "001-Daily": "#e1575988"
      },
      statusColors: {
        "Pending": "#e1575988",
        "Date sensitive": "#f28e2c88",
        "On the PC": "#f28e2c88",
        "Nice to do": "#bab0ab88"
      },
      dayOffsetValue: Number(1 / 24),
      daysBetween1900and1970: 25569, // Diff Google Sheets and Browser for regression
      getDatedMondayItemsToJson: true,
      hide0DurTasks: true,
      inflation: 1.04,
      interval: 1000,
      lastRefreshDateTime: "undefined",
      lastUpdatedDt: "",
      lastUpdatedItem: false,
      milliSecondsPerDay: 24 * 60 * 60 * 1000,
      minsOffsetValue: 60,
      mondayTasksByCategoryAndDay: [],
      mondayTasksByCategorySvg: [],
      mondayTasksByCatDict: {},
      mondayTasksByDay: {},
      mondayTasksJson: {},
      nextExercisingDay: "undefined",
      nextVF: "undefined",
      nextVI: "undefined",
      numberFormat: {
        currency: "EUR",
        maximumSignificantDigits: 9,
        style: "currency",
        useGrouping: true
      }
    };
  };
  //#endregion
  // @ts-ignore
}
tasksManager.prototype.render = function () {
  if (this.updateDashboard() === false) {
    return null;
  }
  return React.createElement(
    "div",
    {
      id: "taskManagerWrapper",
      style: { paddingLeft: "0.5em", width: "calc(100% - 0.8em)" },
    },
    this.renderTopBar(),
    this.renderTaskTable(),
    this.renderGraphs()
  );
};
