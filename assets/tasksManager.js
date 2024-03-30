"use strict";
//#region Variables
const nextViAsV = false;
const categoryAggrDaysRange = 28;
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
    ["1.🏠", "#59a14f"],
    ["2.💰", "#9c755f"],
    ["3.🍏", "#edc949"],
    ["4.🚩🇩🇰", "#f28e2c"],
    ["5.🔬", "#ff9da7"],
    ["6.📺", "#af7aa1"],
    ["7.🎮", "#4e79a7"],
    ["8.🌐", "#76b7b2"],
    ["9.➕", "#bab0ab66"]
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
      const hDiff = Math.round(((
        // @ts-ignore
        new Date(d) - new Date((new Date().toISOString().substring(0, 10)))
      ) + 3.6e6) / 3.6e5) / 10
      const color = `${this.setBgBasedOnHDiff(hDiff).substring(0, 7)}CC`;
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
      "#bab0ab66", // ➕
      ""
    ]; // d3.scaleOrdinal(treeMapChildren.map(d => d.name), d3.schemeTableau10); // alternative
    // @ts-ignore
    const color = d3.scaleOrdinal(customColors); // for bubbleChart
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
      .text(d => format(d.value - 2));

    return Object.assign(svg.node(), { scales: { color } });
    //#endregion
  };
  aggrTasksByCategoryAndDay = (sortedMondayItemsJson) => {
    // @ts-ignore
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
    Object.keys(remainingTasksDurationsByDay).map(d => {
      const wd = weekday[new Date(d).getDay()];
      const maxForDay = ["Sat", "Sun"].includes(wd) ? 300 : 180;
      tasksDurationByDayCategory.filter(
        tddcf => (tddcf["x"] === d && tddcf["name"] === "9.➕")
      ).map(tddc => {
        tddc["value"] += Math.max(
          0, maxForDay - remainingTasksDurationsByDay[d]
        );
        return tddc;
      });
    });

    // @ts-ignore Determine the series that need to be stacked.
    const series = d3.stack()
      //@ts-ignore .offset(d3.stackOffsetWiggle).order(d3.stackOrderInsideOut) For StreamGraph
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
    const x = d3.scaleUtc() // @ts-ignore
      .domain(d3.extent(tasksDurationByDayCategory, d => new Date(d.x)))
      .range([marginLeft, width - marginRight]);

    //@ts-ignore
    const y = d3.scaleLinear() // @ts-ignore
      .domain([0, d3.max(series, d => d3.max(d, d => d[1]))]) // d3.extent(series.flat(2)) for StreamGraph
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
        let nextViD = nextVI;
        if (nextViAsV) {
          nextViD = nextVI.substring(0, 10);
        }
        const setDurStrAsV = (k >= nextViD && k <= nextVF);
        const durStr = `${"|".repeat(usedTime)}${setDurStrAsV ?
          "v".repeat(unUsedTime) :
          ".".repeat(unUsedTime)}`;
        const hDiff = Math.round(((
          // @ts-ignore
          new Date(k) - new Date(new Date().toISOString().substring(0, 10))
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
    const mondayTasksByCategoryAndDay = this.aggrTasksByCategoryAndDay(sortedMondayItemsJson);
    // @ts-ignore
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
      // @ts-ignore
      this.setState({ lastUpdatedItem: lastUpdatedItem });
    }
  };
  setBgBasedOnHDiff = (hDiffStr) => {
    const hToNextDay = new Date().getHours();
    const hToNextWeek = ((8 - (new Date().getDay() % 7)) * 24) - hToNextDay;
    const hDiff = parseFloat(hDiffStr);
    const bgRanges = [
      { "bgRange": -9e3, /*                                   */ "bgColor": "#CC6666DD" }, // passed
      { "bgRange": 0, /*                                      */ "bgColor": "#CC666699" }, // now
      { "bgRange": 24 - hToNextDay, /*                        */ "bgColor": "#CC766677" }, // today
      { "bgRange": 48 - hToNextDay, /*                        */ "bgColor": "#CC866655" }, // tomorrow
      { "bgRange": 72 - hToNextDay, /*                        */ "bgColor": "#CC986655" }, // in_2d
      { "bgRange": 96 - hToNextDay, /*                        */ "bgColor": "#CCA96655" }, // in_3d
      { "bgRange": Math.max(96 - hToNextDay, hToNextWeek), /* */ "bgColor": "#CCB06655" }, // this_week
      { "bgRange": 168 + hToNextWeek, /*                      */ "bgColor": "#CCCC6633" }, // next_week
      { "bgRange": 720 - hToNextDay, /*                       */ "bgColor": "#CCEE6622" }, // this_month
      { "bgRange": 8760, /*                                   */ "bgColor": "#99FF6622" }, // this_year
      { "bgRange": 9e9, /*                                    */ "bgColor": "#BBFF6606" } // next_year
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
                    backgroundColor: this.setBgBasedOnHDiff(taskRow["h_diff"])
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
                    (taskRow[taskKey] !== " null" ? taskRow[taskKey] : "")
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
                    style: { backgroundColor: this.setBgBasedOnHDiff(taskRow["h_diff"]) }
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
// @ts-ignore
root.render(React.createElement(tasksManager));
//#endregion