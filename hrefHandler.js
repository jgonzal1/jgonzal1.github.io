const url = window.location.href;
const href = url.substring(url.indexOf("#") + 1);

let cvHeader, cvBody, legend;
if(href === 'ES') {
    [cvHeader, cvBody, legend] = getSpanishContents();
} else {
    [cvHeader, cvBody, legend] = getEnglishContents();
}
document.getElementById("cvHeader").innerHTML = cvHeader;
document.getElementById("cvBody").innerHTML = cvBody;
document.getElementById("legend").innerHTML = legend;

if (href.length > 1) {
    const style = document.createElement("style");
    style.innerHTML = `
    .${href} {\n\
        opacity: 1;\n\
        font-weight:bolder;\n\
        font-size: 1.5em;\n\
    }`;
    document.head.appendChild(style);
}