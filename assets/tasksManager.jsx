"use strict";
class tasksManager extends React.Component {
  //#region Constructor and functions
  constructor(props) {
    super(props);
    this.state = {
      minsOffsetValue: 60,
      dayOffsetValue: Number(1 / 24),
      getDatedMondayItemsToJson: true,
      lastRefreshDateTime: "undefined",
      lastUpdatedItem: false,
      mondayTasksCols: {},
      mondayTasksByCategoryAndDay: [],
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
  };
  aggrTasksByCategoryPieChart = (sortedMondayItemsJson) => {
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
    //
    this.setState({
      mondayTasksDurationSum: mondayTasksDurationSum
    });
    const tasksByCategoryWidth =
      parseInt(window.getComputedStyle(
        //
        document.getElementById("tasksByCategory") ?? document.createElement("div")
      )["width"], 10);
    const tasksByCategoryHeight =
      Math.min(parseInt(window.getComputedStyle(
        //
        document.getElementById("tasksByCategory") ?? document.createElement("div")
      )["height"], 10), tasksByCategoryWidth * 0.8)
      ;
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
      "#bab0ab66", // ➕
      ""
    ]; // globalThis.d3.scaleOrdinal(treeMapChildren.map(d => d.name), globalThis.d3.schemeTableau10); // alternative
    //
    const color = globalThis.d3.scaleOrdinal(customColors); // for mapping
    const pieChartData = dataCategoriesAndValues.map(nv => {
      return {
        "label": `tc.${nv.name}`,
        "value": nv.value + 2
      }
    });
    //#endregion
    //#region Plot Donut Chart
    const transitionDurationsMs = 200;

    //
    var svg = globalThis.d3.select("body")
      .append("svg")
      .append("g")

    svg.append("g")
      .attr("class", "slices");
    svg.append("g")
      .attr("class", "labels");
    svg.append("g")
      .attr("class", "lines");

    var radius = Math.min(tasksByCategoryWidth, tasksByCategoryHeight) / 2;

    //
    var pie = globalThis.d3.pie()
      // sort usually accepts globalThis.d3.descending, but here we can only do this, to prevent labels cramming
      .sort(null)
      .value((d) => d.value);

    //
    var arc = globalThis.d3.arc()
      .outerRadius(radius * 0.8)
      .innerRadius(radius * 0.4);

    //
    var outerArc = globalThis.d3.arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    svg.attr("transform", "translate(" + tasksByCategoryWidth / 2 + "," + tasksByCategoryHeight / 2 + ")");

    var key = (d) => d.data.label;

    //function plotData() {
    //  var labels = color.domain();
    //  labels = pieChartData;
    //  return labels;
    //}

    (() => {
      var slice = svg.select(".slices").selectAll("path.slice")
        .data(pie(pieChartData), key);

      slice.enter()
        .insert("path")
        .style("fill", (d) => color(d.data.label))
        .attr("class", "slice");

      slice
        .transition().duration(transitionDurationsMs)
        .attrTween("d", (d) => {
          this._current = this._current || d;
          //
          var interpolate = globalThis.d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return (t) => arc(interpolate(t));
        })

      slice.exit()
        .remove();

      var text = svg.select(".labels").selectAll("text")
        .data(pie(pieChartData), key);

      text.enter()
        .append("text")
        .attr("dy", ".35em")
        .text((d) => {
          const label = `${d.data.label} ${d.data.value.toPrecision(3)}`;
          console.log(label);
          return label;
        })

      function midAngle(d) {
        return d.startAngle + (d.endAngle - d.startAngle) / 2;
      }

      text.transition().duration(transitionDurationsMs)
        .attrTween("transform", (d) => {
          this._current = this._current || d;
          //
          var interpolate = globalThis.d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return (t) => {
            var d2 = interpolate(t);
            var pos = outerArc.centroid(d2);
            pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
            return "translate(" + pos + ")";
          };
        })
        .styleTween("text-anchor", (d) => {
          this._current = this._current || d;
          //
          var interpolate = globalThis.d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return (t) => {
            var d2 = interpolate(t);
            return midAngle(d2) < Math.PI ? "start" : "end";
          };
        });

      text.exit()
        .remove();

      var polyline = svg.select(".lines").selectAll("polyline")
        .data(pie(pieChartData), key);

      polyline.enter()
        .append("polyline");

      polyline.transition().duration(transitionDurationsMs)
        .attrTween("points", (d) => {
          this._current = this._current || d;
          //
          var interpolate = globalThis.d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return (t) => {
            var d2 = interpolate(t);
            var pos = outerArc.centroid(d2);
            pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
            return [arc.centroid(d2), outerArc.centroid(d2), pos];
          };
        });

      polyline.exit()
        .remove();
    })()

    return Object.assign(svg.node(), { scales: { color } });
    //#endregion
  };
  aggrTasksByCategoryBubbleChart = (sortedMondayItemsJson) => {
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
    //
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
      "#bab0ab66", // ➕
      ""
    ]; // globalThis.d3.scaleOrdinal(treeMapChildren.map(d => d.name), globalThis.d3.schemeTableau10); // alternative
    //
    const color = globalThis.d3.scaleOrdinal(customColors); // for bubbleChart
    const bubbleChart = dataCategoriesAndValues.map(nv => {
      return {
        "id": `tc.${nv.name}`,
        "value": nv.value + 2
      }
    });
    //#endregion
    //#region Plot Bubble Chart
    const margin = 1; // to avoid clipping the root circle stroke
    const name = d => d.id.split(".").pop(); // "Strings" of "flare.util.Strings"
    const group = d => d.id.split(".")[1]; // "util" of "flare.util.Strings"
    const names = d => name(d).split(/(?=[A-Z][a-z])|\s+/g); // ["Legend", "Item"] of "flare.vis.legend.LegendItems"

    //@ts-ignore [Number format for values](https://observablehq.com/@d3/d3-format?collection=@d3/d3-format)
    const format = globalThis.d3.format(".1f");

    // Create layout
    const pack = globalThis.d3.pack()
      .size([width - margin * 2, height - margin * 2])
      .padding(3);

    // Compute the hierarchy from the (flat) bubbleChart data
    const root = pack(globalThis.d3.hierarchy({ children: bubbleChart })
      .sum(d => d.value));

    //
    const svg = globalThis.d3.create("svg")
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
      //
      .attr("y", (d, i, nodes) => `${i - nodes.length / 2 + 0.35}em`)
      .text(d => d);

    // Add a tspan for the node's value.
    text.append("tspan")
      .attr("x", 0)
      .attr("y", d => `${names(d.data).length / 2 + 0.35}em`)
      .attr("fill-opacity", 0.7)
      .text(d => format(d.value - 2));

    return Object.assign(svg.node(), { scales: { color } });
    //#endregion
  };
  aggrTasksByCategoryAndDay = (sortedMondayItemsJson) => {
    //
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
  aggrTasksByDay = (sortedMondayItemsJson) => {
    const currentDate = new Date();
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
    const mondayTasksByCategory = this.aggrTasksByCategoryBubbleChart(sortedMondayItemsJson);
    const mondayTasksByCategoryAndDay = this.aggrTasksByCategoryAndDay(sortedMondayItemsJson);
    //
    this.setState({
      mondayTasksCols: sortedMondayItemsJson,
      mondayTasksByCategory: [mondayTasksByCategory],
      mondayTasksByCategoryAndDay: [mondayTasksByCategoryAndDay],
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
      //
      this.setState({ lastUpdatedItem: lastUpdatedItem });
    }
  };
  setBgBasedOnDDiff = (dDiffStr) => {
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
  setDayOffsetValue = (k) => {
    //
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
    }
    if (this.state.mondayTasksByCategoryAndDay.length) { // Add Stacked Bar Chart
      const tasksByCategoryAndDayPlaceholder = document.querySelector("#tasksByCategoryAndDay");
      if (!tasksByCategoryAndDayPlaceholder) { return; }
      tasksByCategoryAndDayPlaceholder.innerHTML = "";
      tasksByCategoryAndDayPlaceholder.appendChild(this.state.mondayTasksByCategoryAndDay[0]);
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
          //
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
          style: { paddingLeft: "0.3em" }
        },
        `minute(s) offset |`
      ),
      // setDayOffset
      React.createElement(
        "input",
        {
          id: "setDayOffset",
          value: this.state.dayOffsetValue,
          //
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
          style: { paddingLeft: "0.3em" }
        },
        `day(s) offset | Last refresh: ${this.state.lastRefreshDateTime}`
      ),
      // lastUpdatedItem
      React.createElement(
        "span",
        {
          id: "lastUpdatedItem",
          style: { paddingLeft: "0.1em" }
        },
        this.state.lastUpdatedItem && `| Last upd. item: ${this.state.lastUpdatedItem
        }`
      ),
      // tasksDurationSum
      React.createElement(
        "span",
        {
          id: "tasksDurationSum",
          style: { paddingLeft: "0.1em" }
        },
        this.state.mondayTasksDurationSum && `| Total tasks dur: ${this.state.mondayTasksDurationSum
        }h/${(this.state.mondayTasksDurationSum / 20).toFixed(1)
        }w`
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
            maxHeight: "440px" // 640
          }
        },
        (Object.keys(this.state.mondayTasksCols).length && !this.state.getDatedMondayItemsToJson) ?
          //
          React.createElement(
            "table",
            null,
            //
            React.createElement(
              "thead",
              null,
              //
              React.createElement(
                "tr",
                null,
                [
                  Object.keys(this.state.mondayTasksCols[0]).pop(),
                  ...Object.keys(this.state.mondayTasksCols[0])
                  //
                ].map((taskKey, taskKeyIdx) => React.createElement(
                  "th",
                  { key: `${taskKey}${taskKeyIdx}Header` },
                  taskKey
                ))
              )
            ),
            //
            React.createElement(
              "tbody",
              null,
              //
              this.state.mondayTasksCols.map((taskRow, idxRow) => React.createElement(
                "tr",
                {
                  key: `TaskRow${idxRow}`,
                  style: {
                    backgroundColor: this.setBgBasedOnDDiff(taskRow["d_diff"])
                  }
                },
                [
                  Object.keys(taskRow).pop(),
                  ...Object.keys(taskRow)
                  //
                ].map((taskKey, taskKeyIdx) => React.createElement(
                  "td",
                  {
                    key: `${taskKey}${taskKeyIdx}${idxRow}Td`,
                    className: `${taskKey}-td`,
                    style: { height: "2em" }
                  },
                  //
                  taskKey === "actions" ? React.createElement(
                    "div",
                    {
                      style: {
                        width: "16em",
                        height: "100%",
                        overflowY: "auto"
                      }
                    },
                    //
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
                    //
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
                    //
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
          className: "flex-container-2",
          style: {
            gap: "0em",
            height: "315px",
            margin: "0.3em 0.3em 0 0.1em",
            position: "relative",
            width: "calc(100% - 1em)"
          }
        },
        //
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
            //
            React.createElement(
              "table",
              { style: { width: "100%" } },
              //
              React.createElement(
                "thead",
                null,
                //
                React.createElement(
                  "tr",
                  null,
                  Object.keys(this.state.mondayTasksByDay[0]).map(taskKey =>
                    //
                    React.createElement(
                      "th",
                      { key: `${taskKey}HeaderByDay` },
                      taskKey
                    )
                  )
                )
              ),
              //
              React.createElement(
                "tbody",
                null,
                //
                this.state.mondayTasksByDay.map((taskRow, idxRow) => React.createElement(
                  "tr",
                  {
                    key: `TaskRow${idxRow}ByDay`,
                    style: { backgroundColor: this.setBgBasedOnDDiff(taskRow["d_diff"]) }
                  },
                  //
                  Object.keys(this.state.mondayTasksByDay[0]).map(taskKey => React.createElement(
                    "td",
                    { key: `${taskKey}${idxRow}TdByDay` },
                    taskRow[taskKey]
                  ))
                ))
              )
            ) :
            //
            React.createElement(
              "div",
              null,
              "Loading tasks by day table"
            )
        ),
        //
        React.createElement(
          "div",
          {
            id: "tasksByCategory",
            style: {
              // backgroundColor: "#FFF3", only like this for treeMap
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
//#region Append to DOM
const domContainer = document.querySelector("#taskManager");
//@ts-ignore
const root = ReactDOM.createRoot(domContainer);
//
root.render(React.createElement(tasksManager));
//#endregion