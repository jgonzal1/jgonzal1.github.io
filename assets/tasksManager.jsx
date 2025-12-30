"use strict";
// @ts-ignore
class tasksManager extends globalThis.React.Component {
  //#region Constructor
  // @ts-ignore
  constructor(props) {
    super(props);
    this.state = {
      colors: {
        "0.➕": /*  */ "#e15759",
        "1.🍏": /*  */ "#edc949",
        "2.🏠": /*  */ "#b5bd68",
        "3.💰": /*  */ "#9c755f",
        "4.🚩🇩🇰": /**/ "#f28e2c",
        "5.🔬": /*  */ "#ff9da7",
        "5.🌿": /*  */ "#59a14f",
        "6.📺": /*  */ "#af7aa1",
        "7.🎮": /*  */ "#4e79a7",
        "8.🌐": /*  */ "#76b7b2",
        "9.➕": /*  */ "#bab0ab66"
      },
      dayOffsetValue: Number(1 / 24),
      getDatedMondayItemsToJson: true,
      hide0DurTasks: true,
      lastRefreshDateTime: "undefined",
      lastUpdatedItem: false,
      lastUpdatedDt: "",
      minsOffsetValue: 60,
      mondayTasksByCategorySvg: [],
      mondayTasksByCategoryAndDay: [],
      mondayTasksByDay: {},
      mondayTasksJson: {},
      nextExercisingDay: "undefined",
      nextVF: "undefined",
      nextVI: "undefined",
    };
  };
  //#endregion
  //#region aggrTasksByCategoryDonutChart
  // @ts-ignore
  aggrTasksByCategoryDonutChart = (mondayTasksSortedJson) => {
    let mondayDursByGroup = mondayTasksSortedJson.reduce(
      // @ts-ignore
      (accumulator, item) => {
        // Separate routines to its section
        if (
          !["360-Yearly", "400->1y", "999-Once"].includes(item["freq"])
        ) {
          if (!accumulator["3.♻️"]) {
            accumulator["3.♻️"] = 0;
          }
          accumulator["3.♻️"] += item["dur"];
          return accumulator;
        }
        // Replace fast-line tasks outside sprint to slow-line
        if (
          // @ts-ignore
          item["Δd"] >= globalThis.categoryAggrDaysRange
          && item["gr"] === "1.🐇"
        ) {
          accumulator["2.🐢"] += item["dur"];
          return accumulator;
        }
        // Fall-back for slow-line, fast-line or new additions
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
    let mondayTasksByCatDict = mondayTasksSortedJson.filter(
      /**
       * @param {any} t
       * @returns {boolean}
       */
      (t) => (new Date(t["datetime"]) <
        new Date(new Date().getTime() +
        // @ts-ignore
        globalThis.categoryAggrDaysRange * 24 * 3.6e6
      ))
    ).reduce(
      // @ts-ignore
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
    // sort by key, uncomment for value
    mondayTasksByCatDict = Object.keys(mondayTasksByCatDict).sort(
      //(a, b) => mondayTasksByCatDict[b] - mondayTasksByCatDict[a]
    ).reduce(
      (obj, key) => {
        // @ts-ignore
        obj[key] = mondayTasksByCatDict[key];
        return obj;
      },
      {}
    );
    // @ts-ignore
    const dataCategoriesAndValues = Object.keys(mondayTasksByCatDict).map(
      (k) => {
        const duration = +(mondayTasksByCatDict[k]);
        return {
          "name": k,
          "value": duration,
          // @ts-ignore
          "color": this.state.colors[k]
        }
      }
    );
    /*let mondayTasksDurationSum = (dataCategoriesAndValues.map(t => t.value)
    .filter(dur => dur > 0).reduce(
      (accumulator, currentValue) => accumulator + currentValue, 0
    ) - mondayDursByGroup["3.🔚"]).toFixed(1);*/

    // @ts-ignore
    const tasksByCatPlaceholder = document.getElementById("tasksByCategory")
      ?? document.createElement("div");
    const [tasksByCategoryWidth, tasksByCategoryHeight] = [500, 400];
    // @ts-ignore
    globalThis.tasksByCategoryWidth = tasksByCategoryWidth;
    // @ts-ignore
    globalThis.tasksByCategoryHeight = tasksByCategoryHeight;
    const margin = 10;
    const radius = Math.min(
      tasksByCategoryWidth, tasksByCategoryHeight
    ) - margin;

    // @ts-ignore
    const donutChartSvg = globalThis.d3.create("svg")
      .attr("width", tasksByCategoryWidth)
      .attr("height", tasksByCategoryHeight)
      .attr("viewBox", [
        -0.6 * tasksByCategoryWidth, -1.2 * tasksByCategoryHeight,
        1.2 * tasksByCategoryWidth, 2.6 * tasksByCategoryHeight
      ])
      .attr("style", "max-width: 100%; height: auto; font: 1em sans-serif;")
      .attr("text-anchor", "middle");

    // @ts-ignore
    // @ts-ignore
    const node = donutChartSvg.append("g")
      .attr(
        "transform", "translate(" + tasksByCategoryWidth + ","
        + tasksByCategoryHeight + ")"
      );

    const donutChartStartAngle = 45;
    // @ts-ignore
    var pie = globalThis.d3.pie().startAngle(donutChartStartAngle)
      // Usually accepts d3.descending but no here. Prevent labels cramming.
      // @ts-ignore
      .sort(null).value((d) => d[1]);
    const data_ready = pie(Object.entries(mondayTasksByCatDict));

    // @ts-ignore
    const arc = globalThis.d3.arc()
      .innerRadius(radius * 0.4)
      .outerRadius(radius * 0.8);

    // @ts-ignore
    const outerArc = globalThis.d3.arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    // @ts-ignore
    const fullArc = globalThis.d3.arc()
      .innerRadius(radius)
      .outerRadius(radius);

    donutChartSvg
      .selectAll('allSlices')
      .data(data_ready)
      .join('path')
      .attr('d', arc)
      // @ts-ignore
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
      // @ts-ignore
      .attr('points', (d) => {
        const posA = arc.centroid(d) // line insertion in the slice
        const posB = outerArc.centroid(d) // line break: we use the other arc
        // generator that has been built only for that
        /*
        const posC = outerArc.centroid(d); // Label position = almost the same
        as posB.
        We need the angle to see if the X position will be at the extreme right
        or extreme left
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2
        const toLeft = 0.8 // 0.95 [-1,1] to put it on the right or on the left
        posC[0] = radius * toLeft * (midAngle < Math.PI ? 1 : -1);
        */
        return [posA, posB]//, posC]
      });

    donutChartSvg
      .selectAll('allLabels')
      .data(data_ready)
      .join('text')
      // @ts-ignore
      .text(d => `${d.data[0]} ${d.data[1]}`)
      // @ts-ignore
      .attr('transform', function (d) {
        const pos = fullArc.centroid(d);
        /*
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        const toLeft = 0.85; // 0.99
        pos[0] = radius * toLeft * (midAngle < Math.PI ? 1 : -1);
        */
        return `translate(${pos})`;
      })
      .style("font-size", "3.5em")
      // @ts-ignore
      // @ts-ignore
      .style('text-anchor', (d) => {
        //const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        return "middle"; //(midAngle < Math.PI ? 'start' : 'end');
      })
      .style('fill', () => '#FFF');

    donutChartSvg.append("text").style("fill", "#FFF")
      .style("font-size", "2.75em").attr("y", "-80").text(() =>
        // @ts-ignore
        `${globalThis.totalHPerWeek}h/w`
      );
    donutChartSvg.append("text").style("fill", "#FFF")
      .style("font-size", "2.75em").attr("y", "-40").text(() =>
        `1.🐇${mondayDursByGroup["1.🐇"]}h/${(
          // @ts-ignore
          parseFloat(mondayDursByGroup["1.🐇"]) / globalThis.totalHPerWeek
        ).toFixed(1)}w`
      );
    donutChartSvg.append("text").style("fill", "#FFF")
      .style("font-size", "2.75em").attr("y", "0").text(() =>
        `2.🐢${mondayDursByGroup["2.🐢"]}h/${(
          // @ts-ignore
          parseFloat(mondayDursByGroup["2.🐢"]) / globalThis.totalHPerWeek
        ).toFixed(1)}w`
      );
    donutChartSvg.append("text").style("fill", "#FFF")
      .style("font-size", "2.75em").attr("y", "40").text(() =>
        `3.♻️${mondayDursByGroup["3.♻️"]}h/${(
          // @ts-ignore
          parseFloat(mondayDursByGroup["3.♻️"]) / globalThis.totalHPerWeek
        ).toFixed(1)}w`
      );
    const SUM = (
      parseFloat(mondayDursByGroup["1.🐇"])
      + parseFloat(mondayDursByGroup["2.🐢"])
      + parseFloat(mondayDursByGroup["3.♻️"])
    ).toFixed(1);
    donutChartSvg.append("text").style("fill", "#FFF")
      .style("font-size", "2.75em").attr("y", "80").text(() =>
        `∑: ${SUM}h/${(parseFloat(SUM) / 20).toFixed(1)}w`
      );

    return Object.assign(donutChartSvg.node());
  };
  //#endregion
  //#region filterTasks
  filterTasks = () => {
    var input, filter, table, tr, td, i, j, txtValue;
    input = document.getElementById("filterTasks");
    // @ts-ignore
    filter = input.value.toUpperCase();
    table = document.getElementById("mondayTasksByDayTable");
    // @ts-ignore
    tr = table.getElementsByTagName("tr");

    // Loop tbody rows (not <1: thead), and hide those not matching search query
    for (i = 1; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td");
      tr[i].style.visibility = "hidden";
      tr[i].style.position = "absolute";
      for (j = 0; j < td.length; j++) {
        if (td[j]) {
          txtValue = td[j].textContent || td[j].innerText || td[j].innerHTML;
          if (txtValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.visibility = "visible";
            tr[i].style.position = "relative";
            continue
          }
        }
      }
    }
  };
  //#endregion
  //#region getMondayTasksToMultipleJson
  getMondayTasksToMultipleJson = async (
    // @ts-ignore
    mondayKey, boardId, columnRenames
  ) => {
    const subItemColNames = [
      "datetime", "dur", "status", "freq", "cat", "house", "notes"
    ];
    // @ts-ignore
    globalThis.headers["Authorization"] = mondayKey;
    const query = `boards (ids: ${boardId}) { ` +
      "items_page (limit: 200) { items { " +
      "group { title id } id name column_values { column { id } text value } " +
      "subitems { id name column_values { text } } } } items_count }"
    const body = JSON.stringify({ "query": "query { " + query + " }" });
    const mondayItemsRawJsonPremise = await fetch(
      // @ts-ignore
      globalThis.mondayApiUrl,
      // @ts-ignore
      { method: "POST", headers: globalThis.headers, body: body }
    ).then(async (response) => {
      try {
        const respJson = await response.json();
        return respJson;
      } catch (e) {
        console.error(e);
        return [response];
      }
    });
    const mondayItemsRawJson = await mondayItemsRawJsonPremise;
    /** @type {any} */
    let mondayTasksJson = [];
    // @ts-ignore
    // @ts-ignore
    let rawItemIdx = 0;
    mondayItemsRawJson["data"]["boards"][0]["items_page"]["items"].map(
      // @ts-ignore
      // @ts-ignore
      (rawItem, rawItemIdx) => {
        let taskIds = {
          "task_id": rawItem["id"],
          "task_name": rawItem["name"],
          "group": rawItem["group"]["title"],
          "type": "item"
        };
        // @ts-ignore
        rawItem.column_values.map((itemCol) => {
          // @ts-ignore
          taskIds[
            columnRenames[itemCol.column.id]
          ] = itemCol.text;
        });
        mondayTasksJson.push(taskIds);
        if (rawItem["subitems"].length) {
          // @ts-ignore
          // @ts-ignore
          rawItem["subitems"].map((subItem, subItemIdx) => {
            let subTaskIds = {
              "task_id": subItem["id"],
              "task_name": `${rawItem["name"]}: ${subItem["name"]}`,
              "group": rawItem["group"]["title"],
              "type": "subitem"
            };
            // @ts-ignore
            subItem["column_values"].map((subItemCol, subItemColIdx) => {
              // @ts-ignore
              subTaskIds[subItemColNames[subItemColIdx]] = subItemCol.text;
            });
            mondayTasksJson.push(subTaskIds);
          });
        }
      }
    );
    // @ts-ignore
    const mondayTasksSortedJson = globalThis.addMondayMeta(mondayTasksJson);
    // @ts-ignore
    const mondayTasksByDay = globalThis.aggrTasksByDay(mondayTasksSortedJson);
    const mondayTasksByCategorySvg = this.aggrTasksByCategoryDonutChart(
      mondayTasksSortedJson
    );
    const tasksByCategoryAndDayPlaceholder = document.querySelector(
      "#tasksByCategoryAndDay"
    );
    if (!tasksByCategoryAndDayPlaceholder) { return; }
    tasksByCategoryAndDayPlaceholder.innerHTML = "";
    tasksByCategoryAndDayPlaceholder.appendChild(
      // @ts-ignore
      globalThis.aggrTasksByCategoryAndDay(mondayTasksSortedJson)
    );
    //console.log(mondayTasksSortedJson);
    this.setState({
      mondayTasksJson: mondayTasksSortedJson,
      mondayTasksByCategorySvg: [mondayTasksByCategorySvg],
      mondayTasksByDay: mondayTasksByDay,
      getDatedMondayItemsToJson: false,
      lastRefreshDateTime: new Date().toISOString().replace("T", " ")
        .substring(2, 19)
    });
    return mondayTasksSortedJson;
  };
  //#endregion
  //#region putMondayDateItem
  putMondayDateItem = async (
    // @ts-ignore
    mondayKey, boardId, itemId, dateTimeToSet, type
  ) => {
    // @ts-ignore
    globalThis.headers["Authorization"] = mondayKey;
    let query;
    const lastRefreshDateTime = new Date().toISOString().replace("T", " ")
      .substring(2, 19);
    if (type === "item") {
      query = `mutation { change_column_value ( ${""
        }board_id: ${boardId}, item_id: ${itemId}, column_id: "date", value: ${""
        }"{\\"date\\":\\"${dateTimeToSet.substring(0, 10)}\\", ${""
        }\\"time\\":\\"${dateTimeToSet.substring(11)}\\", ${""
        }\\"changed_at\\":\\"${lastRefreshDateTime}\\"${""
        }}") { name } }`;
    } else if (type === "subitem") {
      query = `mutation {
        change_multiple_column_values(
            board_id: ${boardId}
            item_id: ${itemId}
            create_labels_if_missing: true
            column_values: "{\\"date0\\": \\"${dateTimeToSet}\\"}"
        ) { name }
      }`;
    }
    const body = JSON.stringify({ "query": query });
    const mondayPutResponsePremise = await fetch(
      // @ts-ignore
      globalThis.mondayApiUrl,
      // @ts-ignore
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
    const lastUpdatedItem = type === "item" ?
      (mondayPutResponse?.["data"]?.["change_column_value"]?.["name"] ?? "") :
      mondayPutResponse?.["data"]?.["change_multiple_column_values"]?.["name"]
      ?? "";
    if (lastUpdatedItem) {
      this.setState({
        lastRefreshDateTime: lastRefreshDateTime,
        lastUpdatedItem: lastUpdatedItem,
        lastUpdatedDt: dateTimeToSet
      });
    }
  };
  //#endregion
  //#region mondayItemToBacklog
  mondayItemToBacklog = async (
    // @ts-ignore
    mondayKey, boardId, itemId, type
  ) => {
    // @ts-ignore
    globalThis.headers["Authorization"] = mondayKey;
    let query;
    const lastRefreshDateTime = new Date().toISOString().replace("T", " ")
      .substring(2, 19);
    if (type === "item") {
      query = `mutation { change_column_value ( ${""
        }board_id: ${boardId}, item_id: ${itemId}, column_id: "date", value: ${""
        }"{\\"date\\":\\"\", ${""
        }\\"time\\":\\"\", ${""
        }\\"changed_at\\":\\"${lastRefreshDateTime}\\"${""
        }}") { name } }`;
    } else if (type === "subitem") {
      query = `mutation {
        change_multiple_column_values(
          board_id: ${boardId}
          item_id: ${itemId}
          create_labels_if_missing: true
          column_values: "{\\"date0\\": \\"\\", \\"numbers\\": \\"0.02\\"}"
        ) { name }
      }`;
    }
    const body = JSON.stringify({ "query": query });
    const mondayPutResponsePremise = await fetch(
      // @ts-ignore
      globalThis.mondayApiUrl,
      // @ts-ignore
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
    const lastUpdatedItem = type === "item" ?
      (mondayPutResponse?.["data"]?.["change_column_value"]?.["name"] ?? "") :
      mondayPutResponse?.["data"]?.["change_multiple_column_values"]?.["name"]
      ?? "";
    if (lastUpdatedItem) {
      this.setState({
        lastRefreshDateTime: lastRefreshDateTime,
        lastUpdatedItem: lastUpdatedItem
      });
    }
  };
  //#endregion
  //#region archiveMondayItem
  archiveMondayItem = async (
    // @ts-ignore
    mondayKey, boardId, itemId
  ) => {
    // @ts-ignore
    globalThis.headers["Authorization"] = mondayKey;
    const query = `mutation { archive_item ( ${""
      }item_id: ${itemId}) { name } }`;
    const body = JSON.stringify({ "query": query });
    const mondayPutResponsePremise = await fetch(
      // @ts-ignore
      globalThis.mondayApiUrl,
      // @ts-ignore
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
    const lastUpdatedItem = mondayPutResponse?.["data"]?.["archive_item"]?.
    ["name"] ?? false;
    if (lastUpdatedItem) {
      this.setState({ lastUpdatedItem: lastUpdatedItem });
    }
  };
  //#endregion
  //#region setDayOffsetValue
  // @ts-ignore
  setDayOffsetValue = (k) => {
    this.setState({ dayOffsetValue: k })
  };
  //#endregion
  //#region sortTableByColumn
  // @ts-ignore
  sortTableByColumn = (jQuerySelector, columnIndex) => {
    const table = document.querySelector(jQuerySelector);
    const tbody = table.tBodies[0];
    const rows = Array.from(tbody.rows);
    const header = table.tHead.rows[0].cells[columnIndex];

    // Determine sort order and toggle header styles
    let ascending = !header.classList.contains("sorted-asc");
    Array.from(header.parentNode.cells).forEach(cell =>
      cell.classList.remove("sorted-asc", "sorted-desc"));
    header.classList.add(ascending ? "sorted-asc" : "sorted-desc");

    // Sort rows based on the column's text content
    rows.sort((rowA, rowB) => {
      const cellA = rowA.cells[columnIndex]?.textContent ?? "";
      const cellB = rowB.cells[columnIndex]?.textContent ?? "";

      const compare = isNaN(cellA) || isNaN(cellB)
        ? cellA.localeCompare(cellB) // Alphabetical sort
        : parseFloat(cellA) - parseFloat(cellB); // Numerical sort

      return ascending ? compare : -compare;
    });
    rows.map(row => tbody.appendChild(row));
  };
  //#endregion
  render() {
    //#region State listeners
    if (this.state.getDatedMondayItemsToJson) {
      //@ts-ignore
      this.getMondayTasksToMultipleJson(monday_key, boardId, columnRenames);
    }
    if (this.state.mondayTasksByCategorySvg.length) { // Add Donut Chart
      const tasksByCategoryPlaceholder = document.querySelector(
        "#tasksByCategory"
      );
      if (!tasksByCategoryPlaceholder) { return; }
      tasksByCategoryPlaceholder.innerHTML = "";
      tasksByCategoryPlaceholder.appendChild(
        this.state.mondayTasksByCategorySvg[0]
      );
      const treesPlantedDom = document.createElement("span");
      treesPlantedDom.innerHTML = "0/400 🌳";
      Object.assign(treesPlantedDom.style, {
        position: "absolute",
        left: "40vw",
        top: 0,
        fontSize: "1.4em",
        fontWeight: "bold",
        // @ts-ignore
        width: tasksByCategoryPlaceholder.computedStyleMap().get("width")?.
        // @ts-ignore
        ["values"]?.[1]?.["value"] ?? (globalThis.tasksByCategoryHeight)
      });
      tasksByCategoryPlaceholder.appendChild(treesPlantedDom);
    }
    //#endregion
    // @ts-ignore
    return React.createElement(
      "div",
      {
        id: "taskManagerWrapper",
        style: { paddingLeft: "0.5em", width: "calc(100% - 0.8em)" },
      },
      // @ts-ignore
      React.createElement(
        "div",
        { id: "taskManagerTopBar", style: { paddingTop: "0.3em" } },
        //#region refreshTasksButton
        // @ts-ignore
        React.createElement(
          "button", {
          id: "refreshTasksButton",
          onClick: //@ts-ignore
            () => this.setState({ getDatedMondayItemsToJson: true })
        }, "Refresh tasks"
        ),
        //#endregion
        //#region setMinsOffset
        // @ts-ignore
        React.createElement(
          "input",
          {
            id: "setMinsOffset",
            value: this.state.minsOffsetValue,
            // @ts-ignore
            onChange: (e) => this.setState({
              minsOffsetValue: e.target.value,
              dayOffsetValue: (parseFloat(e.target.value) / 24 / 60)
                .toExponential(3)
            }),
            style: {
              backgroundColor: "#FFF9",
              borderRadius: "0.3em",
              fontWeight: "bold",
              marginLeft: "0.3em",
              paddingLeft: "0.3em",
              width: "4.6em"
            }
          },
          null
        ),
        //#endregion
        //#region lastRefreshDateTime
        // @ts-ignore
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
        //#endregion
        //#region setDayOffset
        // @ts-ignore
        React.createElement(
          "input",
          {
            id: "setDayOffset",
            value: typeof (this.state.dayOffsetValue) === "number" ?
              parseFloat(this.state.dayOffsetValue.toPrecision(5)) :
              this.state.dayOffsetValue,
            // @ts-ignore
            onChange: (e) => this.setState({
              minsOffsetValue: (parseFloat(e.target.value) * 60 * 24)
                .toExponential(2),
              dayOffsetValue: e.target.value
            }),
            style: {
              backgroundColor: "#FFF9",
              borderRadius: "0.3em",
              fontWeight: "bold",
              marginLeft: "0.3em",
              paddingLeft: "0.3em",
              width: "5em"
            }
          },
          null
        ),
        //#endregion
        //#region lastRefreshDateTime
        // @ts-ignore
        React.createElement(
          "span",
          {
            id: "lastRefreshDateTime",
            style: {
              display: "inline-block",
              padding: "0 0.3em"
            }
          },
          `day(s) offset`
        ),
        // @ts-ignore
        (this.state.lastRefreshDateTime !== "undefined") && React.createElement(
          "span",
          {
            id: "lastRefreshDateTime",
            style: {
              display: "inline-block",
              paddingRight: "0.3em"
            }
          },
          `| Last refresh at`
        ),
        // @ts-ignore
        (this.state.lastRefreshDateTime !== "undefined") && React.createElement(
          "span",
          {
            id: "lastRefreshDateTime",
            style: {
              display: "inline-block",
              color: "#999",
              paddingRight: "0.3em"
            }
          },
          this.state.lastRefreshDateTime.substring(9) // time
        ),
        //#endregion
        //#region filter
        // @ts-ignore
        React.createElement(
          "input",
          {
            type: "text",
            id: "filterTasks",
            onKeyUp: () => this.filterTasks(),
            placeholder: "Search for tasks..",
            style: {
              backgroundColor: "#FFF9",
              borderRadius: "0.3em",
              fontWeight: "bold",
              marginLeft: "0.3em",
              paddingLeft: "0.3em",
            }
          },
        ),
        //#endregion
        //#region lastUpdatedItem
        // @ts-ignore
        React.createElement(
          "div",
          {
            id: "lastUpdatedItem",
            style: {
              display: "inline-block",
              fontSize: "0.88em",
              paddingLeft: "0.1em",
              right: "10em",
              top: "0em",
              width: "fit-content"
            }
          },
          this.state.lastUpdatedItem && `| Last upd. item is `,
          // @ts-ignore
          this.state.lastUpdatedItem && React.createElement(
            "span",
            {
              id: "lastUpdatedItem",
              style: {
                color: "#999",
                fontSize: "1em",
                paddingLeft: "0.1em",
              }
            },
            this.state.lastUpdatedItem
          ),
          this.state.lastUpdatedItem && this.state.lastUpdatedDt &&
          // @ts-ignore
          React.createElement(
            "span",
            {
              id: "lastUpdatedItem",
              style: {
                fontSize: "1em",
                paddingLeft: "0.1em",
              }
            },
            " to "
          ),
          // @ts-ignore
          this.state.lastUpdatedItem && React.createElement(
            "span",
            {
              id: "lastUpdatedItem",
              style: {
                color: "#999",
                fontSize: "1em",
                paddingLeft: "0.1em",
              }
            },
            this.state.lastUpdatedDt.substring(5, 16)
          ),
        )
      ),
      //#endregion
      //#region mondayTableContainer
      // @ts-ignore
      React.createElement(
        "div",
        {
          id: "mondayTableContainer",
          className: "first-flex-container-item table-container resizable ui-widget-content",
          style: {
            borderColor: "#6666",
            fontSize: "0.924em",
            isolation: "isolate",
            margin: "auto",
            maxHeight:
              `calc(500px - ${this.state.lastUpdatedItem ? "2.5em" : "0em"})`,
            maxWidth: "calc(100% - 1em)",
            marginTop: "0.5em",
          }
        },
        (
          Object.keys(this.state.mondayTasksJson).length &&
          !this.state.getDatedMondayItemsToJson
          // @ts-ignore
        ) ? React.createElement(
          "table",
          {
            id: "mondayTasksByDayTable"
          },
          // @ts-ignore
          React.createElement(
            "thead",
            null,
            // @ts-ignore
            React.createElement(
              "tr",
              { zindex: 1 },
              [
                // @ts-ignore
                Object.keys(this.state.mondayTasksJson[0]).pop(),
                // @ts-ignore
                ...Object.keys(this.state.mondayTasksJson[0])
              ].map(
                // @ts-ignore
                (taskKey, taskKeyIdx) => React.createElement(
                  "th",
                  {
                    key: `${taskKey}${taskKeyIdx} Header`,
                    id: `${taskKey}${taskKeyIdx}Header`,
                    onClick: () => this.sortTableByColumn(
                      "#mondayTasksByDayTable", taskKeyIdx
                    ),
                    className: "hoverable",
                    style: { cursor: "pointer" }
                  },
                  taskKey,
                  // @ts-ignore
                  React.createElement(
                    "div",
                    {
                      key: `${taskKey}${taskKeyIdx} HeaderOnHover`,
                      className: "hover-text",
                    },
                    "Sort columns by this header"
                  )
                )
              )
            )
          ),
          // @ts-ignore
          React.createElement(
            "tbody",
            null,
            // @ts-ignore
            this.state.mondayTasksJson.map(
              // @ts-ignore
              (taskRow, idxRow) => React.createElement(
                "tr",
                {
                  key: `TaskRow${idxRow} `,
                  style: {
                    // @ts-ignore
                    backgroundColor: globalThis.setBgBasedOnDDiff(
                      taskRow["Δd"]
                    ),
                    textAlign: "center"
                  }
                },
                [
                  Object.keys(taskRow).pop(),
                  ...Object.keys(taskRow)
                ].map((taskKey, taskKeyIdx) => ((
                  (taskKey !== "type") &&
                  (this.state.hide0DurTasks ? (taskRow["dur"] > 0) : true)
                  // @ts-ignore
                ) ? React.createElement(
                  "td",
                  {
                    key: `${taskKey}${taskKeyIdx}${idxRow} Td`,
                    className: `${taskKey}-td`,
                    style: { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "30em" }
                  },
                  ((taskKey === "actions") && (taskRow["dur"] > 0)) ?
                    // @ts-ignore
                    React.createElement(
                      "div",
                      {
                        style: {
                          width: "10em",
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
                          key: `${taskRow["task_id"]} PrioritizeImg`,
                          className: "clickable-icon",
                          style: {
                            paddingRight: "0.3em",
                            userSelect: "none"
                          },
                          onClick: () => this.putMondayDateItem(
                            //@ts-ignore
                            monday_key, taskRow["type"] === "item" ? boardId : subItemsBoardId,
                            taskRow["task_id"],
                            // @ts-ignore
                            globalThis.offsetNDay(-1 * this.state.dayOffsetValue, `${taskRow["datetime"]}:00`, "min"),
                            taskRow["type"]
                          )
                        }
                      ),
                      // @ts-ignore
                      React.createElement(
                        "img",
                        {
                          src: "../public/snooze.png",
                          alt: "Snooze",
                          key: `${taskRow["task_id"]} SnoozeImg`,
                          className: "clickable-icon",
                          style: {
                            paddingRight: "0.3em",
                            userSelect: "none"
                          },
                          onClick: () => this.putMondayDateItem(
                            //@ts-ignore
                            monday_key, taskRow["type"] === "item" ? boardId : subItemsBoardId,
                            taskRow["task_id"],
                            // @ts-ignore
                            globalThis.offsetNDay(this.state.dayOffsetValue, `${taskRow["datetime"]}:00`, "min"),
                            taskRow["type"]
                          )
                        }
                      ),
                      // @ts-ignore
                      React.createElement(
                        "img",
                        {
                          src: "../public/backlog.png",
                          alt: "Archive",
                          key: `${taskRow["task_id"]}BacklogImg`,
                          className: "clickable-icon",
                          style: {
                            paddingRight: "0.3em",
                            userSelect: "none"
                          },
                          onClick: () => this.mondayItemToBacklog(
                            //@ts-ignore
                            monday_key, taskRow["type"] === "item" ? boardId : subItemsBoardId,
                            taskRow["task_id"],
                            taskRow["type"]
                          )
                        }
                      ),
                      // @ts-ignore
                      React.createElement(
                        "img",
                        {
                          src: "../public/archive.png",
                          alt: "Archive",
                          key: `${taskRow["task_id"]}ArchiveImg`,
                          className: "clickable-icon",
                          style: {
                            paddingRight: "0.3em",
                            userSelect: "none"
                          },
                          onClick: () => this.archiveMondayItem(
                            //@ts-ignore
                            monday_key, boardId,
                            taskRow["task_id"]
                          )
                        }
                      ),
                      (
                        taskRow[taskKey] !== " null"
                          ? (/(https?:\/\/[^ ]+)/.exec(taskRow[taskKey])
                            // @ts-ignore
                            ? React.createElement(
                              "a",
                              { href: /(https?:\/\/[^ ]+)/.exec(taskRow[taskKey])?.[1] ?? "" },
                              taskRow[taskKey]
                            ) : taskRow[taskKey])
                          : ""
                      )
                    ) : taskRow[taskKey ?? ""]
                ) : ""))
              )
            )
          )
        ) : // Loading ↓
          // @ts-ignore
          React.createElement(
            "div",
            { style: { color: "#fff" }},
            "Loading tasks summary table"
          )
      ),
      //#endregion
      //#region durations list & cat bubbles
      // @ts-ignore
      React.createElement(
        "div",
        {
          id: "graphsPlaceholder",
          className: "flex-container-2",
          style: {
            border: "1px solid #6666",
            borderRadius: "0.3em",
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
            id: "tasksByCategoryAndDay",
            style: {
              flexGrow: 1,
              // @ts-ignore
              height: `${globalThis.tasksByCategoryHeight}px`,
              margin: "0.1em",
              // @ts-ignore
              width: `${globalThis.tasksByCategoryWidth}px`,
            }
          },
          "Loading tasks by category and day"
        ),
        // @ts-ignore
        React.createElement(
          "div",
          {
            id: "tasksByCategory",
            style: {
              // backgroundColor: "#FFF3", only like this for treeMap
              color: "#FFF",
              // @ts-ignore
              height: `${globalThis.tasksByCategoryWidth}px`,
              margin: "0.1em",
              overflow: "hidden",
              textShadow: "0px 0px 2px #000, 0px 0px 3px #FFF",
              // @ts-ignore
              width: `${globalThis.tasksByCategoryWidth}px`,
            }
          },
          ""
        )
      )
      //#endregion
    )

  }
}
const domContainer = document.querySelector("#taskManager");
// @ts-ignore
const root = globalThis.ReactDOM.createRoot(domContainer);
// @ts-ignore
root.render(React.createElement(tasksManager));
