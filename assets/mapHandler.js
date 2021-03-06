const width = 80,
    height = 60;

function createImgMap(img, bounds) {
    map = L.map(
        'map', {
            crs: L.CRS.Simple,
            inertia: true,
            inertiaMaxSpeed: 1000,
            tilt: true, // moves map
            // w/ mobiles giroscope(deviceOrientation)
            wheelPxPerZoomLevel: 50,
            scrollWheelZoom: true,
            minZoom: 3, // 2 in online tile
            maxZoom: 7 // 17 in online tile
        }
    );
    map.zoomControl.setPosition("bottomright");
    const lat = height - 1;
    const long = 0;
    const zoom = 4; // z
    const _bounds = (bounds || [
        [0, 0],
        [100, 100]
    ]);
    map.setView([lat, long], zoom).setMaxBounds(_bounds);
    L.imageOverlay(img, bounds).addTo(map);
}
createImgMap("../style/maps/theThreeSeas.jpg", bounds = [
    [0, 0],
    [height, width]
]); // cabe en 660 490 con zoom 3x

let coordsArr = [];
let clickedCoords;

function onMapClick(e) {
    clickedCoords = [Math.round(e.latlng.lat * 100) / 100, Math.round(e.latlng.lng * 100) / 100];
    coordsArr.push("[" + clickedCoords + "]");
    console.trace("Pushed your map click at " + clickedCoords); // trace
    document.getElementById("logs").innerText = clickedCoords
}
map.on('click', onMapClick);

const locations = [
    "gas_station",
    "grocery_store",
    "hospital",
    "library",
    "police_station",
    "school"
]

function createIcon(path, filter, rel_size = 1, stretch_height = 1) {
    size = rel_size * 16;
    let _className;
    if (filter) {
        _className = "leaflet-marker-icon-" + filter
    } else {
        _className = "leaflet-marker-icon";
    }
    return {
        iconUrl: path,
        iconSize: [size, size * stretch_height],
        iconAnchor: [Math.floor(size / 2), size],
        popupAnchor: [10, -35],
        className: _className
    };
}

function createCharacterIcon(path, zombie = false, rel_size = 1) {
    size = rel_size * 90;
    let _className;
    if (zombie) {
        _className = "leaflet-marker-zombie-icon"
    } else {
        _className = "leaflet-marker-character-icon"
    }
    return {
        iconUrl: path,
        iconSize: [size / 2, size],
        iconAnchor: [Math.floor(size / 2), size],
        popupAnchor: [10, -35],
        className: _className
    };
}

function createEnemyIcon(path, zombie = false, rel_size = 1) {
    size = rel_size * 90;
    let _className;
    if (zombie) {
        _className = "leaflet-marker-zombie-icon"
    } else {
        _className = "leaflet-marker-character-icon"
    }
    return {
        iconUrl: path,
        iconSize: [size / 2, size],
        iconAnchor: [Math.floor(size / 2), size],
        popupAnchor: [10, -35],
        className: _className
    };
}

function setSlots(n_slots) {
    const openedPositions = spawnSlots.length
    let chosenSlot;
    let slotToUse;
    let xCoord;
    let yCoord;
    let slots = [];
    for (let k = 0; k < n_slots; k++) {
        chosenSlot = Math.floor(openedPositions * Math.random());
        slotToUse = spawnSlots[chosenSlot];

        xCoord = 5 * (slotToUse % 20) + 5;
        yCoord = 100 - 5 * (Math.floor(slotToUse / 20));

        // console.trace(`${spawnSlots[chosenSlot]} : ${moveInSlots[chosenSlot]}, x = ${xCoord}`);

        slots.push([
            '',
            yCoord, // coords[0] + (Math.random() - 0.5) * spread,
            xCoord // coords[1] + (Math.random() - 0.5) * spread
        ]);
        if (k === (n_slots - 1)) {
            return slots;
        }
    }
}

/**
 * @param {string} name 
 * @param {L.icon} _icon 
 */
function spawnMarker(name, _icon, _lat, _long) {
    return L.marker(
            [_lat, _long], {
                title: name,
                icon: _icon
            }
        ).addTo(map)
        //.bindPopup( '<color="green"><b>Objetivo</b></color>')
    ;
}
const villageIcon = L.icon(createIcon("../style/world_map_markers/green_circle.png", "Village", rel_size = 0.8)); // ../style/places/countryside.png
const townIcon = L.icon(createIcon("../style/world_map_markers/orange_circle.png", "Town", rel_size = 1)); // ../style/places/town.png
const cityIcon = L.icon(createIcon("../style/world_map_markers/red_circle.png", "City", rel_size = 1.2)); // ../style/places/city.png
cities.map(function(city) {
    switch (city["sz"]) {
        case 1:
            spawnMarker(
                city["ct"], villageIcon, city["coords"][0], city["coords"][1]
            );
            break;
        case 2:
            spawnMarker(
                city["ct"], townIcon, city["coords"][0], city["coords"][1]
            );
            break;
        case 3:
        default:
            spawnMarker(
                city["ct"], cityIcon, city["coords"][0], city["coords"][1]
            );
            break;
    }

    return true;
});

/** @typedef L.icon @type {object} @type {L.icon} */
function spawnMarkers() {
    const gas_station_icon = L.icon(createIcon('locations/gas_station.png', filter = "brightness-60"));
    const grocery_store_icon = L.icon(createIcon('locations/grocery_store.png', filter = "brightness-60"));
    const hospital_icon = L.icon(createIcon('locations/hospital.png', filter = "brightness-60", rel_size = 1.2));
    const library_icon = L.icon(createIcon('locations/library.png', filter = "brightness-60", rel_size = 1.2));
    const police_station_icon = L.icon(createIcon('locations/police_station.png', filter = "brightness-60"));
    const school_icon = L.icon(createIcon('locations/school.png', filter = "brightness-60", rel_size = 1.4));

    const character_1_icon = L.icon(createCharacterIcon('characters/character_1.png'), 1.4);
    const character_2_icon = L.icon(createCharacterIcon('characters/character_2.png'), 1.4);
    const character_3_icon = L.icon(createCharacterIcon('characters/character_3.png'), 1.4);
    const character_4_icon = L.icon(createCharacterIcon('characters/character_8.png'), 1.4);
    const character_5_icon = L.icon(createCharacterIcon('characters/character_5.png'), 1.4);
    const character_6_icon = L.icon(createCharacterIcon('characters/character_6.png'), 1.4);
    const character_7_icon = L.icon(createCharacterIcon('characters/character_7.png'), 1.4);

    const zombie_1_icon = L.icon(createCharacterIcon('zombies/01.png', zombie = true));
    const zombie_2_icon = L.icon(createCharacterIcon('zombies/02.png', zombie = true));
    const zombie_3_icon = L.icon(createCharacterIcon('zombies/03.png', zombie = true));
    const zombie_4_icon = L.icon(createCharacterIcon('zombies/04.png', zombie = true));
    const zombie_5_icon = L.icon(createCharacterIcon('zombies/05.png', zombie = true));
    const zombie_6_icon = L.icon(createCharacterIcon('zombies/06.png', zombie = true));
    const zombie_7_icon = L.icon(createCharacterIcon('zombies/07.png', zombie = true));
    const zombie_8_icon = L.icon(createCharacterIcon('zombies/08.png', zombie = true));
    const zombie_9_icon = L.icon(createCharacterIcon('zombies/09.png', zombie = true));
    const zombie_10_icon = L.icon(createCharacterIcon('zombies/10.png', zombie = true));
    const zombie_11_icon = L.icon(createCharacterIcon('zombies/11.png', zombie = true));
    const zombie_12_icon = L.icon(createCharacterIcon('zombies/12.png', zombie = true));
    const zombie_13_icon = L.icon(createCharacterIcon('zombies/13.png', zombie = true));
    const zombie_14_icon = L.icon(createCharacterIcon('zombies/14.png', zombie = true));
    const zombie_15_icon = L.icon(createCharacterIcon('zombies/15.png', zombie = true));
    const zombie_icons_array = [
        zombie_1_icon, zombie_2_icon, zombie_3_icon, zombie_4_icon, zombie_5_icon,
        zombie_6_icon, zombie_7_icon, zombie_8_icon, zombie_9_icon, zombie_10_icon,
        zombie_11_icon, zombie_12_icon, zombie_13_icon, zombie_14_icon, zombie_15_icon
    ];
    const n_zombie_icons = zombie_icons_array.length;

    const spread = 50;
    const slots = setSlots(50);
    let zombies = [];

    for (let i in slots) {
        element = Math.floor(n_zombie_icons * Math.random());
        zombie_icon = zombie_icons_array[element];
        zombie = spawnMarker("zombie", zombie_icon, slots[i][1], slots[i][2]); //.bindPopup(places[element]);
        zombies.push(
            zombie
        );
    }

    L.layerGroup(
        zombies
    ).addTo(map);

    gas_station_marker = spawnMarker('gas_station', gas_station_icon, 45, 57.5);
    grocery_store_marker = spawnMarker('grocery_store', grocery_store_icon, 40, 12.5);
    hospital_marker = spawnMarker('hospital', hospital_icon, 29, 42.5);
    library_marker = spawnMarker('library', library_icon, 20, 57.5);
    police_station_marker = spawnMarker('police_station', police_station_icon, 64, 52.5);
    school_marker = spawnMarker('school', school_icon, 55, 32.5);

    character_1_marker = spawnMarker('character_1', character_1_icon, 89, 10);
    character_2_marker = spawnMarker('character_2', character_2_icon, 89, 20);
    character_3_marker = spawnMarker('character_1', character_3_icon, 89, 30);
    character_4_marker = spawnMarker('character_2', character_4_icon, 89, 40);
    character_5_marker = spawnMarker('character_1', character_5_icon, 89, 50);
    character_6_marker = spawnMarker('character_2', character_6_icon, 89, 60);
    character_7_marker = spawnMarker('character_1', character_7_icon, 89, 70);


    return new Promise((resolve, reject) => {
        resolve(`objectives spawned`);
    })
}

function createGrid(dimension) {

    const mapHeight = document.getElementById("map").offsetHeight;
    const mapWidth = document.getElementById("map").offsetWidth;
    const countX = dimension; //cells by x
    const countY = dimension * mapHeight / mapWidth; //cells by y    
    const cellWidth = mapWidth / countX;
    const cellHeight = mapWidth / dimension;

    let coordinates = [],
        c = { x: 0, y: mapHeight }, //cursor
        //top-left/top-right/bottom-right/bottom-left
        tLx, tLy, tRx, tRy,
        bRx, bRy, bLx, bLy;

    // build coordinates array, from top-left to bottom-right
    // count by row
    for (let iY = 0; iY < countY; iY++) {
        // count by cell in row
        for (let iX = 0; iX < countX; iX++) {
            tLx = bLx = c.x;
            tLy = tRy = c.y;
            tRx = bRx = c.x + cellWidth;
            bRy = bLy = c.y - cellHeight;
            let cell = [
                // top-left/top-right/bottom-right/bottom-left/top-left
                [tLx, tLy],
                [tRx, tRy],
                [bRx, bRy],
                [bLx, bLy],
                [tLx, tLy]
            ];
            coordinates.push(cell);
            // refresh cusror for cell
            c.x = c.x + cellWidth;
        }
        // refresh cursor for row
        c.x = 0;
        c.y = c.y - cellHeight;
    }

    const grid = {
        type: 'FeatureCollection',
        features: [{
            type: 'Feature',
            geometry: {
                type: 'MultiPolygon',
                coordinates: [coordinates]
            }
        }]
    };

    const gridStyle = {
        "color": "#660000",
        "weight": 2,
        "opacity": 0.6,
        "fillOpacity": 0.2
    };

    // add grid to map
    L.geoJson(grid, { style: gridStyle }).addTo(map);
}
/* createGrid(160);
map.addEventListener('mousemove', function(ev) {
    console.trace(`lat = ${ev.latlng.lat}; lng = ${ev.latlng.lng};`);
});
*/