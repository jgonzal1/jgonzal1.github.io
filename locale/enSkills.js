/**
 * @example
 * const strI = "EC2";
 * let arrO = enSkills[0].regex.exec(str);
 * @results ```js
 * arrO = [ 'EC2', undefined, index: 0, input: 'EC2', groups: undefined ];
 * ```
 */
const enSkills = [
    { "sk": "aws",                    "ct": "Amazon Web Services (AWS)",     "regex": /AWS|([Aa]mazon [Ww]eb [Ss]ervices)/g },
    { "sk": "amazon-ec2",             "ct": "Amazon Web Services (AWS)",     "regex": /([Aa]mazon )?EC2/g },
    { "sk": "amazon-glue",            "ct": "Amazon Web Services (AWS)",     "regex": /([Aa]mazon )?[Gg]lue]/g },
    { "sk": "amazon-redshift",        "ct": "Amazon Web Services (AWS)",     "regex": /([Aa]mazon )?[Rr]edshift/g },
    { "sk": "amazon-s3",              "ct": "Amazon Web Services (AWS)",     "regex": /([Aa]mazon)? [Ss]3/g },
    { "sk": "api-development",        "ct": "Full-stack software developer", "regex": /API/g },
    { "sk": "azure-app-service",      "ct": "Microsoft / Azure",             "regex": /(Azure )?[Aa]pp [Ss]ervice/g },
    { "sk": "aws-athena",             "ct": "Amazon Web Services (AWS)",     "regex": /(AWS )?[Aa]thena/g },
    { "sk": "aws-cli",                "ct": "Amazon Web Services (AWS)",     "regex": /AWS CLI/g },                                              //!
    { "sk": "aws-lambda",             "ct": "Amazon Web Services (AWS)",     "regex": /(AWS )?[Ll]ambda/g },
    { "sk": "azure-cloud-services",   "ct": "Microsoft / Azure",             "regex": /([Mm]icrosoft )?[Aa]zure( [Cc]loud)?( [Ss]ervices)?]/g }, //!
    { "sk": "azure-data-factory",     "ct": "Microsoft / Azure",             "regex": /ADF|([Aa]zure [Dd]ata [Ff]actory)/g },
    { "sk": "azure-devops",           "ct": "Microsoft / Azure",             "regex": /[Aa]zure [Dd]ev[Oo]ps/g },                                //!
    { "sk": "bit-bucket",             "ct": "Full-stack software developer", "regex": /[Bb]it ?[Bb]ucket/g },                                    //!
    { "sk": "boto3",                  "ct": "Amazon Web Services (AWS)",     "regex": /boto3/g },
    { "sk": "business-intelligence",  "ct": "Data Engineering",              "regex": /[Bb]usiness [Ii]ntelligence/g },
    { "sk": "chatbot",                "ct": "Full-stack software developer", "regex": /chat ?bot/g },                                            //!
    { "sk": "ci-cd",                  "ct": "Full-stack software developer", "regex": /CI[/-]CD]/g },                                            //!
    { "sk": "css",                    "ct": "Web developer",                 "regex": /css|CSS/g },
    { "sk": "d3-js",                  "ct": "Web developer",                 "regex": /[Dd]3.?[Jj][Ss]/g },
    { "sk": "data-mining",            "ct": "Data Engineering",              "regex": /[Dd]ata [Mm]ining/g },                            //!
    { "sk": "data-sync",              "ct": "Full-stack software developer", "regex": /(data )sync/g },                                          //!
    { "sk": "database-administrator", "ct": "Data Engineering",              "regex": /DBA|([Dd]atabase [Aa]dministrator)/g },                   //!
    { "sk": "database-migrations",    "ct": "Data Engineering",              "regex": /[Dd]atabase [Mm]igrations/g },                            //!
    { "sk": "dax",                    "ct": "Data Engineering",              "regex": /DAX/g },                                                  //!
    { "sk": "django",                 "ct": "Full-stack software developer", "regex": /django/g },                                               //!
    { "sk": "docker",                 "ct": "Full-stack software developer", "regex": /[Dd]ocker/g },
    { "sk": "dynamo-db",              "ct": "Amazon Web Services (AWS)",     "regex": /[Dd]ynamo[ -]?[Dd][Bb]/g },
    { "sk": "elastic-search",         "ct": "Data Engineering",              "regex": /[Ee]lastic[Ss]earch/g },
    { "sk": "etl",                    "ct": "Data Engineering",              "regex": /ETL/g },
    { "sk": "excel",                  "ct": "Data Engineering",              "regex": /(Microsoft )?Excel/g },
    { "sk": "front-end",              "ct": "Web developer",                 "regex": /front[- ]end/g },
    { "sk": "gcp",                    "ct": "Full-stack software developer", "regex": /GCP|([Gg]oogle [Cc]loud( [Pp]latform)?)/g },
    { "sk": "g-sheets",               "ct": "Data Engineering",              "regex": /[Gg](oogle )?[Ss]heets/g },
    { "sk": "gis",                    "ct": "Data Engineering",              "regex": /GIS/g },
    { "sk": "git",                    "ct": "Full-stack software developer", "regex": / [Gg][Ii][Tt]/g },
    { "sk": "graphql",                "ct": "Data Engineering",              "regex": /[Gg]raph[Qq][Ll]/g },
    { "sk": "javascript",             "ct": "Web developer",                 "regex": /(( JS)|([Jj]ava[Ss]cript))[^\w]/g },
    { "sk": "microservices",          "ct": "Full-stack software developer", "regex": /micro-?services/g },                                      //!
    { "sk": "microsoft-luis",         "ct": "Microsoft / Azure",             "regex": /(Microsoft )?(LUIS|L.U.I.S.)/g },
    { "sk": "nlp",                    "ct": "Full-stack software developer", "regex": /NLP|[Nn]atural [Ll]anguage [Pp]rocessing/g },
    { "sk": "node-js",                "ct": "Full-stack software developer", "regex": /[Nn]ode ?[Jj][Ss]/g },
    { "sk": "pandas",                 "ct": "Data Engineering",              "regex": /pandas/g },
    { "sk": "pentaho",                "ct": "Data Engineering",              "regex": /[Pp]entaho/g },
    { "sk": "postgres-sql",           "ct": "Data Engineering",              "regex": /[Pp]ostgres+q?l?/g },
    { "sk": "power-bi",               "ct": "Microsoft / Azure",             "regex": /(Microsoft )?[Pp]ower ?[Bb][Ii]/g },
    { "sk": "power-query",            "ct": "Data Engineering",              "regex": /[Pp]ower [Qq]uery/g },                                                  //!
    { "sk": "python",                 "ct": "Full-stack software developer", "regex": /[Pp]ython/g },
    { "sk": "pyspark",                "ct": "Data Engineering",              "regex": /[Pp]y[Ss]park/g },                                                  //!
    { "sk": "react",                  "ct": "Full-stack software developer", "regex": /[Rr]eact/g },
    { "sk": "react",                  "ct": "Web developer",                 "regex": /[Rr]eact/g },
    { "sk": "regex",                  "ct": "Full-stack software developer", "regex": /[Rr]eg(ular )?[Ee]x(pressions)?/g },                      //!
    { "sk": "rest",                   "ct": "Full-stack software developer", "regex": /REST/g },
    { "sk": "serverless",             "ct": "Full-stack software developer", "regex": /serverless/g },
    { "sk": "sql",                    "ct": "Data Engineering",              "regex": /SQL/g },
    { "sk": "sqlite",                 "ct": "Data Engineering",              "regex": /sqlite/g },                                               //!
    { "sk": "typescript",             "ct": "Full-stack software developer", "regex": /[Tt]ype[Ss]cript/g },
    { "sk": "user-experience-design", "ct": "Web developer",                 "regex": /(UI|user experience) design/g },                          //!
    { "sk": "vscode",                 "ct": "Microsoft / Azure",             "regex": /vscode|([Vv]isual [Ss]tudio [Cc]ode)/g },                 //!
];
  