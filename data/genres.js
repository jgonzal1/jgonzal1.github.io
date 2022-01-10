const buildingPoints = [
  {"crds":  [ 115, 500], "text": "Soundtrack"}
  ,{"crds": [ 270, 620], "text": "Celtic"}
  ,{"crds": [ 270, 605], "text": "Latin"}
  ,{"crds": [ 270, 590], "text": "Nordic"}
  ,{"crds": [ 560, 630], "text": "Traditional gospel"}
  ,{"crds": [ 720, 580], "text": "Renaissance"}
  ,{"crds": [ 720, 590], "text": "Symphony"}
  ,{"crds": [ 720, 600], "text": "Medieval"}
  ,{"crds": [ 720, 610], "text": "Baroque"}
  ,{"crds": [ 720, 620], "text": "Opera"}
  ,{"crds": [ 810, 620], "text": "Contemp. class. m."}
  ,{"crds": [ 810, 610], "text": "Modern class. m."}
  ,{"crds": [ 810, 600], "text": "Class. romantic"}
  ,{"crds": [ 940, 550], "text": "Merengue"}
  ,{"crds": [ 940, 530], "text": "Salsa"}
  ,{"crds": [1000, 570], "text": "Bossa nova"}
  ,{"crds": [1000, 550], "text": "Cumbia"}
  ,{"crds": [1000, 530], "text": "Samba"}
  ,{"crds": [1000, 510], "text": "Tango"}
  ,{"crds": [1000, 490], "text": "Tropicalia"}
  ,{"crds": [1060, 540], "text": "Afrobeat"}
  ,{"crds": [ 100, 270], "text": "Avant-garde industrial"}
  ,{"crds": [  95, 245], "text": "Gothic rock"}
  ,{"crds": [  75, 230], "text": "EBM"}
  ,{"crds": [  75, 210], "text": "Dark ambient"}
  ,{"crds": [  95, 195], "text": "Darkwave"}
  ,{"crds": [ 115, 170], "text": "Industrial rock"}
  ,{"crds": [ 130, 160], "text": "Industrial metal"}
  ,{"crds": [  75, 140], "text": "Aggrotech"}
  ,{"crds": [  75, 100], "text": "Futurepop"}
  ,{"crds": [  75,  60], "text": "Min wave synth & ind"}
  ,{"crds": [ 175, 315], "text": "Classic metal"}
  ,{"crds": [ 190, 280], "text": "Progressive metal"}
  ,{"crds": [ 145, 250], "text": "Power metal"}
  ,{"crds": [ 190, 260], "text": "Glam metal"}
  ,{"crds": [ 180, 220], "text": "Thrash metal"}
  ,{"crds": [ 160, 205], "text": "Doom metal"}
  ,{"crds": [ 190, 195], "text": "Death metal"}
  ,{"crds": [ 195, 150], "text": "Black metal"}
  ,{"crds": [ 165, 135], "text": "Symphonic metal"}
  ,{"crds": [ 150, 120], "text": "Gothic metal"}
  ,{"crds": [ 195, 105], "text": "Nu metal"}
  ,{"crds": [ 290, 410], "text": "Rockabilly"}
  ,{"crds": [ 290, 400], "text": "Rock & Roll"}
  ,{"crds": [ 250, 340], "text": "Folk rock"}
  ,{"crds": [ 350, 340], "text": "Psy rock"}
  ,{"crds": [ 345, 300], "text": "Progressive rock"}
  ,{"crds": [ 285, 290], "text": "Hard rock"}
  ,{"crds": [ 275, 265], "text": "Punk rock"}
  ,{"crds": [ 305, 230], "text": "New wave"}
  ,{"crds": [ 365, 220], "text": "Synthpop"}
  ,{"crds": [ 265, 165], "text": "Math rock"}
  ,{"crds": [ 375, 170], "text": "Dream pop"}
  ,{"crds": [ 365, 160], "text": "Shoegaze"}
  ,{"crds": [ 345, 140], "text": "Alt rock & indie"}
  ,{"crds": [ 320, 130], "text": "Post-rock"}
  ,{"crds": [ 370,  65], "text": "Indietronica"}
  ,{"crds": [ 290,  55], "text": "Nu post prog rock"}
  ,{"crds": [ 370,  45], "text": "Indie folk / freak folk"}
  ,{"crds": [ 395, 400], "text": "Schlager"}
  ,{"crds": [ 420, 320], "text": "Country pop rock"}
  ,{"crds": [ 370, 285], "text": "Singer-songwriter"}
  ,{"crds": [ 395, 260], "text": "Soft rock"}
  ,{"crds": [ 410, 230], "text": "Eurodisco"}
  ,{"crds": [ 390, 210], "text": "Disco pop"}
  ,{"crds": [ 410, 195], "text": "Indie pop"}
  ,{"crds": [ 400, 125], "text": "Dance pop"}
  ,{"crds": [ 445, 530], "text": "Classic country"}
  ,{"crds": [ 450, 500], "text": "Western swing"}
  ,{"crds": [ 450, 420], "text": "Bluegrass"}
  ,{"crds": [ 485, 450], "text": "RnB"}
  ,{"crds": [ 485, 280], "text": "Disco"}
  ,{"crds": [ 485, 200], "text": "Boogie electrofunk"}
  ,{"crds": [ 485,  70], "text": "Funktronica"}
  ,{"crds": [ 535, 575], "text": "Contry folk blues"}
  ,{"crds": [ 535, 165], "text": "Hill country trance blues"}
  ,{"crds": [ 570, 430], "text": "Modern gospel"}
  ,{"crds": [ 570, 310], "text": "Relipop"}
  ,{"crds": [ 600, 520], "text": "Swing / big band"}
  ,{"crds": [ 600, 440], "text": "Bebop"}
  ,{"crds": [ 600, 370], "text": "Free jazz avant-garde"}
  ,{"crds": [ 600, 300], "text": "Fussion jazz-rock"}
  ,{"crds": [ 580, 265], "text": "Smooth jazz"}
  ,{"crds": [ 590, 190], "text": "Acid jazz / jazzdance"}
  ,{"crds": [ 590, 140], "text": "Nu jazz / electro jazz"}
  ,{"crds": [ 590,  65], "text": "Electro-swing"}
  ,{"crds": [ 640, 380], "text": "Ska"}
  ,{"crds": [ 625, 320], "text": "Reggae"}
  ,{"crds": [ 650, 290], "text": "Dub"}
  ,{"crds": [ 710, 275], "text": "Old skool rap"}
  ,{"crds": [ 690, 130], "text": "East coast gangsta rap"}
  ,{"crds": [ 760, 170], "text": "Trip-hop"}
  ,{"crds": [ 780,  35], "text": "EDM Trap"}
  ,{"crds": [ 850, 180], "text": "Old skool jungle dnb"}
  ,{"crds": [ 860, 135], "text": "Intelligent & jazzstep"}
  ,{"crds": [ 850, 105], "text": "Liquid funk"}
  ,{"crds": [ 870,  85], "text": "Dubstep"}
  ,{"crds": [ 870,  65], "text": "Post-dubstep"}
  ,{"crds": [ 960, 170], "text": "Hardcore techno / rave"}
  ,{"crds": [ 900, 160], "text": "Breakbeat hardcore"}
  ,{"crds": [ 920, 110], "text": "Trance & acid core"}
  ,{"crds": [ 950,  95], "text": "Hardstyle"}
  ,{"crds": [1020, 160], "text": "Amb. techno / idm"}
  ,{"crds": [1000, 120], "text": "Tech trance"}
  ,{"crds": [1045, 150], "text": "Progressive house"}
  ,{"crds": [1060,  55], "text": "Moombahton"}
  ,{"crds": [1140, 185], "text": "Classic & acid trance"}
  ,{"crds": [1140, 165], "text": "Goa trance & psytrance"}
  ,{"crds": [1160, 145], "text": "Progressive trance"}
  ,{"crds": [1140,  70], "text": "Neo-trance"}
  ,{"crds": [1200, 410], "text": "Lounge / space age pop"}
  ,{"crds": [1190, 380], "text": "Minimalism"}
  ,{"crds": [1200, 360], "text": "Muzak / elevator music"}
  ,{"crds": [1190, 285], "text": "Synth / electronica"}
  ,{"crds": [1200, 275], "text": "Ambient"}
  ,{"crds": [1190, 230], "text": "Chiptune"}
  ,{"crds": [1200, 220], "text": "New age"}
  ,{"crds": [1200, 100], "text": "Digital minimalism / lowercase"}
  ,{"crds": [1200,  55], "text": "Synthwave / vaporwave"}
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