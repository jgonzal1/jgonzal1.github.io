const buildingPoints = [
  { text: "Webpage based on musicmap.info"/* */, self: 2, crds: [100, 700], index: 136, url: "https://musicmap.info" }
  , { text: "Acid jazz / jazzdance"/*        */, self: 0, crds: [590, 190], index: 84, url: "#" }
  , { text: "Afrobeat"/*                     */, self: 0, crds: [1060, 540], index: 21, url: "#" }
  , { text: "Aggrotech"/*                    */, self: 1, crds: [75, 140], index: 29, url: "7EmeLvO69511qZYR9rbK3m" }
  , { text: "Alt rock & indie"/*             */, self: 1, crds: [345, 140], index: 55, url: "2gX78AZu9KQ9w59YEziRJP" }
  , { text: "Amb. techno / idm"/*            */, self: 1, crds: [1020, 160], index: 103, url: "7mrmrI9K8ooGYEL5BJjYNl" }
  , { text: "Ambient"/*                      */, self: 1, crds: [1200, 275], index: 115, url: "0OoH9VKKOkMmFVShSdGI5I" }
  , { text: "Avant-garde industrial"/*       */, self: 0, crds: [100, 270], index: 22, url: "#" }
  , { text: "Bachata"/*                      */, self: 1, crds: [1000, 550], index: 17, url: "1GGZiLw5ikiuI53SUpEpE3" }
  , { text: "Baroque"/*                      */, self: 0, crds: [720, 610], index: 9, url: "#" }
  , { text: "Bebop"/*                        */, self: 0, crds: [600, 440], index: 80, url: "#" }
  , { text: "Black metal"/*                  */, self: 0, crds: [195, 150], index: 39, url: "#" }
  , { text: "Bluegrass"/*                    */, self: 0, crds: [450, 420], index: 70, url: "#" }
  , { text: "Boogie electrofunk"/*           */, self: 1, crds: [485, 200], index: 73, url: "3rwcuTwNyzGSEm9JgVykXM" }
  , { text: "Bossa nova"/*                   */, self: 1, crds: [1000, 570], index: 16, url: "6fuXYNqgIyeVyOlykCobA9" }
  , { text: "Breakbeat hardcore"/*           */, self: 0, crds: [900, 160], index: 100, url: "#" }
  , { text: "Celtic"/*                       */, self: 1, crds: [270, 620], index: 2, url: "14wTJv3u383K0fDr0TK6qs" }
  , { text: "chill or ethereal"/*            */, self: 2, crds: [1200, 330], index: 127, url: "0OoH9VKKOkMmFVShSdGI5I" }
  , { text: "Chiptune"/*                     */, self: 0, crds: [1190, 230], index: 116, url: "1SQBCNypeE7acQxPjsROhl" }
  , { text: "Class. romantic"/*              */, self: 1, crds: [810, 580], index: 13, url: "11sIaL1E2OmGhrXW4abKME" }
  , { text: "Classic & acid trance"/*        */, self: 0, crds: [1140, 185], index: 107, url: "#" }
  , { text: "Classic country"/*              */, self: 1, crds: [445, 530], index: 68, url: "3BGJOT0AYU2EenKL2Qzsyz" }
  , { text: "Classic metal"/*                */, self: 1, crds: [175, 315], index: 32, url: "0wigyGCyr0pajRhFAfG66t" }
  , { text: "Classical mix"/*                */, self: 2, crds: [810, 560], index: 128, url: "37i9dQZF1EQn1VBR3CMMWb" }
  , { text: "Contemp. class. m." /*          */, self: 0, crds: [810, 620], index: 11, url: "#" }
  , { text: "Country folk blues"/*           */, self: 0, crds: [535, 575], index: 75, url: "#" }
  , { text: "Country pop rock"/*             */, self: 0, crds: [420, 320], index: 61, url: "#" }
  , { text: "Cumbia"/*                       */, self: 0, crds: [985, 535], index: 17, url: "#" }
  , { text: "Dance pop"/*                    */, self: 1, crds: [400, 125], index: 67, url: "0DGusKA7sgydJdLzsQ5LX2" }
  , { text: "Dark ambient"/*                 */, self: 1, crds: [75, 210], index: 25, url: "5rBnPOG2GizWe2tyHfphyK" }
  , { text: "Darkwave"/*                     */, self: 1, crds: [95, 195], index: 26, url: "55YmcZmEGMizDOqDW1MT1x" }
  , { text: "Death metal"/*                  */, self: 1, crds: [190, 195], index: 38, url: "3erptMyjJ4bZ4xgYTnlCm6" }
  , { text: "Digital minimalism/lowercase"/* */, self: 0, crds: [1200, 100], index: 118, url: "2rN3mSrzUcgjlj1TcEDTX7" }
  , { text: "Disco pop"/*                    */, self: 1, crds: [390, 210], index: 65, url: "4YJoN3ChDJ4gBBgSDy4jmK" }
  , { text: "Disco"/*                        */, self: 1, crds: [485, 280], index: 72, url: "4mxY0dw8OU00UnOQeq9OFx" }
  , { text: "Doom metal"/*                   */, self: 0, crds: [160, 205], index: 37, url: "#" }
  , { text: "Dream pop"/*                    */, self: 1, crds: [375, 170], index: 53, url: "36finQ0m3T8BSJEG5evvts" }
  , { text: "Dub"/*                          */, self: 1, crds: [650, 290], index: 89, url: "246zLjoIEAPggNphqvARTR" }
  , { text: "Dubstep"/*                      */, self: 0, crds: [870, 85], index: 97, url: "#" }
  , { text: "East coast gangsta rap"/*       */, self: 0, crds: [690, 130], index: 91, url: "#" }
  , { text: "EBM"/*                          */, self: 0, crds: [75, 230], index: 24, url: "#" }
  , { text: "EDM Trap"/*                     */, self: 0, crds: [780, 35], index: 93, url: "#" }
  , { text: "Electro-swing"/*                */, self: 1, crds: [590, 65], index: 86, url: "7gK6OgvfAShw2zpbq20uob" }
  , { text: "Eurodisco"/*                    */, self: 0, crds: [410, 230], index: 64, url: "#" }
  , { text: "Experimental"/*                 */, self: 1, crds: [115, 470], index: 120, url: "6pV8WR1UUTR0kyF5BgAvn9" }
  , { text: "Folk & Acoustic Mix"/*          */, self: 2, crds: [270, 570], index: 135, url: "37i9dQZF1EQp62d3Dl7ECY" }
  , { text: "Folk rock"/*                    */, self: 1, crds: [250, 340], index: 45, url: "0jR8JGnUiOseB2Sb2ajpxj" }
  , { text: "Foltronica"/*                   */, self: 1, crds: [1000, 85], index: 104, url: "6tvgvZAOM6aXLyMJZOaFzw" }
  , { text: "Free jazz avant-garde"/*        */, self: 1, crds: [600, 370], index: 81, url: "4PCTXMZ22Iup2ztEQO6YRX" }
  , { text: "Funk"/*                         */, self: 1, crds: [600, 390], index: 81, url: "3rwcuTwNyzGSEm9JgVykXM" }
  , { text: "Funktronica"/*                  */, self: 0, crds: [485, 70], index: 74, url: "#" }
  , { text: "Fussion jazz-rock"/*            */, self: 1, crds: [600, 300], index: 82, url: "2LKohXp89pIOoC4ac3mqn5" }
  , { text: "Futurepop"/*                    */, self: 0, crds: [75, 100], index: 30, url: "#" }
  , { text: "Glam metal"/*                   */, self: 0, crds: [190, 260], index: 35, url: "#" }
  , { text: "Goa trance & psytrance"/*       */, self: 1, crds: [1140, 165], index: 108, url: "4pMUqKVbwkudmHCYTkVvu5" }
  , { text: "Gothic metal"/*                 */, self: 0, crds: [150, 120], index: 41, url: "#" }
  , { text: "Gothic rock"/*                  */, self: 1, crds: [95, 240], index: 23, url: "0T6qPt9zJAdfBnagGyzOl4" }
  , { text: "Hard rock"/*                    */, self: 1, crds: [285, 290], index: 48, url: "607ys9TpDSMlsx5U7NcbdP" }
  , { text: "Hardcore techno / rave"/*       */, self: 0, crds: [960, 170], index: 99, url: "#" }
  , { text: "Hardstyle"/*                    */, self: 0, crds: [950, 95], index: 102, url: "#" }
  , { text: "Hill country trance blues"/*    */, self: 0, crds: [535, 165], index: 76, url: "#" }
  , { text: "House Mix"/*                    */, self: 2, crds: [1070, 120], index: 130, url: "37i9dQZF1EQpoj8u9Hn81e" }
  , { text: "Indie folk / freak folk"/*      */, self: 0, crds: [370, 45], index: 59, url: "#" }
  , { text: "Indie pop"/*                    */, self: 1, crds: [410, 195], index: 66, url: "2gX78AZu9KQ9w59YEziRJP" }
  , { text: "Indietronica"/*                 */, self: 0, crds: [370, 65], index: 57, url: "#" }
  , { text: "Industrial metal"/*             */, self: 1, crds: [130, 160], index: 28, url: "0sLzhB45BUsKtMY1GFLp99" }
  , { text: "Industrial rock"/*              */, self: 1, crds: [115, 170], index: 27, url: "5NWBIHZ8SUvAMR3b9glaH2" }
  , { text: "Intelligent & jazzstep"/*       */, self: 0, crds: [860, 135], index: 95, url: "#" }
  , { text: "Jazz Mix"/*                     */, self: 2, crds: [590, 230], index: 131, url: "37i9dQZF1EQqA6klNdJvwx" }
  , { text: "Kizomba"/*                      */, self: 1, crds: [1060, 520], index: 21, url: "7EWSrxZKDblyqJNsGPdcE2" }
  , { text: "Latin"/*                        */, self: 0, crds: [270, 605], index: 3, url: "5Mo0ErzMKoU4hkypC1s8eN" }
  , { text: "Liquid funk"/*                  */, self: 1, crds: [850, 105], index: 96, url: "2nf10oPPudKAFgWE0oESkD" }
  , { text: "Lounge / space age pop"/*       */, self: 1, crds: [1200, 410], index: 111, url: "3NDootlTJJtUk2CE5nrJIP" }
  , { text: "Math rock"/*                    */, self: 0, crds: [265, 165], index: 52, url: "#" }
  , { text: "Medieval"/*                     */, self: 0, crds: [720, 600], index: 8, url: "#" }
  , { text: "Melodic death metal"/*          */, self: 1, crds: [190, 185], index: 38, url: "0LnpDpweu69GWjDY68BJXw" }
  , { text: "Merengue"/*                     */, self: 0, crds: [940, 550], index: 14, url: "#" }
  , { text: "Min wave synth & ind"/*         */, self: 0, crds: [75, 60], index: 31, url: "#" }
  , { text: "Minimalism"/*                   */, self: 0, crds: [1190, 380], index: 112, url: "#" }
  , { text: "Modern class. m." /*            */, self: 0, crds: [810, 600], index: 12, url: "#" }
  , { text: "Modern gospel"/*                */, self: 0, crds: [570, 430], index: 77, url: "#" }
  , { text: "Moombahton"/*                   */, self: 0, crds: [1060, 55], index: 106, url: "#" }
  , { text: "Muzak / elevator music"/*       */, self: 0, crds: [1200, 360], index: 113, url: "#" }
  , { text: "Neofolk"/*                      */, self: 1, crds: [75, 195], index: 26, url: "2Er6xZyUuBjJ0EampHFXAi" }
  , { text: "Neo-trance"/*                   */, self: 0, crds: [1140, 70], index: 110, url: "#" }
  , { text: "New age"/*                      */, self: 0, crds: [1200, 220], index: 117, url: "#" }
  , { text: "New wave"/*                     */, self: 0, crds: [305, 230], index: 50, url: "#" }
  , { text: "Nordic"/*                       */, self: 0, crds: [270, 590], index: 4, url: "37i9dQZF1DWXhcuQw7KIeM" }
  , { text: "Nu jazz / electro jazz"/*       */, self: 0, crds: [590, 140], index: 85, url: "#" }
  , { text: "Nu metal"/*                     */, self: 1, crds: [195, 105], index: 42, url: "2SsCVycRhgG51cY2rOsPr1" }
  , { text: "Nu post prog rock"/*            */, self: 0, crds: [290, 55], index: 58, url: "#" }
  , { text: "Old skool jungle dnb"/*         */, self: 1, crds: [850, 180], index: 94, url: "2nf10oPPudKAFgWE0oESkD" }
  , { text: "Old skool rap"/*                */, self: 1, crds: [710, 275], index: 90, url: "2YPgwLHGvvMe24mpff2zBW" }
  , { text: "Opera"/*                        */, self: 0, crds: [720, 620], index: 10, url: "#" }
  , { text: "Post-dubstep"/*                 */, self: 0, crds: [870, 65], index: 98, url: "#" }
  , { text: "Post-rock"/*                    */, self: 0, crds: [320, 130], index: 56, url: "#" }
  , { text: "Power metal"/*                  */, self: 1, crds: [145, 250], index: 34, url: "7fTtYmlOBNF0il5uO2ASsk" }
  , { text: "Progressive house"/*            */, self: 1, crds: [1045, 150], index: 105, url: "2D2kioZ5cdvPRFVDgxYaEx" }
  , { text: "Progressive metal"/*            */, self: 1, crds: [190, 280], index: 33, url: "373bAM3YOUVc2GDe7rvj5u" }
  , { text: "Progressive rock"/*             */, self: 1, crds: [345, 300], index: 47, url: "4TOAesAQqrMS4U2NuUi1RT" }
  , { text: "Progressive trance"/*           */, self: 0, crds: [1160, 145], index: 109, url: "#" }
  , { text: "Psy rock"/*                     */, self: 0, crds: [350, 340], index: 46, url: "#" }
  , { text: "Punk rock"/*                    */, self: 0, crds: [275, 265], index: 49, url: "#" }
  , { text: "Reggae"/*                       */, self: 1, crds: [625, 320], index: 88, url: "06mtEUIM4CpBqF4oElDJpW" }
  , { text: "Reggae Mix"/*                   */, self: 2, crds: [640, 250], index: 129, url: "37i9dQZF1EQpjs4F0vUZ1x" }
  , { text: "Relipop"/*                      */, self: 0, crds: [570, 310], index: 78, url: "#" }
  , { text: "Renaissance"/*                  */, self: 0, crds: [720, 580], index: 6, url: "#" }
  , { text: "RnB"/*                          */, self: 1, crds: [485, 450], index: 71, url: "707OZVnjub2qm46XuHYU4G" }
  , { text: "Rock & Roll"/*                  */, self: 0, crds: [290, 400], index: 44, url: "#" }
  , { text: "Rock Mix"/*                     */, self: 2, crds: [300, 380], index: 134, url: "37i9dQZF1EQpj7X7UK8OOF" }
  , { text: "Rockabilly"/*                   */, self: 0, crds: [290, 410], index: 43, url: "#" }
  , { text: "Salsa"/*                        */, self: 1, crds: [940, 530], index: 15, url: "3CiPI46QLPVSRfm5UieqHR" }
  , { text: "Samba"/*                        */, self: 1, crds: [1015, 535], index: 18, url: "4xRylvSqmE2GIzKCPpUINR" }
  , { text: "Schlager"/*                     */, self: 0, crds: [395, 400], index: 60, url: "#" }
  , { text: "Shoegaze"/*                     */, self: 0, crds: [365, 160], index: 54, url: "#" }
  , { text: "Singer-songwriter"/*            */, self: 1, crds: [370, 285], index: 62, url: "05a3A3cxTTsA5EGaeH9d84" }
  , { text: "Ska"/*                          */, self: 0, crds: [640, 380], index: 87, url: "#" }
  , { text: "Smooth jazz"/*                  */, self: 1, crds: [580, 265], index: 83, url: "1N7PVlMupNg0z36K8oMzEh" }
  , { text: "Soft rock"/*                    */, self: 1, crds: [395, 260], index: 63, url: "607ys9TpDSMlsx5U7NcbdP" }
  , { text: "Soul Mix"/*                     */, self: 2, crds: [490, 395], index: 133, url: "37i9dQZF1EQntZpEGgfBif" }
  , { text: "Soundtrack"/*                   */, self: 1, crds: [115, 500], index: 1, url: "64kGNTzaPcy6LcPpq4yGOi" }
  , { text: "Swing / big band"/*             */, self: 1, crds: [600, 520], index: 79, url: "3EMjGn7GdAzNoKwMEIj8PG" }
  , { text: "Swing Mix"/*                    */, self: 2, crds: [600, 500], index: 132, url: "37i9dQZF1EIezSgnavWYjm" }
  , { text: "Symphonic metal"/*              */, self: 1, crds: [165, 135], index: 40, url: "0ITx338BH3GM8VGYXPxyy2" }
  , { text: "Symphony"/*                     */, self: 0, crds: [720, 590], index: 7, url: "#" }
  , { text: "Synth / electronica"/*          */, self: 1, crds: [1190, 285], index: 114, url: "3KGfSFPFDkUc440NkmJx7b" }
  , { text: "Synthpop"/*                     */, self: 0, crds: [365, 220], index: 51, url: "#" }
  , { text: "Synthwave / vaporwave"/*        */, self: 0, crds: [1200, 55], index: 119, url: "#" }
  , { text: "Tango"/*                        */, self: 0, crds: [985, 520], index: 19, url: "#" }
  , { text: "Tech trance"/*                  */, self: 1, crds: [1000, 120], index: 104, url: "4mxY0dw8OU00UnOQeq9OFx" }
  , { text: "Thrash metal"/*                 */, self: 0, crds: [180, 220], index: 36, url: "#" }
  , { text: "Traditional gospel"/*           */, self: 0, crds: [560, 630], index: 5, url: "#" }
  , { text: "Trance & acid core"/*           */, self: 0, crds: [920, 110], index: 101, url: "#" }
  , { text: "Trip-hop"/*                     */, self: 1, crds: [760, 170], index: 92, url: "4fYMPKJmZLlwwDDn3o4DCh" }
  , { text: "Tropicalia"/*                   */, self: 0, crds: [1015, 520], index: 20, url: "#" }
  , { text: "Western swing"/*                */, self: 0, crds: [450, 500], index: 69, url: "#" }
].map(
  p => {
    return {
      "type": "Feature",
      "geometry": {
        "type": "Point", "coordinates": p.crds
      },
      "properties": {
        self: p.self,
        text: p.text,
        url: p.url,
        "radius": 0
      }
    }
  }
)