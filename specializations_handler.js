const url = window.location.href;
const specialization = url.substring(url.indexOf("#") + 1);
const style = document.createElement("style");
if (specialization.length > 1) {
    style.innerHTML = `
        .${specialization} {\n\
            opacity: 1;\n\
            font-weight:bolder;\n\
            font-size: 1.5em;\n\
        }`;
}
document.head.appendChild(style);