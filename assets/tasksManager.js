"use strict";
const quartersOfHourWeekdays = 14; // 3.5 h
const quartersOfHourWeekends = 20; // 5.0 h
const nextViAsV = false;
const categoryAggrDaysRange = 35; // 63 prev.
const msPerH = 3600000;
const msPerD = msPerH * 24;
const boardId = "3478645467";
const subItemsBoardId = "4700154754";
globalThis.mondayApiUrl = "https://api.monday.com/v2";
globalThis.headers = {
  'Access-Control-Allow-Origin': "*",
  'Content-Type': 'application/json',
  'Referer': '',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
  'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};
const weekday = [
  "U", "M", "T", "W", "R", "F", "S"
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
globalThis.addMondayMeta = (mondayTasksCols) => {
  const currentDate = new Date();
  const lastRangeDay = new Date(offsetNDay(categoryAggrDaysRange))
    .toISOString().substring(0, 16).replace("T", " ");
  mondayTasksCols = mondayTasksCols.map(item => {
    if (!item["datetime"]) {
      item["datetime"] = lastRangeDay
    };
    item["d_diff"] = +(
      (new Date(item["datetime"]).valueOf() - currentDate.valueOf()) / msPerH / 24
    ).toFixed(2);
    item["dur"] = +(parseFloat(item["dur"]).toFixed(1));
    item["date"] = item["datetime"].substring(0, 10);
    const notes = `${item["comments"] ?? ""} ${item["subitems"] ?? ""}`;
    item["notes"] = notes;
    return item;
  });
  let mondayItemsJsonPayload = mondayTasksCols.map(
    (t) => {
      return {
        "cat": t["cat"] ?? "9.➕",
        "task_name": t["task_name"],
        "datetime": t["datetime"],
        "wd": weekday[new Date(t["date"]).getDay()],
        "dur": isNaN(t["dur"]) ? 0.5 : parseFloat(t["dur"]),
        "d_diff": t["d_diff"],
        "actions": t["notes"],
        "task_id": t["task_id"],
        "gr": t["group"],
        "type": t["type"]
      }
    }
  )
  mondayItemsJsonPayload.sort(
    (a, b) => ("" + a["datetime"]).localeCompare(b["datetime"])
  ).map(
    (t, i) => {
      t["#"] = i + 1;
      return t;
    }
  );
  let parentItemDates = {};
  mondayItemsJsonPayload.filter(k => k["task_name"].search(":") !== -1).map(l => {
    const parentName = l["task_name"].substring(0, l["task_name"].search(":"));
    if (!Object.keys(parentItemDates).includes(parentName)) {
      const newDateTime = offsetNDay(1 / 6 - 7e-4, l["datetime"], "min"); // take out 1/6 on summer time
      const newDateTimeStr = new Date(newDateTime).toISOString().substring(0, 16).replace("T", " ");
      parentItemDates[parentName] = newDateTimeStr;
      mondayItemsJsonPayload.filter(m => m["task_name"] === parentName).map(n => {
        n["datetime"] = newDateTimeStr;
        n["d_diff"] = +(
          (new Date(newDateTimeStr).valueOf() - currentDate.valueOf()) / msPerH / 24
        ).toFixed(2);
        n["wd"] = weekday[new Date(newDateTimeStr).getDay()];
      });
    }
  });
  mondayItemsJsonPayload.sort(
    (a, b) => ("" + a["datetime"]).localeCompare(b["datetime"])
  ).map(
    (t, i) => {
      t["#"] = i + 1;
      return t;
    }
  );
  return mondayItemsJsonPayload;
};
globalThis.aggrTasksByCategoryAndDay = (sortedMondayItemsJson) => {
  const msPerH = 3.6e6;
  const msPerDay = (24 * msPerH);
  const daysRangeStart = new Date().getTime();
  const daysRangeEnd = daysRangeStart + (categoryAggrDaysRange * msPerDay);
  const categoryAggrDaysRangeEnd = new Date(daysRangeEnd);
  const currentDate = new Date(
    new Date().toISOString().substring(0, 10)
  ); // Gets current day at 00.00
  const [
    nextClimbingDay, nextVI, nextVF
  ] = [
    "Climb", "(v_i)", "(v_f)"
  ].map(
    (tn) => sortedMondayItemsJson.filter(
      t => t["task_name"] === tn
    ).map(t => t.datetime)[0]
  );
  const arrNextClimbingDays = Array.from(
    { length: categoryAggrDaysRange }, (_, n) => n
  ).filter(
    n => (((
      (+new Date(offsetNDay(n)) - +new Date(nextClimbingDay.substring(0, 10)))
      / msPerDay
    ) + 1) % 2) && (offsetNDay(n) > nextClimbingDay.substring(0, 10))
  ).map((n) => {
    return { "x": offsetNDay(n), "name": "3.🍏", "value": 120 }
  });
  let sortedMondayItemsJsonWithEmptyDates = sortedMondayItemsJson.map(
    t => {
      return {
        "date": t["datetime"].substring(0, 10),
        "dur": t["dur"]
      }
    }
  );
  let mondayTasksByDayDict = sortedMondayItemsJsonWithEmptyDates.reduce(
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
  let renamedSortedMondayItemsJson = sortedMondayItemsJson.map(t => {
    return {
      "x": //Math.floor(new Date(
        t["datetime"].substring(0, 10),
      //).getTime() / msPerDay ) - daysSince1970UntilStartYear
      "name": t["cat"],
      "value": Math.round(t["dur"] * 60)
    };
  });
  renamedSortedMondayItemsJson = renamedSortedMondayItemsJson.concat(arrNextClimbingDays);
  const days = renamedSortedMondayItemsJson.map(t => t["x"])
    .filter((val, idx, arr) => arr.indexOf(val) === idx);
  const categories = [
    "1.🏠", "2.💰", "3.🍏", "4.🚩🇩🇰", "5.🔬", "6.📺", "7.🎮", "8.🌐", "9.➕"
  ];
  days.map(d =>
    categories.map(c => {
      renamedSortedMondayItemsJson.push({ "x": d, "name": c, "value": 0 })
    })
  );
  const tasksDurationByDayCategoryPk = renamedSortedMondayItemsJson.reduce(
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
      if (!accumulator[item["x"]]) {
        accumulator[item["x"]] = 0;
      }
      accumulator[item["x"]] += item["value"]
      return accumulator
    }, {}
  );
  Array.from({ length: categoryAggrDaysRange }, (_, i) => {
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
  const popUpDiv = document.getElementById("popUpDiv") ?? document.createElement("div");

  // Determine the series that need to be stacked.
  const series = globalThis.d3.stack()
    //@ts-ignore .offset(d3.stackOffsetWiggle).order(d3.stackOrderInsideOut) For StreamGraph
    .keys(d3.union(tasksDurationByDayCategory.map(d => d.name))) // distinct series keys, in input order
    .value(([, D], key) => D.get(key)?.value ?? 0) //@ts-ignore get value for each series key and stack
    (d3.index(tasksDurationByDayCategory, d => new Date(d.x), d => d.name)); // group by stack then series key

  const customColors = [
    //"#e15759",
    "#59a14f", // 🏠
    "#9c755f", // 💰
    "#edc949", // 🍏
    "#f28e2c", // 🚩🇩🇰
    "#ff9da7", // 🔬
    "#af7aa1", // 📺
    "#4e79a7", // 🎮
    "#76b7b2", // 🌐
    "#bab0ab66", // ➕
    ""
  ];
  //@ts-ignore
  const color = globalThis.d3.scaleOrdinal()
    .domain(series.map(d => d.key).sort())
    .range(customColors);

  const width = 500;
  const height = 320;
  const marginTop = 10;
  const marginRight = 10;
  const marginBottom = 45;
  const marginLeft = 55;

  // Prepare the scales for positional and color encodings.
  const x = globalThis.d3.scaleUtc() //
    .domain(globalThis.d3.extent(
      tasksDurationByDayCategory, d => new Date(d.x)
    ))
    .range([marginLeft, width - marginRight]);
  //@ts-ignore
  const y = globalThis.d3.scaleLinear() //
    .domain([
      0, globalThis.d3.max(series, d => globalThis.d3.max(d, d => d[1]))
    ]) // globalThis.d3.extent(series.flat(2)) for StreamGraph
    .rangeRound([height - marginBottom, marginTop]);

  //@ts-ignore Construct an area shape
  const area = globalThis.d3.area()
    .x(d => x(d.data[0]))
    .y0(d => y(d[0]))
    .y1(d => y(d[1]))
    .curve(globalThis.d3.curveCardinal.tension(0.1)); // 0 mostly curved, 1 no curve

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
      (d) => Math.abs(d).toLocaleString("en-US")
    ))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick line").clone()
      .attr("x2", width - marginLeft - marginRight)
      .attr("stroke-opacity", 0.1))
    .call(g => g.append("text")
      .attr("x", -marginLeft)
      .attr("y", 30)
      .attr("fill", "currentColor")
      .attr("text-anchor", "start")
      .text("↑ minutes"));

  /** x-axis
  const xTicks = globalThis.d3.axisBottom(x).tickSizeOuter(0)
    .ticks(categoryAggrDaysRange / 2, "%y-%m-%d");
  const xScale = globalThis.d3.scaleTime()
    .domain(globalThis.d3.extent(tasksDurationByDayCategory, d => d.x))
    .range([marginLeft, width - marginRight]);
  */
  svg.append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    //@ts-ignore
    .call(d3.axisBottom(x).tickSizeOuter(0).ticks(categoryAggrDaysRange / 2, "%y-%m-%d") // %a for weekday
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
    .attr("fill", d => color(d.key))
    .attr("d", area)
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
    .text(d => d.key);

  // Legend
  const yOffset = 50;
  const xOffset = 400;
  svg.append("rect").attr("x", xOffset).attr("y", yOffset).attr("width", 85).attr("height", 190)
    .attr("rx", 10).attr("ry", 10).style("fill", "#6666");
  [
    ["1.🏠", "#59a14f"],
    ["2.💰", "#9c755f"],
    ["3.🍏", "#edc949"],
    ["4.🚩🇩🇰", "#f28e2c"],
    ["5.🔬", "#ff9da7"],
    ["6.📺", "#af7aa1"],
    ["7.🎮", "#4e79a7"],
    ["8.🌐", "#76b7b2"],
    ["9.➕", "#bab0ab66"]
  ].map((colorPair, idx) => {
    svg.append("circle").attr("cx", xOffset + 15).attr("cy", 20 * idx + yOffset + 15).attr("r", 6).style("fill", colorPair[1])
    svg.append("text").attr("x", xOffset + 25).attr("y", 20 * idx + yOffset + 15).text(colorPair[0]).style("font-size", "15px")
      .attr("alignment-baseline", "middle").attr("fill", "#FFF")
  });

  const mondayTasksByCategoryAndDay = Object.assign(svg.node(), { scales: { color } });
  mondayTasksByCategoryAndDay.id = "mondayTasksByCategoryAndDay";
  mondayTasksByCategoryAndDay.style.position = "absolute";
  mondayTasksByCategoryAndDay.style.top = 0;
  return mondayTasksByCategoryAndDay;
};
globalThis.aggrTasksByDay = (sortedMondayItemsJson) => {
  const currentDate = new Date(
    new Date().toISOString().substring(0, 10)
  ); // Gets current day at 00.00
  const msPerH = 3.6e6;
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
    return { "date": offsetNDay(n), "dur": 0 }
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
      const totV = ["Sat", "Sun"].includes(wd) ? quartersOfHourWeekends : quartersOfHourWeekdays;
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
        "d_diff": dDiff
      }
    }
  );
};
globalThis.offsetNDay = (n, dateToOffset, precision = "day") => {
  const dateToOffsetAsValue = dateToOffset ?
    new Date(dateToOffset).valueOf() :
    new Date().valueOf();
  const offsetMs = n * msPerD;
  let dateValueOffset = dateToOffsetAsValue + offsetMs;
  dateValueOffset = parseFloat((Math.round(dateValueOffset * 96) / 96).toFixed(4));
  return new Date(
    dateValueOffset
  ).toISOString().substring(0,
    precision === "day" ? 10 :
      precision === "min" ? 16 :
        19 // sec
  );
};
globalThis.setBgBasedOnDDiff = (dDiffStr) => {
  const hToNextDay = new Date().getHours();
  const hToNextWeek = ((8 - (new Date().getDay() % 7)) * 24) - hToNextDay;
  const dDiff = parseFloat(dDiffStr);
  const bgRanges = [
    { "bgRange": -9e3, /*                                          */ "bgColor": "#CC6666DD" }, // passed
    { "bgRange": 0, /*                                             */ "bgColor": "#CC666699" }, // now
    { "bgRange": (24 - hToNextDay) / 24, /*                        */ "bgColor": "#CC766677" }, // today
    { "bgRange": (48 - hToNextDay) / 24, /*                        */ "bgColor": "#CC866655" }, // tomorrow
    { "bgRange": (72 - hToNextDay) / 24, /*                        */ "bgColor": "#CC986655" }, // in_2d
    { "bgRange": (96 - hToNextDay) / 24, /*                        */ "bgColor": "#CCA96655" }, // in_3d
    { "bgRange": (Math.max(96 - hToNextDay, hToNextWeek)) / 24, /* */ "bgColor": "#CCB06655" }, // this_week
    { "bgRange": (168 + hToNextWeek) / 24, /*                      */ "bgColor": "#CCCC6633" }, // next_week
    { "bgRange": (720 - hToNextDay) / 24, /*                       */ "bgColor": "#CCEE6622" }, // this_month
    { "bgRange": 365, /*                                           */ "bgColor": "#99FF6622" }, // this_year
    { "bgRange": 3e4, /*                                           */ "bgColor": "#BBFF6606" } // next_year
  ];
  let bgColor = "#0000";
  bgRanges.filter(
    (bgPair, idx) => dDiff > bgPair.bgRange && dDiff <= bgRanges[idx + 1].bgRange
  ).map(bgPair => {
    bgColor = bgPair.bgColor;
  });
  return bgColor;
};