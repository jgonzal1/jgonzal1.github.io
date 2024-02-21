const propertiesColumnRenames = {
  "label": "house_id",
  "numbers": "purchase_price",
  "numbers6": "m2",
  "numbers7": "lat",
  "numbers77": "lng",
  "numbers8": "entity_h",
  "status": "status"
};
/**
 * position @ Jernbanevej: 12.5003437, 55.7714248, 64.5
 */
function setEntity(entityId, entityName, entityLat, entityLng, entityH) {
  return {
    name: entityId,
    // @ts-ignore
    position: Cesium.Cartesian3.fromDegrees(entityLng, entityLat, entityH),
    point: { // @ts-ignore
      color: Cesium.Color.BLACK, outlineColor: Cesium.Color.WHITE,
      outlineWidth: 1, pixelSize: 10
    },
    label: {
      font: "14pt Arial", outlineWidth: 3, text: entityName,
      // @ts-ignore
      pixelOffset: new Cesium.Cartesian2(0, -9), style: Cesium.LabelStyle.FILL_AND_OUTLINE, verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
    }
  }
}
async function getMondayPropertiesThenInitMap(mondayKey, boardId, cesiumApiKey) {
  const mondayApiUrl = "https://api.monday.com/v2";
  const headers = {
    "Authorization": mondayKey,
    "Content-Type": "application/json",
  };
  const query = "boards (ids: " + boardId + ") { " +
    "items_page (limit: 500) { items { " +
    "group { title id } id name column_values { column { id } text value } " +
    "} } items_count }";
  const body = JSON.stringify({ "query": "query { " + query + " }" });
  const mondayItemsRawJsonPremise = await fetch(
    mondayApiUrl,
    { method: "POST", headers: headers, body: body }
  ).then((response) => {
    try {
      return response.json();
    } catch (e) {
      console.error(e);
      return [response];
    }
  });
  const mondayItemsRawJson = await mondayItemsRawJsonPremise;
  /** @type {any} */
  let mondayItems = [];
  let rawItemIdx = 0;
  mondayItemsRawJson["data"]["boards"][0]["items_page"]["items"].map(
    (rawItem, _rawItemIdx) => {
      const houseIds = {
        "item_id": rawItem["id"], "house_name": rawItem["name"]
      };
      mondayItems.push(houseIds);
      rawItemIdx = _rawItemIdx;
      rawItem.column_values.map((itemCol) => {
        mondayItems[rawItemIdx][propertiesColumnRenames[itemCol.column.id]] = itemCol.text;
      });
    }
  );
  setTimeout(() => initCesiumMap(cesiumApiKey, mondayItems), 3000);
}
function initCesiumMap(cesiumApiKey, propertiesList) {
  // @ts-ignore Your access token can be found at: https://ion.cesium.com/tokens.
  Cesium.Ion.defaultAccessToken = cesiumApiKey;
  let viewer;
  try {
    // @ts-ignore Initialize the Cesium Viewer in the HTML element with the `arg[1]` ID.
    viewer = new Cesium.Viewer('map', {
      // @ts-ignore
      terrainProvider: Cesium.createWorldTerrain()
    });
  } catch (e) {
    console.error(e);
  }
  // @ts-ignore Add Cesium OSM buildingTileset, a global 3D buildings layer. Can be assigned to constant
  viewer.scene.primitives.add(Cesium.createOsmBuildings());
  propertiesList.map(p => {
    const e = setEntity(
      p["house_id"],
      p["house_name"],
      parseFloat(p["lat"]),
      parseFloat(p["lng"]),
      parseFloat(p["entity_h"])
    );
    viewer.entities.add(e);
  });
  // Fly the camera to Copenhagen at the given longitude, latitude, and height.
  viewer.camera.flyTo({
    // @ts-ignore 12.49, 55.76, 1000 Jernbanevej, -2.453, 36.845, 250 pr52
    destination: Cesium.Cartesian3.fromDegrees(-2.4634, 36.8510, 250),
    orientation: {
      // @ts-ignore
      heading: Cesium.Math.toRadians(160.0), /* 0 Jernbanevej 220 pr52 */
      // @ts-ignore
      pitch: Cesium.Math.toRadians(-15.0), /* -20 pr52 -30 Jernbanevej */
      roll: 0.0
    }
  });
}

getMondayPropertiesThenInitMap(
  // @ts-ignore
  monday_key,
  "3488660413", // properties monday board
  // @ts-ignore
  cesium_api_key
);