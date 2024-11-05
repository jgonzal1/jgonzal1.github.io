function getEnglishContents() {
  const skills = `
  <fieldset class="font-size-1-rem border-light-gray"><legend class="category-td">Data Engineering</legend>
  Business Intelligence, Database Migrations, Database Administrator,
  DAX, ElasticSearch, ETL, GIS, GraphQL, GSheets/Excel, MySQL, pandas,
  Pentaho Data Integration, PL/SQL, PostgreSQL, SQL, sqlite
  </fieldset>
  <fieldset class="font-size-1-rem border-light-gray"><legend class="category-td">Microsoft / Azure</legend>
  Azure Data Factory, Azure DevOps, Azure Cloud Services,
  Microsoft LUIS, Power BI, VSCode
  </fieldset>
  <fieldset class="font-size-1-rem border-light-gray"><legend class="category-td">Amazon Web Services (AWS)</legend>
  Amazon DynamoDB, Amazon EC2, Amazon Redshift, Amazon S3,
  AWS Athena, AWS CLI, AWS Lambda, boto3, IAM
  </fieldset>
  <fieldset class="font-size-1-rem border-light-gray"><legend class="category-td">Web developer</legend>
  CSS, D3.JS, Figma User Experience Design, Front-end, Javascript, React Native
  </fieldset>
  <fieldset class="font-size-1-rem border-light-gray"><legend class="category-td">Full-stack software developer</legend>
  API development, CI/CD, Docker, Git,
  Microservices Architecture, Node.Js, Python, ReactJS, RegEx, REST,
  Serverless Architecture, Web Services Integrations
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
    <td colspan="2" style="border-width:0">
      <img src="public/javier.jpg" alt="Javier González" style="width: 4em; position: absolute;">
      <div style="padding-left:5em">
        <span>Javier González Berenguel</span>
        <a href="mailto:javier.gonzalezberenguel@gmail.com" target="_blank">
          javier.gonzalezberenguel@gmail.com
        </a>
        <p>📫 Copenhagen, DK. Available for EU reallocation</p>
      </div>
    </td>
    <td style="border-width:0; min-width: 6.5em">
      <fieldset style="display:none;">
        <legend>📲 (please inform before calling)</legend>
        <span>(+34) 664383902</span>
      </fieldset>
      <div style="font-family:monospace;">
        <!--<legend>🗣</legend>-->
        <span style="color:#F0C674">★★★★★</span> EN<br>
        <span style="color:#F0C674">★★★★★</span> ES<br>
        <span style="color:#F0C674">★★</span>☆☆☆ DA<br>
        <span style="color:#F0C674">★★</span>☆☆☆ DE<br>
        <span style="color:#F0C674">★★</span>☆☆☆ FR<br>
        <!--<span style="color:#F0C674">★</span>☆☆☆☆ LT<br>-->
      </div>
    </td>
  </tr>
  <tr>
    <td colspan="3">
      <h2>CV summary</h2>
    </td>
  </tr>
  <tr>
    <td class="bold-right" style="width: 7em">
      <h3>About me</h3>
    </td>
    <td colspan="2" class="w70">
      I am a technical consultant expert in data engineering, Power BI, cloud architectures and software development.
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
    <td colspan="3"><br><br><br>
      <h2>Professional experience</h2>
    </td>
  </tr>
  `;
  const cvBody = `
  <tr>
    <td class="bold-right t0"><br>AETY</td>
    <td class="w70">
      <p>Client: AETY Aps @ Copenhagen, Denmark, EU.</p>
      <p>21-11 - 24-11 / Part-time.</p>
      <p>Roles: Full-stack developer, data engineer, and AWS/JSM/Power BI/monday.com technical consultant.<br><br></p>

      <p>Client: UFST @ Copenhagen, Denmark, EU.</p>
      <p>24-03 - 24-07 / B2B full-time.</p>
      <p>Project: ETL data engineer for delivering architecture SYS102 to VURDST department.</p>
      <p>Role: AWS cloud software developer and data engineer.</p>
      <p>Responsible for data pipeline development on AWS to gather all the data sources required for.</p>
      <p>a Business Intelligence solution in Power BI for the property tax agency UFST in Denmark.</p><br>
      <p>Main tasks:</p><ol>
      <li>Develop lambda functions to get raw XML documents and transform them into JSON,
      un-flatten them to Parquet files, and save them in S3 to be usable in Athena.</li>
      <li>Replicate the logic in AWS Glue ETL visual jobs for scalability.</li>
      <li>Make the foundational technical data flows on the solution for UFST's self-maintenance as SQL queries in AWS Athena.</li>
      <li>Deliver the data in Power BI using DAX queries.<br></li>
      </ol>

      <p>Client: TDC NET @ Copenhagen, Denmark, EU.</p>
      <p>23-09 - 23-12</p>
      <p>Project: Smart Build solution.</p>
      <p>Role: Full-stack developer and UX implementation responsible.</p>
      <p>Full-stack developer for TDC NET geographical auctioning Phoenix solution at the AI & Digital team.<br><br></p>

      <p>Client: Lego Systems @ Copenhagen, Denmark, EU.</p>
      <p>21/11 - 23/6</p>
      <p>Software Developer and Power BI technical consultant.</p>
      <p>Management reporting in Power BI on Lego's sustainability projects.</p>
      <p>The consultant's responsibilities/actions were:</p>
      <p>• Responsible for developing a Business Intelligence solution to create dashboards to provide
      actionable intelligence for Lego sustainability projects.</p>
      <p>• Creation of data model/dimensions for the BI report Extraction of data from REST APIs.</p>
      <p>• Presentation of data in Power BI using DAX queries to generate custom columns and metrics (C#-
      based).</p>
      <p>PowerApps & wider Power Platform ecosystem.</p>
      <p>Data Visualization best practices.</p>
      <p>Microsoft Power BI | Data Analysis Expressions (DAX) | REST API | Business Intelligence (BI) | C#.<br><br></p>

      <p>Client: Dr. Oetker via partnership with AKQA Copenhagen, Denmark / Remote EU.</p>
      <p>22-09 - 23-04</p>
      <p>Project: Data automation on Dr. Oetker Home, public webpages content creation.</p>
      <p>Role: <span class="arch">Full-stack</span> software developer, data engineer, and AWS technical consultant.<br><br></p>

      <p>Client: AETY Aps @ Copenhagen, Denmark, EU.</p>
      <p>21-12 - 22-01</p>
      <p>Project: Business intelligence solution.</p>
      <p>Role: Software Developer, Data engineer / Consultant.</p>
      <p>Responsible for developing a Business Intelligence solution to provide actionable market intelligence for Atlassian's Marketplace Apps.</p>
      <p>Write SQL queries in AWS Athena.</li>
      <li>Deliver the data in Power BI for its usage with DAX queries.<br></li><br>
      <p>Project description:</p>
      <p>There is a regular high interest in automatically gathering all public add-ons information from <span class="arch">Atlassian Marketplace API</span> to understand our
      partnership vendors better. Javier used the programming language Python in a <span class="arch">serverless architecture</span> for the ETL and an analytical solution for
      performing SQL queries over the data to identify potential vendors and add-ons.</p>
      <p>PowerApps & wider Power Platform ecosystem.</p>
      <p>Data Visualization best practices.</p>
      <p>Main tasks:</p><ol>
      <li>Creation of data model/dimensions for the BI report</li>
      <li>Extraction of data from <span class="arch">REST APIs</span> using AWS Lambda</li>
      <li>Storage of raw data in S3</li>
      <li>Integration with, and querying of data via AWS Athena</li>
      <li>Presentation of data in Power BI</li>
      <li>Technologies used:</li>
      <li>AWS Lambda, S3, Athena, Power BI, Python, <span class="arch">API REST</span>, SQL.<br></li></ol>
    </td>
  </tr>
  <tr class="no-border">
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right t0">T-Systems Iberia</td>
    <td class="w70">
      <p>Client: T-Systems Iberia @ Spain, EU / Hybrid.</p>
      <p>(19-11 - 21-11)</p>
      <p>Roles: Full-stack developer, consultant, and Power BI technician.<br><br></p>

      <p>Client: Deutsche Telekom @ EU / Remote.</p>
      <p>21-05</p>
      <p><span class="bi">Power BI technical consultant</span><br>
      <span class='arch bi'>Power BI teacher</span> for T-Systems, and all other Deutsche Telekom companies.</p>
      <p>SQL queries and DAX aggregations in Power BI.</p>
      <p>PowerApps & wider Power Platform ecosystem.</p>
      <p>Data Visualization best practices.<br><br></p>

      <p>Client: Ayuntamiento de Valladolid @ Spain / Remote.</p>
      <p>20-12 - 21-04</p>
      <p><span class="bi">Data engineer and front-end consultant</span><p>
      <p>Technical consultant for <span class='arch webdev'>full-stack development</span> on <span class='bi webdev cloud'>Pentaho CDE</span> reports for a Smart City.</p>
      <p>Data Visualization best practices.<br><br></p>

      <p>Client: T-Systems Iberia @ Spain, EU / Remote.</p>
      <p>20-10 - 20-12</p>
      <p><span class="bi">Power BI</span> <span class="arch">consultant and technician</span><br><span class='webdev'>Setting up corporate reports</span> for T-Systems to track
      worker's project dedications, plans, assignments, etc. Using <span class="bi cloud">Azure Data Factory</span> and DataFlows.</p>
      <p>SQL queries and DAX aggregations in Power BI.</p>
      <p>PowerApps & wider Power Platform ecosystem.</p>
      <p>Data Visualization best practices.<br><br></p>

      <p>Client: T-Systems Iberia @ Spain, EU / Remote.</p>
      <p>20-06 - 20-09</p>
      <p><span class="bi">Power BI consultant and technician</span><br><span class='webdev'>Setting up multi-client reports</span> for T-Systems based on <span class="cloud">Azure Log
      Analytics</span> Exports. Design of the Power Query data sources and of all the tab reports.</p>
      <p>SQL queries and DAX aggregations in Power BI.</p>
      <p>PowerApps & wider Power Platform ecosystem.</p>
      <p>Data Visualization best practices.<br><br></p>

      <p>Client: T-Systems Iberia @ Madrid, Spain, EU / Hybrid.</p>
      <p>19-11 - 19-12</p>
      <p>Azure and Power BI technical consultant.</p>
      <p><span class="bi">Power BI, ETL and <span class='arch webdev'>report designer</span></span> for an <span class="cloud">Azure Log Analytics</span> tracking environment in real-state.</p>
      <p>SQL queries and DAX aggregations in Power BI.</p>
      <p>PowerApps & wider Power Platform ecosystem.</p>
      <p>Data Visualization best practices.<br><br></p>
    </td>
  </tr>
  <tr class="no-border">
    <td colspan="3"><br></td>
  </tr>
  <tr>
      <p>Client: Redexis Gas @ Madrid, Spain, EU, on-site.</p>
      <p>19-06 - 19-10</p>
      <p>Development, <a href="https://github.com/jgonzal1/d3js-graph-analytics">analysis</a> and <span class="arch">architecture</span> for an ETL and BI project.<br>
      Involving <span class="bi">extraction of data files from different <span class="cloud">cloud sources</span>
      (SAP, Salesforce, Excel documents)</span> to Amazon S3 buckets, transformation of data with
      <span class="bi">Amazon Glue (boto3 and pyspark libraries)</span>, and load in
      <span class="bi">Amazon Redshift tables which are taken by
      <span class='webdev'>Power BI for its data representation</span></span>.</p>
      <p>SQL queries and DAX aggregations in Power BI.</p>
      <p>PowerApps & wider Power Platform ecosystem.</p>
      <p>Data Visualization best practices.<br><br></p>

      <p>Client: UOC @ Barcelona, Spain, EU, hybrid.</p>
      <p>18-11 - 19-05</p>
      <p>Development and <span class="arch">architecture</span> in an <span class="bi">ETL project.<br>
      Involving data extraction from both an Oracle database and Google Sheets</span> spreadsheets, transformation of data with <span class="bi">Data Lake Analytics and Azure App
      Service within Azure Data Factory</span>, and load of data in <span class="bi">Data Lake Storage CSVs which are taken by Power BI for its <span class='webdev'
      >data representation</span></span>.</p>
      <p>SQL queries and DAX aggregations in Power BI.</p>
      <p>PowerApps & wider Power Platform ecosystem.</p>
      <p>Data Visualization best practices.<br><br></p>
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
    <td class="bold-right"><p>BSc @ University of Granada</p></td>
    <td colspan="2"><p>2010 - 2014</p>
    <p>Biochemistry with Biotechnology specialization bachelor degree.<br><br></p>
    </td>
  </tr>
  <tr>
    <td class="bold-right"><p>MSc @ University of Granada</p></td>
    <td colspan="2"><p>2014 - 2015</p>
    <p>Master of Science in Foodstuffs quality and technology.<br><br></p>
    </td>
  </tr>
  <tr>
    <td class="bold-right"><p>MD @ University of Alcalá</p></td>
    <td colspan="2"><p>2016 - 2017</p>
    <p>Master in Professional Development 4.0.<br><br></p>
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