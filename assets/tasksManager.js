"use strict";

const msPerH = 3600000;
const msPerD = msPerH*24;
const boardId = "3478645467";
const mondayApiUrl = "https://api.monday.com/v2";
const weekday = [
  "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
];
const columnRenames = {
  "date": "datetime",
  "estado": "status",
  "label": "frequency",
  "label9": "house",
  "numbers": "duration",
  "people": "assigned",
  "status_1": "category",
  "subitems": "subitems",
  "text": "comments"
};

class tasksManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      getDatedMondayItemsToJson: true,
      lastRefreshDateTime: "undefined",
      lastUpdatedItem: false,
      mondayTasksCols: {},
      mondayTasksByCategory: [],
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
    const aYearFromNow = aYearFromNowDt.toISOString().substring(0,16).replace("T"," ");
    mondayTasksCols = mondayTasksCols.map(item=>{
      if(!item["datetime"]){
        item["datetime"]=aYearFromNow
      };
      item["h_diff"] = +(
        (new Date(item["datetime"]).valueOf() - currentDate.valueOf())/msPerH
      ).toFixed(2);
      item["duration"] = +(parseFloat(item["duration"]).toFixed(1));
      item["date"] = item["datetime"].substring(0,10);
      item["notes"] = `${item["comments"]} ${item["subitems"]}`
      return item;
    });
    const mondayItemsJsonPayload = mondayTasksCols.map(
      (t)=>{ return {
        "category": t["category"],
        "task_name": t["task_name"],
        "datetime": t["datetime"],
        "duration": t["duration"],
        "h_diff": t["h_diff"],
        "actions": t["notes"],
        "task_id": t["task_id"]
      }}
    )
    return mondayItemsJsonPayload.sort(
      (a,b)=>(""+a["datetime"]).localeCompare(b["datetime"])
    ).map(
      (t,i) => {
        t["index"] = i+1;
        return t;
      }
    );
  };

  offsetNDay = (n, dateToOffset, precision="day") => {
    const dateToOffsetAsValue = dateToOffset?
      new Date(dateToOffset).valueOf():
      new Date().valueOf();
    const offsetMs = n*msPerD;
    const dateValueOffset = dateToOffsetAsValue + offsetMs;
    return new Date(
      dateValueOffset
    ).toISOString().substring(0,
      precision==="day"?10:
      precision==="min"?16:
      19 // sec
    );
  };

  aggrTasksByDay = (sortedMondayItemsJson) => {
    const [
      nextClimbingDay, nextVI, nextVF
    ] = [
      "Climb", "(v_i)", "(v_f)"
    ].map(
      (tn)=>sortedMondayItemsJson.filter(
        t=>t["task_name"]===tn
      ).map(t=>t.datetime)[0]
    );
    let sortedMondayItemsJsonWithEmptyDates = sortedMondayItemsJson.map(
      t=>{return{
        "date": t["datetime"].substring(0,10),
        "duration": t["duration"]
      }}
    );
    const arrNext21D = Array.from({ length: 21 }, (_, n) => n).map((n)=>{
      return { "date": this.offsetNDay(n), "duration": 0 }
    });
    sortedMondayItemsJsonWithEmptyDates = sortedMondayItemsJsonWithEmptyDates
      .concat(arrNext21D).sort(
        (a,b)=>(""+a["date"]).localeCompare(b["date"])
      );
    const mondayTasksByDayDict = sortedMondayItemsJsonWithEmptyDates.reduce(
      (accumulator, item) => {
        if (!accumulator[item["date"]]){
          accumulator[item["date"]] = 0;
        }
        accumulator[item["date"]] += item["duration"]
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
        const isOddDayDiff = !(dayDiff%2) && (dayDiff>=0);
        const durOffs = isOddDayDiff?duration+2:duration;
        const totV = ["Sat","Sun"].includes(wd)?20:12;
        const usedTime = Math.min(Math.ceil(4*durOffs),21);
        const unUsedTime = Math.max(totV-usedTime, 0);
        const setDurStrAsV = (k >= nextVI && k <=nextVF);
        const durStr = setDurStrAsV ?
          "v".repeat(totV) :
          `${"|".repeat(usedTime)}${".".repeat(unUsedTime)}`;
        return {
          "date": k,
          "wd": wd,
          "dur_offs": durOffs,
          "dur_str": durStr
        }
      }
    );
  };

  aggrTasksByCategory = (sortedMondayItemsJson) => {
    const mondayTasksByCatDict = sortedMondayItemsJson.reduce(
      (accumulator, item) => {
        if (!accumulator[item["category"]]){
          accumulator[item["category"]] = 0;
        }
        accumulator[item["category"]] += item["duration"]
        return accumulator
      }, {}
    );
    const treeMapChildren = Object.keys(mondayTasksByCatDict).map(
      (k) => {
        const duration = +(mondayTasksByCatDict[k].toFixed(1));
        return {
          "name": k,
          "value": duration
        }
      }
    );
    const [width, height] = [350, 350];
    const treeMap = {
      "name":"tasks",
      "children":treeMapChildren
    }
    const color = [
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
    ]; // d3.scaleOrdinal(treeMapChildren.map(d => d.name), d3.schemeTableau10);

    const root = d3.treemap()
      .tile(d3.treemapSquarify)
      .size([width, height])
      .padding(1)
      .round(true)
    (d3.hierarchy(treeMap)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value));

    // Create the SVG container.
    const svg = d3.create("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr("width", width)
        .attr("height", height)
        .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

    // Add a cell for each leaf of the hierarchy.
    const leaf = svg.selectAll("g")
      .data(root.leaves())
      .join("g")
        .attr("transform", d => `translate(${d.x0},${d.y0})`);

    // Append a tooltip.
    const format = d3.format(",d");
    leaf.append("title")
        .text(d => `${d.ancestors().reverse().map(d => d.data.name).join(".")}\n${format(d.value)}`);

    // Append a color rectangle.
    leaf.append("rect")
        .attr("id", (d, dIdx) => d.leafUid = `leaf${dIdx}`)
        .attr("fill", d => {
          while (d.depth > 1) d = d.parent;
          return color[parseInt(d.data.name.substring(0,1),10)];
        })
        .attr("fill-opacity", 0.6)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0);

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
        .attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
        .text(d => d);
    const treeMapSvgObj = Object.assign(svg.node());
    return treeMapSvgObj;
  };

  getDatedMondayTasksToJsons = async (
    mondayKey, boardId, columnRenames
  ) => {
    const headers = {
      "Authorization": mondayKey,
      "Content-Type": "application/json",
    };
    const query ="boards (ids: " + boardId + ") { " +
      "items { id name column_values { id text value } } " +
    "}"
    const body = JSON.stringify({"query": "query { " + query + " }"});
    const mondayItemsRawJsonPremise = await fetch(
      mondayApiUrl,
      { method: "POST", headers: headers, body: body }
    ).then((response) => {
      try {
        return response.json();
      } catch (e) {
        console.error(e);
        return [ response ];
      }
    });
    const mondayItemsRawJson = await mondayItemsRawJsonPremise;
    /** @type {any} */
    let mondayTasksCols = [];
    let rawItemIdx = 0;
    mondayItemsRawJson["data"]["boards"][0]["items"].map(
      (rawItem, _rawItemIdx) => {
        const taskIds = {
          "task_id": rawItem["id"], "task_name": rawItem["name"]
        };
        mondayTasksCols.push(taskIds);
        rawItemIdx = _rawItemIdx;
        rawItem.column_values.map((itemCol)=>{
          mondayTasksCols[rawItemIdx][
            columnRenames[itemCol.id]
          ] = itemCol.text;
        });
      }
    );
    const sortedMondayItemsJson = this.addMondayMeta(mondayTasksCols);
    const mondayTasksByDay = this.aggrTasksByDay(sortedMondayItemsJson);
    const mondayTasksByCategory = this.aggrTasksByCategory(sortedMondayItemsJson);
    
    this.setState({
      mondayTasksCols: sortedMondayItemsJson,
      mondayTasksByCategory: [mondayTasksByCategory],
      mondayTasksByDay: mondayTasksByDay,
      getDatedMondayItemsToJson: false,
      lastRefreshDateTime: new Date().toISOString().substring(2,19).replace("T"," ")
    });
    return sortedMondayItemsJson;
  };

  putMondayDateItem = async (
    mondayKey, boardId, itemId, dateTimeToSet
  ) => {
    const query = `mutation { change_column_value ( ${""
      }board_id: ${boardId}, item_id: ${itemId}, column_id: "date", value: "{${""
        }\\"date\\":\\"${dateTimeToSet.substring(0,10)}\\", ${""
        }\\"time\\":\\"${dateTimeToSet.substring(11)}\\", ${""
        }\\"changed_at\\":\\"${new Date().toISOString().substring(0,19)}\\"${""
      }}") { name } }`;
    const headers = {
      "Authorization": mondayKey,
      "Content-Type": "application/json",
    };
    const body = JSON.stringify({"query": query });
    const mondayPutResponsePremise = await fetch(
      mondayApiUrl,
      { method: "POST", headers: headers, body: body }
    ).then((response) => {
      try {
        return response.json();
      } catch (e) {
        console.error(e);
        return [ response ];
      }
    });
    const mondayPutResponse = await mondayPutResponsePremise;
    const lastUpdatedItem = mondayPutResponse?.["data"]?.["change_column_value"]?.["name"] ?? false;
    if(lastUpdatedItem) {
      this.setState({ lastUpdatedItem: lastUpdatedItem });
    }
  };

  render() {
    if (this.state.getDatedMondayItemsToJson) {
      //@ts-ignore
      this.getDatedMondayTasksToJsons(monday_key,boardId,columnRenames);
    }
    if(this.state.mondayTasksByCategory.length) {
      const treeMapPlaceholder = document.querySelector("#treeMap");
      if(!treeMapPlaceholder) { return; }
      treeMapPlaceholder.innerHTML = "";
      treeMapPlaceholder.appendChild(this.state.mondayTasksByCategory[0]);
    }
    return React.createElement(
      "div", {
        id: "taskManagerWrapper",
        style: { width: "calc(100% - 0.8em)" }
      },
      React.createElement(
        "button", {
          id: "refreshTasksButton",
          onClick: //@ts-ignore
            () => this.setState({ getDatedMondayItemsToJson: true })
        }, "Refresh tasks"
      ),
      React.createElement(
        "span",
        {
          id: "lastRefreshDateTime",
          style: { paddingLeft: "0.3em" }
        },
        `Last refresh datetime: ${this.state.lastRefreshDateTime}`
      ),
      React.createElement(
        "span",
        {
          id: "lastRefreshDateTime",
          style: { paddingLeft: "0.3em" }
        },
        this.state.lastUpdatedItem && `| ${
          this.state.lastUpdatedItem
        }`
      ),
      React.createElement(
        "div",
        {
          id: "mondayTableContainer",
          className: "table-container",
          style: {
            height: "calc(50% - 4.5em)",
            marginTop: "0.3em",
            paddingTop: "0.1em"
          }
        },
        (Object.keys(this.state.mondayTasksCols).length && !this.state.getDatedMondayItemsToJson)?
        React.createElement(
          "table",
          null,
          React.createElement(
            "thead",
            null,
            React.createElement(
              "tr",
              null,
              [
                Object.keys(this.state.mondayTasksCols[0]).pop(),
                ...Object.keys(this.state.mondayTasksCols[0])
              ].map((taskKey,taskKeyIdx)=>React.createElement(
                "th",
                { key:`${taskKey}${taskKeyIdx}Header` },
                taskKey
              ))
            )
          ),
          React.createElement(
            "tbody",
            null,
            this.state.mondayTasksCols.map((taskRow,idxRow)=>React.createElement(
              "tr",
              { key:`TaskRow${idxRow}`},
              [
                Object.keys(taskRow).pop(),
                ...Object.keys(taskRow)
              ].map((taskKey,taskKeyIdx)=>React.createElement(
                "td",
                {
                  key:`${taskKey}${taskKeyIdx}${idxRow}Td`,
                  className:`${taskKey}-td`,
                },
                //@ts-ignore
                taskRow[taskKey],
                taskKey==="actions"&&[
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
                        this.offsetNDay(-1, taskRow["datetime"], "sec")
                      )
                    }
                  ),
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
                        this.offsetNDay(1, taskRow["datetime"], "sec")
                      )
                    }
                  ),
                ]
              ))
            ))
          )
        ):
        React.createElement(
          "div",
          null,
          "Loading tasks summary table"
        )
      ),
      React.createElement(
        "div",
        {
          className: "flex-container-2",
          style: {
            gap: "0em",
            height: "50%",
            margin: "0.3em 0.3em 0 0.1em",
            position: "relative",
            width: "calc(100% - 1em)"
          }
        },
        React.createElement(
          "div",
          {
            id: "mondayTasksByDayTableContainer",
            className: "table-container",
            style: {
              height: "calc(100% - 0.6em)",
              margin: "0.3em",
              width: "fit-content"
            }
          },
          (Object.keys(this.state.mondayTasksByDay).length && !this.state.getDatedMondayItemsToJson)?
          React.createElement(
            "table",
            null,
            React.createElement(
              "thead",
              null,
              React.createElement(
                "tr",
                null,
                Object.keys(this.state.mondayTasksByDay[0]).map(taskKey=>React.createElement(
                  "th",
                  { key:`${taskKey}HeaderByDay` },
                  taskKey
                ))
              )
            ),
            React.createElement(
              "tbody",
              null,
              this.state.mondayTasksByDay.map((taskRow,idxRow)=>React.createElement(
                "tr",
                { key:`TaskRow${idxRow}ByDay`},
                Object.keys(this.state.mondayTasksByDay[0]).map(taskKey=>React.createElement(
                  "td",
                  {
                    key:`${taskKey}${idxRow}TdByDay`,
                    style:{
                      fontFamily: "monospace",
                      fontSize: "0.7rem"
                    }
                  },
                  taskRow[taskKey]
                ))
              ))
            )
          ):
          React.createElement(
            "div",
            null,
            "Loading tasks by day table"
          )
        ),
        React.createElement(
          "div",
          {
            id:"treeMap",
            style: {
              height: "calc(100% - 0.6em)",
              margin: "0.3em",
              width: "50%"
            }
          },
          ""
        )
      )
    )
  }
}

const domContainer = document.querySelector("#taskManager");
//@ts-ignore
const root = ReactDOM.createRoot(domContainer);
root.render(React.createElement(tasksManager));
