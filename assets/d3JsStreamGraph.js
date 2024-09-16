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