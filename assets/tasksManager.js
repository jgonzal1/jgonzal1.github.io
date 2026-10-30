"use strict";
/** @typedef {{ daily_exercise_dur_min: number, mondayApiUrl: string, headers: Record<string, string>, repetitive_threshold: number, category_aggr_days_range: number, end_day_yymmdd_date: number, quarters_of_hour_weekdays: number, quarters_of_hour_weekends: number, addMondayMeta: Function, aggrTasksByCategoryAndDay: Function, aggrTasksByDay: Function, filterTasks: Function, offsetNDay: Function, setBgBasedOnDDiff: Function, d3: any }} GlobalThisExtended */
/** @type {typeof globalThis & GlobalThisExtended} */
const _g = /** @type {any} */ (globalThis);
//#region Variables
const weeklyExerciseH = 6;
//@ts-ignore
const nextViAsV = false;
const msPerH = 3.6e6;
const msPerD = msPerH * 24;
const boardId = "3478645467";
const subItemsBoardId = "4700154754";
_g.mondayApiUrl = "https://api.monday.com/v2";
_g.headers = {
  'Access-Control-Allow-Origin': "*",
  'Content-Type': 'application/json',
  'Referer': '',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
  'sec-ch-ua':
    '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
    'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};
const weekday = [
  "U", "M", "T", "W", "R", "F", "S"
];
const columnRenames = {
  "date": "datetime",
  "estado": "status",
  "label9": "house",
  "numbers": "dur",
  "people": "assigned",
  "status_1": "cat",
  "subitems": "subitems",
  "text": "comments"
};
//#endregion
//#region addMondayMeta
_g.addMondayMeta = (/** @type {any[]} */ mondayTasksJson) => {
  const currentDate = new Date();
  const endDayStr = _g.end_day_yymmdd_date.toString();
  const endDayDate = new Date(`20${endDayStr.substring(0, 2)
    }-${endDayStr.substring(2, 4)
    }-${endDayStr.substring(4, 6)}`);
  let categoryAggrDaysRange = Math.round(
    (endDayDate.valueOf() - currentDate.valueOf()) / msPerD
  );
  if (_g.category_aggr_days_range < categoryAggrDaysRange) {
    globalThis["category_aggr_days_range"] = categoryAggrDaysRange;
  }
  const penultimateDay = new Date
    (_g.offsetNDay(_g.category_aggr_days_range - 1))
    .toISOString().substring(0, 16).replace("T", " ");
  const lastRangeDay = new Date(_g.offsetNDay(_g.category_aggr_days_range))
    .toISOString().substring(0, 16).replace("T", " ");
  mondayTasksJson = mondayTasksJson.map(item => {
    if (!item["datetime"]) {
      if (item["group"] === "1.🐇") {
        item["datetime"] = penultimateDay;
      } else { // if (item["group"] === "2.🐢") {
        item["datetime"] = lastRangeDay;
      }
    }
    item["Δd"] = +(((
      new Date(item["datetime"]).valueOf() - currentDate.valueOf()
    ) / msPerH / 24).toPrecision(3));
    item["dur"] = +(parseFloat(item["dur"]).toFixed(2));
    item["date"] = item["datetime"].substring(0, 10);
    const notes = `${item["comments"] ?? ""} ${item["subitems"] ?? ""} ${item["notes"] ?? ""} `;
    item["notes"] = notes;
    return item;
  });
  let mondayItemsJsonPayload = mondayTasksJson.map(
    (t) => {
      return {
        "cat": t["cat"] ?? "9.➕",
        "task_name": t["task_name"],
        "actions": t["notes"],
        "datetime": t["datetime"],
        "wd": weekday[new Date(t["date"]).getDay()],
        "dur": isNaN(t["dur"]) ? 0.5 : parseFloat(t["dur"]),
        "Δd": t["Δd"],
        "task_id": t["task_id"],
        "gr": t["group"],
        "freq": t["freq"],
        "status": t["status"],
        "type": t["type"]
      }
    }
  )
  mondayItemsJsonPayload.sort(
    (a, b) => ("" + a["datetime"]).localeCompare(b["datetime"])
  ).map(
    (t, i) => {
      // @ts-ignore
      t["#"] = i + 1;
      return t;
    }
  );
  let parentItemDates = {};
  mondayItemsJsonPayload.filter(
    k => k["task_name"].search(":") !== -1
  ).map(l => {
    const parentName = l["task_name"].substring(0, l["task_name"].search(":"));
    if (!Object.keys(parentItemDates).includes(parentName)) {
      const newDateTime = _g.offsetNDay(1 / 6 - 7e-4, l["datetime"], "min");
      // take out 1/6 on summer time
      const newDateTimeStr = new Date(newDateTime).toISOString()
        .substring(0, 16).replace("T", " ");
      // @ts-ignore
      parentItemDates[parentName] = newDateTimeStr;
      mondayItemsJsonPayload.filter(m => m["task_name"] === parentName)
        .map(n => {
          if (n["datetime"] === newDateTime.replace("T", " ").substring(0, 16)) {
            return; // Parent task is already updated today
          }
          /*const query = `mutation {
  change_column_value(${
    ""
            }board_id: ${ boardId }, item_id: ${
    n["task_id"]
            }, column_id: "date", value: "{${""
            } \\"date\\": \\"${newDateTimeStr.substring(0, 10)}\\", ${
  ""
} \\"time\\": \\"${newDateTimeStr.substring(11)}:00\\", ${
  ""
} \\"changed_at\\": \\"${
new Date().toISOString().substring(0, 19)
            }\\"}") { name } }`;
          const body = JSON.stringify({ "query": query });
          fetch(
            _g.mondayApiUrl,
            { method: "POST", headers: _g.headers, body: body }
          );*/
          n["datetime"] = newDateTimeStr;
          n["Δd"] = +(((
            new Date(newDateTimeStr).valueOf() - currentDate.valueOf()
          ) / msPerH / 24).toPrecision(3));
          n["wd"] = weekday[new Date(newDateTimeStr).getDay()];
        });
    }
  });
  mondayItemsJsonPayload.sort(
    (a, b) => ("" + a["datetime"]).localeCompare(b["datetime"])
  ).map(
    (t, i) => {
      // @ts-ignore
      t["#"] = i + 1;
      return t;
    }
  );
  return mondayItemsJsonPayload;
};
//#endregion
