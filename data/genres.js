const buildingPoints = [
  {"crds":  [ 115, 500], "url":"about:blank", "text": "Soundtrack"}
  ,{"crds": [ 270, 620], "url":"about:blank", "text": "Celtic"}
  ,{"crds": [ 270, 605], "url":"about:blank", "text": "Latin"}
  ,{"crds": [ 270, 590], "url":"about:blank", "text": "Nordic"}
  ,{"crds": [ 560, 630], "url":"about:blank", "text": "Traditional gospel"}
  ,{"crds": [ 720, 580], "url":"about:blank", "text": "Renaissance"}
  ,{"crds": [ 720, 590], "url":"about:blank", "text": "Symphony"}
  ,{"crds": [ 720, 600], "url":"about:blank", "text": "Medieval"}
  ,{"crds": [ 720, 610], "url":"about:blank", "text": "Baroque"}  
  ,{"crds": [ 720, 620], "url":"about:blank", "text": "Opera"}
  ,{"crds": [ 810, 620], "url":"about:blank", "text": "Contemp. class. m."}
  ,{"crds": [ 810, 610], "url":"about:blank", "text": "Modern class. m."}
  ,{"crds": [ 810, 600], "url":"about:blank", "text": "Class. romantic"}
  ,{"crds": [ 940, 550], "url":"about:blank", "text": "Merengue"}
  ,{"crds": [ 940, 530], "url":"about:blank", "text": "Salsa"}
  ,{"crds": [1000, 570], "url":"about:blank", "text": "Bossa nova"}
  ,{"crds": [1000, 550], "url":"about:blank", "text": "Cumbia"}
  ,{"crds": [1000, 530], "url":"about:blank", "text": "Samba"}
  ,{"crds": [1000, 510], "url":"about:blank", "text": "Tango"}
  ,{"crds": [1000, 490], "url":"about:blank", "text": "Tropicalia"}
  ,{"crds": [1060, 540], "url":"about:blank", "text": "Afrobeat"}
  ,{"crds": [ 100, 270], "url":"about:blank", "text": "Avant-garde industrial"}
  ,{"crds": [  95, 245], "url":"about:blank", "text": "Gothic rock"}
  ,{"crds": [  75, 230], "url":"about:blank", "text": "EBM"}
  ,{"crds": [  75, 210], "url":"about:blank", "text": "Dark ambient"}
  ,{"crds": [  95, 195], "url":"about:blank", "text": "Darkwave"}
  ,{"crds": [ 115, 170], "url":"about:blank", "text": "Industrial rock"}
  ,{"crds": [ 130, 160], "url":"about:blank", "text": "Industrial metal"}
  ,{"crds": [  75, 140], "url":"about:blank", "text": "Aggrotech"}
  ,{"crds": [  75, 100], "url":"about:blank", "text": "Futurepop"}
  ,{"crds": [  75,  60], "url":"about:blank", "text": "Min wave synth & ind"}
  ,{"crds": [ 175, 315], "url":"about:blank", "text": "Classic metal"}
  ,{"crds": [ 190, 280], "url":"about:blank", "text": "Progressive metal"}
  ,{"crds": [ 145, 255], "url":"about:blank", "text": "Power metal"}
  ,{"crds": [ 190, 255], "url":"about:blank", "text": "Glam metal"}
  ,{"crds": [ 180, 220], "url":"about:blank", "text": "Thrash metal"}
  ,{"crds": [ 160, 205], "url":"about:blank", "text": "Doom metal"}
  ,{"crds": [ 190, 195], "url":"about:blank", "text": "Death metal"}
  ,{"crds": [ 195, 150], "url":"about:blank", "text": "Black metal"}
  ,{"crds": [ 165, 135], "url":"about:blank", "text": "Symphonic metal"}
  ,{"crds": [ 150, 120], "url":"about:blank", "text": "Gothic metal"}
  ,{"crds": [ 195, 105], "url":"about:blank", "text": "Nu metal"}
  ,{"crds": [ 290, 410], "url":"about:blank", "text": "Rockabilly"}
  ,{"crds": [ 290, 400], "url":"about:blank", "text": "Rock & Roll"}
  ,{"crds": [ 250, 340], "url":"about:blank", "text": "Folk rock"}
  ,{"crds": [ 350, 340], "url":"about:blank", "text": "Psy rock"}
  ,{"crds": [ 345, 300], "url":"about:blank", "text": "Progressive rock"}
  ,{"crds": [ 285, 290], "url":"about:blank", "text": "Hard rock"}
  ,{"crds": [ 275, 265], "url":"about:blank", "text": "Punk rock"}
  ,{"crds": [ 305, 230], "url":"about:blank", "text": "New wave"}
  ,{"crds": [ 365, 220], "url":"about:blank", "text": "Synthpop"}
  ,{"crds": [ 265, 165], "url":"about:blank", "text": "Math rock"}
  ,{"crds": [ 375, 170], "url":"about:blank", "text": "Dream pop"}
  ,{"crds": [ 365, 160], "url":"about:blank", "text": "Shoegaze"}
  ,{"crds": [ 345, 140], "url":"about:blank", "text": "Alt rock & indie"}
  ,{"crds": [ 320, 130], "url":"about:blank", "text": "Post-rock"}
  ,{"crds": [ 370,  65], "url":"about:blank", "text": "Indietronica"}
  ,{"crds": [ 290,  55], "url":"about:blank", "text": "Nu post prog rock"}
  ,{"crds": [ 370,  45], "url":"about:blank", "text": "Indie folk / freak folk"}
  ,{"crds": [ 395, 400], "url":"about:blank", "text": "Schlager"}
  ,{"crds": [ 420, 320], "url":"about:blank", "text": "Country pop rock"}
  ,{"crds": [ 370, 285], "url":"about:blank", "text": "Singer-songwriter"}
  ,{"crds": [ 395, 260], "url":"about:blank", "text": "Soft rock"}
  ,{"crds": [ 410, 230], "url":"about:blank", "text": "Eurodisco"}
  ,{"crds": [ 390, 210], "url":"about:blank", "text": "Disco pop"}
  ,{"crds": [ 410, 195], "url":"about:blank", "text": "Indie pop"}
  ,{"crds": [ 400, 125], "url":"about:blank", "text": "Dance pop"}
  ,{"crds": [ 445, 530], "url":"about:blank", "text": "Classic country"}
  ,{"crds": [ 450, 500], "url":"about:blank", "text": "Western swing"}
  ,{"crds": [ 450, 420], "url":"about:blank", "text": "Bluegrass"}
  ,{"crds": [ 485, 450], "url":"about:blank", "text": "RnB"}
  ,{"crds": [ 485, 280], "url":"about:blank", "text": "Disco"}
  ,{"crds": [ 485, 200], "url":"about:blank", "text": "Boogie electrofunk"}
  ,{"crds": [ 485,  70], "url":"about:blank", "text": "Funktronica"}
  ,{"crds": [ 535, 575], "url":"about:blank", "text": "Contry folk blues"}
  ,{"crds": [ 535, 165], "url":"about:blank", "text": "Hill country trance blues"}
  ,{"crds": [ 570, 430], "url":"about:blank", "text": "Modern gospel"}
  ,{"crds": [ 570, 310], "url":"about:blank", "text": "Relipop"}
  ,{"crds": [ 600, 520], "url":"about:blank", "text": "Swing / big band"}
  ,{"crds": [ 600, 440], "url":"about:blank", "text": "Bebop"}
  ,{"crds": [ 600, 370], "url":"about:blank", "text": "Free jazz avant-garde"}
  ,{"crds": [ 600, 300], "url":"about:blank", "text": "Fussion jazz-rock"}
  ,{"crds": [ 580, 265], "url":"about:blank", "text": "Smooth jazz"}
  ,{"crds": [ 590, 190], "url":"about:blank", "text": "Acid jazz / jazzdance"}
  ,{"crds": [ 590, 140], "url":"about:blank", "text": "Nu jazz / electro jazz"}
  ,{"crds": [ 590,  65], "url":"about:blank", "text": "Electro-swing"}
  ,{"crds": [ 640, 380], "url":"about:blank", "text": "Ska"}
  ,{"crds": [ 625, 320], "url":"about:blank", "text": "Reggae"}
  ,{"crds": [ 650, 290], "url":"about:blank", "text": "Dub"}
  ,{"crds": [ 710, 275], "url":"about:blank", "text": "Old skool rap"}
  ,{"crds": [ 690, 130], "url":"about:blank", "text": "East coast gangsta rap"}
  ,{"crds": [ 760, 170], "url":"about:blank", "text": "Trip-hop"}
  ,{"crds": [ 780,  35], "url":"about:blank", "text": "EDM Trap"}
  ,{"crds": [ 850, 180], "url":"about:blank", "text": "Old skool jungle dnb"}
  ,{"crds": [ 860, 135], "url":"about:blank", "text": "Intelligent & jazzstep"}
  ,{"crds": [ 850, 105], "url":"about:blank", "text": "Liquid funk"}
  ,{"crds": [ 870,  85], "url":"about:blank", "text": "Dubstep"}
  ,{"crds": [ 870,  65], "url":"about:blank", "text": "Post-dubstep"}
  ,{"crds": [ 960, 170], "url":"about:blank", "text": "Hardcore techno / rave"}
  ,{"crds": [ 900, 160], "url":"about:blank", "text": "Breakbeat hardcore"}
  ,{"crds": [ 920, 110], "url":"about:blank", "text": "Trance & acid core"}
  ,{"crds": [ 950,  95], "url":"about:blank", "text": "Hardstyle"}
  ,{"crds": [1020, 160], "url":"about:blank", "text": "Amb. techno / idm"}
  ,{"crds": [1000, 120], "url":"about:blank", "text": "Tech trance"}
  ,{"crds": [1045, 150], "url":"about:blank", "text": "Progressive house"}
  ,{"crds": [1060,  55], "url":"about:blank", "text": "Moombahton"}
  ,{"crds": [1140, 185], "url":"about:blank", "text": "Classic & acid trance"}
  ,{"crds": [1140, 165], "url":"about:blank", "text": "Goa trance & psytrance"}
  ,{"crds": [1160, 145], "url":"about:blank", "text": "Progressive trance"}
  ,{"crds": [1140,  70], "url":"about:blank", "text": "Neo-trance"}
  ,{"crds": [1200, 410], "url":"about:blank", "text": "Lounge / space age pop"}
  ,{"crds": [1190, 380], "url":"about:blank", "text": "Minimalism"}
  ,{"crds": [1200, 360], "url":"about:blank", "text": "Muzak / elevator music"}
  ,{"crds": [1190, 285], "url":"about:blank", "text": "Synth / electronica"}
  ,{"crds": [1200, 275], "url":"about:blank", "text": "Ambient"}
  ,{"crds": [1190, 230], "url":"about:blank", "text": "Chiptune"}
  ,{"crds": [1200, 220], "url":"about:blank", "text": "New age"}
  ,{"crds": [1200, 100], "url":"about:blank", "text": "Digital minimalism / lowercase"}
  ,{"crds": [1200,  55], "url":"about:blank", "text": "Synthwave / vaporwave"}
].map(
  p => {
    return {
      "type": "Feature",
      "geometry": {
        "type": "Point", "coordinates": p.crds
      },
      "properties": {
        "text": p.text,
        "url": p.url,
        "radius": 0
      }
    }
  }
)