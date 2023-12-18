// Your access token can be found at: https://ion.cesium.com/tokens.
Cesium.Ion.defaultAccessToken = cesium_api_key;
// @ts-ignore Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
const viewer = new Cesium.Viewer('map', {
  // @ts-ignore
  terrainProvider: Cesium.createWorldTerrain()
});
// @ts-ignore Add Cesium OSM Buildings, a global 3D buildings layer.
const buildingTileset = viewer.scene.primitives.add(Cesium.createOsmBuildings());
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
viewer.entities.add(setEntity("a", "A", 36.843, -2.455, 85));
viewer.entities.add(setEntity("b", "B", 36.848, -2.463, 105));

// Fly the camera to Copenhagen at the given longitude, latitude, and height.
viewer.camera.flyTo({
  // @ts-ignore 12.49, 55.76, 1000 Jernbanevej, -2.453, 36.845, 250 pr52
  destination : Cesium.Cartesian3.fromDegrees(-2.4634, 36.8510, 250),
  orientation : {
    // @ts-ignore
    heading : Cesium.Math.toRadians(160.0), /* 0 Jernbanevej 220 pr52 */ pitch : Cesium.Math.toRadians(-15.0), /* -20 pr52 -30 Jernbanevej */
    roll: 0.0
  }
});
