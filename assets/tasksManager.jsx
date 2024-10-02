"use strict";
class tasksManager extends globalThis.React.Component {
  //#region Constructor and functions
  constructor(props) {
    super(props);
    this.state = {
      colors: {
        "0.➕": /*  */ "#e15759",
        "1.🏠": /*  */ "#59a14f",
        "2.💰": /*  */ "#9c755f",
        "3.🍏": /*  */ "#edc949",
        "4.🚩🇩🇰": /**/ "#f28e2c",
        "5.🔬": /*  */ "#ff9da7",
        "6.📺": /*  */ "#af7aa1",
        "7.🎮": /*  */ "#4e79a7",
        "8.🌐": /*  */ "#76b7b2",
        "9.➕": /*  */ "#bab0ab66"
      },
      dayOffsetValue: Number(1 / 24),
      getDatedMondayItemsToJson: true,
      lastRefreshDateTime: "undefined",
      lastUpdatedItem: false,
      minsOffsetValue: 60,
      mondayTasksByCategory: [],
      mondayTasksByCategoryAndDay: [],
      mondayTasksByDay: {},
      mondayTasksCols: {},
      nextClimbingDay: "undefined",
      nextVF: "undefined",
      nextVI: "undefined",
    };
  };
  aggrTasksByCategoryDonutChart = (sortedMondayItemsJson) => {
    let mondayDursByGroup = sortedMondayItemsJson.reduce(
      (accumulator, item) => {
        if (!accumulator[item["gr"]]) {
          accumulator[item["gr"]] = 0;
        }
        accumulator[item["gr"]] += item["dur"];
        return accumulator;
      }, {}
    );
    Object.keys(mondayDursByGroup).map(
      k => mondayDursByGroup[k] = mondayDursByGroup[k].toPrecision(3)
    );
    let mondayTasksByCatDict = sortedMondayItemsJson.reduce(
      (accumulator, item) => {
        if (!accumulator[item["cat"]]) {
          accumulator[item["cat"]] = 0;
        }
        accumulator[item["cat"]] += item["dur"];
        return accumulator;
      }, {}
    );
    Object.keys(mondayTasksByCatDict).map(
      k => mondayTasksByCatDict[k] = mondayTasksByCatDict[k].toPrecision(3)
    );
    mondayTasksByCatDict = Object.keys(mondayTasksByCatDict).sort(
      (a, b) => mondayTasksByCatDict[b] - mondayTasksByCatDict[a]
    ).reduce(
      (obj, key) => {
        obj[key] = mondayTasksByCatDict[key];
        return obj;
      },
      {}
    );
    const dataCategoriesAndValues = Object.keys(mondayTasksByCatDict).map(
      (k) => {
        const duration = +(mondayTasksByCatDict[k]);
        return {
          "name": k,
          "value": duration,
          "color": this.state.colors[k]
        }
      }
    );
    let mondayTasksDurationSum = (dataCategoriesAndValues.map(t => t.value).filter(dur => dur > 0).reduce(
      (accumulator, currentValue) => accumulator + currentValue, 0
    ) - mondayDursByGroup["3. 🔚"]).toFixed(1);

    const tasksByCatPlaceholder = document.getElementById("tasksByCategory") ?? document.createElement("div");
    let tasksByCategoryWidth = 350, tasksByCategoryHeight = 305;
    if (tasksByCatPlaceholder) {
      tasksByCategoryWidth =
        Math.min(
          parseInt(window.getComputedStyle(
            tasksByCatPlaceholder
          )["width"], 10)
          , tasksByCategoryWidth
        );
      tasksByCategoryHeight =
        Math.min(
          parseInt(window.getComputedStyle(
            tasksByCatPlaceholder
          )["height"], 10)
          , tasksByCategoryHeight
        );
    }
    const margin = 40;
    const radius = Math.min(tasksByCategoryWidth, tasksByCategoryHeight) / 2 - margin;

    const donutChartSvg = globalThis.d3.create("svg")
      .attr("width", tasksByCategoryWidth)
      .attr("height", tasksByCategoryHeight)
      .attr("viewBox", [-tasksByCategoryWidth / 2, -tasksByCategoryHeight / 2, tasksByCategoryWidth, tasksByCategoryHeight])
      .attr("style", "max-width: 100%; height: auto; font: 1em sans-serif;")
      .attr("text-anchor", "middle");

    const node = donutChartSvg.append("g")
      .attr("transform", "translate(" + tasksByCategoryWidth / 2 + "," + tasksByCategoryHeight / 2 + ")");

    const donutChartStartAngle = 45;
    var pie = globalThis.d3.pie().startAngle(donutChartStartAngle)
      // sort usually accepts d3.descending, but here we can only do this, to prevent labels cramming
      .sort(null).value((d) => d[1]);
    const data_ready = pie(Object.entries(mondayTasksByCatDict));

    const arc = globalThis.d3.arc()
      .innerRadius(radius * 0.4)
      .outerRadius(radius * 0.8);

    const outerArc = globalThis.d3.arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    const fullArc = globalThis.d3.arc()
      .innerRadius(radius)
      .outerRadius(radius);

    donutChartSvg
      .selectAll('allSlices')
      .data(data_ready)
      .join('path')
      .attr('d', arc)
      .attr('fill', d => this.state.colors[d.data[0]])
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 0.7);

    donutChartSvg
      .selectAll('allPolylines')
      .data(data_ready)
      .join('polyline')
      .attr("stroke", "white")
      .style("fill", "none")
      .attr("stroke-width", 2)
      .attr('points', (d) => {
        const posA = arc.centroid(d) // line insertion in the slice
        const posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
        /*
        const posC = outerArc.centroid(d); // Label position = almost the same as posB
        We need the angle to see if the X position will be at the extreme right or extreme left
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        const toLeft = 0.8 // 0.95 [-1,1] to put it on the right or on the left
        posC[0] = radius * toLeft * (midangle < Math.PI ? 1 : -1);
        */
        return [posA, posB]//, posC]
      });

    donutChartSvg
      .selectAll('allLabels')
      .data(data_ready)
      .join('text')
      .text(d => `${d.data[0]} ${d.data[1]}`)
      .attr('transform', function (d) {
        const pos = fullArc.centroid(d);
        /*
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        const toLeft = 0.85; // 0.99
        pos[0] = radius * toLeft * (midangle < Math.PI ? 1 : -1);
        */
        return `translate(${pos})`;
      })
      .style('text-anchor', (d) => {
        //const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        return "middle"; //(midangle < Math.PI ? 'start' : 'end');
      })
      .style('fill', () => '#FFF');

    donutChartSvg.append("text").style("fill", "#FFF").text(() =>
      `${mondayTasksDurationSum}h/${(parseFloat(mondayTasksDurationSum) / 20).toFixed(1)}w`
    );

    return Object.assign(donutChartSvg.node());
  };
  getDatedMondayTasksToMultipleJson = async (
    mondayKey, boardId, columnRenames
  ) => {
    globalThis.headers["Authorization"] = mondayKey;
    const query = "boards (ids: " + boardId + ") { " +
      "items_page (limit: 500) { items { " +
      "group { title id } id name column_values { column { id } text value } " +
      "} } items_count }"
    const body = JSON.stringify({ "query": "query { " + query + " }" });
    const mondayItemsRawJsonPremise = await fetch(
      globalThis.mondayApiUrl,
      { method: "POST", headers: globalThis.headers, body: body }
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
    const sortedMondayItemsJson = globalThis.addMondayMeta(mondayTasksCols);
    const mondayTasksByDay = globalThis.aggrTasksByDay(sortedMondayItemsJson);
    const mondayTasksByCategory = this.aggrTasksByCategoryDonutChart(sortedMondayItemsJson);
    const tasksByCategoryAndDayPlaceholder = document.querySelector("#tasksByCategoryAndDay");
    if (!tasksByCategoryAndDayPlaceholder) { return; }
    tasksByCategoryAndDayPlaceholder.innerHTML = "";
    tasksByCategoryAndDayPlaceholder.appendChild(
      globalThis.aggrTasksByCategoryAndDay(sortedMondayItemsJson)
    );
    this.setState({
      mondayTasksCols: sortedMondayItemsJson,
      mondayTasksByCategory: [mondayTasksByCategory],
      mondayTasksByDay: mondayTasksByDay,
      getDatedMondayItemsToJson: false,
      lastRefreshDateTime: new Date().toISOString().substring(2, 19).replace("T", " ")
    });
    return sortedMondayItemsJson;
  };
  putMondayDateItem = async (
    mondayKey, boardId, itemId, dateTimeToSet
  ) => {
    globalThis.headers["Authorization"] = mondayKey;
    const query = `mutation { change_column_value ( ${""
      }board_id: ${boardId}, item_id: ${itemId}, column_id: "date", value: "{${""
      }\\"date\\":\\"${dateTimeToSet.substring(0, 10)}\\", ${""
      }\\"time\\":\\"${dateTimeToSet.substring(11)}\\", ${""
      }\\"changed_at\\":\\"${new Date().toISOString().substring(0, 19)}\\"${""
      }}") { name } }`;
    const body = JSON.stringify({ "query": query });
    const mondayPutResponsePremise = await fetch(
      globalThis.mondayApiUrl,
      { method: "POST", headers: globalThis.headers, body: body }
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
      this.setState({ lastUpdatedItem: lastUpdatedItem });
    }
  };
  archiveMondayItem = async (
    mondayKey, boardId, itemId
  ) => {
    globalThis.headers["Authorization"] = mondayKey;
    const query = `mutation { archive_item ( ${""
      }item_id: ${itemId}) { name } }`;
    const body = JSON.stringify({ "query": query });
    const mondayPutResponsePremise = await fetch(
      globalThis.mondayApiUrl,
      { method: "POST", headers: globalThis.headers, body: body }
    ).then((response) => {
      try {
        return response.json();
      } catch (e) {
        console.error(e);
        return [response];
      }
    });
    const mondayPutResponse = await mondayPutResponsePremise;
    const lastUpdatedItem = mondayPutResponse?.["data"]?.["archive_item"]?.["name"] ?? false;
    if (lastUpdatedItem) {
      this.setState({ lastUpdatedItem: lastUpdatedItem });
    }
  }
  setDayOffsetValue = (k) => {
    this.setState({ dayOffsetValue: k })
  };
  //#endregion
  render() {
    //#region State listeners
    if (this.state.getDatedMondayItemsToJson) {
      //@ts-ignore
      this.getDatedMondayTasksToMultipleJson(monday_key, boardId, columnRenames);
    }
    if (this.state.mondayTasksByCategory.length) { // Add Bubble Chart
      const tasksByCategoryPlaceholder = document.querySelector("#tasksByCategory");
      if (!tasksByCategoryPlaceholder) { return; }
      tasksByCategoryPlaceholder.innerHTML = "";
      tasksByCategoryPlaceholder.appendChild(this.state.mondayTasksByCategory[0]);
      const treesPlantedDom = document.createElement("span");
      treesPlantedDom.innerHTML = "0/400 trees planted";
      Object.assign(treesPlantedDom.style, {
        position: "absolute",
        right: 0,
        top: 0,
        width: tasksByCategoryPlaceholder.computedStyleMap().get("width")?.["values"][1]["value"] ?? 305
      });
      tasksByCategoryPlaceholder.appendChild(treesPlantedDom);
    }
    //#endregion
    // taskManagerWrapper
    return React.createElement(
      "div", {
      id: "taskManagerWrapper",
      style: { width: "calc(100% - 0.8em)" }
    },
      // refreshTasksButton
      React.createElement(
        "button", {
        id: "refreshTasksButton",
        onClick: //@ts-ignore
          () => this.setState({ getDatedMondayItemsToJson: true })
      }, "Refresh tasks"
      ),
      // setMinsOffset
      React.createElement(
        "input",
        {
          id: "setMinsOffset",
          value: this.state.minsOffsetValue,
          onChange: (e) => this.setState({
            minsOffsetValue: e.target.value,
            dayOffsetValue: (parseFloat(e.target.value) / 24 / 60).toExponential(3)
          }),
          style: {
            backgroundColor: "#FFF6",
            fontStyle: "italic",
            fontWeight: "bold",
            marginLeft: "0.3em",
            paddingLeft: "0.3em",
            width: "4.6em"
          }
        },
        null
      ),
      // lastRefreshDateTime
      React.createElement(
        "span",
        {
          id: "lastRefreshDateTime",
          style: {
            display: "inline-block",
            paddingLeft: "0.3em"
          }
        },
        `min(s) offset | `
      ),
      // setDayOffset
      React.createElement(
        "input",
        {
          id: "setDayOffset",
          value: this.state.dayOffsetValue,
          onChange: (e) => this.setState({
            minsOffsetValue: (parseFloat(e.target.value) * 60 * 24).toExponential(2),
            dayOffsetValue: e.target.value
          }),
          style: {
            backgroundColor: "#FFF6",
            fontStyle: "italic",
            fontWeight: "bold",
            marginLeft: "0.3em",
            paddingLeft: "0.3em",
            width: "5em"
          }
        },
        null
      ),
      // lastRefreshDateTime
      React.createElement(
        "span",
        {
          id: "lastRefreshDateTime",
          style: {
            display: "inline-block",
            padding: "0 0.3em"
          }
        },
        `day(s) offset | Last refresh: ${this.state.lastRefreshDateTime} `
      ),
      // lastUpdatedItem
      React.createElement(
        "div",
        {
          id: "lastUpdatedItem",
          style: {
            display: "inline-block",
            right: "10em",
            paddingLeft: "0.1em",
            top: "0em",
            width: "fit-content"
          }
        },
        this.state.lastUpdatedItem && `Last upd.item: ${this.state.lastUpdatedItem
        } `
      ),
      // mondayTableContainer
      React.createElement(
        "div",
        {
          id: "mondayTableContainer",
          className: "first-flex-container-item table-container",
          style: {
            paddingTop: "0.1em",
            width: "fit-content",
            maxWidth: "calc(100% - 0.8em)",
            maxHeight: `calc(440px - ${this.state.lastUpdatedItem ? "2.5em" : "0em"})` // 640
          }
        },
        (Object.keys(this.state.mondayTasksCols).length && !this.state.getDatedMondayItemsToJson) ?
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
                ].map((taskKey, taskKeyIdx) => React.createElement(
                  "th",
                  { key: `${taskKey}${taskKeyIdx} Header` },
                  taskKey
                ))
              )
            ),
            React.createElement(
              "tbody",
              null,
              this.state.mondayTasksCols.map((taskRow, idxRow) => React.createElement(
                "tr",
                {
                  key: `TaskRow${idxRow} `,
                  style: {
                    backgroundColor: globalThis.setBgBasedOnDDiff(taskRow["d_diff"])
                  }
                },
                [
                  Object.keys(taskRow).pop(),
                  ...Object.keys(taskRow)
                ].map((taskKey, taskKeyIdx) => React.createElement(
                  "td",
                  {
                    key: `${taskKey}${taskKeyIdx}${idxRow} Td`,
                    className: `${taskKey} - td`,
                    style: { height: "2em" }
                  },
                  taskKey === "actions" ? React.createElement(
                    "div",
                    {
                      style: {
                        width: "16em",
                        height: "100%",
                        overflowY: "auto"
                      }
                    },
                    React.createElement(
                      "img",
                      {
                        src: "../public/prioritize.png",
                        alt: "Prioritize",
                        key: `${taskRow["task_id"]} PrioritizeImg`,
                        className: "clickable-icon",
                        style: { paddingRight: "0.3em" },
                        onClick: () => this.putMondayDateItem(
                          //@ts-ignore
                          monday_key, boardId,
                          taskRow["task_id"],
                          globalThis.offsetNDay(-1 * this.state.dayOffsetValue, taskRow["datetime"], "sec")
                        )
                      }
                    ),
                    React.createElement(
                      "img",
                      {
                        src: "../public/snooze.png",
                        alt: "Snooze",
                        key: `${taskRow["task_id"]} SnoozeImg`,
                        className: "clickable-icon",
                        style: { paddingRight: "0.3em" },
                        onClick: () => this.putMondayDateItem(
                          //@ts-ignore
                          monday_key, boardId,
                          taskRow["task_id"],
                          globalThis.offsetNDay(this.state.dayOffsetValue, taskRow["datetime"], "sec")
                        )
                      }
                    ),
                    React.createElement(
                      "img",
                      {
                        src: "../public/archive.png",
                        alt: "Archive",
                        key: `${taskRow["task_id"]} ArchiveImg`,
                        className: "clickable-icon",
                        style: { paddingRight: "0.3em" },
                        onClick: () => this.archiveMondayItem(
                          //@ts-ignore
                          monday_key, boardId,
                          taskRow["task_id"]
                        )
                      }
                    ),
                    (taskRow[taskKey] !== " null" ? taskRow[taskKey] : "")
                  ) : //
                    taskRow[taskKey ?? ""]
                )
                )))
            )
          ) : //
          React.createElement(
            "div",
            null,
            "Loading tasks summary table"
          )
      ),
      // durs list & cat bubbles
      React.createElement(
        "div",
        {
          id: "graphsPlaceholder",
          className: "flex-container-2",
          style: {
            border: "1px solid #CCC",
            gap: "0em",
            height: "315px",
            margin: "0.3em 0.3em 0 0.1em",
            position: "relative",
            width: "calc(100% - 1em)"
          }
        },
        React.createElement(
          "div",
          {
            id: "tasksByCategoryAndDay",
            style: {
              flexGrow: 1,
              height: "305px",
              margin: "0.1em",
              width: "fit-content"
            }
          },
          "Loading tasks by category and day"
        )
        ,
        /*React.createElement(
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
            React.createElement(
              "table",
              { style: { width: "100%" } },
              React.createElement(
                "thead",
                null,
                React.createElement(
                  "tr",
                  null,
                  Object.keys(this.state.mondayTasksByDay[0]).map(taskKey =>
                    React.createElement(
                      "th",
                      { key: `${ taskKey } HeaderByDay` },
                      taskKey
                    )
                  )
                )
              ),
              React.createElement(
                "tbody",
                null,
                this.state.mondayTasksByDay.map((taskRow, idxRow) => React.createElement(
                  "tr",
                  {
                    key: `TaskRow${ idxRow } ByDay`,
                    style: { backgroundColor: globalThis.setBgBasedOnDDiff(taskRow["d_diff"]) }
                  },
                  Object.keys(this.state.mondayTasksByDay[0]).map(taskKey => React.createElement(
                    "td",
                    { key: `${ taskKey }${ idxRow } TdByDay` },
                    taskRow[taskKey]
                  ))
                ))
              )
            ) :
            React.createElement(
              "div",
              null,
              "Loading tasks by day table"
            )
        ),*/
        React.createElement(
          "div",
          {
            id: "tasksByCategory",
            style: {
              // backgroundColor: "#FFF3", only like this for treeMap
              color: "#FFF",
              height: "305px",
              margin: "0.1em",
              overflow: "hidden",
              textShadow: "0px 0px 2px #000, 0px 0px 3px #FFF",
              width: "min(50%, 305px)",
            }
          },
          ""
        )
      )
    )
  }
}
const domContainer = document.querySelector("#taskManager");
const root = globalThis.ReactDOM.createRoot(domContainer);
root.render(React.createElement(tasksManager));
