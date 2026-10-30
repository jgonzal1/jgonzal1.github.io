tasksManager.prototype.renderGraphs = function () {
  return React.createElement(
        "div",
        {
          id: "graphsPlaceholder",
          className: "flex-container-2",
          style: {
            border: "1px solid #6666",
            borderRadius: "0.3em",
            gap: "0em",
            height: "315px",
            margin: "0.3em 0.3em 0 0.1em",
            position: "relative",
            width: "calc(100% - 1em)"
          }
        },
        // @ts-ignore
        React.createElement(
          "div",
          {
            id: "tasksByCategoryAndDay",
            style: {
              // @ts-ignore
              height: `${_gx.tasksByCategoryHeight}px`,
              margin: "0.1em",
              // @ts-ignore
              width: `${_gx.tasksByCategoryWidth}px`,
            }
          },
          "Loading tasks by category and day"
        ),
        // @ts-ignore
        React.createElement(
          "div",
          {
            id: "goals",
            style: {
              flexGrow: 1,
              fontSize: "1.2em",
              fontFamily: "monospace",
            }
          },
          ""
        ),
        // @ts-ignore
        React.createElement(
          "div",
          {
            id: "tasksByCategory",
            style: {
              // backgroundColor: "#FFF3", only like this for treeMap
              color: "#FFF",
              // @ts-ignore
              height: `${_gx.tasksByCategoryWidth}px`,
              margin: "0.1em",
              overflow: "hidden",
              textShadow: "0px 0px 2px #000, 0px 0px 3px #FFF",
              // @ts-ignore
              width: `${_gx.tasksByCategoryWidth}px`,
            }
          },
          ""
        )
      )

};
