function getEnglishContents() {
  const cvHeader = `
  <tr>
    <td colspan="3">
      <h2>Personal Information</h2>
    </td>
  </tr>
  <tr>
    <td>
      <fieldset>
        <legend>🧔</legend>
        Javier González Berenguel
      </fieldset>
      <fieldset style="display:none;">
        <legend>📲 (please inform before calling)</legend>
        <span>(+34) 664383902</span>
      </fieldset>
      <fieldset>
        <legend>🗣</legend>
        English<br>
        Spanish (nationality)<br>
        More TBD
      </fieldset>
    </td>
    <td>
      <fieldset>
        <legend>📩</legend>
        <a href="mailto:javier.gonzalezberenguel@gmail.com" target="_blank">
          javier.gonzalezberenguel@gmail.com
        </a>
      </fieldset>
      <fieldset>
        <legend>📫</legend>
        Copenhague, Denmark
      </fieldset>
      <fieldset>
        <legend>🗺</legend>
        Availability for international projects
      </fieldset>
    </td>
    <td class="centered">
      <fieldset>
        <legend>📸</legend>
        <img src="javier.jpg" alt="Javier González">
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
    <td colspan="2" class="w70" style="font-size: 1.3em;">
      <p>
        <b>Technical</b> and <b><span class="cloud">cloud consultant expert</span></b> in <span class="bi highlight-yellow"><b>ETLs</b></span>, <span class="bi highlight-yellow"><b>BI</b></span>, <span class="webdev highlight-red"><b>web development</b></span> and NLP.
      </p>
      <p>
        Greatest experience in these clouds: <span class="highlight-orange cloud"><b>Amazon Web Services</b></span> (3+ years of experience),
      </p>
      <p>
        <span class="highlight-blue cloud"><b>Azure</b></span> (3 years of experience) and <span class="highlight-gray cloud"><b>IBM</b></span> (1 year of experience within the company).
      </p>
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right">
      <h3>
        Technologies
      </h3>
    </td>
    <td colspan="2" class="w70" style="font-size: 1.3em;">
      <p>
        <span class="highlight-orange">AWS EC2</span>, <span class="highlight-orange">Amazon Code Commit</span> (git), <span class="highlight-red cloud">Python</span> (boto3, <span class="bi">pyspark</span>, numpy,</p>
      <p>
        pandas, scikit-learn...), <span class="bi highlight-orange">Amazon Redshift</span> (SQL), <span class="bi highlight-orange">AWS Glue</span> (pyspark),</p>
      <p>
        <span class="webdev highlight-red"> Regular Expressions</span> (advanced), <span class="highlight-blue">Excel</span> (advanced), <span class="bi highlight-yellow">Power BI</span> (DAX</p>
      <p>
        functions, R), <span class="webdev highlight-red">JavaScript</span> (experience on full stack development with React,</p>
      <p>
        Angular, jQuery, Leaflet, BootStrap, D3.JS, Ionic, Node.JS, Three.JS, ESLint</p>
      <p>
        and TypeScript), <span class="webdev highlight-red">CSS</span>(BootStrap, LeafLet, AwesomeFonts), <span class="webdev highlight-red">HTML</span></p>
      <p>
        (complex structures and DOM handlers), <span class="bi highlight-blue">Azure Data Lake Analytics</span> (U-SQL, C#),</p>
      <p>
        <span class="bi highlight-blue">Azure Data Factory</span>(ETLs), <span class="highlight-gray">IBM Watson</span> (AI solutions), <span class="webdev highlight-blue">Azure App Service</span>,
      </p>
      <p>
        <span class="highlight-blue">Microsoft LUIS</span>.
      </p>
    </td>
  </tr>
  <tr>
    <td colspan="3">
      <h2>Proffesional experience</h2>
    </td>
  </tr>
  `;
  const cvBody = `
  <tr>
    <td class="bold-right">AETY</td>
    <td colspan="2" class="w70"><br>(Nov 21 – Nowadays)<br>Software developer
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right">T-Systems Iberia</td>
    <td colspan="2" class="w70"><br>(Nov 19 – Nov 21)<br>Software developer and consultant, and Power BI technician
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right"> </td>
    <td colspan="2" class="w70"><br>Dec 20 – Nov 21<br>Technical consultant for <span class='webdev'>full-stack development</span> on <span class='bi webdev cloud'>Pentaho CDE</span> reports for a Smart City<br>Technical consultant whose role was to implement proofs of concept for full-stack
      development of personalized reports on <span class="bi">Pentaho CDE</span> <span class='webdev'>ctools</span> with <span class="bi">postgresql</span> data sources, such as CC charts, <span class='webdev'>Raphaël.JS</span> Sankey and network diagrams, Scatterplot and Tile Set Map Components,
      and environment test cases.
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
      Dec 20 – Present<br>Technical consultant for <span class='webdev'>full-stack development</span> on <span class='bi webdev cloud'>Pentaho CDE</span> reports for a Smart City<br>Technical consultant whose role was to implement proofs of concept for full-stack
      development of personalized reports on <span class="bi">Pentaho CDE</span> <span class='webdev'>ctools</span> with <span class="bi">postgresql</span> data sources, such as CC charts, <span class='webdev'>Raphaël.JS</span> Sankey and network diagrams, Scatterplot and Tile Set Map Components,
      and environment test cases.
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right"> </td>
    <td colspan="2" class="w70">May 21 – Oct 21<br>
    Full-stack developer for Ferrovial's application to handle view, monitor and send real-time traffic alerts, automation of the creation of new road trackings, and user management, all accesible within a React.JS webpage. <span class="cloud">Docker, Python</span>, JavaScript, SQL, <span class="cloud">APIs REST</span>, <span class="cloud">GCP's Directions</span> API, Django, React and UX specialist.
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right"> </td>
    <td colspan="2" class="w70">Dec 20 - May 21<br><span class="bi">Power BI technical consultant</span><br>
    <span class='bi'>Power BI teacher</span> for T-Systems, and all other Deutsche Telekom companies.
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right"> </td>
    <td colspan="2" class="w70">Oct 20 - Dec 20<br><span class="bi">Power BI consultant and technician</span><br><span class='webdev'>Setting up corporate reports</span> for T-Systems to track worker's project dedications, plans, assignments, etc. Using <span class="bi cloud">Azure Data Factory</span> and DataFlows.
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right"> </td>
    <td colspan="2" class="w70">Sep 20 – Oct 20<br>Software developer and consultant<br>Software developer and consultant for a multi-language automatic translator within a public sector autonomy
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right"> </td>
    <td colspan="2" class="w70">Jun 20 - Sep 20<br><span class="bi">Power BI consultant and technician</span><br><span class='webdev'>Setting up multi-client reports</span> for T-Systems based on <span class="cloud">Azure Log Analytics</span> Exports. Design of the Power Query data sources and of all the tab reports.
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right"> </td>
    <td colspan="2" class="w70">May 20 - Jun 20<br>Software Developer and Consultant<br>Software developer and consultant for a multi-language automatic translator within a public sector autonomy
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right"> </td>
    <td colspan="2" class="w70">Mar 20 – Apr 20<br><span class="bi">Big Data technician</span><br>Big Data technician for setting up the data scientist environment for the biggest insurance company in Spain, using <span class="bi cloud">Python, AWS Lambda, AWS Step Functions, AWS S3, AWS Athena</span>, AWS IAM and remote connections.
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right"> </td>
    <td colspan="2" class="w70">Dec 19 – Feb 20<br>Technical consultant of <span class="cloud">cloud architecture</span>, software and big data for a Smart City<br>Technical consultant whose role was to implement proofs of concept of <span class='webdev'>front-end developments</span>, <span class="cloud">python</span> backend
      connectors, third party's <span class='webdev cloud'>API managements</span>, big data solutions (<span class='webdev cloud'>elasticsearch</span>, BERT, <span class='webdev'>Kibana</span>), <span class="bi">AWS Lambda functions</span>, connections and <span class="cloud">dockerization of all
      the components in Docker containers</span> for a big Smart City project.
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right"> </td>
    <td colspan="2" class="w70">Dec 19 – Jan 20<br><span class='webdev'>Chatbot full-stack developer</span><br>Chatbot development from scratch of a fully <span class='webdev'>serverless web chat</span> using <span class='webdev'>AJAX</span> calls for Microsoft L.U.I.S.,
      <span class='webdev'> CSS3, HTML5 and JavaScript native development</span>.
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right"> </td>
    <td colspan="2" class="w70">Nov 19 - Dec 19<br>Azure and Power BI technical consultant<br><span class="bi">Power BI, ETL and <span class='webdev'>report designer</span></span> for an <span class="cloud">Azure Log Analytics</span> tracking environment in real-state.
    </td>
  </tr>

  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right">OpenWebinars</td>
    <td colspan="2" class="w70">(Collaboration, Oct 21)<br>
     Teacher for the OpenWebinars courses and workshop for <span class="webdev">JavaScript design patters</span>.
    </td>
  </tr>

  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right">Informática El Corte Inglés</td>
    <td colspan="2" class="w70">(Jul 17 – Oct 19)<br>Technical and consultant on Big Data and Analytics solutions. Artificial intelligence <span class='webdev'>software development, chatbots</span> and <span class="bi">ETLs</span>, using <span class="cloud">Amazon Web Services</span> technologies (AWS EC2, Amazon CodeCommit,
      <span class="bi">Amazon Redshift, Amazon Glue and Amazon S3</span> among others), Microsoft Azure (L.U.I.S., QnA, <span class='webdev'>App Service</span>, <span class="bi">Data Lake Storage, Azure Data Factory, Data Lake Analytics</span>), IBM Watson, <span class='webdev cloud'>Oracle Intelligent Bots</span>,
      <span class="cloud">Google Cloud</span> and SAS. <span class='webdev'>Programming with JavaScript, Node.JS</span>, <span class="bi"><span class="cloud">Python</span>, U-SQL</span> and R.
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right"> </td>
    <td colspan="2" class="w70">Jun 19 – Oct 19<br>Development and architecture for an ETL and BI project<br>Involving <span class="bi">extraction of data files from different <span class="cloud">cloud sources</span> (SAP, Salesforce, Excel documents)</span> to Amazon S3 buckets, transfomation of data with <span class="bi">Amazon Glue (boto3 and
      pyspark libraries)</span>, and load in <span class="bi">Amazon Redshift tables which are taken by <span class='webdev'>Power BI for its data representation</span></span>.
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right"> </td>
    <td colspan="2" class="w70">Nov 18 – Feb 19<br>Development and architecture in an <span class="bi">ETL project<br>Involving data extraction from both an Oracle database and Google Sheets</span> spreadsheets, transformation of data with <span class="bi">Data Lake Analytics and Azure App Service within Azure
      Data Factory</span>, and load of data in <span class="bi">Data Lake Storage CSVs which are taken by Power BI for its <span class='webdev'>data representation</span></span>.
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right"> </td>
    <td colspan="2" class="w70">Dec 17 – Oct 18<br>Software developer.<br><span class='webdev'>Development of a geoanalytical BI web service built with R and Javascript, and chatbot development</span> (fully development of a Node.JS chatbot for an insurance company).
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right"> </td>
    <td colspan="2" class="w70">Aug 17 – Nov 17<br><span class="bi">Data mining technician</span> and artificial intelligence training.<br>Development of an artificial vision software in <span class="cloud">Python</span> to classify vehicles.
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right">PrimeX Artificial Intelligence</td>
    <td colspan="2" class="w70">Sep 16 – Sep 18<br>Artificial Intelligence developer for a <span class='webdev'>chatbot</span><br>Java programming, <span class="bi">data mining</span>, and AI training using <span class="cloud">different APIs from IBM Watson Cloud, Amazon Lex</span>, and Instagram, among others.
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right">BABEL Sistemas de Información</td>
    <td colspan="2" class="w70">Jun 17 – Jul 17<br><span class='webdev'>Software development in C# to build chatbots</span>. Enabling connections with IBM Watson and Microsoft LUIS technologies
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right">IBM</td>
    <td colspan="2" class="w70">May 16 – May 17<br>Pre sales and technical consultant of <span class="cloud">IBM Watson</span> for Drug Discovery for Spain, Portugal, Greece and Israel.<br>Use cases leveraging, <span class="bi">data mining</span>, <span class='webdev'>business analyst, and social media manager for the marketing campaign</span>.
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right">Unica Group S.C.A.</td>
    <td colspan="2" class="w70">Apr 15 – May 15<br>Quality control professional for foodstuff products in Cohorsan S.C.A
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td colspan="3" class="colspan4">
      <h2>University degrees</h2>
    </td>
  </tr>
  <tr>
    <td class="bold-right">BSc @ Universidad de Granada</td>
    <td colspan="2">10 – 14<br>Biochemistry with Biotechnology specialization bachelor degree.
    </td>
  </tr>
  <tr>
    <td class="bold-right">MSc @ Universidad de Granada</td>
    <td colspan="2">14 – 15<br>Master of Science in Foodstuffs quality and technology.
    </td>
  </tr>
  <tr>
    <td class="bold-right">MD @ Universidad de Alcalá</td>
    <td colspan="2">16 – 17<br>Master in Professional Development 4.0
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td colspan="3" class="colspan4">
      <h2>Courses, certifications and events</h2>
    </td>
  </tr>
  <tr>
    <td class="bold-right">Microsoft</td>
    <td clospan="2">Feb 21<br><span class='cloid'>Microsoft AI-100</span>.
      Issued by Pearson VUE, Credential ID 990098386.
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right">Red.ES</td>
    <td colspan="2">Dec 20<br><span class='webdev'>HTML5 and CSS3</span>
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right">LinkedIn verified evaluation</td>
    <td colspan="2">Jun 20<br><span class='webdev'>Javascript</span>
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right">LinkedIn verified evaluation</td>
    <td colspan="2">Jun 20<br>Git
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right">LinkedIn verified evaluation</td>
    <td colspan="2">Jun 20<br>Excel
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right">LinkedIn verified evaluation</td>
    <td colspan="2">Jun 20<br><span class="cloud">Python</span>
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right">Event</td>
    <td colspan="2">May 19<br>Amazon Web Services VIP assistant in AWS Summit 19 in Spain
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right">Cognitive Class.AI</td>
    <td colspan="2">Dic 17<br><span class="cloud">Machine Learning with Python</span>
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right">Amazon Web Services</td>
    <td colspan="2">Oct 17<br>AWS Technical Professional Online
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right">IBM</td>
    <td colspan="2">May 16<br>IBM's Watson Academy Courses
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right">Universidad de Alcalá</td>
    <td colspan="2">Abr 16<br>Probability & Statistics
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right">Formación sin Barreras</td>
    <td colspan="2">Nov 15<br><span class='webdev'>Knowledge management for companies</span>
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right">Formación sin Barreras</td>
    <td colspan="2">Sep 15<br>Financial accountability
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td colspan="3" class="colspan4">
      <h2>Languages</h2>
    </td>
  </tr>
  <tr>
    <td class="bold-right">Native Language</td>
    <td colspan="2">Spanish</td>
  </tr>
  <tr>
    <td class="bold-right">High Level</td>
    <td colspan="2">English (B2 cambridge certificate)</td>
  </tr>
  <tr>
    <td class="bold-right">Basic Level</td>
    <td colspan="2">German</td>
  </tr>
  `;
  const legend = `
  <tr><td rowspan="6">Legend</td><td></td>
  <td colspan="7" style="background-color:#B5BD68">web_developer</td></tr>
  <tr><td></td><td colspan="7" style="background-color:#A54242">big_data_engineer</td></tr>
  <tr><td></td><td colspan="7" style="background-color:#CC6666">software_developer</td></tr>
  <tr><td></td><td colspan="7" style="background-color:#F0C674">data_analist_power_bi</td></tr>
  <tr><td></td><td colspan="7" style="background-color:#DE935F">ai_data_scientist</td></tr>
  <tr><td></td><td colspan="7" style="background-color:#81A2BE">technical_consultant</td></tr>
  `;
  return [cvHeader,cvBody,legend];
}