const urlPrefix = location.href.substring(0, location.href.search("/pages/"));
console.log(urlPrefix)
const sideBarDom = document.getElementsByClassName('sidebar')[0];
const sideBarRoot = globalThis.ReactDOM.createRoot(sideBarDom);
sideBarRoot.render(
  <div className="space-children-1em">
    <a href="#" onClick={() => document.location = urlPrefix + '/index.html'}>cv</a>
    <a href="#" onClick={() => document.location = urlPrefix + '/pages/books.html'}>books</a>
    <a href="#" onClick={() => document.location = urlPrefix + '/pages/music.html'}>music</a>
    <a href="#" onClick={() => document.location = urlPrefix + '/pages/humanitz-Island.html'}>humanitz-Island</a>
    <a href="#" onClick={() => document.location = urlPrefix + '/pages/tasksDashboard.html'}>tasksDashboard</a>
    <a href="#" onClick={() => document.location = urlPrefix + '/pages/theThreeSeas.html'}>theThreeSeas</a>
  </div >
)