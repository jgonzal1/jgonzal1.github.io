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
  const rangeWeek = Math.max(120 - hToNextDay, hToNextWeek) / 24;
  const bgRanges = [
    { "bgRange": -9e3,                     "color": "rgba(204,102,102,1 )", "bgColor":"rgba(64,  0,0,.6)" }, // passed
    { "bgRange": 0,                        "color": "rgba(204,102,102,.9)", "bgColor":"rgba(64,  0,0,.5)" }, // now
    { "bgRange": (24 - hToNextDay) / 24,   "color": "rgba(204,118,102,.9)", "bgColor":"rgba(64, 16,0,.4)" }, // today
    { "bgRange": (48 - hToNextDay) / 24,   "color": "rgba(204,134,102,.9)", "bgColor":"rgba(64, 32,0,.4)" }, // tomorrow
    { "bgRange": (72 - hToNextDay) / 24,   "color": "rgba(204,152,102,.9)", "bgColor":"rgba(64, 48,0,.4)" }, // in_2d
    { "bgRange": (96 - hToNextDay) / 24,   "color": "rgba(204,169,102,.9)", "bgColor":"rgba(64, 64,0,.4)" }, // in_3d
    { "bgRange": rangeWeek,                "color": "rgba(204,176,102,.8)", "bgColor":"rgba(64, 80,0,.4)" }, // this_week
    { "bgRange": (120 + hToNextWeek) / 24, "color": "rgba(204,204,102,.7)", "bgColor":"rgba(64, 96,0,.4)" }, // next_w
    { "bgRange": (720 - hToNextDay) / 24,  "color": "rgba(204,238,102,.5)", "bgColor":"rgba(64,100,0,.4)" }, // this_mo
    { "bgRange": 365,                      "color": "rgba(187,255,102,.4)", "bgColor":"rgba(48,100,0,.3)" }, // this_year
    { "bgRange": 3e4,                      "color": "rgba(187,255,102,.3)", "bgColor":"rgba(32,100,0,.2)" }  // next_year
  ];
  let bgColor = "#0000";
  let color = "#FFF";
  bgRanges.filter((bgPair, idx) =>
    dDiff > bgPair.bgRange && dDiff <= bgRanges[idx + 1].bgRange
  ).map(bgPair => {
    color = bgPair.color;
    bgColor = bgPair.bgColor;
  });
  return [color, bgColor];
};
//#endregion
