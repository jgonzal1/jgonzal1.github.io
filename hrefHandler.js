const url = window.location.href;
const href = url.substring(url.indexOf("#") + 1);
const lTmp = href.substring(href.search("lang=") === -1 ? 0 : href.search("lang=") + 5);
const lang = lTmp === href ? href : lTmp.substring(0, 2);
const rTmp = href.substring(href.search("role=") === -1 ? 0 : href.search("role=") + 5);
const role = rTmp === href ? href : rTmp.substring(0, rTmp.search("&") === -1 ? rTmp.length : rTmp.search("&"));

let cvHeader, cvBody, legend;
if (lang === 'ES') {
    // @ts-ignore
    [cvHeader, cvBody, legend] = getSpanishContents();
} else {
    // @ts-ignore
    [cvHeader, cvBody, legend] = getEnglishContents();
}
document.getElementById("cvHeader").innerHTML = cvHeader;
document.getElementById("cvBody").innerHTML = cvBody;
document.getElementById("legend").innerHTML = legend;

const style = document.createElement("style");
style.innerHTML = `
.${role} {\n\
    opacity: 1;\n\
    font-weight:bolder;\n\
    font-size: 1.2em;\n\
}`;
document.head.appendChild(style);