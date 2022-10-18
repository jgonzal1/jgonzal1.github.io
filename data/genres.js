const buildingPoints = [
  {"text":"Webpage based on musicmap.info!","self":2,"url":"https://musicmap.info", "crds":[ 100,700],"index":136}
  ,{"text":"Acid jazz / jazzdance"         ,"self":0,"url":"#","crds":[ 590,190],"index": 84}
  ,{"text":"Afrobeat"                      ,"self":0,"url":"#","crds":[1060,540],"index": 21}
  ,{"text":"Aggrotech"                     ,"self":1,"url":"7EmeLvO69511qZYR9rbK3m","crds":[  75,140],"index": 29}
  ,{"text":"Alt rock & indie"              ,"self":1,"url":"2gX78AZu9KQ9w59YEziRJP","crds":[ 345,140],"index": 55}
  ,{"text":"Amb. techno / idm"             ,"self":1,"url":"7mrmrI9K8ooGYEL5BJjYNl","crds":[1020,160],"index":103}
  ,{"text":"Ambient"                       ,"self":1,"url":"0OoH9VKKOkMmFVShSdGI5I","crds":[1200,275],"index":115}
  ,{"text":"Avant-garde industrial"        ,"self":0,"url":"#","crds":[ 100,270],"index": 22}
  ,{"text":"Bachata"                       ,"self":1,"url":"1GGZiLw5ikiuI53SUpEpE3","crds":[1000,550],"index": 17}
  ,{"text":"Baroque"                       ,"self":0,"url":"#","crds":[ 720,610],"index":  9}
  ,{"text":"Bebop"                         ,"self":0,"url":"#","crds":[ 600,440],"index": 80}
  ,{"text":"Black metal"                   ,"self":0,"url":"#","crds":[ 195,150],"index": 39}
  ,{"text":"Bluegrass"                     ,"self":0,"url":"#","crds":[ 450,420],"index": 70}
  ,{"text":"Boogie electrofunk"            ,"self":1,"url":"3rwcuTwNyzGSEm9JgVykXM","crds":[ 485,200],"index": 73}
  ,{"text":"Bossa nova"                    ,"self":1,"url":"6fuXYNqgIyeVyOlykCobA9","crds":[1000,570],"index": 16}
  ,{"text":"Breakbeat hardcore"            ,"self":0,"url":"#","crds":[ 900,160],"index":100}
  ,{"text":"Celtic"                        ,"self":1,"url":"14wTJv3u383K0fDr0TK6qs","crds":[ 270,620],"index":  2}
  ,{"text":"Chill Mix"                     ,"self":2,"url":"37i9dQZF1EVHGWrwldPRtj","crds":[1200,330],"index":127}
  ,{"text":"Chiptune"                      ,"self":0,"url":"1SQBCNypeE7acQxPjsROhl","crds":[1190,230],"index":116}
  ,{"text":"Class. romantic"               ,"self":1,"url":"11sIaL1E2OmGhrXW4abKME","crds":[ 810,580],"index": 13}
  ,{"text":"Classic & acid trance"         ,"self":0,"url":"#","crds":[1140,185],"index":107}
  ,{"text":"Classic country"               ,"self":1,"url":"3BGJOT0AYU2EenKL2Qzsyz","crds":[ 445,530],"index": 68}
  ,{"text":"Classic metal"                 ,"self":1,"url":"0wigyGCyr0pajRhFAfG66t","crds":[ 175,315],"index": 32}
  ,{"text":"Classical mix"                 ,"self":2,"url":"37i9dQZF1EQn1VBR3CMMWb","crds":[ 810,560],"index":128}
  ,{"text":"Contemp. class. m."            ,"self":0,"url":"#","crds":[ 810,620],"index": 11}
  ,{"text":"Country folk blues"            ,"self":0,"url":"#","crds":[ 535,575],"index": 75}
  ,{"text":"Country pop rock"              ,"self":0,"url":"#","crds":[ 420,320],"index": 61}
  ,{"text":"Cumbia"                        ,"self":0,"url":"#","crds":[985,535],"index": 17}
  ,{"text":"Dance pop"                     ,"self":1,"url":"0DGusKA7sgydJdLzsQ5LX2","crds":[ 400,125],"index": 67}
  ,{"text":"Dark ambient"                  ,"self":1,"url":"5rBnPOG2GizWe2tyHfphyK","crds":[  75,210],"index": 25}
  ,{"text":"Darkwave"                      ,"self":1,"url":"55YmcZmEGMizDOqDW1MT1x","crds":[  95,195],"index": 26}
  ,{"text":"Death metal"                   ,"self":1,"url":"3erptMyjJ4bZ4xgYTnlCm6","crds":[ 190,195],"index": 38}
  ,{"text":"Digital minimalism / lowercase","self":0,"url":"2rN3mSrzUcgjlj1TcEDTX7","crds":[1200,100],"index":118}
  ,{"text":"Disco pop"                     ,"self":1,"url":"4YJoN3ChDJ4gBBgSDy4jmK","crds":[ 390,210],"index": 65}
  ,{"text":"Disco"                         ,"self":1,"url":"4mxY0dw8OU00UnOQeq9OFx","crds":[ 485,280],"index": 72}
  ,{"text":"Doom metal"                    ,"self":0,"url":"#","crds":[ 160,205],"index": 37}
  ,{"text":"Dream pop"                     ,"self":1,"url":"36finQ0m3T8BSJEG5evvts","crds":[ 375,170],"index": 53}
  ,{"text":"Dub"                           ,"self":1,"url":"246zLjoIEAPggNphqvARTR","crds":[ 650,290],"index": 89}
  ,{"text":"Dubstep"                       ,"self":0,"url":"#","crds":[ 870, 85],"index": 97}
  ,{"text":"East coast gangsta rap"        ,"self":0,"url":"#","crds":[ 690,130],"index": 91}
  ,{"text":"EBM"                           ,"self":0,"url":"#","crds":[  75,230],"index": 24}
  ,{"text":"EDM Trap"                      ,"self":0,"url":"#","crds":[ 780, 35],"index": 93}
  ,{"text":"Electro-swing"                 ,"self":1,"url":"7gK6OgvfAShw2zpbq20uob","crds":[ 590, 65],"index": 86}
  ,{"text":"Eurodisco"                     ,"self":0,"url":"#","crds":[ 410,230],"index": 64}
  ,{"text":"Experimental"                  ,"self":1,"url":"6pV8WR1UUTR0kyF5BgAvn9","crds":[ 115,470],"index":120}
  ,{"text":"Folk & Acoustic Mix"           ,"self":2,"url":"37i9dQZF1EQp62d3Dl7ECY","crds":[ 270,570],"index":135}
  ,{"text":"Folk rock"                     ,"self":1,"url":"0jR8JGnUiOseB2Sb2ajpxj","crds":[ 250,340],"index": 45}
  ,{"text":"Foltronica"                    ,"self":1,"url":"6tvgvZAOM6aXLyMJZOaFzw","crds":[1000, 85],"index":104}
  ,{"text":"Free jazz avant-garde"         ,"self":1,"url":"4PCTXMZ22Iup2ztEQO6YRX","crds":[ 600,370],"index": 81}
  ,{"text":"Funk"                          ,"self":1,"url":"3rwcuTwNyzGSEm9JgVykXM","crds":[ 600,390],"index": 81}
  ,{"text":"Funktronica"                   ,"self":0,"url":"#","crds":[ 485, 70],"index": 74}
  ,{"text":"Fussion jazz-rock"             ,"self":1,"url":"2LKohXp89pIOoC4ac3mqn5","crds":[ 600,300],"index": 82}
  ,{"text":"Futurepop"                     ,"self":0,"url":"#","crds":[  75,100],"index": 30}
  ,{"text":"Glam metal"                    ,"self":0,"url":"#","crds":[ 190,260],"index": 35}
  ,{"text":"Goa trance & psytrance"        ,"self":1,"url":"4pMUqKVbwkudmHCYTkVvu5","crds":[1140,165],"index":108}
  ,{"text":"Gothic metal"                  ,"self":0,"url":"#","crds":[ 150,120],"index": 41}
  ,{"text":"Gothic rock"                   ,"self":1,"url":"0T6qPt9zJAdfBnagGyzOl4","crds":[  95,240],"index": 23}
  ,{"text":"Hard rock"                     ,"self":1,"url":"607ys9TpDSMlsx5U7NcbdP","crds":[ 285,290],"index": 48}
  ,{"text":"Hardcore techno / rave"        ,"self":0,"url":"#","crds":[ 960,170],"index": 99}
  ,{"text":"Hardstyle"                     ,"self":0,"url":"#","crds":[ 950, 95],"index":102}
  ,{"text":"Hill country trance blues"     ,"self":0,"url":"#","crds":[ 535,165],"index": 76}
  ,{"text":"House Mix"                     ,"self":2,"url":"37i9dQZF1EQpoj8u9Hn81e","crds":[1070,120],"index":130}
  ,{"text":"Indie folk / freak folk"       ,"self":0,"url":"#","crds":[ 370, 45],"index": 59}
  ,{"text":"Indie pop"                     ,"self":1,"url":"2gX78AZu9KQ9w59YEziRJP","crds":[ 410,195],"index": 66}
  ,{"text":"Indietronica"                  ,"self":0,"url":"#","crds":[ 370, 65],"index": 57}
  ,{"text":"Industrial metal"              ,"self":1,"url":"0sLzhB45BUsKtMY1GFLp99","crds":[ 130,160],"index": 28}
  ,{"text":"Industrial rock"               ,"self":1,"url":"5NWBIHZ8SUvAMR3b9glaH2","crds":[ 115,170],"index": 27}
  ,{"text":"Intelligent & jazzstep"        ,"self":0,"url":"#","crds":[ 860,135],"index": 95}
  ,{"text":"Jazz Mix"                      ,"self":2,"url":"37i9dQZF1EQqA6klNdJvwx","crds":[ 590,230],"index":131}
  ,{"text":"Kizomba"                       ,"self":1,"url":"7EWSrxZKDblyqJNsGPdcE2","crds":[1060,520],"index": 21}
  ,{"text":"Latin"                         ,"self":0,"url":"5Mo0ErzMKoU4hkypC1s8eN","crds":[ 270,605],"index":  3}
  ,{"text":"Liquid funk"                   ,"self":1,"url":"2nf10oPPudKAFgWE0oESkD","crds":[ 850,105],"index": 96}
  ,{"text":"Lounge / space age pop"        ,"self":1,"url":"3NDootlTJJtUk2CE5nrJIP","crds":[1200,410],"index":111}
  ,{"text":"Math rock"                     ,"self":0,"url":"#","crds":[ 265,165],"index": 52}
  ,{"text":"Medieval"                      ,"self":0,"url":"#","crds":[ 720,600],"index":  8}
  ,{"text":"Melodic death metal"           ,"self":1,"url":"0LnpDpweu69GWjDY68BJXw","crds":[ 190,185],"index": 38}
  ,{"text":"Merengue"                      ,"self":0,"url":"#","crds":[ 940,550],"index": 14}
  ,{"text":"Min wave synth & ind"          ,"self":0,"url":"#","crds":[  75, 60],"index": 31}
  ,{"text":"Minimalism"                    ,"self":0,"url":"#","crds":[1190,380],"index":112}
  ,{"text":"Modern class. m."              ,"self":0,"url":"#","crds":[ 810,600],"index": 12}
  ,{"text":"Modern gospel"                 ,"self":0,"url":"#","crds":[ 570,430],"index": 77}
  ,{"text":"Moombahton"                    ,"self":0,"url":"#","crds":[1060, 55],"index":106}
  ,{"text":"Muzak / elevator music"        ,"self":0,"url":"#","crds":[1200,360],"index":113}
  ,{"text":"Neofolk"                       ,"self":1,"url":"2Er6xZyUuBjJ0EampHFXAi","crds":[  75,195],"index": 26}
  ,{"text":"Neo-trance"                    ,"self":0,"url":"#","crds":[1140, 70],"index":110}
  ,{"text":"New age"                       ,"self":0,"url":"#","crds":[1200,220],"index":117}
  ,{"text":"New wave"                      ,"self":0,"url":"#","crds":[ 305,230],"index": 50}
  ,{"text":"Nordic"                        ,"self":0,"url":"37i9dQZF1DWXhcuQw7KIeM","crds":[ 270,590],"index":  4}
  ,{"text":"Nu jazz / electro jazz"        ,"self":0,"url":"#","crds":[ 590,140],"index": 85}
  ,{"text":"Nu metal"                      ,"self":1,"url":"2SsCVycRhgG51cY2rOsPr1","crds":[ 195,105],"index": 42}
  ,{"text":"Nu post prog rock"             ,"self":0,"url":"#","crds":[ 290, 55],"index": 58}
  ,{"text":"Old skool jungle dnb"          ,"self":1,"url":"2nf10oPPudKAFgWE0oESkD","crds":[ 850,180],"index": 94}
  ,{"text":"Old skool rap"                 ,"self":1,"url":"2YPgwLHGvvMe24mpff2zBW","crds":[ 710,275],"index": 90}
  ,{"text":"Opera"                         ,"self":0,"url":"#","crds":[ 720,620],"index": 10}
  ,{"text":"Post-dubstep"                  ,"self":0,"url":"#","crds":[ 870, 65],"index": 98}
  ,{"text":"Post-rock"                     ,"self":0,"url":"#","crds":[ 320,130],"index": 56}
  ,{"text":"Power metal"                   ,"self":1,"url":"7fTtYmlOBNF0il5uO2ASsk","crds":[ 145,250],"index": 34}
  ,{"text":"Progressive house"             ,"self":1,"url":"2D2kioZ5cdvPRFVDgxYaEx","crds":[1045,150],"index":105}
  ,{"text":"Progressive metal"             ,"self":1,"url":"373bAM3YOUVc2GDe7rvj5u","crds":[ 190,280],"index": 33}
  ,{"text":"Progressive rock"              ,"self":1,"url":"4TOAesAQqrMS4U2NuUi1RT","crds":[ 345,300],"index": 47}
  ,{"text":"Progressive trance"            ,"self":0,"url":"#","crds":[1160,145],"index":109}
  ,{"text":"Psy rock"                      ,"self":0,"url":"#","crds":[ 350,340],"index": 46}
  ,{"text":"Punk rock"                     ,"self":0,"url":"#","crds":[ 275,265],"index": 49}
  ,{"text":"Reggae"                        ,"self":1,"url":"06mtEUIM4CpBqF4oElDJpW","crds":[ 625,320],"index": 88}
  ,{"text":"Reggae Mix"                    ,"self":2,"url":"37i9dQZF1EQpjs4F0vUZ1x","crds":[ 640,250],"index":129}
  ,{"text":"Relipop"                       ,"self":0,"url":"#","crds":[ 570,310],"index": 78}
  ,{"text":"Renaissance"                   ,"self":0,"url":"#","crds":[ 720,580],"index":  6}
  ,{"text":"RnB"                           ,"self":1,"url":"707OZVnjub2qm46XuHYU4G","crds":[ 485,450],"index": 71}
  ,{"text":"Rock & Roll"                   ,"self":0,"url":"#","crds":[ 290,400],"index": 44}
  ,{"text":"Rock Mix"                      ,"self":2,"url":"37i9dQZF1EQpj7X7UK8OOF","crds":[ 300,380],"index":134}
  ,{"text":"Rockabilly"                    ,"self":0,"url":"#","crds":[ 290,410],"index": 43}
  ,{"text":"Salsa"                         ,"self":1,"url":"3CiPI46QLPVSRfm5UieqHR","crds":[ 940,530],"index": 15}
  ,{"text":"Samba"                         ,"self":1,"url":"4xRylvSqmE2GIzKCPpUINR","crds":[1015,535],"index": 18}
  ,{"text":"Schlager"                      ,"self":0,"url":"#","crds":[ 395,400],"index": 60}
  ,{"text":"Shoegaze"                      ,"self":0,"url":"#","crds":[ 365,160],"index": 54}
  ,{"text":"Singer-songwriter"             ,"self":1,"url":"05a3A3cxTTsA5EGaeH9d84","crds":[ 370,285],"index": 62}
  ,{"text":"Ska"                           ,"self":0,"url":"#","crds":[ 640,380],"index": 87}
  ,{"text":"Smooth jazz"                   ,"self":1,"url":"1N7PVlMupNg0z36K8oMzEh","crds":[ 580,265],"index": 83}
  ,{"text":"Soft rock"                     ,"self":1,"url":"607ys9TpDSMlsx5U7NcbdP","crds":[ 395,260],"index": 63}
  ,{"text":"Soul Mix"                      ,"self":2,"url":"37i9dQZF1EQntZpEGgfBif","crds":[ 490,395],"index":133}
  ,{"text":"Soundtrack"                    ,"self":1,"url":"64kGNTzaPcy6LcPpq4yGOi","crds":[ 115,500],"index":  1}
  ,{"text":"Swing / big band"              ,"self":1,"url":"3EMjGn7GdAzNoKwMEIj8PG","crds":[ 600,520],"index": 79}
  ,{"text":"Swing Mix"                     ,"self":2,"url":"37i9dQZF1EIezSgnavWYjm","crds":[ 600,500],"index":132}
  ,{"text":"Symphonic metal"               ,"self":1,"url":"0ITx338BH3GM8VGYXPxyy2","crds":[ 165,135],"index": 40}
  ,{"text":"Symphony"                      ,"self":0,"url":"#","crds":[ 720,590],"index":  7}
  ,{"text":"Synth / electronica"           ,"self":1,"url":"3KGfSFPFDkUc440NkmJx7b","crds":[1190,285],"index":114}
  ,{"text":"Synthpop"                      ,"self":0,"url":"#","crds":[ 365,220],"index": 51}
  ,{"text":"Synthwave / vaporwave"         ,"self":0,"url":"#","crds":[1200, 55],"index":119}
  ,{"text":"Tango"                         ,"self":0,"url":"#","crds":[985,520],"index": 19}
  ,{"text":"Tech trance"                   ,"self":1,"url":"4mxY0dw8OU00UnOQeq9OFx","crds":[1000,120],"index":104}
  ,{"text":"Thrash metal"                  ,"self":0,"url":"#","crds":[ 180,220],"index": 36}
  ,{"text":"Traditional gospel"            ,"self":0,"url":"#","crds":[ 560,630],"index":  5}
  ,{"text":"Trance & acid core"            ,"self":0,"url":"#","crds":[ 920,110],"index":101}
  ,{"text":"Trip-hop"                      ,"self":1,"url":"4fYMPKJmZLlwwDDn3o4DCh","crds":[ 760,170],"index": 92}
  ,{"text":"Tropicalia"                    ,"self":0,"url":"#","crds":[1015,520],"index": 20}
  ,{"text":"Western swing"                 ,"self":0,"url":"#","crds":[ 450,500],"index": 69}
].map(
  p => {
    return {
      "type": "Feature",
      "geometry": {
        "type": "Point", "coordinates": p.crds
      },
      "properties": {
        "self": p.self,
        "text": p.text,
        "url": p.url,
        "radius": 0
      }
    }
  }
)