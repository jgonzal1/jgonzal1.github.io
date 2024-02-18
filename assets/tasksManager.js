"use strict";
//#region Variables
const msPerH = 3600000;
const msPerD = msPerH * 24;
const boardId = "3478645467";
const mondayApiUrl = "https://api.monday.com/v2";
let headers = {
  'Content-Type': 'application/json',
  'Referer': '',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
  'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};
const weekday = [
  "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
];
const columnRenames = {
  "date": "datetime",
  "estado": "status",
  "label": "frequency",
  "label9": "house",
  "numbers": "dur",
  "people": "assigned",
  "status_1": "cat",
  "subitems": "subitems",
  "text": "comments"
};
function createTreeMap(dataCategoriesAndValues, width, height, customColors) {
  const treeMap = {
    "name": "tasks",
    "children": dataCategoriesAndValues
  };
  // @ts-ignore
  const root = d3.treemap().tile(d3.treemapSquarify)
    .size([width, height])
    .padding(1)
    .round(true)
    // @ts-ignore
    (d3.hierarchy(treeMap)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value));

  // @ts-ignore Create the SVG container.
  const svg = d3.create("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("width", width)
    .attr("height", height)
    .attr("style", "font: bold 14px sans-serif; height: auto; max-width: 100%;");

  // Add a cell for each leaf of the hierarchy.
  const leaf = svg.selectAll("g")
    .data(root.leaves())
    .join("g")
    .attr("transform", d => `translate(${d.x0},${d.y0})`);

  // @ts-ignore Append a tooltip.
  const format = d3.format(",d");
  leaf.append("title")
    .text(d => `${d.ancestors().reverse().map(d => d.data.name).join(".")}\n${format(d.value)}`);

  // Append a color rectangle.
  leaf.append("rect")
    .attr("id", (d, dIdx) => d.leafUid = `leaf${dIdx}`)
    .attr("fill", d => {
      while (d.depth > 1) d = d.parent;
      return customColors[parseInt(d.data.name.substring(0, 1), 10)];
    })
    .attr("fill-opacity", 0.6)
    .attr("width", d => d.x1 - d.x0)
    .attr("height", d => d.y1 - d.y0 + 10);

  // Append a clipPath to ensure text does not overflow.
  leaf.append("clipPath")
    .attr("id", (d, dIdx) => d.clipUid = `clip${dIdx}`)
    .append("use")
    .attr("xlink:href", d => d.leafUid.href);

  // Append multiline text. The last line shows the value and has a specific formatting.
  leaf.append("text")
    .attr("clip-path", d => d.clipUid)
    .selectAll("tspan")
    .data(d => d.data.name.split(/(?=[A-Z][a-z])|\s+/g).concat(format(d.value)))
    .join("tspan")
    .attr("x", 3)
    // @ts-ignore
    .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
    // @ts-ignore
    .attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
    .text(d => d);
  const treeMapSvgObj = Object.assign(svg.node());
  return treeMapSvgObj;
}
//#endregion
// @ts-ignore
class tasksManager extends React.Component {
  //#region Constructor and functions
  constructor(props) {
    super(props);
    this.state = {
      dayOffsetValue: 1,
      getDatedMondayItemsToJson: true,
      lastRefreshDateTime: "undefined",
      lastUpdatedItem: false,
      mondayTasksCols: {},
      mondayTasksByCategory: [],
      mondayTasksDurationSum: 0,
      mondayTasksByDay: {},
      nextClimbingDay: "undefined",
      nextVF: "undefined",
      nextVI: "undefined",
    };
  };
  addMondayMeta = (mondayTasksCols) => {
    const currentDate = new Date();
    const aYearFromNowDt = new Date();
    aYearFromNowDt.setFullYear(aYearFromNowDt.getFullYear() + 1);
    const aYearFromNow = aYearFromNowDt.toISOString().substring(0, 16).replace("T", " ");
    mondayTasksCols = mondayTasksCols.map(item => {
      if (!item["datetime"]) {
        item["datetime"] = aYearFromNow
      };
      item["h_diff"] = +(
        (new Date(item["datetime"]).valueOf() - currentDate.valueOf()) / msPerH
      ).toFixed(2);
      item["dur"] = +(parseFloat(item["dur"]).toFixed(1));
      item["date"] = item["datetime"].substring(0, 10);
      const notes = `${item["comments"]} ${item["subitems"]}`;
      item["notes"] = notes;
      return item;
    });
    const mondayItemsJsonPayload = mondayTasksCols.map(
      (t) => {
        return {
          "cat": t["cat"],
          "task_name": t["task_name"],
          "datetime": t["datetime"],
          "wd": weekday[new Date(t["date"]).getDay()],
          "dur": t["dur"],
          "h_diff": t["h_diff"],
          "actions": t["notes"],
          "task_id": t["task_id"],
          "gr": t["group"]
        }
      }
    )
    return mondayItemsJsonPayload.sort(
      (a, b) => ("" + a["datetime"]).localeCompare(b["datetime"])
    ).map(
      (t, i) => {
        t["#"] = i + 1;
        return t;
      }
    );
  };
  aggrTasksByCategory = (sortedMondayItemsJson) => {
    //#region Prepare data and setState
    const mondayTasksByCatDict = sortedMondayItemsJson.reduce(
      (accumulator, item) => {
        if (!accumulator[item["cat"]]) {
          accumulator[item["cat"]] = 0;
        }
        accumulator[item["cat"]] += item["dur"]
        return accumulator
      }, {}
    );
    const dataCategoriesAndValues = Object.keys(mondayTasksByCatDict).map(
      (k) => {
        const duration = +(mondayTasksByCatDict[k].toFixed(1));
        return {
          "name": k,
          "value": duration
        }
      }
    );
    const mondayTasksDurationSum = dataCategoriesAndValues.map(t => t.value).filter(dur => dur > 0).reduce(
      (accumulator, currentValue) => accumulator + currentValue, 0
    ).toFixed(1);
    // @ts-ignore
    this.setState({
      mondayTasksDurationSum: mondayTasksDurationSum
    });
    const [width, height] = [350, 350];
    const customColors = [
      "#e15759",
      "#59a14f", // 🏠
      "#9c755f", // 💰
      "#edc949", // 🍏
      "#f28e2c", // 🚩🇩🇰
      "#ff9da7", // 🔬
      "#af7aa1", // 📺
      "#4e79a7", // 🎮
      "#76b7b2", // 🌐
      "#bab0ab", // ➕
      ""
    ]; // d3.scaleOrdinal(treeMapChildren.map(d => d.name), d3.schemeTableau10); // alternative
    // @ts-ignore
    const color = d3.scaleOrdinal(customColors); // for bubbleChart
    const bubbleChart = dataCategoriesAndValues.map(nv => {
      return {
        "id": `tc.${nv.name}`,
        "value": 1 + nv.value
      }
    });
    //#endregion
    //#region Plot Bubble Chart
    const margin = 1; // to avoid clipping the root circle stroke
    const name = d => d.id.split(".").pop(); // "Strings" of "flare.util.Strings"
    const group = d => d.id.split(".")[1]; // "util" of "flare.util.Strings"
    const names = d => name(d).split(/(?=[A-Z][a-z])|\s+/g); // ["Legend", "Item"] of "flare.vis.legend.LegendItems"

    //@ts-ignore [Number format for values](https://observablehq.com/@d3/d3-format?collection=@d3/d3-format)
    const format = d3.format(".1f");

    // @ts-ignore Create layout
    const pack = d3.pack()
      .size([width - margin * 2, height - margin * 2])
      .padding(3);

    // @ts-ignore Compute the hierarchy from the (flat) bubbleChart data
    const root = pack(d3.hierarchy({ children: bubbleChart })
      .sum(d => d.value));

    // @ts-ignore
    const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-margin, -margin, width, height])
      .attr("style", "max-width: 100%; height: auto; font: 1.4em sans-serif;")
      .attr("text-anchor", "middle");

    // Place each (leaf) node according to the layout's x and y values
    const node = svg.append("g")
      .selectAll()
      .data(root.leaves())
      .join("g")
      .attr("transform", d => `translate(${d.x},${d.y})`);

    node.append("title")
      .text(d => `${d.data.id}\n${format(d.value)}`);

    node.append("circle")
      .attr("fill-opacity", 0.7)
      .attr("fill", d => customColors[group(d.data)])
      .attr("r", d => d.r);

    // Add the labels
    const text = node.append("text")
      .attr("clip-path", d => `circle(${d.r})`);

    // Add a tspan for each CamelCase-separated word.
    text.selectAll()
      .data(d => names(d.data))
      .join("tspan")
      .attr("x", 0)
      // @ts-ignore
      .attr("y", (d, i, nodes) => `${i - nodes.length / 2 + 0.35}em`)
      .text(d => d);

    // Add a tspan for the node's value.
    text.append("tspan")
      .attr("x", 0)
      .attr("y", d => `${names(d.data).length / 2 + 0.35}em`)
      .attr("fill-opacity", 0.7)
      .text(d => format(d.value));

    return Object.assign(svg.node(), { scales: { color } });
    //#endregion
  };
  aggrTasksByDay = (sortedMondayItemsJson) => {
    const [
      nextClimbingDay, nextVI, nextVF
    ] = [
      "Climb", "(v_i)", "(v_f)"
    ].map(
      (tn) => sortedMondayItemsJson.filter(
        t => t["task_name"] === tn
      ).map(t => t.datetime)[0]
    );
    let sortedMondayItemsJsonWithEmptyDates = sortedMondayItemsJson.map(
      t => {
        return {
          "date": t["datetime"].substring(0, 10),
          "dur": t["dur"]
        }
      }
    );
    const arrNext21D = Array.from({ length: 21 }, (_, n) => n).map((n) => {
      return { "date": this.offsetNDay(n), "dur": 0 }
    });
    sortedMondayItemsJsonWithEmptyDates = sortedMondayItemsJsonWithEmptyDates
      .concat(arrNext21D).sort(
        (a, b) => ("" + a["date"]).localeCompare(b["date"])
      );
    const mondayTasksByDayDict = sortedMondayItemsJsonWithEmptyDates.reduce(
      (accumulator, item) => {
        if (!accumulator[item["date"]]) {
          accumulator[item["date"]] = 0;
        }
        accumulator[item["date"]] += item["dur"]
        return accumulator
      }, {}
    );
    return Object.keys(mondayTasksByDayDict).map(
      (k) => {
        const wd = weekday[new Date(k).getDay()];
        const duration = +(mondayTasksByDayDict[k].toFixed(1));
        const dayDiff = (Math.floor(
          (
            new Date(k).valueOf() -
            new Date(nextClimbingDay).valueOf()
          ) / msPerD
        ));
        const isOddDayDiff = !!(dayDiff % 2) && (dayDiff >= 0);
        const durOffs = isOddDayDiff ? duration + 2 : duration;
        const totV = ["Sat", "Sun"].includes(wd) ? 20 : 12;
        const usedTime = Math.min(Math.ceil(4 * durOffs), 21);
        const unUsedTime = Math.max(totV - usedTime, 0);
        const setDurStrAsV = (k >= nextVI && k <= nextVF);
        const durStr = setDurStrAsV ?
          "v".repeat(totV) :
          `${"|".repeat(usedTime)}${".".repeat(unUsedTime)}`;
        const hDiff = Math.round(((
          // @ts-ignore
          new Date(k) - new Date((new Date().toISOString().substring(0, 10)))
        ) + 3.6e6) / 3.6e5) / 10
        return {
          "date": k,
          "wd": wd,
          "dur_offs": durOffs,
          "dur_str": durStr,
          "h_diff": hDiff
        }
      }
    );
  };
  getDatedMondayTasksToMultipleJson = async (
    mondayKey, boardId, columnRenames
  ) => {
    headers["Authorization"] = mondayKey;
    const query = "boards (ids: " + boardId + ") { " +
      "items_page (limit: 500) { items { " +
      "group { title id } id name column_values { column { id } text value } " +
      "} } items_count }"
    const body = JSON.stringify({ "query": "query { " + query + " }" });
    const mondayItemsRawJsonPremise = await fetch(
      mondayApiUrl,
      { method: "POST", headers: headers, body: body }
    ).then((response) => {
      try {
        return response.json();
      } catch (e) {
        console.error(e);
        return [response];
      }
    });
    const mondayItemsRawJson = await mondayItemsRawJsonPremise;
    /** @type {any} */
    let mondayTasksCols = [];
    let rawItemIdx = 0;
    mondayItemsRawJson["data"]["boards"][0]["items_page"]["items"].map(
      (rawItem, _rawItemIdx) => {
        const taskIds = {
          "task_id": rawItem["id"],
          "task_name": rawItem["name"],
          "group": rawItem["group"]["title"]
        };
        mondayTasksCols.push(taskIds);
        rawItemIdx = _rawItemIdx;
        rawItem.column_values.map((itemCol) => {
          mondayTasksCols[rawItemIdx][
            columnRenames[itemCol.column.id]
          ] = itemCol.text;
        });
      }
    );
    const sortedMondayItemsJson = this.addMondayMeta(mondayTasksCols);
    const mondayTasksByDay = this.aggrTasksByDay(sortedMondayItemsJson);
    const mondayTasksByCategory = this.aggrTasksByCategory(sortedMondayItemsJson);
    // @ts-ignore
    this.setState({
      mondayTasksCols: sortedMondayItemsJson,
      mondayTasksByCategory: [mondayTasksByCategory],
      mondayTasksByDay: mondayTasksByDay,
      getDatedMondayItemsToJson: false,
      lastRefreshDateTime: new Date().toISOString().substring(2, 19).replace("T", " ")
    });
    return sortedMondayItemsJson;
  };
  offsetNDay = (n, dateToOffset, precision = "day") => {
    const dateToOffsetAsValue = dateToOffset ?
      new Date(dateToOffset).valueOf() :
      new Date().valueOf();
    const offsetMs = n * msPerD;
    const dateValueOffset = dateToOffsetAsValue + offsetMs;
    return new Date(
      dateValueOffset
    ).toISOString().substring(0,
      precision === "day" ? 10 :
        precision === "min" ? 16 :
          19 // sec
    );
  };
  putMondayDateItem = async (
    mondayKey, boardId, itemId, dateTimeToSet
  ) => {
    headers["Authorization"] = mondayKey;
    const query = `mutation { change_column_value ( ${""
      }board_id: ${boardId}, item_id: ${itemId}, column_id: "date", value: "{${""
      }\\"date\\":\\"${dateTimeToSet.substring(0, 10)}\\", ${""
      }\\"time\\":\\"${dateTimeToSet.substring(11)}\\", ${""
      }\\"changed_at\\":\\"${new Date().toISOString().substring(0, 19)}\\"${""
      }}") { name } }`;
    const body = JSON.stringify({ "query": query });
    const mondayPutResponsePremise = await fetch(
      mondayApiUrl,
      { method: "POST", headers: headers, body: body }
    ).then((response) => {
      try {
        return response.json();
      } catch (e) {
        console.error(e);
        return [response];
      }
    });
    const mondayPutResponse = await mondayPutResponsePremise;
    const lastUpdatedItem = mondayPutResponse?.["data"]?.["change_column_value"]?.["name"] ?? false;
    if (lastUpdatedItem) {
      // @ts-ignore
      this.setState({ lastUpdatedItem: lastUpdatedItem });
    }
  };
  setBgBasedOnHDiff = (taskRow) => {
    const hToNextDay = new Date().getHours();
    const hToNextWeek = ((8 - (new Date().getDay() % 7)) * 24) - hToNextDay;
    const hDiff = parseFloat(taskRow["h_diff"]);
    const bgRanges = [
      { "bgRange": -9e3, "bgColor": "#C66D" }, // passed
      { "bgRange": 0, "bgColor": "#C669" }, // now
      { "bgRange": 24 - hToNextDay, "bgColor": "#C667" }, // today
      { "bgRange": 48 - hToNextDay, "bgColor": "#C665" }, // tomorrow
      { "bgRange": 72 - hToNextDay, "bgColor": "#C865" }, // in 2d
      { "bgRange": 96 - hToNextDay, "bgColor": "#C965" }, // in 3d
      { "bgRange": Math.max(96 - hToNextDay, hToNextWeek), "bgColor": "#CA65" }, // this week
      { "bgRange": 168 + hToNextWeek, "bgColor": "#CC63" }, // next week
      { "bgRange": 720 - hToNextDay, "bgColor": "#CE62" }, // this month
      { "bgRange": 8760, "bgColor": "#9F62" }, // this year
      { "bgRange": 9e9, "bgColor": "#BBFF6606" }
    ];
    let bgColor = "#0000";
    bgRanges.filter(
      (bgPair, idx) => hDiff > bgPair.bgRange && hDiff <= bgRanges[idx + 1].bgRange
    ).map(bgPair => {
      bgColor = bgPair.bgColor;
    });
    return bgColor;
  };
  setDayOffsetValue = (k) => {
    // @ts-ignore
    this.setState({ dayOffsetValue: k })
  };
  //#endregion
  render() {
    //#region State listeners
    if (this.state.getDatedMondayItemsToJson) {
      //@ts-ignore
      this.getDatedMondayTasksToMultipleJson(monday_key, boardId, columnRenames);
    }
    if (this.state.mondayTasksByCategory.length) {
      const tasksByCategoryPlaceholder = document.querySelector("#tasksByCategory");
      if (!tasksByCategoryPlaceholder) { return; }
      tasksByCategoryPlaceholder.innerHTML = "";
      tasksByCategoryPlaceholder.appendChild(this.state.mondayTasksByCategory[0]);
    }
    //#endregion
    // @ts-ignore
    return React.createElement(
      "div", {
      id: "taskManagerWrapper",
      style: { width: "calc(100% - 0.8em)" }
    },
      // @ts-ignore
      React.createElement(
        "button", {
        id: "refreshTasksButton",
        onClick: //@ts-ignore
          () => this.setState({ getDatedMondayItemsToJson: true })
      }, "Refresh tasks"
      ),
      // @ts-ignore
      React.createElement(
        "span",
        {
          id: "lastRefreshDateTime",
          style: { paddingLeft: "0.3em" }
        },
        `Last refresh: ${this.state.lastRefreshDateTime}`
      ),
      // @ts-ignore
      React.createElement(
        "span",
        {
          id: "lastUpdatedItem",
          style: { paddingLeft: "0.3em" }
        },
        this.state.lastUpdatedItem && `| Last upd. item: ${this.state.lastUpdatedItem
        }`
      ),
      // @ts-ignore
      React.createElement(
        "span",
        {
          id: "tasksDurationSum",
          style: { paddingLeft: "0.3em" }
        },
        this.state.mondayTasksDurationSum && `| Total tasks dur: ${this.state.mondayTasksDurationSum
        }h/${(this.state.mondayTasksDurationSum / 18).toFixed(1)
        }w | Day(s) offset: `
      ),
      // @ts-ignore
      React.createElement(
        "input",
        {
          id: "seyDayOffset",
          value: this.state.dayOffsetValue,
          // @ts-ignore
          onChange: (e) => this.setState({ dayOffsetValue: e.target.value }),
          style: {
            backgroundColor: "#FFF6",
            fontStyle: "italic",
            fontWeight: "bold",
            paddingLeft: "0.3em",
            width: "3em"
          }
        },
        null
      ),
      // @ts-ignore
      React.createElement(
        "div",
        {
          id: "mondayTableContainer",
          className: "first-flex-container-item table-container",
          style: {
            paddingTop: "0.1em",
            width: "fit-content",
            maxWidth: "calc(100% - 0.8em)"
          }
        },
        (Object.keys(this.state.mondayTasksCols).length && !this.state.getDatedMondayItemsToJson) ?
          // @ts-ignore
          React.createElement(
            "table",
            null,
            // @ts-ignore
            React.createElement(
              "thead",
              null,
              // @ts-ignore
              React.createElement(
                "tr",
                null,
                [
                  Object.keys(this.state.mondayTasksCols[0]).pop(),
                  ...Object.keys(this.state.mondayTasksCols[0])
                  // @ts-ignore
                ].map((taskKey, taskKeyIdx) => React.createElement(
                  "th",
                  { key: `${taskKey}${taskKeyIdx}Header` },
                  taskKey
                ))
              )
            ),
            // @ts-ignore
            React.createElement(
              "tbody",
              null,
              // @ts-ignore
              this.state.mondayTasksCols.map((taskRow, idxRow) => React.createElement(
                "tr",
                {
                  key: `TaskRow${idxRow}`,
                  style: {
                    backgroundColor: this.setBgBasedOnHDiff(taskRow)
                  }
                },
                [
                  Object.keys(taskRow).pop(),
                  ...Object.keys(taskRow)
                  // @ts-ignore
                ].map((taskKey, taskKeyIdx) => React.createElement(
                  "td",
                  {
                    key: `${taskKey}${taskKeyIdx}${idxRow}Td`,
                    className: `${taskKey}-td`,
                    style: { height: "2em" }
                  },
                  // @ts-ignore
                  taskKey === "actions" ? React.createElement(
                    "div",
                    {
                      style: {
                        height: "100%",
                        overflowY: "auto"
                      }
                    },
                    // @ts-ignore
                    React.createElement(
                      "img",
                      {
                        src: "../public/prioritize.png",
                        alt: "Prioritize",
                        key: `${taskRow["task_id"]}PrioritizeImg`,
                        className: "clickable-icon",
                        onClick: () => this.putMondayDateItem(
                          //@ts-ignore
                          monday_key, boardId,
                          taskRow["task_id"],
                          this.offsetNDay(-1 * this.state.dayOffsetValue, taskRow["datetime"], "sec")
                        )
                      }
                    ),
                    // @ts-ignore
                    React.createElement(
                      "img",
                      {
                        src: "../public/snooze.png",
                        alt: "Snooze",
                        key: `${taskRow["task_id"]}SnoozeImg`,
                        className: "clickable-icon",
                        onClick: () => this.putMondayDateItem(
                          //@ts-ignore
                          monday_key, boardId,
                          taskRow["task_id"],
                          this.offsetNDay(this.state.dayOffsetValue, taskRow["datetime"], "sec")
                        )
                      }
                    ),
                    // @ts-ignore
                    taskRow[taskKey]
                  ) : // @ts-ignore
                    taskRow[taskKey]
                )
                )))
            )
          ) : // @ts-ignore
          React.createElement(
            "div",
            null,
            "Loading tasks summary table"
          )
      ),
      // @ts-ignore
      React.createElement(
        "div",
        {
          className: "flex-container-2",
          style: {
            gap: "0em",
            height: "315px",
            margin: "0.3em 0.3em 0 0.1em",
            position: "relative",
            width: "calc(100% - 1em)"
          }
        },
        // @ts-ignore
        React.createElement(
          "div",
          {
            id: "mondayTasksByDayTableContainer",
            className: "table-container",
            style: {
              flexGrow: 1,
              height: "305px",
              margin: "0.1em",
              width: "fit-content"
            }
          },
          (Object.keys(this.state.mondayTasksByDay).length && !this.state.getDatedMondayItemsToJson) ?
            // @ts-ignore
            React.createElement(
              "table",
              { style: { width: "100%" } },
              // @ts-ignore
              React.createElement(
                "thead",
                null,
                // @ts-ignore
                React.createElement(
                  "tr",
                  null,
                  Object.keys(this.state.mondayTasksByDay[0]).map(taskKey =>
                    // @ts-ignore
                    React.createElement(
                      "th",
                      { key: `${taskKey}HeaderByDay` },
                      taskKey
                    )
                  )
                )
              ),
              // @ts-ignore
              React.createElement(
                "tbody",
                null,
                // @ts-ignore
                this.state.mondayTasksByDay.map((taskRow, idxRow) => React.createElement(
                  "tr",
                  {
                    key: `TaskRow${idxRow}ByDay`,
                    style: { backgroundColor: this.setBgBasedOnHDiff(taskRow) }
                  },
                  // @ts-ignore
                  Object.keys(this.state.mondayTasksByDay[0]).map(taskKey => React.createElement(
                    "td",
                    { key: `${taskKey}${idxRow}TdByDay` },
                    taskRow[taskKey]
                  ))
                ))
              )
            ) :
            // @ts-ignore
            React.createElement(
              "div",
              null,
              "Loading tasks by day table"
            )
        ),
        // @ts-ignore
        React.createElement(
          "div",
          {
            id: "tasksByCategory",
            style: {
              // backgroundColor: "#FFF3", only like this for treeMap
              height: "305px",
              margin: "0.1em",
              overflow: "hidden",
              width: "min(50%, 305px)"
            }
          },
          ""
        )
      )
    )
  }
}
//#region Append to DOM
const domContainer = document.querySelector("#taskManager");
//@ts-ignore
const root = ReactDOM.createRoot(domContainer);
// @ts-ignore
root.render(React.createElement(tasksManager));
//#endregion