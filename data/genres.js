const buildingPoints = [
  {"crds": [115, 500], "text": "Soundtrack"}
  ,{"crds": [270, 625], "text": "Celtic"}
  ,{"crds": [270, 610], "text": "Latin"}
  ,{"crds": [270, 595], "text": "Nordic"}
  ,{"crds": [560, 630], "text": "Traditional gospel"}
].map(
  p => {
    return {
      "type": "Feature",
      "geometry": {
        "type": "Point", "coordinates": p.crds
      },
      "properties": {"text": p.text, "radius": 0}
    }
  }
)