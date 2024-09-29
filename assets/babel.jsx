let babelTemplate = `
<div>
    <h1>Heading</h1>
    <hr />
    <ComponentOne msg="MsgText-ComponentOne" />
</div>
`;
let babelTemplateStr = `
<div>
    <h1>Heading</h1>
    <hr />
    ${componentOneStr}
</div>
`;

const App = () => {
  const appCode = Babel.transform(babelTemplateStr, { presets: ['es2017', 'react'] }).code;
  console.log(appCode);
  return (eval(Babel.transform(babelTemplate, { presets: ['es2017', 'react'] }).code));
};


ReactDOM.render(
  React.createElement(App, null),
  document.getElementById("root")
);


/*function renderHello($, React, ReactDOM) {
  return ReactDOM.render(
    <div>Hello React!</div>
    //<span>Hello</span>, <span>React</span>
    ,
    $('#root')[0]
  )
}*/
