"use strict";
//#region Variables
// 12 3h, 14 3.5h, 16 4h, 20 5h, 24 6h
const quartersOfHourWeekdays = 12;
const quartersOfHourWeekends = 16;
const weeklyExerciseH = 6;
globalThis.totalHPerWeek = Math.floor(
  quartersOfHourWeekdays * 5 / 4 + quartersOfHourWeekends / 2 - weeklyExerciseH
);
console.log("totalHPerWeek", globalThis.totalHPerWeek);
const nextViAsV = false;
const msPerH = 3600000;
const msPerD = msPerH * 24;
const loadTasksUntilDate = "2025-12-16"; // inclusive
// Number of days from today until loadTasksUntilDate
globalThis.categoryAggrDaysRange = Math.ceil(
  (new Date(loadTasksUntilDate).getTime() - new Date().getTime()) / msPerD
); // 10; */
const boardId = "3478645467";
const subItemsBoardId = "4700154754";
globalThis.mondayApiUrl = "https://api.monday.com/v2";
globalThis.headers = {
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
globalThis.addMondayMeta = (/** @type {any[]} */ mondayTasksJson) => {
  const currentDate = new Date();
  const penultimateDay = new Date(offsetNDay(globalThis.categoryAggrDaysRange - 1))
    .toISOString().substring(0, 16).replace("T", " ");
  const lastRangeDay = new Date(offsetNDay(globalThis.categoryAggrDaysRange))
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
    const notes = `${item["comments"] ?? ""} ${item["subitems"] ?? ""} ${item["notes"] ?? ""}`;
    item["notes"] = notes;
    return item;
  });
  let mondayItemsJsonPayload = mondayTasksJson.map(
    (t) => {
      return {
        "cat": t["cat"] ?? "9.➕",
        "task_name": t["task_name"],
        "datetime": t["datetime"],
        "wd": weekday[new Date(t["date"]).getDay()],
        "dur": isNaN(t["dur"]) ? 0.5 : parseFloat(t["dur"]),
        "Δd": t["Δd"],
        "actions": t["notes"],
        "task_id": t["task_id"],
        "gr": t["group"],
        "type": t["type"],
        "freq": t["freq"],
        "status": t["status"]
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
      const newDateTime = offsetNDay(1 / 6 - 7e-4, l["datetime"], "min");
      // take out 1/6 on summer time
      const newDateTimeStr = new Date(newDateTime).toISOString()
        .substring(0, 16).replace("T", " ");
      // @ts-ignore
      parentItemDates[parentName] = newDateTimeStr;
      mondayItemsJsonPayload.filter(m => m["task_name"] === parentName).map(n => {
        if (n["datetime"] === newDateTime.replace("T", " ").substring(0, 16)) {
          return; // Parent task is already updated today
        }
        /*const query = `mutation { change_column_value ( ${""
          }board_id: ${boardId}, item_id: ${n["task_id"]
          }, column_id: "date", value: "{${""
          }\\"date\\":\\"${newDateTimeStr.substring(0, 10)}\\", ${""
          }\\"time\\":\\"${newDateTimeStr.substring(11)}:00\\", ${""
          }\\"changed_at\\":\\"${
            new Date().toISOString().substring(0, 19)
          }\\"}") { name } }`;
        const body = JSON.stringify({ "query": query });
        fetch(
          globalThis.mondayApiUrl,
          { method: "POST", headers: globalThis.headers, body: body }
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
//#region aggrTasksByCategoryAndDay
// @ts-ignore
globalThis.aggrTasksByCategoryAndDay = (mondayTasksSortedJson) => {
  const msPerH = 3.6e6;
  const msPerDay = (24 * msPerH);
  const daysRangeStart = new Date().getTime();
  const daysRangeEnd = daysRangeStart + (globalThis.categoryAggrDaysRange * msPerDay);
  const categoryAggrDaysRangeEnd = new Date(daysRangeEnd);
  const currentDate = new Date(
    new Date().toISOString().substring(0, 10)
  ); // Gets current day at 00.00
  const [
    // @ts-ignore
    nextExercisingDay, nextVI, nextVF
  ] = [
    "Gym", "(v_i)", "(v_f)"
  ].map(
    (tn) => mondayTasksSortedJson.filter(
      // @ts-ignore
      t => t["task_name"] === tn
    // @ts-ignore
    ).map(t => t.datetime)[0]
  );

  /**
   * Check if date falls under range of weekdays (Monday to Thursday).
   *
   * Range: Monday (1) to Thursday (4). @param {Date} date <br>
   *
   * Example:
   * ```js
   * const currentDate = new Date();
   * console.log(isWeekdayInRange(currentDate));
   * ```
   * */
  function isWeekdayInRange(date) {
      const dayOfWeekN = date.getDay();
      return dayOfWeekN >= 1 && dayOfWeekN <= 4;
  }

  /* Exercise days evenly filter
  const nextExercisingDateNum = +new Date(nextExercisingDay.substring(0, 10));
  (((
    (+new Date(offsetNDay(n)) - nextExercisingDateNum)
    / msPerDay
  ) + 1) % 2) */
  const exerciseMinDuration = 30;
  const arrNextExercisingDays = Array.from(
    { length: globalThis.categoryAggrDaysRange - 2 }, (_, n) => n
  ).filter(
    n => isWeekdayInRange(new Date(offsetNDay(n))) &&
      (offsetNDay(n) > nextExercisingDay.substring(0, 10))
  ).map((n) => {
    return { "x": offsetNDay(n), "name": "1.🍏", "value": exerciseMinDuration }
  });
  let sortedMondayItemsJsonWithEmptyDates = mondayTasksSortedJson.map(
    // @ts-ignore
    t => {
      return {
        "date": t["datetime"].substring(0, 10),
        "dur": t["dur"]
      }
    }
  );
  let mondayTasksByDayDict = sortedMondayItemsJsonWithEmptyDates.reduce(
    // @ts-ignore
    (accumulator, item) => {
      if (!accumulator[item["date"]]) {
        accumulator[item["date"]] = 0;
      }
      accumulator[item["date"]] += item["dur"]
      return accumulator
    }, {}
  );
  Object.keys(mondayTasksByDayDict).map(
    k => mondayTasksByDayDict[k] = mondayTasksByDayDict[k].toPrecision(3)
  );
  // @ts-ignore
  let renamedSortedMondayItemsJson = mondayTasksSortedJson.map(t => {
    return {
      "x": //Math.floor(new Date(
        t["datetime"].substring(0, 10),
      //).getTime() / msPerDay ) - daysSince1970UntilStartYear
      "name": t["cat"],
      "value": Math.round(t["dur"] * 60)
    };
  });
  renamedSortedMondayItemsJson = renamedSortedMondayItemsJson.concat(
    arrNextExercisingDays
  );
  // @ts-ignore
  const days = renamedSortedMondayItemsJson.map(t => t["x"])
    // @ts-ignore
    .filter((val, idx, arr) => arr.indexOf(val) === idx);
  const categories = [
    "1.🍏", "2.🏠", "3.💰", "4.🚩🇩🇰", "5.🌿", "5.🔬", "6.🌐", "7.📺", "8.🎮", "9.➕"
  ];
  // @ts-ignore
  days.map(d =>
    categories.map(c => {
      renamedSortedMondayItemsJson.push({ "x": d, "name": c, "value": 0 })
    })
  );
  const tasksDurationByDayCategoryPk = renamedSortedMondayItemsJson.reduce(
    // @ts-ignore
    (accumulator, item) => {
      const pk = `${item["x"]}|${item["name"]}`;
      if (!accumulator[pk]) {
        accumulator[pk] = 0;
      }
      accumulator[pk] += item["value"]
      return accumulator
    }, {}
  );
  const tasksDurationByDayCategory = Object.keys(
    tasksDurationByDayCategoryPk
  ).map(tDCD => {
    const [x, name] = tDCD.split("|");
    return {
      "x": x,
      "name": name,
      "value": tasksDurationByDayCategoryPk[tDCD] ?? 0
    };
  }).filter(k => (new Date(k["x"]) <= new Date(categoryAggrDaysRangeEnd)));
  let remainingTasksDurationsByDay = tasksDurationByDayCategory.reduce(
    (accumulator, item) => {
      // @ts-ignore
      if (!accumulator[item["x"]]) {
        // @ts-ignore
        accumulator[item["x"]] = 0;
      }
      // @ts-ignore
      accumulator[item["x"]] += item["value"]
      return accumulator
    }, {}
  );
  Array.from({ length: globalThis.categoryAggrDaysRange }, (_, i) => {
    const d = daysRangeStart + (i * msPerDay);
    const wd = weekday[new Date(d).getDay()];
    const maxForDay = ["S", "U"].includes(wd)
      ? (quartersOfHourWeekends * 15)
      : (quartersOfHourWeekdays * 15);
    const date = new Date(d).toISOString().substring(0, 10);
    let matched = false;
    tasksDurationByDayCategory.filter(
      taskToFilter => (
        taskToFilter["x"] === date
        && taskToFilter["name"] === "9.➕"
      )
    ).map(filteredTask => {
      matched = true;
      // @ts-ignore
      const remaining = maxForDay - (remainingTasksDurationsByDay[date] ?? 0);
      filteredTask["value"] += Math.max(0, remaining);
      return filteredTask;
    });
    if (!matched) {
      tasksDurationByDayCategory.push({
        "x": date,
        "name": "9.➕",
        "value": maxForDay
      })
    }
  });
  tasksDurationByDayCategory.sort((a, b) => {
    return b.x < a.x ? -1 : b.x > a.x ? 1 : 0
  });
  //console.log(tasksDurationByDayCategory);
  const popUpDiv = document.getElementById("popUpDiv")
    ?? document.createElement("div");

  // Determine the series that need to be stacked.
  // @ts-ignore
  const series = globalThis.d3.stack()
    //.offset(d3.stackOffsetWiggle).order(d3.stackOrderInsideOut) to StreamGraph
    //@ts-ignore
    .keys(d3.union(tasksDurationByDayCategory.map(d => d.name)))
    // distinct series keys, in input order
    // @ts-ignore
    .value(([, D], key) => D.get(key)?.value ?? 0)
    //@ts-ignore get value for each series key and stack
    (d3.index(tasksDurationByDayCategory, d => new Date(d.x), d => d.name));
  // group by stack then series key

  const customColors = [
    //"#e15759",
    "#edc949", // 🍏
    "#b5bd68", // 🏠
    "#9c755f", // 💰
    "#f28e2c", // 🚩🇩🇰
    "#59a14f", // 🌿
    "#ff9da7", // 🔬
    "#76b7b2", // 🌐
    "#af7aa1", // 📺
    "#4e79a7", // 🎮
    "#bab0ab66", // ➕
    ""
  ];
  //@ts-ignore
  const color = globalThis.d3.scaleOrdinal()
    // @ts-ignore
    .domain(series.map(d => d.key).sort())
    .range(customColors);

  const width = 500;
  const height = 320;
  const marginTop = 10;
  const marginRight = 10;
  const marginBottom = 45;
  const marginLeft = 55;

  // Prepare the scales for positional and color encodings.
  // @ts-ignore
  const x = globalThis.d3.scaleUtc() //
    // @ts-ignore
    .domain(globalThis.d3.extent(
      // @ts-ignore
      tasksDurationByDayCategory, d => new Date(d.x)
    ))
    .range([marginLeft, width - marginRight]);
  //@ts-ignore
  const y = globalThis.d3.scaleLinear() //
    .domain([
      // @ts-ignore
      0, globalThis.d3.max(series, d => globalThis.d3.max(d, d => d[1]))
    ]) // globalThis.d3.extent(series.flat(2)) for StreamGraph
    .rangeRound([height - marginBottom, marginTop]);

  //@ts-ignore Construct an area shape
  const area = globalThis.d3.area()
    // @ts-ignore
    .x(d => x(d.data[0]))
    // @ts-ignore
    .y0(d => y(d[0]))
    // @ts-ignore
    .y1(d => y(d[1]))
    // @ts-ignore
    .curve(globalThis.d3.curveCardinal.tension(0.1)); // 0 curved, 1 no curve

  //@ts-ignore Create the SVG container
  const svg = globalThis.d3.create("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("width", width)
    .attr("height", height)
    .attr("style", "max-width: 100%; height: auto;");

  // y-axis without domain line, grid lines and y-label
  svg.append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    //@ts-ignore
    .call(d3.axisLeft(y).ticks(height / 80).tickFormat(
      // @ts-ignore
      (d) => Math.abs(d).toLocaleString("en-US")
    ))
    // @ts-ignore
    .call(g => g.select(".domain").remove())
    // @ts-ignore
    .call(g => g.selectAll(".tick line").clone()
      .attr("x2", width - marginLeft - marginRight)
      .attr("stroke-opacity", 0.1))
    // @ts-ignore
    .call(g => g.append("text")
      .attr("x", -marginLeft)
      .attr("y", 30)
      .attr("fill", "currentColor")
      .attr("text-anchor", "start")
      .text("↑ minutes"));

  /** x-axis
  const xTicks = globalThis.d3.axisBottom(x).tickSizeOuter(0)
    .ticks(globalThis.categoryAggrDaysRange / 2, "%y-%m-%d");
  const xScale = globalThis.d3.scaleTime()
    .domain(globalThis.d3.extent(tasksDurationByDayCategory, d => d.x))
    .range([marginLeft, width - marginRight]);
  */
  svg.append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    //@ts-ignore
    .call(d3.axisBottom(x).tickSizeOuter(0).ticks(
      globalThis.categoryAggrDaysRange / 2, "%y-%m-%d"
    ) // %a for weekday
      // @ts-ignore
      .tickFormat((d) => `${(
        100 + ((new Date(d).valueOf() - currentDate.valueOf()) / msPerH / 24)
      ).toFixed(0).slice(1, 3)
        } ${new Date(d).toISOString().slice(5, 10)
        } ${weekday[new Date(d).getDay()]
        }`))
    .selectAll("text")
    .style("font-family", "courier")
    .style("text-anchor", "end")
    .attr("dx", "-0.5em")
    .attr("dy", "0.1em")
    .attr("transform", () => "rotate(-30)")
  /* ↓ optional
  .call(g => g
    .attr('class', 'grid-lines').selectAll('line')
    .data(xScale.ticks()).join('line')
    .attr('x1', d => xScale(d)).attr('x2', d => xScale(d))
    .attr('y1', marginTop).attr('y2', height - marginBottom))
  .call(g => g.select(".domain").remove())
  */

  // Filling path to graph each series
  svg.append("g")
    .selectAll()
    .data(series)
    .join("path")
    // @ts-ignore
    .attr("fill", d => color(d.key))
    .attr("d", area)
    // @ts-ignore
    .on("mouseover", (d) => {
      popUpDiv.innerHTML = d.target.textContent;
      Object.assign(popUpDiv.style, {
        backgroundColor: color(d.target.textContent),
        border: "1px solid #666",
        borderRadius: "0.3em",
        left: (d.x) + "px",
        padding: "0.1em 0 0.3em 0.3em",
        textShadow: "#000 0 0 1px",
        top: (d.y - 30) + "px"
      })
    })
    .append("title")
    // @ts-ignore
    .text(d => d.key);

  // Legend
  const yOffset = 50;
  const xOffset = 400;
  svg.append("rect").attr("x", xOffset).attr("y", yOffset).attr("width", 85)
    .attr("height", 190).attr("rx", 10).attr("ry", 10).style("fill", "#6666");
  [
    ["1.🍏", "#edc949"],
    ["2.🏠", "#b5bd68"],
    ["3.💰", "#9c755f"],
    ["4.🚩🇩🇰", "#f28e2c"],
    ["5.🔬", "#ff9da7"],
    ["5.🌿", "#59a14f"],
    ["6.🌐", "#76b7b2"],
    ["7.📺", "#af7aa1"],
    ["8.🎮", "#4e79a7"],
    ["9.➕", "#bab0ab66"]
  ].map((colorPair, idx) => {
    svg.append("circle").attr("cx", xOffset + 15)
      .attr("cy", 20 * idx + yOffset + 15).attr("r", 6)
      .style("fill", colorPair[1])
    svg.append("text").attr("x", xOffset + 25)
      .attr("y", 20 * idx + yOffset + 15).text(colorPair[0])
      .style("font-size", "15px").attr("alignment-baseline", "middle")
      .attr("fill", "#FFF")
  });

  const mondayTasksByCategoryAndDay = Object.assign(
    svg.node(), { scales: { color } }
  );
  mondayTasksByCategoryAndDay.id = "mondayTasksByCategoryAndDay";
  mondayTasksByCategoryAndDay.style.position = "absolute";
  mondayTasksByCategoryAndDay.style.top = 0;
  return mondayTasksByCategoryAndDay;
};
//#endregion
//#region aggrTasksByDay @deprecated?
// @ts-ignore
globalThis.aggrTasksByDay = (mondayTasksSortedJson) => {
  const currentDate = new Date(
    new Date().toISOString().substring(0, 10)
  ); // Gets current day at 00.00
  const msPerH = 3.6e6;
  const [
    nextExercisingDay, nextVI, nextVF
  ] = [
    "Gym", "(v_i)", "(v_f)"
  ].map(
    (tn) => mondayTasksSortedJson.filter(
      // @ts-ignore
      t => t["task_name"] === tn
    // @ts-ignore
    ).map(t => t.datetime)[0]
  );
  let sortedMondayItemsJsonWithEmptyDates = mondayTasksSortedJson.map(
    // @ts-ignore
    t => {
      return {
        "date": t["datetime"].substring(0, 10),
        "dur": t["dur"]
      }
    }
  );
  const arrNext21D = Array.from({ length: 21 }, (_, n) => n).map((n) => {
    return { "date": offsetNDay(n), "dur": 0 }
  });
  sortedMondayItemsJsonWithEmptyDates = sortedMondayItemsJsonWithEmptyDates
    .concat(arrNext21D).sort(
      // @ts-ignore
      (a, b) => ("" + a["date"]).localeCompare(b["date"])
    );
  const mondayTasksByDayDict = sortedMondayItemsJsonWithEmptyDates.reduce(
    // @ts-ignore
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
          new Date(nextExercisingDay).valueOf()
        ) / msPerD
      ));
      const isOddDayDiff = !!(dayDiff % 2) && (dayDiff >= 0);
      const durOffs = isOddDayDiff ? duration + 2 : duration;
      const totV = ["Sat", "Sun"].includes(wd) ? quartersOfHourWeekends
        : quartersOfHourWeekdays;
      const usedTime = Math.min(Math.ceil(4 * durOffs), 21);
      const unUsedTime = Math.max(totV - usedTime, 0);
      let nextViD = nextVI;
      if (nextViAsV) {
        nextViD = nextVI.substring(0, 10);
      }
      const setDurStrAsV = (k >= nextViD && k <= nextVF);
      const durStr = `${"|".repeat(usedTime)}${setDurStrAsV ?
        "v".repeat(unUsedTime) :
        ".".repeat(unUsedTime)}`;
      const kDate = new Date(k);
      const dDiff = (
        ((+kDate - +currentDate) + msPerH)
        / msPerH / 24
      ).toFixed(2);
      return {
        "date": k,
        "wd": wd,
        "dur_offs": durOffs,
        "dur_str": durStr,
        "Δd": dDiff
      }
    }
  );
};
//#endregion
//#region offsetNDay
// @ts-ignore
globalThis.offsetNDay = (n, dateToOffset, precision = "day") => {
  const dateToOffsetAsValue = dateToOffset ?
    new Date(dateToOffset).valueOf() :
    new Date().valueOf();
  const offsetMs = n * msPerD;
  const dateValueOffset = dateToOffsetAsValue + offsetMs;
  let dateStrOffset = new Date(
    dateValueOffset
  ).toISOString().substring(0,
    precision === "day" ? 10 : 19 // sec
  );
  if (precision === "min") {
    const timePrecision = dateStrOffset.substring(
      dateStrOffset.length - 5, dateStrOffset.length - 3
    );
    let roundedTimePrecision = (
      Math.floor(parseInt(timePrecision, 10) / 30) * 30
    ).toString();
    if (roundedTimePrecision === "0") {
      roundedTimePrecision = "00";
    }
    dateStrOffset = `${dateStrOffset.substring(0, dateStrOffset.length - 5)}${roundedTimePrecision.toString()}:00`.replace("T", " ");
  }
  return dateStrOffset;
};
//#endregion
//#region setBgBasedOnDDiff
// @ts-ignore
globalThis.setBgBasedOnDDiff = (dDiffStr) => {
  const hToNextDay = new Date().getHours();
  const hToNextWeek = ((8 - (new Date().getDay() % 7)) * 24) - hToNextDay;
  const dDiff = parseFloat(dDiffStr);
  const bgRanges = [
    { "bgRange": -9e3, "bgColor": "#CC6666DD" }, // passed
    { "bgRange": 0, "bgColor": "#CC6666AA" }, // now
    { "bgRange": (24 - hToNextDay) / 24, "bgColor": "#CC766699" }, // today
    { "bgRange": (48 - hToNextDay) / 24, "bgColor": "#CC866677" }, // tomorrow
    { "bgRange": (72 - hToNextDay) / 24, "bgColor": "#CC986677" }, // in_2d
    { "bgRange": (96 - hToNextDay) / 24, "bgColor": "#CCA96670" }, // in_3d
    {
      "bgRange": (
        Math.max(120 - hToNextDay, hToNextWeek)
      ) / 24, "bgColor": "#CCB06650"
    }, // this_week
    { "bgRange": (120 + hToNextWeek) / 24, "bgColor": "#CCCC664D" }, // next_w
    { "bgRange": (720 - hToNextDay) / 24, "bgColor": "#CCEE663D" }, // this_mo
    { "bgRange": 365, "bgColor": "#99FF662D" }, // this_year
    { "bgRange": 3e4, "bgColor": "#BBFF6606" } // next_year
  ];
  let bgColor = "#0000";
  bgRanges.filter((bgPair, idx) =>
    dDiff > bgPair.bgRange && dDiff <= bgRanges[idx + 1].bgRange
  ).map(bgPair => {
    bgColor = bgPair.bgColor;
  });
  return bgColor;
};
//#endregion
