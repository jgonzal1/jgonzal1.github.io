/*
exported gapiLoaded
exported gisLoaded
exported handleAuthClick
exported handleSignoutClick
const CLIENT_ID = globalThis.googleClientId;
const API_KEY = globalThis.sheetsApiKey;
Authorization scopes required by the API; multiple scopes can be
included, separated by spaces.
*/
let tokenClient;
let gapiInited = false;
let gisInited = false;

/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
  if(localStorage.getItem('sheetData')) {
    console.log('Sheet data already in localStorage.');
    return;
  }
  gapi.load('client', initializeGapiClient);
}
/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
  await gapi.client.load('sheets', 'v4');
  gapiInited = true;
  maybeEnableButtons();
}
/**
 * Callback after Google Identity Services
 * (Google Sign In) are loaded.
 */
function gisLoaded() {
  if(localStorage.getItem('sheetData')) {
    console.log('Sheet data already in localStorage.');
    return;
  }
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: globalThis.googleClientId,
    scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
    callback: '', // defined later
  });
  gisInited = true;
  maybeEnableButtons();
}
/**
 * Enables user interaction after all libraries are loaded.
 */
function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    document.getElementById('authorize_button').style.visibility = 'visible';
  }
}
/**
 *  Sign in the user upon button click.
 */
function handleAuthClick() {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      throw (resp);
    }
    document.getElementById('signout_button').style.visibility = 'visible';
    document.getElementById('authorize_button').innerText = 'Refresh';
    await returnSheetsData();
  };
  if (gapi.client.getToken() === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    tokenClient.requestAccessToken({prompt: 'consent'});
  } else {
    // Skip display of account chooser and consent dialog for an existing session.
    tokenClient.requestAccessToken({prompt: ''});
  }
}
/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick() {
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken('');
    document.getElementById('content').innerText = '';
    document.getElementById('authorize_button').innerText = 'Authorize';
    document.getElementById('signout_button').style.visibility = 'hidden';
  }
}
/**
 * Return sheets data:
 *
 */
async function returnSheetsData() {
  let response;
  try {
    // Fetch first 10 files
    response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: globalThis.sheetId,
      range: globalThis.sheetRange,
    });
  } catch (err) {
    document.getElementById('content').innerText = err.message;
    return;
  }
  const range = response.result;
  if (!range || !range.values || range.values.length == 0) {
    document.getElementById('content').innerText = 'No values found.';
    return;
  }
  /** @typeof {[[h1,h2],[v11,v12],[v21,v22]]} */
  if (localStorage.getItem('sheetData')) {
    console.log('Sheet data stored in localStorage.');
  } else {
    localStorage.setItem('sheetData', JSON.stringify(range.values));
    const rv = range.values;
    console.table(rv);
    /** Flatten to string to display
    const output = range.values.reduce(
      (str, row) => `${str}${row[0]}, ${row[1]}\n`,
      'col1, col2:\n'
    );*/
    document.getElementById('content').innerText = range.values;
  }
}

function sortTableByColumn(domSelector, columnIndex) {
  const tHeader = document.getElementById(`${domSelector}-header`);
  const tBody = document.getElementById(`${domSelector}-body`);
  const rows = Array.from(tBody.children); // Exclude header row
  const allHeaders = Array.from(tHeader.children)[0]
  const header = Array.from(allHeaders.children)[columnIndex];
  // Determine sort order and toggle header styles
  let ascending = !header.classList.contains("sorted-asc");
  Array.from(header.parentNode.cells).forEach(cell =>
    cell.classList.remove("sorted-asc", "sorted-desc"));
  header.classList.add(ascending ? "sorted-asc" : "sorted-desc");
  // Sort rows based on the column's text content
  rows.sort((rowA, rowB) => {
    const cellA = rowA.cells[columnIndex]?.textContent ?? "";
    const cellB = rowB.cells[columnIndex]?.textContent ?? "";
    const compare = isNaN(cellA) || isNaN(cellB)
      ? cellA.localeCompare(cellB) // Alphabetical sort
      : parseFloat(cellA) - parseFloat(cellB); // Numerical sort
    return ascending ? compare : -compare;
  });
  rows.map(row => tBody.appendChild(row));
}

function populateSheetTable(sheetDataJson) {
  const table = document.createElement('table');
  const domSelector = "financial-data-table";
  table.id=domSelector;
  const tHeader = document.createElement('thead');
  tHeader.id=`${domSelector}-header`;
  const tBody = document.createElement('tbody');
  tBody.id=`${domSelector}-body`;
  sheetDataJson.map((row,i) => {
    let tr = document.createElement('tr');
    if(!i){
      row.map((cell,j) => {
        const td = document.createElement('th');
        td.onclick = () => sortTableByColumn("financial-data-table",j);
        td.innerText = cell;
        td.style.textOrientation = "sideways";
        td.style.writingMode = "sideways-lr";
        tr.appendChild(td);
      });
      tHeader.appendChild(tr);
      table.appendChild(tHeader);
    } else {
      row.map((cell) => {
        const td = document.createElement('td');
        td.innerText = cell;
        tr.appendChild(td);
      });
      tBody.appendChild(tr);
    }
  });
  table.appendChild(tBody);
  const content = document.getElementById('content');
  content.innerHTML = '';
  content.appendChild(table);
}

function normalizeSheetDataJson(sheetDataJson) {
  const headers = sheetDataJson[0];
  let normalizedData = [];
  sheetDataJson.map((row, vi) => {
    if(vi===0) { return; } // skip headers
    Array.from({length: 21},(_,i)=>i+2).map((i) => {
      let numVal = parseFloat((row[i]).replace(".","").replace(",","."));
      if(isNaN(numVal) || numVal<0) {
        numVal = 0;
      }
      normalizedData.push({
        "x": `20${row[1]}-01`,
        "name": headers[i],
        "value": numVal
      });
    });
  });
  return normalizedData;
}

function createStackedAreaChart(sheetDataJson) {
  const msPerD = 3.6e6 * 24;
  const daysRangeStart = sheetDataJson[0]["x"]; // 18 // new Date("2024-03-01"); 
  const daysRangeEnd = new Date(); // sheetDataJson[sheetDataJson.length-1]["x"]; // new Date("2024-11-01"); // new Date("2030-06-01"); // 
  const sheetDataJsonPk = sheetDataJson.reduce(
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
  const sheetDataJsonFiltered = Object.keys(
    sheetDataJsonPk
  ).map(pk => {
    const [x, name] = pk.split("|");
    return {
      "x": x,
      "name": name,
      "value": sheetDataJsonPk[pk] ?? 0
    };
  }).filter((k) => (
    (new Date(k["x"]) > new Date(daysRangeStart)) &&
    (new Date(k["x"]) < new Date(daysRangeEnd))
  )).sort((a, b) => {
    return b.x < a.x ? -1 : b.x > a.x ? 1 : 0
  });
  const popUpDiv = document.getElementById("popUpDiv")
    ?? document.createElement("div");
  // Determine the series that need to be stacked.
  const series = globalThis.d3.stack()
    //.offset(d3.stackOffsetWiggle).order(d3.stackOrderInsideOut) to StreamGraph
    //@ts-ignore
    .keys(d3.union(sheetDataJsonFiltered.map(d => d.name)))
    // @ts-ignore distinct series keys, in input order
    .value(([, D], key) => D.get(key)?.value ?? 0)
    //@ts-ignore get value for each series key and stack
    (d3.index(sheetDataJsonFiltered, d => new Date(d.x), d => d.name));
  // group by stack then series key

  const customColors = [
    "#af7aa1", "#4e79a7", "#76b7b2", "#b5bd68", "#edc949", "#f28e2c", "#e15759", "#ff9da7",
    "#af7aa1", "#4e79a7", "#76b7b2", "#b5bd68", "#edc949", "#f28e2c", "#e15759", "#ff9da7",
    "#af7aa1", "#4e79a7", "#76b7b2", "#b5bd68", "#edc949"
  ];
  //@ts-ignore
  const color = globalThis.d3.scaleOrdinal()
    // @ts-ignore
    .domain(series.map(d => d.key).sort())
    .range(customColors);

  const width = 800;
  const height = 800;
  const marginTop = 10;
  const marginRight = 10;
  const marginBottom = 45;
  const marginLeft = 55;

  // Prepare the scales for positional and color encodings. @ts-ignore
  const x = globalThis.d3.scaleUtc() //
    // @ts-ignore
    .domain(globalThis.d3.extent(
      // @ts-ignore
      sheetDataJsonFiltered, d => new Date(d.x)
    ))
    .range([marginLeft, width - marginRight]);
  //@ts-ignore
  const y = globalThis.d3.scaleLinear() //
    .domain([
      // @ts-ignore
      0, globalThis.d3.max(series, d => globalThis.d3.max(d, d => d[1]))
    ]) // globalThis.d3.extent(series.flat(2)) for StreamGraph
    .rangeRound([height - marginBottom, marginTop]);

  //@ts-ignore Construct an area shape
  const area = globalThis.d3.area()
    // @ts-ignore
    .x(d => x(d.data[0])).y0(d => y(d[0])).y1(d => y(d[1]))
    // @ts-ignore
    .curve(globalThis.d3.curveCardinal.tension(0.1)); // 0 curved, 1 no curve

  //@ts-ignore Create the SVG container
  const svg = globalThis.d3.create("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("width", width)
    .attr("height", height)
    .attr("style", "max-width: 100%; height: auto;");

  // y-axis without domain line, grid lines and y-label
  svg.append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    //@ts-ignore
    .call(globalThis.d3.axisLeft(y).ticks(height / 80).tickFormat(
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

  svg.append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    //@ts-ignore
    .call(d3.axisBottom(x).tickSizeOuter(0).ticks(
      20, "%y-%m-%d"
    ))
    .selectAll("text")
    .style("font-family", "courier")
    .style("text-anchor", "end")
    .attr("dx", "-0.5em")
    .attr("dy", "0.1em")
    .attr("transform", () => "rotate(-30)")

  // Filling path to graph each series
  svg.append("g")
    .selectAll()
    .data(series)
    .join("path")
    // @ts-ignore
    .attr("fill", d => color(d.key))
    .attr("d", area)
    /*.style("cursor", "pointer")
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
    .on("click", (d) => {
      const filterTaskDom = document.getElementById("filterTasks");
      if(filterTaskDom.value != d.target.textContent) {
        filterTaskDom.value = d.target.textContent;
      } else {
        filterTaskDom.value = "";
      }
      globalThis.filterTasks();
    })*/
    .append("title")
    // @ts-ignore
    .text(d => d.key);

  // Legend
  const yOffset = 90;
  const xOffset = 60;
  svg.append("rect").attr("x", xOffset).attr("y", yOffset).attr("width", 160)
    .attr("height", 390).attr("rx", 10).attr("ry", 10).style("fill", "#6666");
  [
    ["cuc88_e", "#e15759"],
    ["pr52_e", "#4e79a7"],
    ["cbm3_e", "#edc949"],
    ["myinv_msciw_fid", "#e15759"],
    ["myinv_man", "#f28e2c"],
    ["myinv_vg_em_rv", "#ff9da7"],
    ["cat_occ_mtfds", "#b5bd68"],
    ["fwu_pias_largo", "#76b7b2"],
    ["axa_primactiva", "#4e79a7"],
    ["cat_oc_ah_cr", "#76b7b2"],
    ["deposito_alquiler", "#ff9da7"],
    ["lunar", "#edc949"],
    ["wise", "#edc949"],
    ["ing", "#b5bd68"],
    ["revolut", "#b5bd68"],
    ["rev_flex_funds", "#76b7b2"],
    ["Breeah_Bitget_liq", "#af7aa1"],
    ["deuda_Sonata", "#af7aa1"],
    ["deuda_mama", "#4e79a7"]
  ].map((colorPair, idx) => {
    svg.append("circle").attr("cx", xOffset + 15)
      .attr("cy", 20 * idx + yOffset + 15).attr("r", 6)
      .style("fill", colorPair[1])
    svg.append("text").attr("x", xOffset + 25)
      .attr("y", 20 * idx + yOffset + 15).text(colorPair[0])
      .style("font-size", "15px").attr("alignment-baseline", "middle")
      .attr("fill", "#FFF")
  });

  const graphPlaceholder = Object.assign(
    svg.node(), { scales: { color } }
  );
  graphPlaceholder.id = "graph";
  graphPlaceholder.style.position = "absolute";
  graphPlaceholder.style.top = 0;
  return graphPlaceholder;
}
