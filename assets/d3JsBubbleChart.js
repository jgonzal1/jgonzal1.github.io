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
  const days = tasksDurationByDayCategory.map(t => t["x"]).filter(
    (val, idx, arr) => arr.indexOf(val) === idx
  )
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

function aggrTasksByCategoryBubbleChart(sortedMondayItemsJson) {
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
  const mondayTasksDurationSum = dataCategoriesAndValues.map(t => t.value)
    .filter(dur => dur > 0).reduce(
      (accumulator, currentValue) => accumulator + currentValue, 0
    ).toFixed(1);
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
}
