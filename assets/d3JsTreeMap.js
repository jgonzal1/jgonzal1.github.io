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