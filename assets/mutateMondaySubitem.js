const mondayApiUrl = "https://api.monday.com/v2";

async function putMondayDateItem(
  mondayKey, boardId, itemId, dateTimeToSet
) {
  let headers = {
    "accept": "*/*",
    "accept-language": "en,en-GB;q=0.9,es;q=0.8,de;q=0.7",
    "access-control-allow-origin": "*",
    "content-type": "application/json",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Google Chrome\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site"
  };
  headers["Authorization"] = mondayKey;
  const query = `mutation {
  change_multiple_column_values(
      board_id: ${boardId}
      item_id: ${itemId}
      create_labels_if_missing: true
      column_values: "{${""
    }\\"date0\\": \\"${dateTimeToSet + ":00" /* {
      }\\\"date\\\":\\\"${dateTimeToSet.substring(0, 10)}\\\", ${""
      }\\\"time\\\":\\\"${dateTimeToSet.substring(11) + ":00"}\\\", ${""
      }\\\"changed_at\\\":\\\"${new Date().toISOString().substring(0, 19) + ".000Z"}\\\"${""
      }}*/}\\"}${""/*, \\\"numbers\\\": \\\"0.1\\\" ,${""
    }\\\"status\\\": \\\"Nice to do\\\" , \\\"freq__1\\\": \\\"180-Every 6 mo\\\" ,${""
    }\\\"cat__1\\\": \\\"2.💰\\\" , \\\"house__1\\\": \\\"none\\\" , \\\"notes\\\": \\\"\\\"${""
    */}") { name }
  }`;
  console.log(query);
  const body = JSON.stringify({ "query": query });
  const mondayPutResponsePremise = await fetch(
    mondayApiUrl,
    {
      method: "POST", headers: headers, body: body,
      referrerPolicy: "strict-origin-when-cross-origin",
      mode: "cors", credentials: "include"
    }
  ).then((response) => {
    try {
      return response.json();
    } catch (e) {
      console.error(e);
      return [response];
    }
  });
  const mondayPutResponse = await mondayPutResponsePremise;
  console.log(mondayPutResponse);
  const lastUpdatedItem = mondayPutResponse?.["data"]?.["change_column_value"]?.["name"] ?? false;
  if (lastUpdatedItem) {
    console.log({ lastUpdatedItem: lastUpdatedItem });
  }
};

putMondayDateItem(
  "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjI4NTUzNTcwMCwiYWFpIjoxMSwidWlkIjozNjIxOTAwMywiaWFkIjoiMjAyMy0xMC0wMVQxMTozMzozOS4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTQwMTM4MjUsInJnbiI6InVzZTEifQ.X7xHnIPlVArbhcUOevaacbL0QSl5giTHUMCeYyJl3vw"
  , "4700154754", "4904340759", "2024-11-03 09:00"
);
