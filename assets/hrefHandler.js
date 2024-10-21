const url = window.location.href;
const href = url.substring(url.indexOf("#") + 1);
const lTmp = href.substring(href.search("lang=") === -1 ? 0 : href.search("lang=") + 5);
const lang = lTmp === href ? href : lTmp.substring(0, 2);
const rTmp = href.substring(href.search("role=") === -1 ? 0 : href.search("role=") + 5);
const role = rTmp === href ? href : rTmp.substring(0, rTmp.search("&") === -1 ? rTmp.length : rTmp.search("&"));

let cvHeader, cvBodyRaw, cvBody, legend;
let legendDom = document.getElementById("legend") ?? document.createElement("div");
if (lang === 'ES') {
    // @ts-ignore
    [cvHeader, cvBody, legend] = getSpanishContents();
    document.getElementById("cvBody").innerHTML = cvBody;
    legendDom.innerHTML = legend;
} else if (lang === 'DA') {
    // @ts-ignore
    [cvHeader, cvBody, legend] = getDanishContents();
    document.getElementById("cvBody").innerHTML = cvBody;
    legendDom.innerHTML = legend;
} else {
    // @ts-ignore
    [cvHeader, cvBody, legend] = getEnglishContents();
    // @ts-ignore
    const cvBodyDomContents = markSkillsAsTBody(cvBody);
    let cvBodyDom = document.getElementById("cvBody") ?? document.createElement("div");

    cvBodyDom.outerHTML = `<div id="cvBody" class="opacity-06"></div>`; // transforms table to div
    cvBodyDom = document.getElementById("cvBody") ?? document.createElement("div");
    Array.from(cvBodyDomContents.children).map(e => {
        if (e.toString() !== "[object HTMLBRElement]") {
            cvBodyDom.appendChild(e)
        }
    })
    const rolesTimelineDom = document.getElementById("rolesTimeline");
    legendDom.innerHTML = legend;
    rolesTimelineDom.appendChild(legendDom);
}
document.getElementById("cvHeader").innerHTML = cvHeader;

const style = document.createElement("style");
style.innerHTML = `
.${role} {\n\
    opacity: 1;\n\
    font-weight:bolder;\n\
    font-size: 1.2em;\n\
}`;
document.head.appendChild(style);