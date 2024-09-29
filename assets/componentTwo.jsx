let componentTwo = `
<div>
    <h2>This is ComponentTwo</h2>
    <p key="2">Property "msg" content: {props.msg}</p>
</div>
`;
let componentTwoStr = `
<div>
    <h2>This is ComponentTwo</h2>
    <p key="2">TODO use props.msg</p>
</div>
`;

const ComponentTwoStr = (props) => {
  return Babel.transform(componentTwoStr, { presets: ['es2017', 'react'] }).code;
}

const ComponentTwo = (props) => {
  return (
    eval(Babel.transform(componentTwo, { presets: ['es2017', 'react'] }).code)
  );
};

