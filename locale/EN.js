function getEnglishContents() {
  const skills = `
  <fieldset class="font-size-12-rem"><legend class="category-td">Full-stack software developer</legend>
  API development, CI/CD, Django, Docker, Git,
  Microservices Architecture, NLP, Node.Js, Python, ReactJS, RegEx, REST,
  Serverless Architecture, Typescript, Web Services Integrations
  </fieldset>
  <fieldset class="font-size-12-rem"><legend class="category-td">Data Engineering</legend>
  Business Intelligence, Database Migrations, Database Administrator,
  DAX, ElasticSearch, ETL, GIS, GraphQL, GSheets/Excel, MySQL, pandas,
  Pentaho Data Integration, PL/SQL, PostgreSQL, SQL, sqlite
  </fieldset>
  <fieldset class="font-size-12-rem"><legend class="category-td">Web developer</legend>
  CSS, D3.JS, Figma User Experience Design, Front-end, Javascript, React Native
  </fieldset>
  <fieldset class="font-size-12-rem"><legend class="category-td">Amazon Web Services (AWS)</legend>
  Amazon DynamoDB, Amazon EC2, Amazon Redshift, Amazon S3,
  AWS Athena, AWS CLI, AWS Lambda, boto3, IAM
  </fieldset>
  <fieldset class="font-size-12-rem"><legend class="category-td">Microsoft / Azure</legend>
  Azure Data Factory, Azure DevOps, Azure Cloud Services,
  Microsoft LUIS, Power BI, VSCode
  </fieldset>
  `;
  /*,<span class="highlight-orange">AWS EC2</span>
  ,<span class="highlight-orange">Amazon Code Commit</span> (git)
  ,<span class="bi highlight-orange">Amazon Redshift</span> (SQL)
  ,<span class="bi highlight-orange">AWS Glue</span> (pyspark)
  ,<span class="highlight-blue">Excel</span> (advanced)
  ,<span class="bi highlight-yellow">Power BI</span> (DAX functions, R)
  ,<span class="highlight-red cloud">Python</span> (boto3
  ,<span class="bi">pyspark</span>, numpy, pandas, scikit-learn...)
  ,<span class="webdev highlight-red">JavaScript</span>
  (experience on full stack development with React, Angular, jQuery
  ,Leaflet, BootStrap, D3.JS, Ionic, Node.JS, Three.JS, ESLint and
  TypeScript), <span class="webdev highlight-red">CSS</span>
  (BootStrap, LeafLet, AwesomeFonts), <span class="webdev highlight-red">HTML</span>
  (complex structures and DOM handlers), <span class="highlight-red">Docker</span>
  ,<span class="highlight-red Kubernetes">Kubernetes</span>
  ,<span class="highlight-red">Terraform</span>
  ,<span class="webdev highlight-red">Regular Expressions</span> (advanced)
  ,<span class="bi highlight-blue">Azure Data Lake Analytics</span> (U-SQL, C#), <span class=
  "bi highlight-blue">Azure Data Factory</span>(ETLs)
  ,<span class="highlight-gray">IBM Watson</span> (AI solutions)
  ,<span class="webdev highlight-blue">Azure App Service</span>
  ,<span class="highlight-blue">Microsoft LUIS</span>, <span class="kafka">Kafka</span>.
  */
  const minorSkills = `
    Agile, Big Data, Confluence, CSS, Data Analysis, Data Modeling
    ,Data Science, Datasets, Deployment, Drug Discovery, Excel
    ,Google Sheets, Helpdesk, HTML, Marketing Analysis, ReactJS
    ,sql queries, Technical Requirements, Unstructured Data
    ,Use Cases, User Interface, Web Services
  `;
  const cvHeader = `
  <tr>
    <td colspan="3">
      <h2>Personal Information</h2>
    </td>
  </tr>
  <tr>
    <td style="border-width:0">
      <fieldset style="">
        <legend>🧔</legend>
        Javier González Berenguel
      </fieldset>
      <fieldset style="display:none;">
        <legend>📲 (please inform before calling)</legend>
        <span>(+34) 664383902</span>
      </fieldset>
      <fieldset style="font-family:monospace;">
        <legend>🗣</legend>
        <span style="color:#F0C674">★★★★★</span> EN<br>
        <span style="color:#F0C674">★★★★★</span> ES<br>
        <span style="color:#F0C674">★★</span>☆☆☆ DA<br>
        <span style="color:#F0C674">★★</span>☆☆☆ DE<br>
        <span style="color:#F0C674">★★</span>☆☆☆ FR<br>
        <span style="color:#F0C674">★</span>☆☆☆☆ LT<br>
      </fieldset>
    </td>
    <td style="border-width:0">
      <fieldset>
        <legend>📩</legend>
        <a href="mailto:javier.gonzalezberenguel@gmail.com" target="_blank">
          javier.gonzalezberenguel@gmail.com
        </a>
      </fieldset>
      <fieldset>
        <legend>📫</legend>
        Copenhagen, Denmark, 🗺:<br>availability for international projects
      </fieldset>
    </td>
    <td class="centered" style="border-width:0">
      <fieldset style="height:16em">
        <legend>📸</legend>
        <img src="public/javier.jpg" alt="Javier González">
      </fieldset>
    </td>
  </tr>
  <tr>
    <td colspan="3">
      <h2>CV summary</h2>
    </td>
  </tr>
  <tr>
    <td class="bold-right">
      <h3>About me</h3>
    </td>
    <td colspan="2" class="font-size-12-rem w70">
      I am a technical consultant expert in data engineering, full-stack software development,
      BI, and cloud architectures in AWS, Azure, GCP, monday.com and JSM.
    </td>
  </tr>
  <tr>
    <td class="bold-right">
      <h3>
        Tech Stack
      </h3>
    </td>
    <td colspan="2" class="summary-cell w70">${skills}</td>
  </tr>
  <tr class="no-border">
    <td colspan="3">
      <h2>Professional experience</h2>
    </td>
  </tr>
  `;
  const cvBody = `
  <tr>
    <td class="bold-right t0"><br>AETY</td>
    <td class="w70">
      (21-11 – Nowadays / Part-time)<br>
      Full-stack developer, data engineer, and AWS/JSM/Power BI/monday.com technical consultant.<br><br>

      24-03 - 24-07<br>
      Project: ETL SYS102 for UFST/VURDST<br>
      Role: AWS cloud software developer and data engineer<br>
      Responsible for data pipeline development on AWS to gather all the data sources required for<br>
      a Business Intelligence solution for the property tax agency VURDST in Denmark.<br><br>

      Main tasks:<ol>
      <li>Develop lambda functions to get raw XML documents and transform them into JSON,
      un-flatten them to Parquet files, and save them in S3 to be usable in Athena.</li>
      <li>Replicate the logic in AWS Glue ETL visual jobs for scalability.</li>
      <li>Make the foundational technical data flows on the solution for UFST's self-maintenance.</li>
      </ol>

      24-01 - 24-02<br>
      Project: Jira Ultimate Customizer<br>
      Role: Full-stack Developer<br>
      Responsible for Jira's Ultimate Customizer and Issue Lock help desk resolutions.<br><br>

      23-09 - 23-12<br>
      Project: TDC's Smart Build solution, Role: Full-stack developer and UX implementation responsible.<br>
      Full-stack developer for TDC NET geographical auctioning Phoenix solution at the AI & Digital team.<br>
      Main tasks:<ol>
      <li>E2E representation of TAB geographical data on OpenLayers and Leaflet front-end environments</li>
      <li>Front-end development of the UI for Smart Build</li>
      <li>Back-end development of the API for the AI model used to improve towers</li>
      </ol>
      Technologies:<ol>
      <li>Python: fastapi, pandas, numpy, polars, requests</li>
      <li>Javascript/Typescript: React, Chakra, OpenLayers, LeafLet, atomic design</li>
      <li>Database: SQL queries, Snowflake</li>
      </ol><br>

      23-05 - 23-08<br>
      Project: Jira Ultimate Customizer<br>
      Role: Full-stack Developer<br>
      Responsible for Jira's Ultimate Customizer feature to modularize custom JS/CSS and main help desk resolution management resource.<br>
      Main tasks:<ol>
      <li>Implementation of a feature for customizing different CSS and JS configurations for Ultimate Customizer</li>
      <li>Upgrade of @atlaskit/tabs code internals</li>
      <li>Update activity diagrams</li>
      <li>Improved back-end running for Dockerfile's and Makefile</li>
      <li>UX design improvement</li>
      <li>Automation of testing in long-term stable JSM versions 4.5, 4.13, 5.4, 5.8</li>
      <li>automated usage of nvmrc</li>
      </ol><br>

      22-09 - 23-04<br>
      Project: Data automation on Dr. Oetker Home, public webpages content creation.<br>
      Role: <span class="arch">Full-stack</span> software developer, data engineer, and AWS technical consultant.<br>
      Project description:<br>
      Dr. Oetker is a producer for baking, frozen pizza, and related supermarket products, whose international webpages have been modernized and adopted a <span class="arch">data
      governance infrastructure and architecture</span>.<br>
      Main tasks:<ol>
      <li>Automation of recipe ratings data validation on import from Dr. Oetker products on multiple countries.</li>
      <li><span class="arch">Data governance</span> from contact form information requested from users in the webpages, having DynamoDB tables to store the data.</li>
      <li>Implementation of promotion forms back-end logic.</li>
      <li>Configuration of SalesForce and Evalanche connections for newsletter subscriptions.</li>
      <li>Full live elasticsearch <span class="arch">database migration</span> from a provider to another one.</li>
      <li>Big <span class="arch">reduction of the technical debt</span> of the project's back-end.</li>
      <li>Creation of a web-service for Dr. Oetker internal stakeholders for enabling them to modify nginx configuration for different Dr. Oetker websites.</li></ol><br>

      22-03 - 22-09<br>
      Project:  Jira Ultimate Customizer,<br>
      Role: Full-stack Developer<br>
      Responsible for enabling Jira's Ultimate Customizer with its correct UI/UX in signup, approvals, single portals, portals page, users login, profile page, create request, view
      request, requests page, and for fixing permissions error when editing login screen for the minor version 4.3.0 as well as for <span class="arch">resolving and communicating
      </span> on the resolution for <span class="arch">all the Service Desk incidences</span> for this App.<br><br>

      22-01 - 22-03<br>
      Project: Integration between monday.com and KortInfo,<br>
      Role: Software Developer<br>
      Responsible for developing an automatic real time synchronization solution for a client from monday.com to KortInfo (web map - GIS - provider).<br><br>
      Project description:<br>
      The client used two systems holding the same information for different purposes (see projects on the map and manage these projects on a project management tool). They lacked
      an automatic way to send new projects and updates to the web map environment. The goal of the project was to implement a solution in a "serverless" environment that listens
      to some critical changes in monday.com.<br>
      Main tasks:<ol>
      <li><span class="arch">Solution design</span> and requirement elucidation with the client and third-party developer</li>
      <li>Making a javascript interface for transforming some <span class="arch">REST GraphQL API</span> data to the necessary web map GIS provider<span class="arch"> API real-time
      POST requests</span>.</li>
      <li>Monitoring these changes through some RSS connected to a business intelligence report to check if there could be potential issues after going live.</li>
      <li>Technologies used:</li>
      <li>JavaScript, <span class="arch">API REST</span>, GraphQL, Zapier.</li></ol><br>

      21-12 - 22-01<br>
      Project: Business intelligence solution<br>
      Role: Software Developer, Data engineer / Consultant.<br>
      Responsible for developing a Business Intelligence solution to provide actionable market intelligence for Atlassian's Marketplace Apps.<br><br>
      Project description:<br>
      There is a regular high interest in automatically gathering all public add-ons information from <span class="arch">Atlassian Marketplace API</span> to understand our
      partnership vendors better. Javier used the programming language Python in a <span class="arch">serverless architecture</span> for the ETL and an analytical solution for
      performing SQL queries over the data to identify potential vendors and add-ons.<br>
      Main tasks:<ol>
      <li>Creation of data model/dimensions for the BI report</li>
      <li>Extraction of data from <span class="arch">REST APIs</span> using AWS Lambda</li>
      <li>Storage of raw data in S3</li>
      <li>Integration with, and querying of data via AWS Athena</li>
      <li>Presentation of data in Power BI</li>
      <li>Technologies used:</li>
      <li>AWS Lambda, S3, Athena, Power BI, Python, <span class="arch">API REST</span>, SQL.</li></ol>
    </td>
  </tr>
  <tr class="no-border">
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right t0"><br>T-Systems Iberia</td>
    <td class="w70">
      (19-11 - 21-11)<br>
      Full-stack developer, consultant, and Power BI technician.<br><br>

      21-05 - 21-10<br>
      <span class="arch">Full-stack developer</span> for Ferrovial's application to handle view, monitor and send real-time traffic alerts, automation of the creation of new road
      trackings, and user management, all accesible within a React.JS webpage. <span class="cloud Kubernetes">Docker, Kubernetes, Python</span>, JavaScript, SQL, <span class=
      "arch cloud">APIs REST</span>, <span class="arch cloud">GCP's Directions API</span>, Django, React and UX specialist.<br><br>

      21-05 - 21-05<br>
      <span class="bi">Power BI technical consultant</span><br>
      <span class='arch bi'>Power BI teacher</span> for T-Systems, and all other Deutsche Telekom companies.<br><br>

      20-12 - 21-04<br>
      <span class="bi">Data engineer and front-end consultant</span><br><br>
      Technical consultant for <span class='arch webdev'>full-stack development</span> on <span class='bi webdev cloud'>Pentaho CDE</span> reports for a Smart City.<br>
      Technical consultant whose role was to <span class="arch">implement proofs of concept</span> for full-stack development of personalized reports on <span class="bi">Pentaho
      CDE</span> <span class='webdev'>c tools</span> and <span class='webdev'>D3.js</span> with <span class="bi">postgresql</span> data sources, such as CC charts, Sankey and
      network diagrams, Scatter plot and Tile Set Map Components use cases.<br><br>
      Project description:<br>
      A big town hall publicly published its will to implement a "smart city" technology over some years, involving IoT devices around the city.<br>
      The nourishing of the database needed to be filtered and queried to measure specific KPIs for the local administration to decide.<br>
      The goal was to query, filter, and display the data to provide insights on the KPIs with Pentaho CDE (open-source web BI platform).<br><br>
      Tasks:<br>
      Technical validations and proof of concepts for shaping how to achieve the requirements for the client (part-time through 2 years).<br>
      Being part of the elected development team to make the solution for the city for the 3 years of project duration.<br>
      Full-stack development of personalized reports on Pentaho CDE.<br>
      Test case development<br><br>
      Technologies used:<br>
      Pentaho CDE, PostgreSQL, CC charts, JavaScript, SQL, Leaflet.JS maps, Sankey and network diagrams.<br><br>

      20-10 - 20-12<br>
      <span class="bi">Power BI</span> <span class="arch">consultant and technician</span><br><span class='webdev'>Setting up corporate reports</span> for T-Systems to track
      worker's project dedications, plans, assignments, etc. Using <span class="bi cloud">Azure Data Factory</span> and DataFlows.<br><br>

      20-09 - 20-10<br>
      Software developer and consultant.<br>
      <span class="arch">Software developer and consultant</span> for a multi-language automatic translator within a public sector autonomy.<br><br>

      20-06 - 20-09<br>
      <span class="bi">Power BI consultant and technician</span><br><span class='webdev'>Setting up multi-client reports</span> for T-Systems based on <span class="cloud">Azure Log
      Analytics</span> Exports. Design of the Power Query data sources and of all the tab reports.<br><br>

      20-05 - 20-06<br>
      <span class="arch">Software Developer and Consultant</span><br>
      Software developer and consultant for a multi-language automatic translator within a public sector autonomy.<br><br>

      20-03 - 20-04<br>
      <span class="bi">Big Data technician</span><br>Big Data technician for setting up the data scientist environment for the biggest insurance company in Spain, using <span
      class="arch bi cloud">Python, AWS Lambda, AWS Step Functions, AWS S3, AWS Athena</span>, AWS IAM and remote connections.<br><br>

      19-12 - 20-02<br>
      Technical consultant of <span class="arch cloud">cloud architecture</span>, full-stack developer and big data engineer for a Smart City.<br>
      Technical consultant whose role was to implement proofs of concept of <span class='webdev'>front-end developments</span>, <span class="cloud">python</span> backend
      connectors, third party's <span class='arch cloud webdev'>API managements</span>, big data solutions (<span class='webdev cloud'>elasticsearch</span>, BERT, <span
      class='webdev'>Kibana</span>), <span class="bi">AWS Lambda functions</span>, connections and <span class=
      "cloud Kubernetes">setting up Docker containers for all the components in Docker containers on a Kubernetes cluster</span> for a big Smart City project.<br><br>

      19-12 - 20-01<br>
      <span class='webdev'>Chatbot full-stack developer</span><br>Chatbot development from scratch of a fully <span class='webdev'>serverless web chat</span> using <span
      class='webdev'>AJAX</span> calls for Microsoft L.U.I.S.,
      <span class='webdev'> CSS3, HTML5 and JavaScript native development</span>.<br><br>

      19-11 - 19-12<br>
      Azure and Power BI technical consultant.<br>
      <span class="bi">Power BI, ETL and <span class='arch webdev'>report designer</span></span> for an <span class="cloud">Azure Log Analytics</span> tracking environment in
      real-state.
    </td>
  </tr>
  <tr class="no-border">
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right">Open Webinars</td>
    <td class="w70">(Collaboration, 21-10).<br>
     <span class="arch">Teacher</span> for the OpenWebinars courses and workshop for <span class="webdev">JavaScript design patters</span>.
    </td>
  </tr>
  <tr class="no-border">
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right t0"><br>Informática El Corte Inglés</td>
    <td class="w70">
      (17-07 - 19-10)<br>
      Technical and consultant on Big Data and Analytics solutions. Artificial intelligence <span class='webdev'>software development, chat-bots</span> and <span class="bi">ETLs
      </span>, using <span class="cloud">Amazon Web Services</span> technologies (AWS EC2, Amazon CodeCommit,
      <span class="bi">Amazon Redshift, Amazon Glue and Amazon S3</span> among others), Microsoft Azure (L.U.I.S., QnA, <span class='webdev'>App Service</span>, <span
      class="bi">Data Lake Storage, Azure Data Factory, Data Lake Analytics</span>), IBM Watson, <span class='webdev cloud'>Oracle Intelligent Bots</span>,
      <span class="cloud">Google Cloud</span> and SAS. <span class='webdev'>Programming with JavaScript, Node.JS</span>, <span class="bi"><span class="cloud">Python</span>, U-SQL
      </span> and R.<br><br>

      19-06 – 19-10<br>
      Development, <a href="https://github.com/jgonzal1/d3js-graph-analytics">analysis</a> and <span class="arch">architecture</span> for an ETL and BI project.<br>
      Involving <span class="bi">extraction of data files from different <span class="cloud">cloud sources</span>
      (SAP, Salesforce, Excel documents)</span> to Amazon S3 buckets, transformation of data with
      <span class="bi">Amazon Glue (boto3 and pyspark libraries)</span>, and load in
      <span class="bi">Amazon Redshift tables which are taken by
      <span class='webdev'>Power BI for its data representation</span></span>.<br><br>

      18-11 - 19-05<br>
      Development and <span class="arch">architecture</span> in an <span class="bi">ETL project.<br>
      Involving data extraction from both an Oracle database and Google Sheets</span> spreadsheets, transformation of data with <span class="bi">Data Lake Analytics and Azure App
      Service within Azure Data Factory</span>, and load of data in <span class="bi">Data Lake Storage CSVs which are taken by Power BI for its <span class='webdev'
      >data representation</span></span>.<br><br>

      18-03 - 18-10<br>
      Full-stack Developer for a chatbot for an insurance company.<br><br>
      Project description:<br>
      A big insurance company in Spain wanted to implement a chatbot on their webpage to get a lower workload on the phone for easily answered questions. The task was to create it
      and implement it on the bottom of their webpage (loads when the page fully renders). The development was done using Javascript, Node.js, Python, SQL, and R.<br><br>
      Tasks:<br>
      Develop a fully functional and customizable chatbot (now in vivaz.com, loads when page fully renders) from a basic Microsoft template.<br>
      Teach an intern how to develop and coordinate tasks with him.<br><br>
      Technologies used:<br>
      Amazon Web Services (AWS EC2, Amazon CodeCommit, Amazon Redshift, Amazon Glue, and Amazon S3 among others).<br>
      Microsoft Azure (L.U.I.S., QnA, App Service, Data Lake Storage, Data Lake Analytics).<br>
      IBM Watson, Oracle Intelligent Bots, Google Cloud, and SAS.<br>
      Programming in Javascript, Node.js, Python, U-SQL, and R.<br><br>

      17-12 – 18-02<br>
      Full-stack developer.<br>
      <span class="webdev">Development of a geo-analytical BI web service built with R</span>.<br><br>

      17-08 - 17-11<br>
      <span class="arch bi">Data mining technician</span> and machine learning.<br>
      Development of an artificial vision software in <span class="cloud">Python</span> to classify vehicles.<br><br>
      Tasks:<br>
      Create a Python artificial intelligence able to process laser vehicle profiles.<br>
      Train the model with thousands of vehicles.<br>
      Enhance profiling detection of the vehicles.<br><br>
      Technologies used:<br>
      RHEL bash scripting.<br>
      WinSCP.<br>
      Python (libraries: sci-kit-learn, pickle, matplotlib).
    </td>
  </tr>
  <tr class="no-border">
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right">PrimeX Artificial Intelligence</td>
    <td class="w70">16-09 - 18-09<br>
    Artificial Intelligence developer for a <span class='webdev'>chatbot</span><br>Java programming, <span class="bi">data mining</span>, and AI training using <span class=
    "arch cloud">different APIs from IBM Watson Cloud, Amazon Lex</span>, and Instagram, among others.
    </td>
  </tr>
  <tr class="no-border">
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right">BABEL Sistemas de Información</td>
    <td class="w70">17-06 - 17-07<br><span class='webdev'>Software development in C# to build chatbots</span>. Enabling connections with IBM Watson and Microsoft LUIS technologies
    </td>
  </tr>
  <tr class="no-border">
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right">IBM</td>
    <td class="w70">16-05 - 17-05<br>
    Pre sales and technical consultant of <span class="cloud">IBM Watson</span> for Drug Discovery for Spain, Portugal, Greece and Israel.<br><span class="arch">Use cases
    leveraging</span>, <span class="bi">data mining</span>, <span class='arch webdev'>business analyst</span>, and <span class='arch webdev'>social media manager</span> for the
    marketing campaign.
    </td>
  </tr>
  <tr class="no-border">
    <td colspan="3"><br></td>
  </tr>
  <tr style="display:none">
    <td class="bold-right">Unica Group S.C.A.</td>
    <td class="w70">15-04 - 15-05<br>Quality control professional for foodstuff products in Cohorsan S.C.A
    </td>
  </tr>
  <tr class="no-border">
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td colspan="3" class="colspan4">
      <h2>University degrees</h2>
    </td>
  </tr>
  <tr>
    <td class="bold-right">BSc @ Universidad de Granada</td>
    <td colspan="2">2010 - 2014<br>Biochemistry with Biotechnology specialization bachelor degree.
    </td>
  </tr>
  <tr>
    <td class="bold-right">MSc @ Universidad de Granada</td>
    <td colspan="2">2014 - 2015<br>Master of Science in Foodstuffs quality and technology.
    </td>
  </tr>
  <tr>
    <td class="bold-right">MD @ Universidad de Alcalá</td>
    <td colspan="2">2016 - 2017<br>Master in Professional Development 4.0
    </td>
  </tr>
  <tr class="no-border">
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td colspan="3" class="colspan4">
      <h2>Courses, certifications and events</h2>
    </td>
  </tr>
  <tr>
    <td class="bold-right">Microsoft</td>
    <td colspan="2">21-02<br><span class='cloud'>Microsoft AI-100</span>.
      Issued by Pearson VUE, Credential ID 990098386.
    </td>
  </tr>
  <tr>
    <td class="bold-right">Red.ES</td>
    <td colspan="2">20-12<br><span class='webdev'>HTML5 and CSS3</span>
    </td>
  </tr>
  <tr>
    <td class="bold-right">LinkedIn verified evaluation</td>
    <td colspan="2">20-06<br><span class='webdev'>Javascript</span><br><br>
    20-06<br>Git<br><br>
    20-06<br>Excel<br><br>
    20-06<br><span class="cloud">Python</span>
    </td>
  </tr>
  <tr>
    <td class="bold-right">Event</td>
    <td colspan="2">19-05<br>Amazon Web Services VIP assistant in AWS Summit 19 in Spain
    </td>
  </tr>
  <tr>
    <td class="bold-right">Cognitive Class.AI</td>
    <td colspan="2">17-12<br><span class="cloud">Machine Learning with Python</span>
    </td>
  </tr>
  <tr>
    <td class="bold-right">Amazon Web Services</td>
    <td colspan="2">
    22-07<br>AWS Certified Data Analytics – Specialty<br><br>
    22-03<br>AWS Certified Developer – Associate<br><br>
    17-10<br>AWS Technical Professional Online
    </td>
  </tr>
  <tr>
    <td class="bold-right">IBM</td>
    <td colspan="2">16-05<br>IBM's Watson Academy Courses
    </td>
  </tr>
  <tr>
    <td class="bold-right">Universidad de Alcalá</td>
    <td colspan="2">16-04<br>Probability & Statistics
    </td>
  </tr>
  <tr>
    <td class="bold-right">Formación sin Barreras</td>
    <td colspan="2">
      15-11<br>
      <span class='webdev'>Knowledge management for companies</span><br><br>
      15-09<br>Financial accountability
    </td>
  </tr>
  <tr class="no-border">
    <td colspan="3"><br></td>
  </tr>
  `;
  const legend = `
  <tr>
    <td colspan="9" style="font-size:0.75rem">
    * Holidays 2w Xmas, Easter, 3w end of Jul/start of Aug
    </td>
  <tr></tr>
    <td rowspan="6">Legend</td>
    <td></td><td colspan="7" style="background-color:#A54242">
      Big data engineer
    </td>
  </tr><tr>
    <td></td><td colspan="7" style="background-color:#CC6666">
      Full stack software developer
    </td>
  </tr><tr>
    <td></td><td colspan="7" style="background-color:#DE935F">
      AI data scientist
    </td>
  </tr><tr>
    <td></td><td colspan="7" style="background-color:#F0C674">
      Data analyst Power BI
    </td>
  </tr><tr>
    <td></td><td colspan="7" style="background-color:#B5BD68">
      Web developer
    </td>
  </tr><tr>
    <td></td><td colspan="7" style="background-color:#81A2BE">
      Technical consultant
    </td>
  </tr>
  `;
  return [cvHeader, cvBody, legend];
}