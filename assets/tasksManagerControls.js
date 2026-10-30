  //#region putMondayDateItem, numbers 1 enforces task to 0.5h for now
tasksManager.prototype.putMondayDateItem = async function (
    // @ts-ignore
    mondayKey, boardId, itemId, dateTimeToSet, type
  ) {
    // @ts-ignore
    _gx.headers["Authorization"] = mondayKey;
    let query;
    const lastRefreshDateTime = new Date().toISOString().replace("T", " ")
      .substring(2, 19);
    if (type === "item") {
      query = `mutation { change_column_value ( ${""
        }board_id: ${boardId}, item_id: ${itemId}, column_id: "date", value: ${""
        }"{\\"date\\":\\"${dateTimeToSet.substring(0, 10)}\\", ${""
        }\\"time\\":\\"${dateTimeToSet.substring(11)}\\", ${""
        }\\"changed_at\\":\\"${lastRefreshDateTime}\\"${""
        }}") { name } }`;
    } else if (type === "subitem") {
      query = `mutation {
        change_multiple_column_values(
            board_id: ${boardId}
            item_id: ${itemId}
            create_labels_if_missing: true
            column_values:
              "{\\"date0\\": \\"${dateTimeToSet}\\"${this.state.durationValue ?
          `, \\"numbers\\": \\"${this.state.durationValue}\\"` : ""
        }}"
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
        lastUpdatedItem: lastUpdatedItem,
        lastUpdatedDt: dateTimeToSet
      });
    }
  };
  //#endregion
  //#region setDayOffsetValue
  // @ts-ignore
tasksManager.prototype.setDayOffsetValue = function (k) {
    this.setState({ dayOffsetValue: k })
  };
  //#endregion
  //#region sortTableByColumn
  // @ts-ignore
tasksManager.prototype.sortTableByColumn = function (jQuerySelector, columnIndex) {
    const table = document.querySelector(jQuerySelector);
    const tbody = table.tBodies[0];
    const rows = Array.from(tbody.rows);
    const header = table.tHead.rows[0].cells[columnIndex];

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
    rows.map(row => tbody.appendChild(row));
  };
  //#endregion
