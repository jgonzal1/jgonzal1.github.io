function sideBarHandler() {
  const sideBarDom = document.getElementsByClassName("sidebar")[0];
  const urlPrefix = location.href.substring(0, location.href.search("/pages/"));
  console.log(urlPrefix)
}