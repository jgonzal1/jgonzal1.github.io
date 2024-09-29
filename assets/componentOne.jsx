let componentOne = `
<div>
    <h2>This is ComponentOne</h2>
    <p key="1">Property "msg" content: {props.msg}</p>

    <ComponentTwo msg="MsgText-ComponentTwo" />
</div>
`;
let componentOneStr = `
<div>
    <h2>This is ComponentOne</h2>
    <p key="1">TODO use props.msg</p>
    ${componentTwoStr}
</div>
`;

const ComponentOneStr = (props) => {
  console.log(componentOneStr)
  return Babel.transform(componentOneStr, { presets: ['es2017', 'react'] }).code;
};

const ComponentOne = (props) => {
  return (
    eval(Babel.transform(componentOne, { presets: ['es2017', 'react'] }).code)
  );
};