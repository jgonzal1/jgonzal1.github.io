"use strict";
const quartersOfHourWeekdays = 14; //3.5h
const quartersOfHourWeekends = 20; //5.0h
const nextViAsV = false;
const categoryAggrDaysRange = 42; // 63
const msPerH = 3600000;
const msPerD = msPerH * 24;
const boardId = "3478645467";
globalThis.mondayApiUrl = "https://api.monday.com/v2";
globalThis.headers = {
  'Access-Control-Allow-Origin': "*",
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
globalThis.addMondayMeta = (mondayTasksCols) => {
  const currentDate = new Date();
  const aYearFromNowDt = new Date();
  aYearFromNowDt.setFullYear(aYearFromNowDt.getFullYear() + 1);
  const aYearFromNow = aYearFromNowDt.toISOString().substring(0, 16).replace("T", " ");
  mondayTasksCols = mondayTasksCols.map(item => {
    if (!item["datetime"]) {
      item["datetime"] = aYearFromNow
    };
    item["d_diff"] = +(
      (new Date(item["datetime"]).valueOf() - currentDate.valueOf()) / msPerH / 24
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
        "d_diff": t["d_diff"],
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
}
globalThis.aggrTasksByCategoryAndDay = (sortedMondayItemsJson) => {
  const msPerDay = (24 * 3600 * 1000);
  const daysRangeStart = new Date().getTime();
  const daysRangeEnd = daysRangeStart + (categoryAggrDaysRange * msPerDay);
  const categoryAggrDaysRangeEnd = new Date(daysRangeEnd);
  const renamedSortedMondayItemsJson = sortedMondayItemsJson.map(t => {
    return {
      "x": //Math.floor(
        //new Date(
        t["datetime"].substring(0, 10),
      //).getTime() / msPerDay // Days since 1970
      //) - daysSince1970UntilStartYear // Days since startYear
      "name": t["cat"],
      "value": Math.round(t["dur"] * 60)
    };
  });
  const days = renamedSortedMondayItemsJson.map(t => t["x"]).filter((val, idx, arr) => arr.indexOf(val) === idx);
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
  const tasksDurationByDayCategory = Object.keys(tasksDurationByDayCategoryPk).map(tDCD => {
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
    const maxForDay = ["Sat", "Sun"].includes(wd) ? (quartersOfHourWeekends * 15) : (quartersOfHourWeekdays * 15);
    const date = new Date(d).toISOString().substring(0, 10);
    let matched = false;
    tasksDurationByDayCategory.filter(
      taskToFilter => (taskToFilter["x"] === date && taskToFilter["name"] === "9.➕")
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

  const width = 600;
  const height = 450;
  const marginTop = 10;
  const marginRight = 10;
  const marginBottom = 80;
  const marginLeft = 30;

  // Prepare the scales for positional and color encodings.
  const x = globalThis.d3.scaleUtc() //
    .domain(globalThis.d3.extent(
      tasksDurationByDayCategory, d => new Date(d.x)
    ))
    .range([marginLeft, width - marginRight]);
  //@ts-ignore
  const y = globalThis.d3.scaleLinear() //
    .domain([0, globalThis.d3.max(series, d => globalThis.d3.max(d, d => d[1]))]) // globalThis.d3.extent(series.flat(2)) for StreamGraph
    .rangeRound([height - marginBottom, marginTop]);

  //@ts-ignore Construct an area shape.
  const area = globalThis.d3.area()
    .x(d => x(d.data[0]))
    .y0(d => y(d[0]))
    .y1(d => y(d[1]));

  //@ts-ignore Create the SVG container.
  const svg = globalThis.d3.create("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("width", width)
    .attr("height", height)
    .attr("style", "max-width: 100%; height: auto;");

  // Add the y-axis, remove the domain line, add grid lines and y-label.
  svg.append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    //@ts-ignore
    .call(d3.axisLeft(y).ticks(height / 80).tickFormat((d) => Math.abs(d).toLocaleString("en-US")))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick line").clone()
      .attr("x2", width - marginLeft - marginRight)
      .attr("stroke-opacity", 0.1))
    .call(g => g.append("text")
      .attr("x", -marginLeft)
      .attr("y", 10)
      .attr("fill", "currentColor")
      .attr("text-anchor", "start")
      .text("↑ minutes"));

  // Append the x-axis and remove the domain line.
  svg.append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    //@ts-ignore
    .call(d3.axisBottom(x).tickSizeOuter(0)) // ↓ optional
    .call(g => g.select(".domain").remove());

  // Append the filling path to graph each serie
  svg.append("g")
    .selectAll()
    .data(series)
    .join("path")
    .attr("fill", d => color(d.key))
    .attr("d", area)
    .on("mouseover", (d) => {
      popUpDiv.innerHTML = d.target.textContent;
      popUpDiv.style.left = (d.x) + "px";
      popUpDiv.style.top = (d.y - 30) + "px";
      popUpDiv.style.backgroundColor = color(d.target.textContent);
    })
    .append("title")
    .text(d => d.key);

  // Legend
  const yOffset = 150;
  svg.append("rect").attr("x", 485).attr("y", yOffset).attr("width", 85).attr("height", 190)
    .attr("rx", 10).attr("ry", 10).style("fill", "#666C");
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
    svg.append("circle").attr("cx", 500).attr("cy", 20 * idx + yOffset + 15).attr("r", 6).style("fill", colorPair[1])
    svg.append("text").attr("x", 510).attr("y", 20 * idx + yOffset + 15).text(colorPair[0]).style("font-size", "15px")
      .attr("alignment-baseline", "middle").attr("fill", "#FFF")
  })
  const mondayTasksByCategoryAndDay = Object.assign(svg.node(), { scales: { color } });
  mondayTasksByCategoryAndDay.id = "mondayTasksByCategoryAndDay";
  mondayTasksByCategoryAndDay.style.position = "absolute";
  mondayTasksByCategoryAndDay.style.top = 420;
  // Return the chart with the color scale as a property (for the legend).
  return mondayTasksByCategoryAndDay;
}
globalThis.aggrTasksByDay = (sortedMondayItemsJson) => {
  const currentDate = new Date(new Date().toISOString().substring(0, 10)); // Hets current day at 00.00
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
}
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
function createBubbleChart(sortedMondayItemsJson) {
  const startYear = 2024;
  const tasksDurationByDayCategoryPk = sortedMondayItemsJson.map(t => {
    return {
      "x": //Math.floor(
        //new Date(
        t["datetime"].substring(0, 10),
      //).getTime() / msPerDay // Days since 1970
      //) - daysSince1970UntilStartYear // Days since startYear
      "name": t["cat"],
      "value": Math.round(t["dur"] * 60)
    };
  }).reduce(
    (accumulator, item) => {
      const pk = `${item["x"]}|${item["name"]}`;
      if (!accumulator[pk]) {
        accumulator[pk] = 0;
      }
      accumulator[pk] += item["value"]
      return accumulator
    }, {}
  );
  const tasksDurationByDayCategory = Object.keys(tasksDurationByDayCategoryPk).map(tDCD => {
    const [x, name] = tDCD.split("|");
    return {
      "x": x,
      "name": name,
      "value": tasksDurationByDayCategoryPk[tDCD] ?? 0
    };
  });
  const days = tasksDurationByDayCategory.map(t => t["x"]).filter((val, idx, arr) => arr.indexOf(val) === idx)
  const categories = [
    "1.🏠", "2.💰", "3.🍏", "4.🚩🇩🇰", "5.🔬", "6.📺", "7.🎮", "8.🌐", "9.➕"
  ];
  days.map(d =>
    categories.map(c =>
      tasksDurationByDayCategory.push({ "x": d, "name": c, "value": 0 })
    )
  );

  const colorsMatrix = [
    ["1.🏠", /*  */ "#59a14f"],
    ["2.💰", /*  */ "#9c755f"],
    ["3.🍏", /*  */ "#edc949"],
    ["4.🚩🇩🇰", /**/ "#f28e2c"],
    ["5.🔬", /*  */ "#ff9da7"],
    ["6.📺", /*  */ "#af7aa1"],
    ["7.🎮", /*  */ "#4e79a7"],
    ["8.🌐", /*  */ "#76b7b2"],
    ["9.➕", /*  */ "#bab0ab66"]
  ];
  // @ts-ignore
  const colors = new Map(colorsMatrix);

  // @ts-ignore
  const series = d3.stack()
    .keys(colors.keys())
    .value((group, key) => group.get(key)?.value ?? 0)
    // @ts-ignore
    .order(d3.stackOrderReverse)
    (
      // @ts-ignore
      d3.rollup(tasksDurationByDayCategory,
        ([d]) => d, d => d.x, d => d.name).values()
    ).map(s => (
      s.forEach(d =>
        d.data = d.data.get(s.key)
      ), s
    ))//.map(k => k.filter(l => !!l.data))

  const width = 600;
  const height = 800;
  const marginTop = 10;
  const marginRight = 10;
  const marginBottom = 80;
  const marginLeft = 30;

  // @ts-ignore
  const x = d3.scaleBand()
    .domain(tasksDurationByDayCategory.map(d => d.x))
    .rangeRound([marginLeft, width - marginRight]);

  // @ts-ignore
  const y = d3.scaleLinear()
    // @ts-ignore
    .domain([0, d3.max(series, d => d3.max(d, d => d[1]))]).nice()
    .range([height - marginBottom, marginTop]);

  // @ts-ignore
  const color = d3.scaleOrdinal()
    .domain(colors.keys())
    .range(colors.values());

  // Create the SVG container.
  // @ts-ignore
  const svg = d3.create("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("width", width)
    .attr("height", height)
    .attr("style", "max-width: 100%; height: auto;");

  svg.append("g")
    .selectAll("g")
    .data(series)
    .join("g")
    .attr("fill", ({ key }) => color(key))
    .call(g => g.selectAll("rect")
      .data(d => d)
      .join("rect")
      .attr("x", d => x(d.data.x))
      .attr("y", d => y(d[1]))
      .attr("width", x.bandwidth() - 1)
      .attr("height", d => y(d[0]) - y(d[1]))
      .append("title")
      .text(d => `${d.data.name}, ${d.data.x}, ${/*formatRevenue(*/
        d.data.value/*)*/
        }`));

  // Create X axis
  svg.append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    // @ts-ignore
    .call(d3.axisBottom(x))
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("fill", (d) => {
      const dDiff = Math.round(((
        // @ts-ignore
        new Date(d) - new Date((new Date().toISOString().substring(0, 10)))
      ) + 3.6e6) / 3.6e5) / 240
      const color = `${this.setBgBasedOnDDiff(dDiff).substring(0, 7)}CC`;
      return color;
    })
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-65)");
  //.tickValues(d3.ticks(...d3.extent(x.domain()), width / 80))
  //.tickSizeOuter(10));

  svg.append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    // @ts-ignore
    .call(d3.axisLeft(y))
    // .tickFormat(x => (x / 1e9).toFixed(0)))
    .call(g => g.select(".domain").remove())
    .call(g => g.select(".tick:last-of-type text").clone()
      .attr("x", 5)
      .attr("text-anchor", "start")
      .attr("font-weight", "bold")
      .text("minutes"));

  colorsMatrix.map((colorPair, idx) => {
    svg.append("circle").attr("cx", 500).attr("cy", 20 * idx + 20).attr("r", 6).style("fill", colorPair[1])
    svg.append("text").attr("x", 510).attr("y", 20 * idx + 20).text(colorPair[0]).style("font-size", "15px")
      .attr("alignment-baseline", "middle").attr("fill", "#FFF")
  })

  return Object.assign(svg.node(), { scales: { color } });
}
globalThis.offsetNDay = (n, dateToOffset, precision = "day") => {
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
}
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
function streamGraph(sortedMondayItemsJson) {
  // @ts-ignore
  const msPerDay = (24 * 3600 * 1000);
  const categoryAggrDaysRangeEnd = new Date(new Date().getTime() + (categoryAggrDaysRange * msPerDay))
  const renamedSortedMondayItemsJson = sortedMondayItemsJson.map(t => {
    return {
      "x": //Math.floor(
        //new Date(
        t["datetime"].substring(0, 10),
      //).getTime() / msPerDay // Days since 1970
      //) - daysSince1970UntilStartYear // Days since startYear
      "name": t["cat"],
      "value": Math.round(t["dur"] * 60)
    };
  });
  const days = renamedSortedMondayItemsJson.map(t => t["x"]).filter((val, idx, arr) => arr.indexOf(val) === idx);
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
  const tasksDurationByDayCategory = Object.keys(tasksDurationByDayCategoryPk).map(tDCD => {
    const [x, name] = tDCD.split("|");
    return {
      "x": x,
      "name": name,
      "value": tasksDurationByDayCategoryPk[tDCD] ?? 0
    };
  }).filter(k => (new Date(k["x"]) <= new Date(categoryAggrDaysRangeEnd)));

  // @ts-ignore Determine the series that need to be stacked.
  const series = d3.stack().offset(d3.stackOffsetWiggle).order(d3.stackOrderInsideOut)
    //@ts-ignore
    .keys(d3.union(tasksDurationByDayCategory.map(d => d.name))) // distinct series keys, in input order
    .value(([, D], key) => D.get(key).value) //@ts-ignore get value for each series key and stack
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
  const color = d3.scaleOrdinal()
    .domain(series.map(d => d.key).sort())
    .range(customColors);

  const width = 600;
  const height = 800;
  const marginTop = 10;
  const marginRight = 10;
  const marginBottom = 80;
  const marginLeft = 30;

  // @ts-ignore Prepare the scales for positional and color encodings.
  const x = d3.scaleUtc().domain(d3.extent(tasksDurationByDayCategory, d => new Date(d.x)))
    .range([marginLeft, width - marginRight]);

  //@ts-ignore
  const y = d3.scaleLinear().domain(d3.extent(series.flat(2)))
    .rangeRound([height - marginBottom, marginTop]);

  //@ts-ignore Construct an area shape.
  const area = d3.area()
    .x(d => x(d.data[0]))
    .y0(d => y(d[0]))
    .y1(d => y(d[1]));

  //@ts-ignore Create the SVG container.
  const svg = d3.create("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("width", width)
    .attr("height", height)
    .attr("style", "max-width: 100%; height: auto;");

  // Add the y-axis, remove the domain line, add grid lines and a label.
  svg.append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    //@ts-ignore
    .call(d3.axisLeft(y).ticks(height / 80).tickFormat((d) => Math.abs(d).toLocaleString("es-ES")))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick line").clone()
      .attr("x2", width - marginLeft - marginRight)
      .attr("stroke-opacity", 0.1))
    .call(g => g.append("text")
      .attr("x", -marginLeft)
      .attr("y", 10)
      .attr("fill", "currentColor")
      .attr("text-anchor", "start")
      .text("↑ minutes"));

  // Append the x-axis and remove the domain line.
  svg.append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    //@ts-ignore
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .call(g => g.select(".domain").remove());

  // Append a path for each series.
  svg.append("g")
    .selectAll()
    .data(series)
    .join("path")
    .attr("fill", d => color(d.key))
    .attr("d", area)
    .append("title")
    .text(d => d.key);

  // Legend
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
    svg.append("circle").attr("cx", 470).attr("cy", 20 * idx + 20).attr("r", 6).style("fill", colorPair[1])
    svg.append("text").attr("x", 480).attr("y", 20 * idx + 20).text(colorPair[0]).style("font-size", "15px")
      .attr("alignment-baseline", "middle").attr("fill", "#FFF")
  })

  // Return the chart with the color scale as a property (for the legend).
  return Object.assign(svg.node(), { scales: { color } });
}