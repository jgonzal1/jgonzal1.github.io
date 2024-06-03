# Notes

<!-- TOC -->

- [Notes](#notes)
  - [Gmail parsing](#gmail-parsing)
  - [Music analytics](#music-analytics)

<!-- /TOC -->

## Gmail parsing

```js
const mails = Array.from(
  document.getElementsByClassName("th")[0].children[0].rows).map(
    k=>k.children[0]
);res[0]
```

## Music analytics

\d+,datathon,(.+)\n\d+,electro yolo,\1
at data/duplicated_tracks_per_playlist_prog_dt_ey.csv
