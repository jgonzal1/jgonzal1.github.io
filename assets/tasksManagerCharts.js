//#region aggrTasksByCategoryAndDay
// @ts-ignore
_g.aggrTasksByCategoryAndDay = (mondayTasksSortedJson) => {
  const msPerH = 3.6e6;
  const msPerDay = (24 * msPerH);
  const currentDateTime = new Date();
  const daysRangeStart = currentDateTime.getTime();
  const daysRangeTomorrow = daysRangeStart + msPerDay / 5; // from around 7 PM
  const daysRangeEnd = daysRangeStart +
    (_g.category_aggr_days_range * msPerDay);
  const category_aggr_days_rangeEnd = new Date(daysRangeEnd);
  /** Get current day at 00.00 */
  const currentDate = new Date(new Date().toISOString().substring(0, 10));
  // @ts-ignore
  const [nextExercisingDay, nextVI, nextVF] = [
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
    const dss = date.toISOString().substring(2, 10);
    const dir = [
      "26-10-01", // Thursday
      "26-10-09", // Friday
      "26-10-13", // Tuesday
      "26-10-16", // Friday
      "26-10-20", // Tuesday
      "26-10-23", // Friday
      "26-10-27", // Tuesday
    ].includes(dss);
    return dir;
    // const dayOfWeekN = date.getDay();
    // return dayOfWeekN >= 1 && dayOfWeekN <= 4;
  }

  /* Exercise days evenly filter
  const nextExercisingDateNum = +new Date(nextExercisingDay.substring(0, 10));
  (((
    (+new Date(offsetNDay(n)) - nextExercisingDateNum)
    / msPerDay
  ) + 1) % 2) */
  const arrNextExercisingDays = Array.from({
    length: (_g.category_aggr_days_range-1)
  }, (_, n) => (n + 1) )/*+1 to avoid current day
  .filter(
    n => (_g.offsetNDay(n) > nextExercisingDay.substring(0, 10))
      && isWeekdayInRange(new Date(_g.offsetNDay(n)))
  )*/.map((n) => {
    return {
      "x": _g.offsetNDay(n),
      "name": "1.🍏",
      "value": _g.daily_exercise_dur_min
    }
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
    "1.🍏", "2.🏠", "3.💰", "4.🚩", "5.🌿", "5.🔬", "8.🌐", "6.📺", "7.🎮",
    "9.➕"
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
  // Skip today if isNight in UTC, to avoid showing 0 for today in the graph
  const isNight = (currentDateTime.getHours() > 16);
  const tasksDurationByDayCategory = Object.keys(
    tasksDurationByDayCategoryPk
  ).map(tDCD => {
    const [x, name] = tDCD.split("|");
    return {
      "x": x,
      "name": name,
      "value": tasksDurationByDayCategoryPk[tDCD] ?? 0
    };
  }).filter(k => (
    new Date(k["x"]) <= new Date(category_aggr_days_rangeEnd)
  ));
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
  Array.from({ length: _g.category_aggr_days_range + 1 }, (_, i) => {
    if (isNight && (i === 0)) {
      return; // Skip today if isNight
    }
    const d = daysRangeStart + (i * msPerDay);
    const wd = weekday[new Date(d).getDay()];
    const maxForDay = ["S", "U"].includes(wd)
      ? (_g.quarters_of_hour_weekends * 15)
      : (_g.quarters_of_hour_weekdays * 15);
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
  const series = _g.d3.stack()
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
    "#f28e2c", // 🚩
    "#59a14f", // 🌿
    "#ff9da7", // 🔬
    "#af7aa1", // 📺
    "#4e79a7", // 🎮
    "#76b7b2", // 🌐
    "#bab0ab66", // ➕
    ""
  ];
  //@ts-ignore
  const color = _g.d3.scaleOrdinal()
    // @ts-ignore
    .domain(series.map(d => d.key).sort())
    .range(customColors);

  const width = 350;
  const height = 300;
  const marginTop = 10;
  const marginRight = 10;
  const marginBottom = 45;
  const marginLeft = 55;

  // Prepare the scales for positional and color encodings.
  // @ts-ignore
  const x = _g.d3.scaleUtc() //
    // @ts-ignore
    .domain(_g.d3.extent(
      // @ts-ignore
      tasksDurationByDayCategory, d => new Date(d.x)
    ))
    .range([marginLeft, width - marginRight]);
  //@ts-ignore
  const y = _g.d3.scaleLinear() //
    .domain([
      // @ts-ignore
      0, _g.d3.max(series, d => _g.d3.max(d, d => d[1]))
    ]) // _g.d3.extent(series.flat(2)) for StreamGraph
    .rangeRound([height - marginBottom, marginTop]);

  //@ts-ignore Construct an area shape
  const area = _g.d3.area()
    // @ts-ignore
    .x(d => x(d.data[0]))
    // @ts-ignore
    .y0(d => y(d[0]))
    // @ts-ignore
    .y1(d => y(d[1]))
    // @ts-ignore
    .curve(_g.d3.curveCardinal.tension(0.1)); // 0 curved, 1 no curve

  //@ts-ignore Create the SVG container
  const svg = _g.d3.create("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("width", width)
    .attr("height", height)
    .attr("style", "max-width: 100%; height: auto;");

  // y-axis without domain line, grid lines and y-label
  svg.append("g")
    .attr("transform", `translate(${marginLeft}, 0)`)
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
  const xTicks = _g.d3.axisBottom(x).tickSizeOuter(0)
    .ticks(_g.category_aggr_days_range / 2, "%y-%m-%d");
  const xScale = _g.d3.scaleTime()
    .domain(_g.d3.extent(tasksDurationByDayCategory, d => d.x))
    .range([marginLeft, width - marginRight]);
  */
  svg.append("g")
    .attr("transform", `translate(0, ${height - marginBottom})`)
    //@ts-ignore
    .call(d3.axisBottom(x).tickSizeOuter(0).ticks(
      _g.category_aggr_days_range / 2, "%y-%m-%d"
    ) // %a for weekday
      // @ts-ignore
      .tickFormat((d) => `${(
        100 + ((new Date(d).valueOf() - currentDate.valueOf()) / msPerH / 24)
      ).toFixed(0).slice(1, 3)
        } ${new Date(d).toISOString().slice(5, 10)
        } ${weekday[new Date(d).getDay()]
        } `))
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
    .style("cursor", "pointer")
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
    .on("click", (/** @type {{ target: { textContent: any; }; }} */ d) => {
      const filterTaskDom = document.getElementById("filterTasks");
      // @ts-ignore
      if (filterTaskDom.value != d.target.textContent) {
        // @ts-ignore
        filterTaskDom.value = d.target.textContent;
      } else {
        // @ts-ignore
        filterTaskDom.value = "";
      }
      _g.filterTasks();
    })
    .append("title")
    // @ts-ignore
    .text(d => d.key);

  // Legend
  const yOffset = 50;
  const xOffset = 400;
  svg.append("rect").attr("x", xOffset).attr("y", yOffset).attr("width", 85)
    .attr("height", 210).attr("rx", 10).attr("ry", 10).style("fill", "#6666");
  [
    ["1.🍏", "#edc949"],
    ["2.🏠", "#b5bd68"],
    ["3.💰", "#9c755f"],
    ["4.🚩", "#f28e2c"],
    ["5.🔬", "#ff9da7"],
    ["5.🌿", "#59a14f"],
    ["6.📺", "#af7aa1"],
    ["7.🎮", "#4e79a7"],
    ["8.🌐", "#76b7b2"],
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
