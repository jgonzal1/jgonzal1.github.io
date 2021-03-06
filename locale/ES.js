function getSpanishContents() {
  const cvHeader = `
  <tr>
    <td colspan="3">
      <h2>Información personal</h2>
    </td>
  </tr>
  <tr>
    <td>
      <fieldset>
        <legend>🧔</legend>
        Javier González Berenguel
      </fieldset>
      <fieldset style="display:none;">
        <legend>📲</legend>
        <span style="-webkit-text-security: disc;">(+34) 664383902</span>
      </fieldset>
      <fieldset>
        <legend>🚩</legend>
        Spanish
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
        <a href="https://earth.google.com/web/@40.49444407,-3.71094332,690.23662493a,128.75462389d,35y,156.09990579h,74.89180972t,0r" target="_blank">
          Calle la Masó, 14
        </a>
      </fieldset>
      <fieldset>
        <legend>🗺</legend>
        28034, Madrid (Madrid), Spain
      </fieldset>
    </td>
    <td class="centered">
      <fieldset>
        <legend>📸</legend>
        <img src="200522_me.jpg" alt="Javier González">
      </fieldset>
    </td>
  </tr>
  <tr>
    <td colspan="3">
      <h2>Resumen del CV</h2>
    </td>
  </tr>
  <tr>
    <td class="bold-right">
      <h3>Sobre mí</h3>
    </td>
    <td colspan="2">
      <p>
        <b>Consultor técnico senior</b> de <b>tecnologías en la nube</b> y <b>desarrollo de <i>software</i></b> en procesos <b><i>ETLs</i></b>, <span class="highlight-yellow"><b>inteligencia de negocio</b></span>, <span class="webdev highlight-red"><b>desarrollo web</b></span> y procesamiento del lenguaje natural (NLP).
      </p>
      <p>
        Experiencia destacada en estas tecnologías en la nube: <span class="highlight-orange"><b>Amazon Web Services</b></span> (3+ años de experiencia),
      </p>
      <p>
        <span class="highlight-blue"><b>Azure</b></span> (3 años de experiencia) e <span class="highlight-gray"><b>IBM</b></span> (1 año de experiencia en la compañía).
      </p>
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right">
      <h3>
        Tecnologías
      </h3>
    </td>
    <td colspan="2">
      <p>
        <span class="highlight-orange">AWS EC2</span>, <span class="highlight-orange">Amazon Code Commit</span> (git), <span class="highlight-red">Python</span> (boto3, pyspark, numpy,</p>
      <p>
        pandas, scikit-learn...), <span class="highlight-orange">Amazon Redshift</span> (SQL), <span class="highlight-orange">AWS Glue</span> (pyspark),</p>
      <p>
        <span class="webdev highlight-red">Expresiones regulares</span> (avanzado), <span class="highlight-blue">Excel</span> (avanzado), <span class="highlight-yellow">Power BI</span> (funciones</p>
      <p>
        DAX, R), <span class="webdev highlight-red">JavaScript</span> (experiencia en desarrollo <i>full stack</i> con React, Angular, jQuery, Leaflet,</p>
      <p>
        BootStrap, D3.JS, Ionic, Node.JS, Three.JS, ESLint y TypeScript), <span class="webdev highlight-red">CSS</span></p>
      <p>
        (BootStrap, LeafLet, AwesomeFonts), <span class="webdev highlight-red">HTML</span> (estructuras complejas y manejadores</p>
      <p>
        DOM), <span class="highlight-blue">Azure Data Lake Analytics</span> (U-SQL, C#), <span class="highlight-blue">Azure Data Factory</span></p>
      <p>
        (ETLs), <span class="highlight-gray">IBM Watson</span> (soluciones de IA), <span class="webdev highlight-blue">Azure App Service</span>, <span class="highlight-blue">Microsoft LUIS</span>.</p>
    </td>
  </tr>
  <tr>
    <td colspan="3">
      <h2>Experiencia Profesional</h2>
    </td>
  </tr>
  `;
  const cvBody = `
  <tr>
    <td class="bold-right">T-Systems Iberia<br>(Noviembre de 19 – Presente)</td>
    <td colspan="2" class="w70">Diciembre de 2020 – Presente<br>
    Consultor técnico de <span class='webdev'>desarrollo full-stack</span> en informes sobre <span class='webdev'>Pentaho CDE</span> para un proyecto de <i>Smart Cities</i><br>
    Consultor técnico con un rol orientado a la implementación de pruebas de concepto de desarrollo full-stack de informes personalizados sobre Pentaho CDE, con <span class='webdev'><i>ctools</i></span>, orígenes de datos en PostgreSQL, <span class='webdev'>Raphaël.JS</span>, D3.JS, diagramas Sankey, diagramas de red, nubes de puntos, mapas geográficos con Leaflet y desarrollo de planes de pruebas para diferentes entornos productivos.
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right"> </td>
    <td colspan="2" class="w70">Octubre 2020 - Diciembre 2020<br>Consultor técnico de Power BI<br>
    <span class='webdev'>Implementación de cuadros de mando corporativos</span> para T-Systems, para el seguimiento de las dedicaciones e imputaciones de los empleados, su planificación, etc.
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right"> </td>
    <td colspan="2" class="w70">Septiembre 2020 – Octubre 2020<br>Desarrollador y consultor de <i>software</i><br>
    Desarrollador y consultor de <i>software</i> para implementar un traductor automático multi-idioma para una administración pública autonómica
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right"> </td>
    <td colspan="2" class="w70">Junio 2020 - Septiembre 2020<br>Consultor y técnico de Power BI<br>
    <span class='webdev'>Implementación de cuadros de mando para la monitorización de serrvicios a clientes</span> para T-Systems sobre exportaciones de Azure Log Analytics.
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right"> </td>
    <td colspan="2" class="w70">Mayo 2020 - Junio 2020<br>Desarrollador y consultor de <i>software</i><br>
    Desarrollador y consultor de <i>software</i> para implementar un traductor automático multi-idioma para una administración pública autonómica
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right"> </td>
    <td colspan="2" class="w70">Marzo 2020 – Abril 2020<br>Técnico de <i>Big Data</i><br>Técnico de Big Data en la implementación de un entorno de científicos de datos para la mayor empresa aseguradora de España, mediante el uso de tecnologías <i>cloud</i> con Python, AWS Lambda, AWS Step Functions, AWS S3, AWS Athena y AWS IAM.
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right"> </td>
    <td colspan="2" class="w70">Diciembre 2019 – Febrero 2020<br>Consultor técnico de arquitecturas <i>cloud</i> y <i>big data</i> para una <i>Smart City</i><br>Consultor técnico para la implementación de pruebas de concepto de <span class='webdev'>desarrollos front-end</span>, conectores python, manejo de <span class='webdev'>APIs</span> de terceros, soluciones <i>big data</i> (<span class='webdev'>Elasticsearch</span>, BERT, <span class='webdev'>Kibana</span>), funciones Lambda de AWS, interconectividad y <i>dockerización</i> de componentes para una solución de <i>Smart City</i>.
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right"> </td>
    <td colspan="2" class="w70">Diciembre 2019 – Enero 2020<br><span class='webdev'>Desarrollador full-stack de un chatbot</span><br>Desarrollo full-stack de un chatbot desde cero para un <span class='webdev'><i>front-end</i> web sin servidor</span> usando llamadas <span class='webdev'>AJAX</span> a Microsoft L.U.I.S.,
      <span class='webdev'> CSS3, HTML5 y desarrollo nativo de JavaScript</span>.
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right"> </td>
    <td colspan="2" class="w70">Noviembre 2019 - Diciembre 2019<br>Consultor técnico de Azure y Power BI<br>Desarrollador de <span class='webdev'>cuadros de mando</span> en Power BI y sus ETLs para un entorno de monitorización de Azure Log Analytics para una gran empresa inmobiliaria.
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right">Informática El Corte Inglés</td>
    <td colspan="2" class="w70">(Junio 2018 – Octubre 2019)<br>Desarrollo, arquitectura y habilitación técnica de un  proyecto de ETLs y BI que extrae datos de ficheros desde  diferentes orígenes (SAP, Salesforce, Excels) a ​buckets de Amazon S3, los procesa con ​Amazon Glue, y los vuelca en     tablas de ​Amazon Redshift que son presentados mediante Power BI.
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right"> </td>
    <td colspan="2" class="w70">Nov 18 – Feb 19<br>Desarrollo y arquitectura de un ​proyecto de ETLs que extrae datos de una ​base de datos Oracle y hojas de cálculo de ​Google Sheets​, los procesa con ​Data Lake Analytics y ​Azure Data Factory​
    ,y los vuelca en archivos en Data Lake Storage que son presentados mediante ​Power BI.
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right"> </td>
    <td colspan="2" class="w70">Dic 17 – Oct 18<br>Desarrollador de software​. Desarrollo de una solución geoanalítica de BI en un servicio web con R y desarrollo de ​chatbots, en especial un chatbot en Node.JS en el contexto de una aseguradora médica.
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right"> </td>
    <td colspan="2" class="w70">Ago 17 – Nov 17<br>
    Técnico en minería de datos y entrenamiento de  inteligencia artificial​. Desarrollo de una  inteligencia artificial de visión artificial para diferenciar diferentes tipos de vehículos.
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right">PrimeX Artificial Intelligence</td>
    <td colspan="2" class="w70">Sep 16 – Sep 18<br>
    Desarrollador de Inteligencia Artificial en un chatbot​.
    Programación en Java, minería de datos, entrenamiento  de Inteligencia Artificial con diferentes APIs de IBM Watson Cloud y Amazon Lex.
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right">BABEL Sistemas de Información</td>
    <td colspan="2" class="w70">Jun 17 – Jul 17<br>Programación en C# para implementar chatbots​.
    Conexión de los mismos con tecnologías de IBM Watson y Microsoft Luis.
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right">IBM</td>
    <td colspan="2" class="w70">May 16 – May 17<br>
    El ​consultor y técnico de preventa de IBM Watson for Drug Discovery ​para cuatro países (España, Portugal, Grecia e Israel). Desarrollo de casos de uso, minería de datos, analítica de negocio, gestión de campaña de comunicación de Watson Health.</span>.
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right">Unica Group S.C.A.</td>
    <td colspan="2" class="w70">Abr 15 – May 15<br>Control de calidad​ de productos en Cohorsan S.C.A
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td colspan="3" class="colspan4">
      <h2>Grados y másteres universitarios</h2>
    </td>
  </tr>
  <tr>
    <td class="bold-right">Universidad de Granada</td>
    <td colspan="2">10 – 14<br>Graduado en Bioquímica y Biología Molecular. Especialización en ​Biotecnología​.
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right">Máster, Universidad de Granada</td>
    <td colspan="2">14 – 15<br>Máster en Calidad y ​Tecnología Alimentaria
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right">Máster. Universidad de Alcalá</td>
    <td colspan="2">16 – 17<br>Master in Professional Development 4.0
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td colspan="3" class="colspan4">
      <h2>Cursos, certificaciones y eventos</h2>
    </td>
  </tr>
  <tr>
    <td class="bold-right">Red.ES</td>
    <td colspan="2">Dec 20<br><span class='webdev'>HTML5 y CSS3</span>
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
    <td colspan="2">Jun 20<br>Python
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
    <td colspan="2">Dic 17<br>Machine Learning with Python
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
    <td colspan="2">Nov 15<br><span class='webdev'>Gestión del conocimiento en las empresas privadas</span>
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td class="bold-right">Formación sin Barreras</td>
    <td colspan="2">Sep 15<br>Contabilidad financiera
    </td>
  </tr>
  <tr>
    <td colspan="3"><br></td>
  </tr>
  <tr>
    <td colspan="3" class="colspan4">
      <h2>Idiomas</h2>
    </td>
  </tr>
  <tr>
    <td class="bold-right">Lengua nativa</td>
    <td colspan="2">Español</td>
  </tr>
  <tr>
    <td class="bold-right">Nivel alto</td>
    <td colspan="2">Inglés (B2 cambridge certificate)</td>
  </tr>
  <tr>
    <td class="bold-right">Nivel básico</td>
    <td colspan="2">Alemán</td>
  </tr>
  `;
  const legend = `
  <tr><td rowspan="6">Leyenda</td><td></td>
  <td colspan="7" style="background-color:#B5BD68">Desarrollador web</td></tr>
  <tr><td></td><td colspan="7" style="background-color:#A54242">Ingeniero Big Data</td></tr>
  <tr><td></td><td colspan="7" style="background-color:#CC6666">Desarrollador de Software</td></tr>
  <tr><td></td><td colspan="7" style="background-color:#F0C674">Analista de datos / cuadros de mando Power BI</td></tr>
  <tr><td></td><td colspan="7" style="background-color:#DE935F">Científico de datos e Inteligencia Artificial</td></tr>
  <tr><td></td><td colspan="7" style="background-color:#81A2BE">Consultor técnico</td></tr>
  `;
  return [cvHeader,cvBody, legend];
}