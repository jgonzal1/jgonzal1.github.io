tasksManager.prototype.updateDashboard = function () {
    //#region State listeners
    this.getMondayVariables(_gx.monday_key, 4351865817).then(() => {
      const milliSecondsPerDay = 24 * 60 * 60 * 1000;
      const daysBetween1900and1970 = 25569;
      /*const amountEurDomObj = document.getElementById("amountEur"); // as HTMLSpanElement;
      const amountEurPasDom = document.getElementById("amountEurPas"); // as HTMLSpanElement;*/
      const dailyGrowthDom = document.getElementById("dailyGrowth");
      const startRegrN = (-_gx.offset_at_1900 / _gx.daily_growth
        - daysBetween1900and1970
      ) * milliSecondsPerDay;
      const startRegr = new Date(startRegrN).toISOString().substring(0, 10);
      /** @type {HTMLElement} */ (document.querySelector("#startRegr"))
        .innerText = `  ${startRegr}`;

      const msPerD = 3.6e6 * 24;
      const currentDate = new Date();
      const dStartRegr = new Date(startRegr).getTime() / msPerD;
      /*const dateMilestone1 = new Date(
        ((-_gx.offset_at_1900 + 12*30*_gx.daily_growth*_gx.passive_factor)/
        _gx.daily_growth - daysBetween1900and1970) * milliSecondsPerDay
      ).toISOString().substring(0, 10);
      const incrD = (dDateMilestone1 - dStartRegr);*/

      if (dailyGrowthDom) dailyGrowthDom.innerText = ` (${_gx.daily_growth}€/d)`;
      const dailyPassGrowthDom = document.getElementById("dailyPassGrowth");
      const dailyPassGrowth = _gx.daily_growth * (_gx.passive_factor / 1200);
      // const hoursPerEur = 24/dailyPassGrowth;
      if (dailyPassGrowthDom) dailyPassGrowthDom.innerText =
        `(${(_gx.passive_factor).toPrecision(3)
        }%@Δ${dailyPassGrowth.toPrecision(3)}p€/d)`;

      Array.from({ length: 4 }, (_, n) => n+1).map((n) => {
        const dDateMilestone = new Date((currentDate.getTime() / msPerD + 60*n)
          *msPerD).getTime() / msPerD;
        const dDateMilestoneYYMM = new Date(
          (currentDate.getTime() / msPerD + 60*n)*msPerD
        ).toISOString().substring(2, 7);
        const dateMilestonePass = (dDateMilestone - dStartRegr)
          * _gx.daily_growth * _gx.passive_factor / 1200;
        try {
          /** @type {HTMLElement} */ (document.querySelector
            (`#dateMilestone${n}YYMM`)).innerText = dDateMilestoneYYMM;
          /** @type {HTMLElement} */ (document.querySelector
            (`#dateMilestone${n}`)).innerText = dateMilestonePass.toFixed(1);
        } catch(e) {
          console.log(e);
        }
      });

      if (this.state.getDatedMondayItemsToJson) {
        //setTimeout(()=>{
        this.getMondayTasksToMultipleJson
          //@ts-ignore
          (_gx.monday_key, boardId, columnRenames);
        //}, 500);
      }
    });
    if (this.state.mondayTasksByCategorySvg.length) { // Add Donut Chart
      const tasksByCategoryPlaceholder =
        document.querySelector("#tasksByCategory");
      if (!tasksByCategoryPlaceholder) { return false; }
      tasksByCategoryPlaceholder.innerHTML = "";
      tasksByCategoryPlaceholder
        .appendChild(this.state.mondayTasksByCategorySvg[0]);
      const goalsDom = document.getElementById("goals");
      // @ts-ignore #e1575944
      goalsDom.innerHTML = `<table class="bordered">
        <tr style="background-color:#cccccc44">
          <th>Category</th> <th>H/W</th> <th>🎯Goals'27</th>
        </tr>
        <tr style="color:#ca8b4c; background-color:#caa04c44">
          <td>🍏/Health</td> <td id="healthCount"/>
          <td class="centered">🤸‍♀️/🪁🏄/🧗‍♂️</td>
        </tr>
        <tr style="color:#ca8b4c; background-color:#caa04c44">
          <td>🏠💰/FIRE</td> <td id="fireCount"/>
          <td class="centered">🏷️🏠♴💼</td>
        </tr>
        <tr style="color:#ca8b4c; background-color:#caa04c44">
          <td>🚩/Rel.</td> <td id="relCount"/>
          <td class="centered">🚩EST💼</td>
        </tr>
        <tr style="color:#b5bd68; background-color:#ddffcc33">
          <td>🔬🌿🎮/Mot.</td> <td id="motCount"/>
          <td class="centered">NCJC|400🌳</td>
        </tr>
        <tr style="background-color:#cccccc33">
          <td>📺🌐➕</td> <td id="restCount" class="centered"/>
          <td id="totalCount" class="r">0</td>
        </tr>
      </table>`;
      const totalCountDom = document.getElementById("totalCount");
      let tc = 0;
      let tcl = 0;
      [
        { "d": "healthCount", "l": _gx["health_count"], "v": Math.round(_gx.daily_exercise_dur_min*_gx.category_aggr_days_range/60), "s": ["1.🍏"], },
        { "d": "fireCount", "l": _gx["fire_count"], "v": 0, "s": ["2.🏠", "3.💰"], },
        { "d": "relCount", "l": _gx["rel_count"], "v": 0, "s": ["4.🚩"], },
        { "d": "motCount", "l": _gx["mot_count"], "v": 0, "s": ["5.🌿", "5.🔬", "7.🎮"], },
        { "d": "restCount", "l": _gx["rest_count"], "v": 0, "s": ["6.📺", "8.🌐"], },
      ].map((k) => {
        k["s"].map(l => k["v"] += parseFloat(
          // @ts-ignore
          this.state.mondayTasksByCatDict[l] || 0
        ));
        const domObj = document.getElementById(k["d"]);
        if (domObj) {
          // const prevV = parseFloat(domObj.innerText) || 0;
          const kv = k["v"] ?? 0;
          domObj.className = "r ";
          domObj.style.color =
            // @ts-ignore
            ((parseFloat(kv) - .5) > k["l"]) ? "#ca8b4c" :
              // @ts-ignore
              ((parseFloat(kv) + .5) < k["l"]) ? "#e15759" :
                "#b5bd68";
          tcl += k["l"];
          tc += k["v"];
          domObj.innerText = `${kv.toFixed(2)} (${k["l"].toFixed(1)}±.5)`;
        }
      });
      // @ts-ignore
      totalCountDom.innerText = `${tc.toFixed(1)} (${tcl.toFixed(1)}±2.5)`;
      // @ts-ignore
      totalCountDom.style.color =
        // @ts-ignore
        ((tc - 2.5) > tcl) ? "#ca8b4c" :
          // @ts-ignore
          ((tc + 2.5) < tcl) ? "#e15759" :
            "#b5bd68";
      // append #monto to goalsDom only if it's not child
      const montoDom = document.querySelector("#monto");
      if (montoDom && !goalsDom.contains(montoDom)) {
        goalsDom.appendChild(montoDom);
      }
      /*Object.assign(goalsDom.style, {
        width: tasksByCategoryPlaceholder.computedStyleMap().get("width")?.
          ["values"]?.[1]?.["value"] ?? (_gx.tasksByCategoryHeight)
      });
      tasksByCategoryPlaceholder.appendChild(goalsDom);
      */
    }
    //#endregion
    return true;
};
