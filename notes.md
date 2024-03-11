# Notes

<!-- TOC -->
- [Notes](#notes)
  - [Gmail parsing](#gmail-parsing)
<!-- /TOC -->

## Gmail parsing

```js
const mails = Array.from(
  document.getElementsByClassName("th")[0].children[0].rows).map(
    k=>k.children[0]
);res[0]
```
