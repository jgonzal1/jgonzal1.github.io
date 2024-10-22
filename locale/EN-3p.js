function getEnglishContents() {
  const skills = `
  <fieldset class="font-size-1-rem border-light-gray"><legend class="category-td">Full-Stack Development</legend>
  API development, CI/CD, Django, Docker, Git, Microservices Architecture, NLP, Node.js, Python, ReactJS, RegEx, REST, Serverless Architecture, Typescript, Web Services Integrations.
  </fieldset>
  <fieldset class="font-size-1-rem border-light-gray"><legend class="category-td">Data Engineering</legend>
  BI, Database Migrations, Database Administration, ElasticSearch, ETL, MySQL, PostgreSQL, SQL, pandas, PL/SQL, DAX, GIS, GraphQL.
  </fieldset>
  <fieldset class="font-size-1-rem border-light-gray"><legend class="category-td">Web Development</legend>
  CSS, D3.JS, Figma, Front-End, Javascript, React Native
  </fieldset>
  <fieldset class="font-size-1-rem border-light-gray"><legend class="category-td">AWS</legend>
  DynamoDB, EC2, Redshift, S3, Athena, Lambda, AWS CLI, boto3, IAM.
  </fieldset>
  <fieldset class="font-size-1-rem border-light-gray"><legend class="category-td">Azure</legend>
  Azure Data Factory, Azure DevOps, Azure Cloud Services, Power BI, Microsoft LUIS.
  </fieldset>
  `;
  const cvHeader = `<tr>
    <td class="w70" style="border-width:0;">
      <h2>Personal Information</h2>
    </td>
    </tr><tr>
    <td style="border-width:0; left:0; min-width:6.5em">
      <img src="public/javier.jpg" alt="Javier González" style="width: 4em; position: absolute;">
      <div style="padding-left:5em">
        <p>Name: Javier González Berenguel</p>
        <p>Email: <a href="mailto:javier.gonzalezberenguel@gmail.com" target="_blank">javier.gonzalezberenguel@gmail.com</a></p>
        <p>Copenhagen, Denmark</p>
      </div>
    </td>
    <td style="border-width:0; min-width: 6.5em">
      <fieldset style="display:none;">
        <legend>📲 (please inform before calling)</legend>
        <span> (+34) 664383902</span>
      </fieldset>
      <div style="font-family:monospace;">
        <legend>Languages</legend>
        English: <span style="color:#F0C674">★★★★★</span><br>
        Spanish: <span style="color:#F0C674">★★★★★</span><br>
        Danish:  <span style="color:#F0C674">★★</span>☆☆☆<br>
        German:  <span style="color:#F0C674">★★</span>☆☆☆<br>
        French:  <span style="color:#F0C674">★★</span>☆☆☆<br>
        <!--Lithuanian: <span style="color:#F0C674">★</span>☆☆☆☆<br>-->
      </div>
    </td>
  </tr>`;
  const cvBody = `<tr>
    <td class="w70">
      <h2>CV Summary</h2>

      <p>
        Technical consultant with expertise in data engineering, full - stack software development,
        business intelligence (BI), and cloud architectures (AWS, Azure, GCP, monday.com, and JSM).
      </p>

      <h2>Professional Experience</h2>

      <p>AETY Aps @Copenhagen, Denmark (21 - 11 – 24 - 11):</p>
      <p>Roles: Full - stack developer, data engineer, and technical consultant for AWS / JSM / Power BI / monday.com.</p>
      <p>Employment Type: Part - time<br><br></p>

      <p>UFST / VURDST @Copenhagen, Denmark (24-03 – 24-07):</p>
      <p>Role: AWS cloud software developer and data engineer.</p>
      <p>Project: ETL Data Engineer for SYS102 architecture, focused on Business Intelligence for Denmark's property tax agency.</p>
      <p>Main tasks: Lambda functions, JSON / XML transformation, AWS Glue ETL.<br><br></p>

      <p>TDC NET @Copenhagen, Denmark (23 -09 – 23 - 12):</p>
      <p>Role: Full - stack developer.</p>
      <p>Project: Smart Build solution, front - end & back - end development for geographical auctioning and AI model API.</p>
      <p>Tech stack: Python, React, Chakra, OpenLayers, Leaflet, Snowflake.<br><br></p>

      <p>Dr.Oetker via AKQA @Copenhagen, Denmark (22 -09 – 23-04):</p>
      <p>Role: Full - stack software developer, data engineer, AWS technical consultant.</p>
      <p>Project: Data automation for public webpage content and governance.<br><br></p>

      <p>Ferrovial @ Spain / Remote (21-05 – 21-10):</p>
      <p>Role: Full-stack developer.</p>
      <p>Project: Developed an application to monitor and send real-time traffic alerts and manage users.</p>
      <p>Technologies: Docker, Kubernetes, Python, JavaScript, SQL, Django, React, GCP Directions API.<br><br></p>

      <p>Ayuntamiento de Valladolid @ Spain / Remote (20-12 – 21-04):</p>
      <p>Role: Data engineer and front-end consultant.</p>
      <p>Project: Full-stack development of personalized reports for a Smart City using Pentaho CDE, PostgreSQL, D3.js, and data filtering for KPIs.</p>
      <p>Main tasks: Technical consulting, front-end development, and KPI reporting for a Smart City initiative.<br><br></p>

      <p>T-Systems Iberia @ Spain / Remote (19-11 – 21-11):</p>
      <p>Role: Full-stack developer, consultant, and Power BI technician.</p>
      <p>Responsibilities: Full-stack development of BI solutions using Docker, Power BI, Python, SQL, and APIs for real-time data management.<br><br></p>

      <p>Redexis Gas @ Madrid, Spain / On-site (19-06 – 19-10):</p>
      <p>Role: Full-stack developer.</p>
      <p>Project: Developed ETL and BI solutions involving data extraction from SAP, Salesforce, and Excel to Amazon S3 using AWS Glue and Redshift for Power BI data visualization.<br><br></p>

      <p>UOC @ Barcelona, Spain / Hybrid (18-11 – 19-05):</p>
      <p>Role: Full-stack developer.</p>
      <p>Project: ETL development using Azure Data Factory, data extraction from Oracle and Google Sheets, and Power BI data representation.<br><br></p>

      <p>Linea Directa Aseguradora @ Madrid, Spain / Hybrid (18-03 – 18-10):</p>
      <p>Role: Full-stack developer.</p>
      <p>Project: Developed a customizable chatbot for an insurance company using JavaScript, Node.js, Python, SQL, and R for real-time communication with customers.<br><br></p>

      <p>USA Frontier Control with Mexico @ EU / Remote (17-08 – 17-11):</p>
      <p>Role: Data mining technician and machine learning engineer.</p>
      <p>Project: Developed artificial vision software using Python to classify vehicles at the USA-Mexico border.</p>
      <p>Technologies: Python (sci-kit-learn, matplotlib), RHEL bash scripting, WinSCP.<br><br></p>

      <p>IBM @ Spain, Portugal, Greece, Israel / Hybrid (16-05 – 17-05):</p>
      <p>Role: Pre-sales and technical consultant for IBM Watson.</p>
      <p>Project: Provided technical consulting for IBM Watson's Drug Discovery program across multiple countries.</p>
      <p>Responsibilities: Data mining, business analysis, and campaign management for AI-driven drug discovery solutions.<br><br></p>

      <p>
        (Additional experiences include multiple other roles spanning from 2016 to 2024 in software development,
        data engineering, cloud computing, and technical consulting across various clients in Europe).
        <br><br>
      </p>

      <h2>Education and certifications</h2>

      <p>BSc Biochemistry (2010 - 2014): Universidad de Granada.</p>
      <p>MSc Foodstuffs Quality and Technology (2014 - 2015): Universidad de Granada.</p>
      <p>Master in Professional Development 4.0 (2016 - 2017): Universidad de Alcalá.<br><br></p>
      <p>AWS Certified Data Analytics – Specialty (22-07).</p>
      <p>AWS Certified Developer – Associate (22-03).</p>
      <p>Microsoft AI - 100 (21-02).</p>
      <p>IBM Watson Academy (16-05).</p>
      <p>Other 50 courses, volunteering experiences and honors</p>
    </td>
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
    '
  `;
  return [cvHeader, cvBody, legend];
}