tasksManager.prototype.aggrTasksByCategoryDonutChart = function (mondayTasksSortedJson) {
    //#region 1🐇2🐢3♻️ Aggregator
    let mondayDursByGroup = mondayTasksSortedJson.reduce(
      // @ts-ignore
      (accumulator, item) => {
        // Separate routines to its section
        if (![
          "090-Every 3 mo", "180-Every 6 mo", "360-Yearly", "400->1y",
          "999-Once"
        ].includes(item["freq"])) {
          if (!accumulator["3.♻️"]) {
            accumulator["3.♻️"] = 0;
          }
          accumulator["3.♻️"] += item["dur"]; // 3.♻️ counter
          return accumulator;
        }
        // Replace fast-line tasks outside sprint to slow-line
        if (
          // @ts-ignore
          item["Δd"] >= _gx.category_aggr_days_range
          && item["gr"] === "1.🐇"
        ) {
          accumulator["2.🐢"] += item["dur"]; // 2.🐢 counter 1/2
          return accumulator;
        }
        // Fall-back for slow-line, fast-line or new additions
        if (!accumulator[item["gr"]]) {
          accumulator[item["gr"]] = 0;
        }
        accumulator[item["gr"]] += item["dur"]; // 1.🐇 & 2.🐢 counter 2/2
        return accumulator;
      }, {}
    );
    Object.keys(mondayDursByGroup).map(
      k => mondayDursByGroup[k] = mondayDursByGroup[k].toPrecision(3)
    );
    //#endregion
    //#region 1🍏2🏠3💰4🚩5🌿5🔬6📺7🎮8🌐 Aggregator
    let mondayTasksByCatDict = mondayTasksSortedJson.filter(
      /**
       * @param {any} t
       * @returns {boolean}
       */
      (t) => (new Date(t["datetime"]) <
        new Date(new Date().getTime() +
          // @ts-ignore
          _gx.category_aggr_days_range * 24 * 3.6e6
        ))
    ).reduce(
      // @ts-ignore
      (accumulator, item) => {
        if (!accumulator[item["cat"]]) {
          accumulator[item["cat"]] = 0;
        }
        accumulator[item["cat"]] += item["dur"];
        return accumulator;
      }, {}
    );
    Object.keys(mondayTasksByCatDict).map(
      k => mondayTasksByCatDict[k] = mondayTasksByCatDict[k].toPrecision(3)
    );
    /**
     * sort() by key, by value;
     * .sort((a, b) => mondayTasksByCatDict[b] - mondayTasksByCatDict[a])
     */
    mondayTasksByCatDict = Object.keys(mondayTasksByCatDict).sort()
      .reduce((obj, key) => { // @ts-ignore
        obj[key] = mondayTasksByCatDict[key];
        return obj;
      }, {});
    this.state.mondayTasksByCatDict = mondayTasksByCatDict;
    //#endregion
    //#region Donut Chart
    /*const dataCategoriesAndValues = Object.keys(mondayTasksByCatDict).map(
      (k) => {
        const duration = +(mondayTasksByCatDict[k]);
        return {
          "name": k,
          "value": duration,
          "color": this.state.colors[k]
        }
      }
    );
    let mondayTasksDurationSum = (dataCategoriesAndValues.map(t => t.value)
    .filter(dur => dur > 0).reduce(
      (accumulator, currentValue) => accumulator + currentValue, 0
    ) - mondayDursByGroup["3.🔚"]).toFixed(1);
    const tasksByCatPlaceholder = document.getElementById("tasksByCategory")
      ?? document.createElement("div");*/
    const [tasksByCategoryWidth, tasksByCategoryHeight] = [380, 350];
    // @ts-ignore
    _gx.tasksByCategoryWidth = tasksByCategoryWidth;
    // @ts-ignore
    _gx.tasksByCategoryHeight = tasksByCategoryHeight;
    const margin = 20;
    const radius = Math.min(
      tasksByCategoryWidth, tasksByCategoryHeight
    ) - margin;
    const vbScale = 0.6;
    // @ts-ignore
    const donutChartSvg = _gx.d3.create("svg")
      .attr("viewBox", [
        -0.9 * vbScale * tasksByCategoryWidth, -2 * vbScale * tasksByCategoryHeight,
        2 * vbScale * tasksByCategoryWidth, 5 * vbScale * tasksByCategoryHeight
      ])
      //.attr("style", "x:x; y:y;")
      .attr("font", "1em sans-serif")
      .attr("margin", "2em 1em")
      .attr("text-anchor", "middle")
      .attr("height", tasksByCategoryHeight) //"auto"
      .attr("width", tasksByCategoryWidth)
      ;
    // @ts-ignore
    const node = donutChartSvg.append("g")
      .attr(
        "transform", "translate(" + tasksByCategoryWidth + ","
        + tasksByCategoryHeight + ")"
      );
    const donutChartStartAngle = 45;
    // @ts-ignore
    var pie = _gx.d3.pie().startAngle(donutChartStartAngle)
      // Usually accepts d3.descending but no here. Prevent labels cramming.
      // @ts-ignore
      .sort(null).value((d) => d[1]);
    const data_ready = pie(Object.entries(mondayTasksByCatDict));
    // @ts-ignore
    const arc = _gx.d3.arc()
      .innerRadius(radius * 0.4)
      .outerRadius(radius * 0.8);
    // @ts-ignore
    const outerArc = _gx.d3.arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);
    // @ts-ignore
    const fullArc = _gx.d3.arc()
      .innerRadius(radius)
      .outerRadius(radius);
    donutChartSvg
      .selectAll('allSlices')
      .data(data_ready)
      .join('path')
      .attr('d', arc)
      // @ts-ignore
      .attr('fill', d => this.state.colors[d.data[0]])
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 0.7)
      .style("cursor", "pointer")
      // @ts-ignore
      .on("click", (d) => {
        const categoryToFilter = d?.target?.__data__?.data?.[0] ?? "";
        const filterTaskDom = document.getElementById("filterTasks");
        // @ts-ignore
        if (filterTaskDom.value != categoryToFilter) {
          // @ts-ignore
          filterTaskDom.value = categoryToFilter;
        } else {
          // @ts-ignore
          filterTaskDom.value = "";
        }
        // @ts-ignore
        _gx.filterTasks();
      });
    donutChartSvg
      .selectAll('allPolylines')
      .data(data_ready)
      .join('polyline')
      .attr("stroke", "white")
      .style("fill", "none")
      .attr("stroke-width", 2)
      // @ts-ignore
      .attr('points', (d) => {
        const posA = arc.centroid(d) // line insertion in the slice
        const posB = outerArc.centroid(d) // line break: we use the other arc
        // generator that has been built only for that
        /*
        const posC = outerArc.centroid(d); // Label position = almost the same
        as posB.
        We need the angle to see if the X position will be at the extreme right
        or extreme left
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2
        const toLeft = 0.8 // 0.95 [-1,1] to put it on the right or on the left
        posC[0] = radius * toLeft * (midAngle < Math.PI ? 1 : -1);
        */
        return [posA, posB]//, posC]
      });
    const donuntChartFontSize = "2em";
    donutChartSvg
      .selectAll('allLabels')
      .data(data_ready)
      .join('text')
      // @ts-ignore
      .text(d => `${d.data[0]} ${d.data[1]}`)
      // @ts-ignore
      .attr('transform', function (d) {
        const pos = fullArc.centroid(d);
        /*
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        const toLeft = 0.85; // 0.99
        pos[0] = radius * toLeft * (midAngle < Math.PI ? 1 : -1);
        */
        return `translate(${pos})`;
      })
      .style("font-size", donuntChartFontSize)
      // @ts-ignore
      .style('text-anchor', (d) => {
        //const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        return "middle"; //(midAngle < Math.PI ? 'start' : 'end');
      })
      .style('fill', () => '#FFF');
    const fastTasksH = parseFloat(mondayDursByGroup["1.🐇"]);
    // @ts-ignore
    const fastTasksW = fastTasksH / _gx.totalHPerWeek;
    const repetitiveThreshold = 0.6 // of the week
    const veryRepetitiveThreshold = 1 // of the week
    donutChartSvg.append("text").style("fill", "#FFF")
      .style("font-size", donuntChartFontSize)
      .style("fill", (fastTasksW > (_gx.repetitive_threshold*2)) ? "#e15759" :
        (fastTasksW < _gx.repetitive_threshold) ? "#b5bd68" :
          "#ca8b4c"
      )
      .attr("y", "-40").text(() =>
        `1.🐇${fastTasksH}h/${fastTasksW.toFixed(1)}w`
      );
    const slowTasksH = parseFloat(mondayDursByGroup["2.🐢"]);
    // @ts-ignore
    const slowTasksW = slowTasksH / _gx.totalHPerWeek;
    donutChartSvg.append("text").style("fill", "#FFF")
      .style("font-size", donuntChartFontSize)
      .style("fill", (slowTasksW > (_gx.repetitive_threshold*2)) ? "#e15759" :
        (slowTasksW < _gx.repetitive_threshold) ? "#b5bd68" :
          "#ca8b4c"
      )
      .attr("y", "0").text(() =>
        `2.🐢${slowTasksH}h/${slowTasksW.toFixed(1)}w`
      );
    const repeatingTasksH = parseFloat(mondayDursByGroup["3.♻️"]);
    // @ts-ignore
    const repeatingTasksW = repeatingTasksH / _gx.totalHPerWeek;
    donutChartSvg.append("text").style("fill", "#FFF")
      .style("font-size", donuntChartFontSize)
      .style("fill", (repeatingTasksW > (_gx.repetitive_threshold*2)) ? "#e15759" :
        (repeatingTasksW < _gx.repetitive_threshold) ? "#b5bd68" :
          "#ca8b4c"
      )
      .attr("y", "40").text(() =>
        `3.♻️${repeatingTasksH}h/${repeatingTasksW.toFixed(1)}w`
      );
    const SumH = fastTasksH + slowTasksH + repeatingTasksH;
    // @ts-ignore
    const SumW = SumH / _gx.totalHPerWeek;
    donutChartSvg.append("text").style("fill", "#FFF")
      .style("font-size", donuntChartFontSize)
      .style("fill", (SumW > (_gx.repetitive_threshold * 6)) ? "#e15759" :
        (SumW < (_gx.repetitive_threshold * 3)) ? "#b5bd68" :
          "#ca8b4c"
      ).attr("y", "80").text(() =>
        `∑: ${SumH.toFixed(1)}h/${SumW.toFixed(1)}w`
      );
    //#endregion
    return Object.assign(donutChartSvg.node());
};
