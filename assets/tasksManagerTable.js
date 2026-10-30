tasksManager.prototype.renderTaskTable = function () {
  return React.createElement(
        "div",
        {
          id: "mondayTableContainer",
          className: "first-flex-container-item table-container resizable ui-widget-content",
          style: {
            borderColor: "#6660",
            fontSize: "0.924em",
            isolation: "isolate",
            margin: "auto",
            maxHeight:
              `calc(800px - ${this.state.lastUpdatedItem ? "2.5em" : "0em"})`,
            maxWidth: "calc(100% - 1em)",
            marginTop: "0.5em",
          }
        },
        (
          Object.keys(this.state.mondayTasksJson).length &&
          !this.state.getDatedMondayItemsToJson
          // @ts-ignore
        ) ? React.createElement(
          "table",
          {
            id: "mondayTasksByDayTable",
            style: {
              position: "relative",
              left: "3em",
              width: "calc(100% - 6.5em)",
            }
          },
          // @ts-ignore
          React.createElement(
            "thead",
            null,
            // @ts-ignore
            React.createElement(
              "tr",
              {
                style: {
                  zIndex: 1,
                  backgroundColor: "#ccc4"
                }
               },
              [
                // @ts-ignore
                Object.keys(this.state.mondayTasksJson[0]).pop(),
                // @ts-ignore
                ...Object.keys(this.state.mondayTasksJson[0])
              ].filter(tk => tk !== "type").map(
                // @ts-ignore
                (taskKey, taskKeyIdx) => React.createElement(
                  "th",
                  {
                    key: `${taskKey}${taskKeyIdx} Header`,
                    id: `${taskKey}${taskKeyIdx}Header`,
                    onClick: () => this.sortTableByColumn(
                      "#mondayTasksByDayTable", taskKeyIdx
                    ),
                    className: "hoverable",
                    style: {
                      cursor: "pointer",
                      width: (taskKey === "task_name") &&
                        (window.innerWidth < 600) ? "90em" : "auto"
                    }
                  },
                  taskKey,
                  // @ts-ignore
                  React.createElement(
                    "div",
                    {
                      key: `${taskKey}${taskKeyIdx} HeaderOnHover`,
                      className: "hover-text",
                    },
                    "Sort columns by this header"
                  )
                )
              )
            )
          ),
          // @ts-ignore
          React.createElement(
            "tbody",
            null,
            // @ts-ignore
            this.state.mondayTasksJson.map(
              // @ts-ignore
              (taskRow, idxRow) => React.createElement(
                "tr",
                {
                  key: `TaskRow${idxRow} `,
                  style: {
                    // @ts-ignore
                    backgroundColor: _gx.setBgBasedOnDDiff(
                      taskRow["Δd"]
                    ),
                    textAlign: "center",
                    width: (taskRow === "task_name") &&
                      (window.innerWidth < 600) ? "90em" : "auto"
                  }
                },
                [
                  Object.keys(taskRow).pop(),
                  ...Object.keys(taskRow)
                ].map((taskKey, taskKeyIdx) => ((
                  (taskKey !== "type") &&
                  (this.state.hide0DurTasks ? (taskRow["dur"] > 0) : true)
                  // @ts-ignore
                ) ? React.createElement(
                  "td",
                  {
                    key: `${taskKey}${taskKeyIdx}${idxRow} Td`,
                    className: `${taskKey}-td`,
                    style: {
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "20em",
                      cursor: "pointer"
                    },
                    onClick: () => {
                      if (taskKey === "actions") {
                        return;
                      }
                      const filterTaskDom = document.getElementById("filterTasks");
                      // @ts-ignore
                      if (filterTaskDom.value != taskRow[taskKey]) {
                        // @ts-ignore
                        filterTaskDom.value = taskRow[taskKey];
                      } else {
                        // @ts-ignore
                        filterTaskDom.value = "";
                      }
                      // @ts-ignore
                      _gx.filterTasks();
                    }
                  },
                  ((taskKey === "dur") && (taskRow["dur"] > 0)) ?
                    // @ts-ignore
                    React.createElement(
                      "div",
                      {
                        style: {
                          height: "100%",
                          overflowY: "none"
                        }
                      },
                      // @ts-ignore
                      React.createElement(
                        "span",
                        {
                          style: {
                            // @ts-ignore
                            backgroundColor: this.state.durColors[
                              taskRow[taskKey]
                            ],
                            borderRadius: "0.8em",
                            fontSize: "0.8em",
                            fontWeight: "bold",
                            padding: "0.3em 0.6em",
                            textShadow: "-0.2em 0 0.2em #000, 0 0.2em 0.2em #000, 0.2em 0 0.2em #000, 0 -0.2em 0.2em #000"
                          }
                        },
                        taskRow[taskKey]
                      )
                    ) :
                    ((taskKey === "actions") && (taskRow["dur"] > 0)) ?
                      // @ts-ignore
                      React.createElement(
                        "div",
                        {
                          style: {
                            width: window.innerWidth < 600 ? "30em" : "auto",
                            height: "100%",
                            overflowY: "auto"
                          }
                        },
                        // @ts-ignore
                        React.createElement(
                          "img",
                          {
                            src: "../public/prioritize.png",
                            alt: "Prioritize",
                            key: `${taskRow["task_id"]} PrioritizeImg`,
                            className: "clickable-icon",
                            style: {
                              paddingRight: "0.1em",
                              userSelect: "none",
                              width: "16px",
                              height: "12px",
                            },
                            onClick: () => this.putMondayDateItem(
                              //@ts-ignore
                              monday_key, taskRow["type"] === "item" ? boardId : subItemsBoardId,
                              taskRow["task_id"],
                              // @ts-ignore
                              _gx.offsetNDay(-1 * this.state.dayOffsetValue, `${taskRow["datetime"]}:00`, "min"),
                              taskRow["type"]
                            )
                          }
                        ),
                        // @ts-ignore
                        React.createElement(
                          "img",
                          {
                            src: "../public/snooze.png",
                            alt: "Snooze",
                            key: `${taskRow["task_id"]} SnoozeImg`,
                            className: "clickable-icon",
                            style: {
                              paddingRight: "0.1em",
                              userSelect: "none",
                              width: "16px",
                              height: "16px",
                            },
                            onClick: () => this.putMondayDateItem(
                              //@ts-ignore
                              monday_key, taskRow["type"] === "item" ? boardId : subItemsBoardId,
                              taskRow["task_id"],
                              // @ts-ignore
                              _gx.offsetNDay(this.state.dayOffsetValue, `${taskRow["datetime"]}:00`, "min"),
                              taskRow["type"]
                            )
                          }
                        ),
                        // @ts-ignore
                        React.createElement(
                          "img",
                          {
                            src: "../public/backlog.png",
                            alt: "Archive",
                            key: `${taskRow["task_id"]}BacklogImg`,
                            className: "clickable-icon",
                            style: {
                              paddingRight: "0.1em",
                              userSelect: "none",
                              width: "16px",
                              height: "16px",
                            },
                            onClick: () => this.mondayItemToBacklog(
                              //@ts-ignore
                              monday_key, taskRow["type"] === "item" ? boardId : subItemsBoardId,
                              taskRow["task_id"],
                              taskRow["type"]
                            )
                          }
                        ),
                        // @ts-ignore
                        React.createElement(
                          "img",
                          {
                            src: "../public/archive.png",
                            alt: "Archive",
                            key: `${taskRow["task_id"]}ArchiveImg`,
                            className: "clickable-icon",
                            style: {
                              paddingRight: "0.1em",
                              userSelect: "none",
                              width: "16px",
                              height: "16px",
                            },
                            onClick: () => this.archiveMondayItem(
                              //@ts-ignore
                              monday_key, boardId,
                              taskRow["task_id"]
                            )
                          }
                        ),
                        (
                          taskRow[taskKey] !== " null"
                            ? (/(https?:\/\/[^ ]+)/.exec(taskRow[taskKey])
                              // @ts-ignore
                              ? React.createElement(
                                "a",
                                { href: /(https?:\/\/[^ ]+)/.exec(taskRow[taskKey])?.[1] ?? "" },
                                taskRow[taskKey]
                              ) : taskRow[taskKey])
                            : ""
                        )
                      ) :
                      ((taskKey === "freq") && (taskRow["dur"] > 0)) ?
                        // @ts-ignore
                        React.createElement(
                          "div",
                          {
                            style: {
                              height: "100%",
                              overflowY: "none"
                            }
                          },
                          // @ts-ignore
                          React.createElement(
                            "span",
                            {
                              style: {
                                // @ts-ignore
                                backgroundColor: this.state.freqColors[
                                  taskRow[taskKey] ?? "999-Once"
                                ],
                                borderRadius: "0.8em",
                                fontSize: "0.8em",
                                fontWeight: "bold",
                                padding: "0.3em 0.6em",
                                textShadow: "-0.2em 0 0.2em #000, 0 0.2em 0.2em #000, 0.2em 0 0.2em #000, 0 -0.2em 0.2em #000"
                              }
                            },
                            taskRow[taskKey] ?? "999-Once"
                          )
                        ) :
                        ((taskKey === "status") && (taskRow["dur"] > 0)) ?
                          // @ts-ignore
                          React.createElement(
                            "div",
                            {
                              style: {
                                height: "100%",
                                overflowY: "none"
                              }
                            },
                            // @ts-ignore
                            React.createElement(
                              "span",
                              {
                                style: {
                                  // @ts-ignore
                                  backgroundColor: this.state.statusColors[
                                    taskRow[taskKey]
                                  ],
                                  borderRadius: "0.8em",
                                  fontSize: "0.8em",
                                  fontWeight: "bold",
                                  padding: "0.3em 0.6em",
                                  textShadow: "-0.2em 0 0.2em #000, 0 0.2em 0.2em #000, 0.2em 0 0.2em #000, 0 -0.2em 0.2em #000"
                                }
                              },
                              taskRow[taskKey]
                            )
                          ) :
                          ((taskKey === "type") && (taskRow["dur"] > 0)) ?
                            "" :
                            ((taskKey === "task_name") && (taskRow["dur"] > 0)) ?
                              // @ts-ignore
                              React.createElement(
                                "span",
                                {
                                  style: {
                                    width: window.innerWidth < 600 ? "90em" : "auto",
                                  }
                                },
                                taskRow[taskKey]
                              ) :
                              taskRow[taskKey ?? ""]
                ) : ""))
              )
            )
          )
        ) : // Loading ↓
          // @ts-ignore
          React.createElement(
            "div",
            { style: { color: "#fff" } },
            "Loading tasks summary table"
          )
      )

};
