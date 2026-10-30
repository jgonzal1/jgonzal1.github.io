tasksManager.prototype.renderTopBar = function () {
  return React.createElement(
        "div",
        { id: "taskManagerTopBar", style: {
          border: "1px solid #333",
          padding: "0.3em",
        } },
        //#region refreshTasksButton
        // @ts-ignore
        React.createElement(
          "button", {
          id: "refreshTasksButton",
          onClick: //@ts-ignore
            () => this.setState({ getDatedMondayItemsToJson: true })
        }, "Refresh tasks"
        ),
        //#endregion
        //#region setMinsOffset
        // @ts-ignore
        React.createElement(
          "input",
          {
            id: "setMinsOffset",
            value: this.state.minsOffsetValue,
            // @ts-ignore
            onChange: (e) => this.setState({
              minsOffsetValue: e.target.value,
              dayOffsetValue: (parseFloat(e.target.value) / 24 / 60)
                .toExponential(3)
            }),
            style: {
              backgroundColor: "#FFF9",
              borderRadius: "0.3em",
              fontWeight: "bold",
              marginLeft: "0.3em",
              paddingLeft: "0.3em",
              width: "4.6em"
            }
          },
          null
        ),
        //#endregion
        //#region lastRefreshDateTime
        // @ts-ignore
        React.createElement(
          "span",
          {
            id: "lastRefreshDateTime",
            style: {
              display: "inline-block",
              paddingLeft: "0.3em"
            }
          },
          `min(s) offset | `
        ),
        //#endregion
        //#region setDayOffset
        // @ts-ignore
        React.createElement(
          "input",
          {
            id: "setDayOffset",
            value: typeof (this.state.dayOffsetValue) === "number" ?
              parseFloat(this.state.dayOffsetValue.toPrecision(5)) :
              this.state.dayOffsetValue,
            // @ts-ignore
            onChange: (e) => this.setState({
              minsOffsetValue: (parseFloat(e.target.value) * 60 * 24)
                .toExponential(2),
              dayOffsetValue: e.target.value
            }),
            style: {
              backgroundColor: "#FFF9",
              borderRadius: "0.3em",
              fontWeight: "bold",
              marginLeft: "0.3em",
              paddingLeft: "0.3em",
              width: "5em"
            }
          },
          null
        ),
        //#endregion
        //#region lastRefreshDateTime
        // @ts-ignore
        React.createElement(
          "span",
          {
            id: "lastRefreshDateTime",
            style: {
              display: "inline-block",
              padding: "0 0.3em"
            }
          },
          `day(s) offset |`
        ),
        //#endregion
        //#region setDuration
        // @ts-ignore
        React.createElement(
          "input",
          {
            id: "setDuration",
            value: typeof (this.state.durationValue) === "number" ?
              parseFloat(this.state.durationValue.toPrecision(5)) :
              this.state.durationValue,
            // @ts-ignore
            onChange: (e) => this.setState({
              durationValue: e.target.value
            }),
            style: {
              backgroundColor: "#FFF9",
              borderRadius: "0.3em",
              fontWeight: "bold",
              marginLeft: "0.3em",
              paddingLeft: "0.3em",
              width: "5em"
            }
          },
          null
        ),
        //#endregion
        //#region lastRefreshDateTime
        // @ts-ignore
        React.createElement(
          "span",
          {
            id: "lastRefreshDateTime",
            style: {
              display: "inline-block",
              padding: "0 0.3em"
            }
          },
          `duration (h)`
        ),
        // @ts-ignore
        (this.state.lastRefreshDateTime !== "undefined") && React.createElement(
          "span",
          {
            id: "lastRefreshDateTime",
            style: {
              display: "inline-block",
              paddingRight: "0.3em"
            }
          },
          `| Last refresh at`
        ),
        // @ts-ignore
        (this.state.lastRefreshDateTime !== "undefined") && React.createElement(
          "span",
          {
            id: "lastRefreshDateTime",
            style: {
              display: "inline-block",
              color: "#999",
              paddingRight: "0.3em"
            }
          },
          this.state.lastRefreshDateTime.substring(9) // time
        ),
        //#endregion
        //#region filter
        // @ts-ignore
        React.createElement(
          "input",
          {
            type: "text",
            id: "filterTasks",
            // @ts-ignore
            onKeyUp: () => _gx.filterTasks(),
            placeholder: "Search for tasks..",
            style: {
              backgroundColor: "#FFF9",
              borderRadius: "0.3em",
              fontWeight: "bold",
              marginLeft: "0.3em",
              paddingLeft: "0.3em",
            }
          },
        ),
        //#endregion
        //#region lastUpdatedItem
        // @ts-ignore
        React.createElement(
          "div",
          {
            id: "lastUpdatedItem",
            style: {
              display: "inline-block",
              fontSize: "0.88em",
              paddingLeft: "0.1em",
              right: "10em",
              top: "0em",
              width: "fit-content"
            }
          },
          this.state.lastUpdatedItem && `| Last upd. item is `,
          // @ts-ignore
          this.state.lastUpdatedItem && React.createElement(
            "span",
            {
              id: "lastUpdatedItem",
              style: {
                color: "#999",
                fontSize: "1em",
                paddingLeft: "0.1em",
              }
            },
            this.state.lastUpdatedItem
          ),
          this.state.lastUpdatedItem && this.state.lastUpdatedDt &&
          // @ts-ignore
          React.createElement(
            "span",
            {
              id: "lastUpdatedItem",
              style: {
                fontSize: "1em",
                paddingLeft: "0.1em",
              }
            },
            " to "
          ),
          // @ts-ignore
          this.state.lastUpdatedItem && React.createElement(
            "span",
            {
              id: "lastUpdatedItem",
              style: {
                color: "#999",
                fontSize: "1em",
                paddingLeft: "0.1em",
              }
            },
            this.state.lastUpdatedDt.substring(5, 16)
          ),
        )
        //#endregion
      )

};
