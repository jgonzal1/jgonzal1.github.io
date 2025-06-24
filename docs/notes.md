# Notes

<!-- TOC -->

1. [Gmail parsing](#gmail-parsing)
2. [Music analytics](#music-analytics)
3. [Word replace manual nl with spaces](#word-replace-manual-nl-with-spaces)

<!-- /TOC -->

<a id="markdown-gmail-parsing" name="gmail-parsing"></a>

## Gmail parsing

```js
const mails = Array.from(
  document.getElementsByClassName("th")[0].children[0].rows).map(
    k=>k.children[0]
);res[0]
```

<a id="markdown-music-analytics" name="music-analytics"></a>

## Music analytics

\d+,datathon,(.+)\n\d+,electro yolo,\1
at data/duplicated_tracks_per_playlist_prog_dt_ey.csv

<a id="markdown-word-replace-manual-nl-with-spaces" name="word-replace-manual-nl-with-spaces"></a>

## Word replace manual nl with spaces

"^l^w" to " ".
