export function renderHello($, React, ReactDOM) {
  return ReactDOM.render(
    <div>Hello, React!</div>,
    $('#container')[0]
  )
}
