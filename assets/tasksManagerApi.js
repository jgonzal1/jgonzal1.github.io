  //#region archiveMondayItem
tasksManager.prototype.archiveMondayItem = async function (
    // @ts-ignore
    mondayKey, boardId, itemId
  ) {
    // @ts-ignore
    _gx.headers["Authorization"] = mondayKey;
    const query = `mutation { archive_item ( ${""
      }item_id: ${itemId}) { name } }`;
    const body = JSON.stringify({ "query": query });
    const mondayPutResponsePremise = await fetch(
      // @ts-ignore
      _gx.mondayApiUrl,
      // @ts-ignore
      { method: "POST", headers: _gx.headers, body: body }
    ).then((response) => {
      try {
        return response.json();
      } catch (e) {
        console.error(e);
        return [response];
      }
    });
    const mondayPutResponse = await mondayPutResponsePremise;
    const lastUpdatedItem = mondayPutResponse?.["data"]?.["archive_item"]?.
    ["name"] ?? false;
    if (lastUpdatedItem) {
      this.setState({ lastUpdatedItem: lastUpdatedItem });
    }
  };
  //#endregion
  //#region getMondayTasksToMultipleJson
tasksManager.prototype.getMondayTasksToMultipleJson = async function (
    // @ts-ignore
    mondayKey, boardId, columnRenames
  ) {
    const subItemColNames = [
      "datetime", "dur", "status", "freq", "cat", "house", "notes"
    ];
    // @ts-ignore
    _gx.headers["Authorization"] = mondayKey;
    const query = `boards (ids: ${boardId}) { ` +
      "items_page (limit: 200) { items { " +
      "group { title id } id name column_values { column { id } text value } " +
      "subitems { id name column_values { text } } } } items_count }"
    const body = JSON.stringify({ "query": "query { " + query + " }" });
    const mondayItemsRawJsonPremise = await fetch(
      // @ts-ignore
      _gx.mondayApiUrl,
      // @ts-ignore
      { method: "POST", headers: _gx.headers, body: body }
    ).then(async (response) => {
      try {
        const respJson = await response.json();
        return respJson;
      } catch (e) {
        console.error(e);
        return [response];
      }
    });
    const mondayItemsRawJson = await mondayItemsRawJsonPremise;
    /** @type {any} */
    let mondayTasksJson = [];
    // @ts-ignore
    let rawItemIdx = 0;
    mondayItemsRawJson["data"]["boards"][0]["items_page"]["items"].map(
      // @ts-ignore
      (rawItem, rawItemIdx) => {
        let taskIds = {
          "task_id": rawItem["id"],
          "task_name": rawItem["name"],
          "group": rawItem["group"]["title"],
          "type": "item"
        };
        // @ts-ignore
        rawItem.column_values.map((itemCol) => {
          // @ts-ignore
          taskIds[
            columnRenames[itemCol.column.id]
          ] = itemCol.text;
        });
        mondayTasksJson.push(taskIds);
        if (rawItem["subitems"].length) {
          // @ts-ignore
          rawItem["subitems"].map((subItem, subItemIdx) => {
            let subTaskIds = {
              "task_id": subItem["id"],
              "task_name": `${rawItem["name"]}: ${subItem["name"]}`,
              "group": rawItem["group"]["title"],
              "type": "subitem"
            };
            // @ts-ignore
            subItem["column_values"].map((subItemCol, subItemColIdx) => {
              // @ts-ignore
              subTaskIds[subItemColNames[subItemColIdx]] = subItemCol.text;
            });
            mondayTasksJson.push(subTaskIds);
          });
        }
      }
    );
    // @ts-ignore
    const mondayTasksSortedJson = _gx.addMondayMeta(mondayTasksJson);
    // @ts-ignore
    const mondayTasksByDay = _gx.aggrTasksByDay(mondayTasksSortedJson);
    const mondayTasksByCategorySvg = this.aggrTasksByCategoryDonutChart(
      mondayTasksSortedJson
    );
    const tasksByCategoryAndDayPlaceholder = document.querySelector(
      "#tasksByCategoryAndDay"
    );
    if (!tasksByCategoryAndDayPlaceholder) { return; }
    tasksByCategoryAndDayPlaceholder.innerHTML = "";
    tasksByCategoryAndDayPlaceholder.appendChild(
      // @ts-ignore
      _gx.aggrTasksByCategoryAndDay(mondayTasksSortedJson)
    );
    //console.log(mondayTasksSortedJson);
    this.setState({
      mondayTasksJson: mondayTasksSortedJson,
      mondayTasksByCategorySvg: [mondayTasksByCategorySvg],
      mondayTasksByDay: mondayTasksByDay,
      getDatedMondayItemsToJson: false,
      lastRefreshDateTime: new Date().toISOString().replace("T", " ")
        .substring(2, 19)
    });
    return mondayTasksSortedJson;
  };
  //#endregion
tasksManager.prototype.getMondayVariables = async function (/** @type {string} */ mondayKey, /** @type {string|number} */ boardId) {
    _gx.headers["Authorization"] = mondayKey;
    const query = `boards (ids: ${boardId}) { ` +
      "items_page (limit: 200) { items { " +
      "  id name column_values { text } " +
      "} } items_count }"
    const body = JSON.stringify({ "query": "query { " + query + " }" });
    const mondayItemsRawJsonPremise = await fetch(
      // @ts-ignore
      _gx.mondayApiUrl,
      // @ts-ignore
      { method: "POST", headers: _gx.headers, body: body }
    ).then(async (response) => {
      try {
        const respJsonRaw = await response.json();
        const respJson = await respJsonRaw["data"]["boards"][0]
        ["items_page"]["items"].map((/** @type {any} */ item) => {
          return {
            key: item.name,
            value: parseFloat(item.column_values[0].text)
          };
        }).map(
          (/** @type {{key: string, value: number}} */ item) => {
            _gx[item.key] = item.value;
            return {
              key: item.key,
              value: item.value
            }
          }
        );
        _gx.totalHPerWeek = _gx.quarters_of_hour_weekdays +
          3 / 4 * _gx.quarters_of_hour_weekends;
        return respJson;
      } catch (e) {
        console.error(e);
        return [response];
      }
    });
    const mondayItemsRawJson = await mondayItemsRawJsonPremise;
  };
  //#region handleMilestoneAmount
  //@ts-ignore
tasksManager.prototype.handleMilestoneAmount = function (passiveAmountEurMs) {
    const amntEurMsDomObj = document.getElementById("amntEurMs"); // as HTMLInputElement;
    // @ts-ignore
    const dayStartRegr = (offset_at_1900 / daily_growth -
      this.state.daysBetween1900and1970);
    const startRegr = new Date(
      dayStartRegr * this.state.milliSecondsPerDay
    ).toISOString().replace("T", " ").substring(0, 16);
    const startRegrDomObj = document.getElementById("startRegr"); // as HTMLSpanElement;
    // @ts-ignore
    startRegrDomObj.innerText = startRegr;
    const afterInput = document.getElementsByClassName("after-input")[0]; // as HTMLSpanElement;
    // @ts-ignore
    afterInput.style.display = "inline";
    const numericAmount = typeof passiveAmountEurMs === 'string' ?
      parseFloat(passiveAmountEurMs) : Number(passiveAmountEurMs);
    // @ts-ignore
    amntEurMsDomObj.innerText = new Intl.NumberFormat(
      // @ts-ignore
      'es-ES', numberFormat
    ).format(numericAmount);
    // @ts-ignore
    const amountEurMs = numericAmount * 12 / _gx.passive_factor;
    // @ts-ignore
    const dayEurMs = (dayStartRegr + amountEurMs / daily_growth) * this.state.milliSecondsPerDay;
    const dateEurMs = new Date(dayEurMs).toISOString().replace("T", " ")
      .substring(0, 16);
    const dateEurMsDomObj = document.getElementById("dateEurMs"); // as HTMLSpanElement;
    if (dateEurMsDomObj) {
      dateEurMsDomObj.innerText = dateEurMs;
    }
    const yearsMsInt = (
      (dayEurMs - Date.now()) / this.state.milliSecondsPerDay / 365
    );
    const yearsMsDomObj = document.getElementById("yearsMs"); // as HTMLSpanElement;
    // @ts-ignore
    yearsMsDomObj.innerText = yearsMsInt.toFixed(2);
    const calcinflation = this.state.inflation ** yearsMsInt;
    const yearsSelfMs = (
      // @ts-ignore
      (dayEurMs - new Date(birthday).getTime()) / this.state.milliSecondsPerDay / 365
    ).toFixed(2);
    const yearsSelfMsDomObj = document.getElementById("yearsSelfMs"); // as HTMLSpanElement;
    // @ts-ignore
    yearsSelfMsDomObj.innerText = yearsSelfMs;
    const adjustedAmountDom = document.getElementById("adjustedAmount"); // as HTMLSpanElement;
    // @ts-ignore
    adjustedAmountDom.innerText = new Intl.NumberFormat(
      // @ts-ignore
      'es-ES', numberFormat
      // @ts-ignore
    ).format(amountEurMs * _gx.passive_factor / 1200 / calcinflation);
  };
  //#endregion
  //#region mondayItemToBacklog
tasksManager.prototype.mondayItemToBacklog = async function (
    // @ts-ignore
    mondayKey, boardId, itemId, type
  ) {
    // @ts-ignore
    _gx.headers["Authorization"] = mondayKey;
    let query;
    const lastRefreshDateTime = new Date().toISOString().replace("T", " ")
      .substring(2, 19);
    if (type === "item") {
      query = `mutation { change_column_value ( ${""
        }board_id: ${boardId}, item_id: ${itemId}, column_id: "date", value: ${""
        }"{\\"date\\":\\"\", ${""
        }\\"time\\":\\"\", ${""
        }\\"changed_at\\":\\"${lastRefreshDateTime}\\"${""
        }}") { name } }`;
    } else if (type === "subitem") {
      query = `mutation {
        change_multiple_column_values(
          board_id: ${boardId}
          item_id: ${itemId}
          create_labels_if_missing: true
          column_values: "{\\"date0\\": \\"\\", \\"numbers\\": \\"0.02\\"}"
        ) { name }
      }`;
    }
    const body = JSON.stringify({ "query": query });
    const mondayPutResponsePremise = await fetch(
      // @ts-ignore
      _gx.mondayApiUrl,
      // @ts-ignore
      { method: "POST", headers: _gx.headers, body: body }
    ).then((response) => {
      try {
        return response.json();
      } catch (e) {
        console.error(e);
        return [response];
      }
    });
    const mondayPutResponse = await mondayPutResponsePremise;
    const lastUpdatedItem = type === "item" ?
      (mondayPutResponse?.["data"]?.["change_column_value"]?.["name"] ?? "") :
      mondayPutResponse?.["data"]?.["change_multiple_column_values"]?.["name"]
      ?? "";
    if (lastUpdatedItem) {
      this.setState({
        lastRefreshDateTime: lastRefreshDateTime,
        lastUpdatedItem: lastUpdatedItem
      });
    }
  };
  //#endregion
