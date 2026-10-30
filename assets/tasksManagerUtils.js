//#region aggrTasksByDay @deprecated?
// @ts-ignore
_g.aggrTasksByDay = (mondayTasksSortedJson) => {
  const currentDate = new Date(
    new Date().toISOString().substring(0, 10)
  ); // Gets current day at 00.00
  const msPerH = 3.6e6;
  const [
    nextExercisingDay, nextVI, nextVF
  ] = [
    "Gym", "(v_i)", "(v_f)"
  ].map(
    (tn) => mondayTasksSortedJson.filter(
      // @ts-ignore
      t => t["task_name"] === tn
      // @ts-ignore
    ).map(t => t.datetime)[0]
  );
  let sortedMondayItemsJsonWithEmptyDates = mondayTasksSortedJson.map(
    // @ts-ignore
    t => {
      return {
        "date": t["datetime"].substring(0, 10),
        "dur": t["dur"]
      }
    }
  );
  const arrNext21D = Array.from({ length: 21 }, (_, n) => n).map((n) => {
    return { "date": _g.offsetNDay(n), "dur": 0 }
  });
  sortedMondayItemsJsonWithEmptyDates = sortedMondayItemsJsonWithEmptyDates
    .concat(arrNext21D).sort(
      // @ts-ignore
      (a, b) => ("" + a["date"]).localeCompare(b["date"])
    );
  const mondayTasksByDayDict = sortedMondayItemsJsonWithEmptyDates.reduce(
    // @ts-ignore
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
          new Date(nextExercisingDay).valueOf()
        ) / msPerD
      ));
      const isOddDayDiff = !!(dayDiff % 2) && (dayDiff >= 0);
      const durOffs = isOddDayDiff ? duration + 2 : duration;
      const totV = ["Sat", "Sun"].includes(wd) ? _g.quarters_of_hour_weekends
        : _g.quarters_of_hour_weekdays;
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
        "Δd": dDiff
      }
    }
  );
};
//#endregion
//#region filterTasks
_g.filterTasks = () => {
  var input, filter, table, tr, td, i, j, txtValue;
  input = document.getElementById("filterTasks");
  // @ts-ignore
  filter = input.value.toUpperCase();
  table = document.getElementById("mondayTasksByDayTable");
  // @ts-ignore
  tr = table.getElementsByTagName("tr");
  // Loop tbody rows (not <1: thead), and hide those not matching search query
  for (i = 1; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td");
    tr[i].style.visibility = "hidden";
    tr[i].style.position = "absolute";
    for (j = 0; j < td.length; j++) {
      if (td[j]) {
        txtValue = td[j].textContent || td[j].innerText || td[j].innerHTML;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.visibility = "visible";
          tr[i].style.position = "relative";
          continue
        }
      }
    }
  }
};
//#endregion
//#region offsetNDay
// @ts-ignore
_g.offsetNDay = (n = 0, dateToOffset =/** @type {string|null} */ (null), precision = "day") => {
  const dateToOffsetAsValue = dateToOffset ?
    new Date(/** @type {string} */(dateToOffset)).valueOf() :
    new Date().valueOf();
  const offsetMs = n * msPerD;
  const dateValueOffset = dateToOffsetAsValue + offsetMs;
  let dateStrOffset = new Date(dateValueOffset).toISOString()
    .substring(0, precision === "day" ? 10 : 19); // sec
  if (precision === "min") {
    const timePrecision = dateStrOffset.substring(
      dateStrOffset.length - 5, dateStrOffset.length - 3
    );
    let roundedTimePrecision = (
      Math.floor(parseInt(timePrecision, 10) / 30) * 30
    ).toString();
    if (roundedTimePrecision === "0") {
      roundedTimePrecision = "00";
    }
    dateStrOffset = `${dateStrOffset.substring(0, dateStrOffset.length - 5)
      }${roundedTimePrecision.toString()}:00`.replace("T", " ");
  }
  return dateStrOffset;
};
//#endregion
//#region setBgBasedOnDDiff
// @ts-ignore
_g.setBgBasedOnDDiff = (dDiffStr) => {
  const hToNextDay = new Date().getHours();
  const hToNextWeek = ((8 - (new Date().getDay() % 7)) * 24) - hToNextDay;
  const dDiff = parseFloat(dDiffStr);
  const bgRanges = [
    { "bgRange": -9e3, "bgColor": "#CC6666CC" }, // passed
    { "bgRange": 0, "bgColor": "#CC666699" }, // now
    { "bgRange": (24 - hToNextDay) / 24, "bgColor": "#CC766677" }, // today
    { "bgRange": (48 - hToNextDay) / 24, "bgColor": "#CC866666" }, // tomorrow
    { "bgRange": (72 - hToNextDay) / 24, "bgColor": "#CC986666" }, // in_2d
    { "bgRange": (96 - hToNextDay) / 24, "bgColor": "#CCA96666" }, // in_3d
    {
      "bgRange": (
        Math.max(120 - hToNextDay, hToNextWeek)
      ) / 24, "bgColor": "#CCB06655"
    }, // this_week
    { "bgRange": (120 + hToNextWeek) / 24, "bgColor": "#CCCC6644" }, // next_w
    { "bgRange": (720 - hToNextDay) / 24, "bgColor": "#CCEE6633" }, // this_mo
    { "bgRange": 365, "bgColor": "#99FF6622" }, // this_year
    { "bgRange": 3e4, "bgColor": "#BBFF6611" } // next_year
  ];
  let bgColor = "#0000";
  bgRanges.filter((bgPair, idx) =>
    dDiff > bgPair.bgRange && dDiff <= bgRanges[idx + 1].bgRange
  ).map(bgPair => {
    bgColor = bgPair.bgColor;
  });
  return bgColor;
};
//#endregion
