donutChartSvg.append("g").attr("class", "slices");
donutChartSvg.append("g").attr("class", "labels");
donutChartSvg.append("g").attr("class", "lines");
const transitionDurationsMs = 200;

var key = (d) => d.data.label;

function randomData() {
  const labels = color.domain();
  const data = labels.map((label) => {
    return {
      label: label, value: parseInt(1000 * Math.random()) / 100
    }
  });
  return data;
}

change(randomData());

d3.select("#randomizeDonutChart").on("click", () => change(randomData()));

function change(data) {

  var slice = donutChartSvg.select(".slices").selectAll("path.slice")
    .data(pie(data), key);

  slice.enter()
    .insert("path")
    .style("fill", (d) => color(d.data.label))
    .attr("class", "slice");

  slice
    .transition().duration(transitionDurationsMs)
    .attrTween("d", (d) => {
      this._current = this._current || d;
      var interpolate = d3.interpolate(this._current, d);
      this._current = interpolate(0);
      return (t) => arc(interpolate(t));
    })

  slice.exit().remove();

  donutChartSvg.selectAll("text.donut-chart-labels").remove();
  var text = donutChartSvg.selectAll("text.donut-chart-labels")
    .data(pie(data), key);
  text.enter()
    .append("text").attr("class", "donut-chart-labels").attr("dy", ".35em")
    .text((d) => `${d.data.label} ${d.data.value.toPrecision(3)}`);

  midAngle = (d) => d.startAngle + (d.endAngle - d.startAngle) / 2;

  text.transition().duration(transitionDurationsMs)
    .attrTween("transform", (d) => {
      this._current = this._current || d;
      var interpolate = d3.interpolate(this._current, d);
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
      var interpolate = d3.interpolate(this._current, d);
      this._current = interpolate(0);
      return (t) => {
        var d2 = interpolate(t);
        return midAngle(d2) < Math.PI ? "start" : "end";
      };
    });

  text.exit().remove();

  var polyline = donutChartSvg.select(".lines").selectAll("polyline")
    .data(pie(data), key);

  polyline.enter().append("polyline");

  polyline.transition().duration(transitionDurationsMs)
    .attrTween("points", (d) => {
      this._current = this._current || d;
      var interpolate = d3.interpolate(this._current, d);
      this._current = interpolate(0);
      return (t) => {
        var d2 = interpolate(t);
        var pos = outerArc.centroid(d2);
        pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
        return [arc.centroid(d2), outerArc.centroid(d2), pos];
      };
    });

  polyline.exit().remove();

};
