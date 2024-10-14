/**
 * @example
 * const strI = "EC2";
 * let arrO = skills[0].regex.exec(str);
 * @results ```js
 * arrO = [ 'EC2', undefined, index: 0, input: 'EC2', groups: undefined ];
 * ```
 */
const skills = [
    {"ct":"Amazon Web Services (AWS)",     "sk":"aws",                    "regex":/AWS|([Aa]mazon [Ww]eb [Ss]ervices)/g },
    {"ct":"Amazon Web Services (AWS)",     "sk":"amazon-ec2",             "regex":/([Aa]mazon )?EC2/g },
    {"ct":"Amazon Web Services (AWS)",     "sk":"amazon-glue",            "regex":/([Aa]mazon )?[Gg]lue]/g },
    {"ct":"Amazon Web Services (AWS)",     "sk":"amazon-redshift",        "regex":/([Aa]mazon )?[Rr]edshift/g },
    {"ct":"Amazon Web Services (AWS)",     "sk":"amazon-s3",              "regex":/([Aa]mazon)? [Ss]3/g },
    {"ct":"Full-stack software developer", "sk":"api-development",        "regex":/API/g },
    {"ct":"Microsoft / Azure",             "sk":"azure-app-service",      "regex":/(Azure )?[Aa]pp [Ss]ervice/g },
    {"ct":"Amazon Web Services (AWS)",     "sk":"aws-athena",             "regex":/(AWS )?[Aa]thena/g },
    {"ct":"Amazon Web Services (AWS)",     "sk":"aws-cli",                "regex":/AWS CLI/g },                                              //!
    {"ct":"Amazon Web Services (AWS)",     "sk":"aws-lambda",             "regex":/(AWS )?[Ll]ambda/g },
    {"ct":"Microsoft / Azure",             "sk":"azure-cloud-services",   "regex":/([Mm]icrosoft )?[Aa]zure( [Cc]loud)?( [Ss]ervices)?]/g }, //!
    {"ct":"Microsoft / Azure",             "sk":"azure-data-factory",     "regex":/ADF|([Aa]zure [Dd]ata [Ff]actory)/g },
    {"ct":"Microsoft / Azure",             "sk":"azure-devops",           "regex":/[Aa]zure [Dd]ev[Oo]ps/g },                                //!
    {"ct":"Full-stack software developer", "sk":"bit-bucket",             "regex":/[Bb]it ?[Bb]ucket/g },                                    //!
    {"ct":"Amazon Web Services (AWS)",     "sk":"boto3",                  "regex":/boto3/g },
    {"ct":"Data Engineering",              "sk":"business-intelligence",  "regex":/[Bb]usiness [Ii]ntelligence/g },
    {"ct":"Full-stack software developer", "sk":"chatbot",                "regex":/chat ?bot/g },                                            //!
    {"ct":"Full-stack software developer", "sk":"ci-cd",                  "regex":/CI[/-]CD]/g },                                            //!
    {"ct":"Web developer",                 "sk":"css",                    "regex":/css|CSS/g },
    {"ct":"Web developer",                 "sk":"d3-js",                  "regex":/[Dd]3.?[Jj][Ss]/g },
    {"ct":"Data Engineering",              "sk":"data-mining",            "regex":/[Dd]ata [Mm]ining/g },                                    //!
    {"ct":"Full-stack software developer", "sk":"data-sync",              "regex":/(data )sync/g },                                          //!
    {"ct":"Data Engineering",              "sk":"database-administrator", "regex":/DBA|([Dd]atabase [Aa]dministrator)/g },                   //!
    {"ct":"Data Engineering",              "sk":"database-migrations",    "regex":/[Dd]atabase [Mm]igrations/g },                            //!
    {"ct":"Data Engineering",              "sk":"dax",                    "regex":/DAX/g },                                                  //!
    {"ct":"Full-stack software developer", "sk":"django",                 "regex":/django/g },                                               //!
    {"ct":"Full-stack software developer", "sk":"docker",                 "regex":/[Dd]ocker/g },
    {"ct":"Amazon Web Services (AWS)",     "sk":"dynamo-db",              "regex":/[Dd]ynamo[ -]?[Dd][Bb]/g },
    {"ct":"Data Engineering",              "sk":"elastic-search",         "regex":/[Ee]lastic[Ss]earch/g },
    {"ct":"Data Engineering",              "sk":"etl",                    "regex":/ETL/g },
    {"ct":"Data Engineering",              "sk":"excel",                  "regex":/(Microsoft )?Excel/g },
    {"ct":"Web developer",                 "sk":"front-end",              "regex":/front[- ]end/g },
    {"ct":"Full-stack software developer", "sk":"gcp",                    "regex":/GCP|([Gg]oogle [Cc]loud( [Pp]latform)?)/g },
    {"ct":"Data Engineering",              "sk":"g-sheets",               "regex":/[Gg](oogle )?[Ss]heets/g },
    {"ct":"Data Engineering",              "sk":"gis",                    "regex":/GIS/g },
    {"ct":"Full-stack software developer", "sk":"git",                    "regex":/ [Gg][Ii][Tt]/g },
    {"ct":"Data Engineering",              "sk":"graphql",                "regex":/[Gg]raph[Qq][Ll]/g },
    {"ct":"Web developer",                 "sk":"javascript",             "regex":/(( JS)|([Jj]ava[Ss]cript))[^\w]/g },
    {"ct":"Full-stack software developer", "sk":"microservices",          "regex":/micro-?services/g },                                      //!
    {"ct":"Microsoft / Azure",             "sk":"microsoft-luis",         "regex":/(Microsoft )?(LUIS|L.U.I.S.)/g },
    {"ct":"Full-stack software developer", "sk":"nlp",                    "regex":/NLP|[Nn]atural [Ll]anguage [Pp]rocessing/g },
    {"ct":"Full-stack software developer", "sk":"node-js",                "regex":/[Nn]ode ?[Jj][Ss]/g },
    {"ct":"Data Engineering",              "sk":"pandas",                 "regex":/pandas/g },
    {"ct":"Data Engineering",              "sk":"pentaho",                "regex":/[Pp]entaho/g },
    {"ct":"Data Engineering",              "sk":"postgres-sql",           "regex":/[Pp]ostgres+q?l?/g },
    {"ct":"Microsoft / Azure",             "sk":"power-bi",               "regex":/(Microsoft )?[Pp]ower ?[Bb][Ii]/g },
    {"ct":"Data Engineering",              "sk":"power-query",            "regex":/[Pp]ower [Qq]uery/g },                                                  //!
    {"ct":"Full-stack software developer", "sk":"python",                 "regex":/[Pp]ython/g },
    {"ct":"Data Engineering",              "sk":"pyspark",                "regex":/[Pp]y[Ss]park/g },                                                  //!
    {"ct":"Full-stack software developer", "sk":"react",                  "regex":/[Rr]eact/g },
    {"ct":"Web developer",                 "sk":"react",                  "regex":/[Rr]eact/g },
    {"ct":"Full-stack software developer", "sk":"regex",                  "regex":/[Rr]eg(ular )?[Ee]x(pressions)?/g },                      //!
    {"ct":"Full-stack software developer", "sk":"rest",                   "regex":/REST/g },
    {"ct":"Full-stack software developer", "sk":"serverless",             "regex":/serverless/g },
    {"ct":"Data Engineering",              "sk":"sql",                    "regex":/SQL/g },
    {"ct":"Data Engineering",              "sk":"sqlite",                 "regex":/sqlite/g },                                               //!
    {"ct":"Full-stack software developer", "sk":"typescript",             "regex":/[Tt]ype[Ss]cript/g },
    {"ct":"Web developer",                 "sk":"user-experience-design", "regex":/(UI|user experience) design/g },                          //!
    {"ct":"Microsoft / Azure",             "sk":"vscode",                 "regex":/vscode|([Vv]isual [Ss]tudio [Cc]ode)/g },                 //!
];
/**
 * @param {string} cvBody 
 * @returns
 * Could also be ```js
 * .parseFromString(
 *     `<table>${cvBody}</table>`, "text/html"
 * ).body.firstChild //table
 * .tBodies[0].rows
 * ```
 */
function markSkillsAsTBody(cvBody) {
    let cvTbody = new DOMParser().parseFromString(
        cvBody, "text/html"
    ).body;
    //let matches = {}
    Array.from(cvTbody.children).map((k,i) => {
        if(k.children.length<2) { // New section, no skills in here
            return;
        }
        let t = k.children[1].innerText;
        skills.map(skm => {
            const res = skm.regex.exec(t);
            if(!res) { // No matches, skip
                return;
            }
            let tp = cvTbody.children[i].children[1].innerHTML;
            tp = tp.replaceAll(res[0],`<b>${res[0]}</b>`);
            cvTbody.children[i].children[1].innerHTML = tp;
            /*if (skm.sk in matches) {
                matches[skm.sk] += 1;
            } else {
                matches[skm.sk] = 1;
            }*/
        });
    });
    // console.log(matches);
    return cvTbody;
}