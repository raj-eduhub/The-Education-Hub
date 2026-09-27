export const additionalSubjects = ["History", "Geography", "Computing", "Design & Technology"];

export const additionalQualifications = {
  History: { AQA: "8145", Edexcel: "1HI0" },
  Geography: { AQA: "8035", Edexcel: "1GB0" },
  Computing: { AQA: "8525", Edexcel: "1CP2" },
  "Design & Technology": { AQA: "8552", Edexcel: "1DT0" },
};

// Kept in step with examBoards in curriculumCatalog.js.
const boards = ["AQA", "Edexcel"];
const slug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const buildTopics = (year, subject, entries, gcse = false) =>
  entries.map(([unit, title, goal, outcomes]) => ({
    id: `y${year}-${slug(subject)}-${slug(title)}`,
    unit,
    title,
    goal,
    outcomes,
    ...(gcse ? { examBoards: boards, tiers: [] } : {}),
  }));

const h = {
  7: [
    ["Medieval Britain", "Norman Conquest", "Explain how conquest changed power, land, and society after 1066.", ["Use chronology accurately", "Compare claimants and causes", "Evaluate evidence about Norman control"]],
    ["Medieval Britain", "Church, Crown and Society", "Explore the relationship between belief, monarchy, and everyday medieval life.", ["Explain the Church's influence", "Analyse conflicts over authority", "Describe social hierarchy"]],
    ["Medieval Britain", "Crisis and Change", "Assess the effects of the Black Death and the Peasants' Revolt.", ["Explain cause and consequence", "Compare social experiences", "Judge the extent of change"]],
    ["Early Britain", "Britain Before 1066", "Place the Normans in a longer story of Roman, Anglo-Saxon and Viking Britain.", ["Sequence Roman, Anglo-Saxon and Viking Britain", "Explain how successive settlers changed Britain", "Explain why 1066 is treated as a turning point"]],
    ["Medieval World", "The Crusades and the Islamic World", "Study the medieval Islamic world on its own terms, and the wars that connected it to Europe.", ["Explain the rise and spread of Islam", "Explain the causes and course of the Crusades", "Compare Christian and Muslim accounts of the same events"]],
    ["Historical Enquiry", "Local History Investigation", "Construct an evidence-led account of change in the local area.", ["Frame an enquiry question", "Interrogate primary sources", "Reach a supported conclusion"]],
  ],
  8: [
    ["Early Modern Britain", "Tudors and Reformation", "Explain religious and political change under the Tudors.", ["Trace religious change", "Analyse motives of rulers", "Assess effects on communities"]],
    ["Early Modern Britain", "Stuarts and Civil War", "Evaluate why monarchy and Parliament went to war.", ["Explain long- and short-term causes", "Compare contemporary viewpoints", "Assess consequences of conflict"]],
    ["Empire and Slavery", "Transatlantic Slavery and Empire", "Examine how empire and slavery developed, were resisted, and were abolished.", ["Describe the triangular trade", "Centre enslaved people's experiences", "Evaluate abolition explanations"]],
    ["Ideas and Reform", "The Age of Enlightenment", "Follow the argument that reason and evidence, not authority, should decide what is true.", ["Explain what Enlightenment thinkers argued", "Link new science to new political ideas", "Assess the influence of those ideas on revolution and reform"]],
    ["Industrial Britain", "Industrial Revolution and Reform", "Assess how industrialisation transformed work, cities, and political rights.", ["Explain industrial growth", "Compare living conditions", "Judge the impact of reform"]],
  ],
  9: [
    ["Conflict", "First World War and Peace", "Explain the causes, experiences, and consequences of the First World War.", ["Prioritise causes", "Use diverse testimony", "Evaluate the peace settlement"]],
    ["Interwar World", "Democracy and Dictatorship", "Analyse why dictatorships grew in interwar Europe.", ["Explain political instability", "Analyse propaganda", "Compare interpretations"]],
    ["Second World War", "War and the Holocaust", "Understand the Second World War and the Holocaust through rigorous historical evidence.", ["Explain the escalation of persecution", "Use survivor testimony responsibly", "Challenge myths and denial"]],
    ["Modern Britain", "Post-war Britain and Decolonisation", "Assess social change, migration, and the end of empire since 1945.", ["Explain decolonisation", "Explore migration experiences", "Evaluate continuity and change"]],
  ],
  10: [
    ["Thematic Study", "Change Across Time", "Trace a board-selected theme across an extended period.", ["Establish chronological frameworks", "Explain turning points", "Compare rates of change"]],
    ["British Depth Study", "British Society in Depth", "Analyse a board-selected period of British history in depth.", ["Use precise contextual knowledge", "Explain cause and consequence", "Reach substantiated judgements"]],
    ["Period Study", "International Period Study", "Understand a board-selected period beyond Britain.", ["Connect developments", "Analyse significance", "Write focused explanations"]],
    ["Evidence", "Historical Sources", "Evaluate source utility in relation to a specific enquiry.", ["Analyse provenance and content", "Apply contextual knowledge", "Reach a balanced utility judgement"]],
    ["Interpretations", "Historical Interpretations", "Explain and evaluate differences between historical interpretations.", ["Identify interpretation arguments", "Explain differences", "Evaluate using contextual knowledge"]],
    ["Ancient World (Wider Reading)", "Greece and Persia", "Wider reading: why a scattering of Greek cities held off the largest empire on earth.", ["Describe the Persian empire at its height", "Explain the causes of the Persian Wars", "Assess why the Greek cities succeeded"]],
    ["Ancient World (Wider Reading)", "Alexander the Great", "Wider reading: how one reign redrew the map from Greece to the Indus, and what it cost.", ["Describe Alexander's campaigns", "Explain how he governed what he conquered", "Assess competing verdicts on his reign"]],
    ["Historic Environment", "Site and Context", "Connect a studied historic site to its wider period.", ["Read visual and material evidence", "Explain site development", "Apply knowledge to unfamiliar evidence"]],
  ],
  11: [
    ["Wider World Depth", "Conflict and Tension", "Analyse a board-selected wider-world depth study.", ["Sequence key developments", "Explain causation", "Assess historical significance"]],
    ["British Depth Study", "Power and Society", "Consolidate a board-selected British depth study.", ["Recall precise evidence", "Connect factors", "Sustain an analytical judgement"]],
    ["Thematic Study", "Patterns of Change", "Compare developments and turning points across the thematic study.", ["Identify patterns", "Evaluate turning points", "Use breadth and depth together"]],
    ["Exam Practice", "Source Enquiry Mastery", "Answer source questions accurately under timed conditions.", ["Decode question demands", "Select contextual evidence", "Evaluate sources concisely"]],
    ["Exam Practice", "Interpretation and Essay Mastery", "Build convincing interpretation responses and extended essays.", ["Plan a line of argument", "Integrate evidence", "Reach reasoned conclusions"]],
    ["Ancient World (Wider Reading)", "Rome and its Neighbours", "Wider reading: how a single city came to govern the Mediterranean, and how it held it.", ["Explain how Rome expanded across Italy", "Describe how Rome treated those it defeated", "Assess the reasons for Roman military success"]],
    ["Ancient World (Wider Reading)", "Hannibal and the Second Punic War", "Wider reading: the war Rome nearly lost, and the general who almost won it.", ["Explain the causes of the Second Punic War", "Describe Hannibal's campaign in Italy", "Assess why Carthage lost despite winning battles"]],
    ["Revision", "Chronology and Connections", "Connect the specification's studies into secure chronological frameworks.", ["Build retrieval timelines", "Link causes and consequences", "Diagnose knowledge gaps"]],
  ],
};

const g = {
  7: [
    ["Geographical Skills", "Maps, Atlas and GIS", "Use maps and geospatial data to investigate places.", ["Use grid references and scale", "Interpret thematic maps", "Create a simple GIS enquiry"]],
    ["UK Landscapes", "Britain's Physical Landscapes", "Explain how geology and processes shape UK landscapes.", ["Locate major regions", "Read relief maps", "Explain landscape formation"]],
    ["Weather and Climate", "UK Weather and Climate", "Interpret weather data and explain Britain's variable climate.", ["Measure weather", "Read climate graphs", "Explain air-mass effects"]],
    ["Tectonics", "Earthquakes and Volcanoes", "Explain tectonic hazards and how risk varies between places.", ["Describe plate movement", "Interpret hazard evidence", "Compare responses"]],
    ["Physical Processes", "Geology, Rocks and Weathering", "Read a landscape back to the rock beneath it, and the weather working on that rock.", ["Compare igneous, sedimentary and metamorphic rocks", "Explain physical, chemical and biological weathering", "Explain how underlying geology shapes a landscape"]],
    ["Place Knowledge", "West Africa: A Regional Study", "Study the human and physical geography of a region within Africa.", ["Locate West Africa and describe its physical geography", "Explain the climate of the Sahel and the rainforest belt", "Describe how people make a living in the region", "Compare a rural and an urban place in West Africa", "Explain how trade links the region to the wider world", "Challenge single stories told about Africa"]],
  ],
  8: [
    ["Physical Processes", "Rivers and Coasts", "Explain how erosion, transport, and deposition create landforms.", ["Sequence physical processes", "Interpret landform diagrams", "Evaluate management choices"]],
    ["Ecosystems", "Global Ecosystems", "Explore interactions in contrasting ecosystems and threats to biodiversity.", ["Explain nutrient cycles", "Compare adaptations", "Evaluate sustainable management"]],
    ["Human Geography", "Population and Urbanisation", "Analyse population change and rapid urban growth.", ["Interpret population data", "Explain migration", "Compare urban opportunities and challenges"]],
    ["Development", "Development and Globalisation", "Evaluate how development and global connections vary between places.", ["Use development indicators", "Explain global supply chains", "Assess strategies for change"]],
    ["Place Knowledge", "South Asia: A Regional Study", "Study the human and physical geography of a region within Asia, and how people earn a living.", ["Locate South Asia and describe its physical geography", "Explain the monsoon and its effect on life", "Compare economic activity in the primary, secondary, tertiary and quaternary sectors", "Explain why cities in the region are growing", "Describe links between South Asia and the UK", "Evaluate the uneven benefits of economic growth"]],
  ],
  9: [
    ["Climate", "Climate Change", "Evaluate evidence, causes, impacts, and responses to climate change.", ["Interpret climate evidence", "Explain human and natural drivers", "Compare mitigation and adaptation"]],
    ["Resources", "Water, Food and Energy", "Investigate unequal resource security and sustainable management.", ["Map resource inequality", "Explain changing demand", "Evaluate management options"]],
    ["Hazards", "Weather Hazards", "Explain extreme weather and how vulnerability shapes impacts.", ["Interpret storm data", "Compare contrasting events", "Evaluate risk reduction"]],
    ["Fieldwork", "Geographical Enquiry", "Complete a fieldwork cycle using primary and secondary data.", ["Design a question", "Collect and present data", "Evaluate methods and conclusions"]],
  ],
  10: [
    ["Physical Geography", "Natural Hazards", "Explain tectonic and weather hazards and evaluate risk management.", ["Use hazard models", "Compare named examples", "Evaluate responses"]],
    ["Physical Geography", "The Living World", "Analyse ecosystems, biodiversity, and management in contrasting biomes.", ["Explain ecosystem links", "Apply named examples", "Assess sustainable management"]],
    ["UK Physical Landscapes", "Coasts and Rivers", "Apply process knowledge to UK coastal and river landscapes.", ["Explain landform sequences", "Interpret maps and photos", "Evaluate management strategies"]],
    ["UK Physical Landscapes", "Glaciated Upland Landscapes", "Explain how ice carved the uplands, and who uses them now.", ["Explain glacial erosion, transport and deposition", "Identify corries, aretes and U-shaped valleys", "Evaluate competing land uses in a glaciated upland"]],
    ["Human Geography", "Urban Issues and Challenges", "Compare urban change in contrasting economic contexts.", ["Explain urban growth", "Use place-specific evidence", "Evaluate regeneration and sustainability"]],
    ["Human Geography", "The Changing Economic World", "Explain uneven development and changing economic futures.", ["Interpret development measures", "Analyse global connections", "Evaluate development strategies"]],
    ["Geographical Skills", "Cartography, Data and GIS", "Apply quantitative, map, and GIS skills across GCSE contexts.", ["Calculate and graph accurately", "Interpret unfamiliar maps", "Draw evidence-led conclusions"]],
  ],
  11: [
    ["Resources", "Resource Management", "Evaluate challenges and strategies for food, water, and energy security.", ["Explain demand and supply", "Use named examples", "Assess sustainable options"]],
    ["Fieldwork", "Physical Fieldwork", "Apply the enquiry process to a physical geography investigation.", ["Justify sampling", "Present field data", "Evaluate reliability"]],
    ["Fieldwork", "Human Fieldwork", "Apply the enquiry process to a human geography investigation.", ["Design data collection", "Analyse spatial patterns", "Evaluate conclusions"]],
    ["Issue Evaluation", "Decision-making Exercise", "Use a resource booklet to evaluate a contemporary geographical issue.", ["Synthesise sources", "Identify stakeholders", "Justify a decision"]],
    ["Synoptic Geography", "People, Place and Environment", "Connect physical and human processes across the specification.", ["Recognise interdependence", "Transfer concepts", "Build synoptic explanations"]],
    ["Revision", "Case Studies and Exam Skills", "Deploy precise place evidence and command-word techniques under timed conditions.", ["Retrieve named examples", "Plan extended answers", "Evaluate with a clear judgement"]],
  ],
};

const c = {
  7: [
    ["Computational Thinking", "Algorithms and Decomposition", "Break problems into precise, testable algorithms.", ["Decompose a problem", "Write pseudocode", "Trace an algorithm"]],
    ["Programming", "Programming Foundations", "Create programs using sequence, selection, iteration, and variables.", ["Use variables and input", "Apply selection", "Build count-controlled loops"]],
    ["Data", "Binary and Data Representation", "Explain how computers represent numbers, text, and images.", ["Convert small binary values", "Explain character encoding", "Relate pixels to image size"]],
    ["Networks", "Networks and Digital Safety", "Explain network communication and make safe, responsible choices online.", ["Identify network hardware", "Describe packet transfer", "Protect personal data"]],
  ],
  8: [
    ["Programming", "Modular Programs", "Design readable programs using procedures and structured data.", ["Define procedures", "Use lists", "Test and debug systematically"]],
    ["Computer Systems", "Hardware and Software", "Explain how processors, memory, storage, and software work together.", ["Describe the fetch-execute cycle", "Compare storage types", "Distinguish system and application software"]],
    ["Data", "Databases and Data Modelling", "Organise, query, and validate structured data.", ["Design fields and records", "Use queries", "Validate data quality"]],
    ["Cybersecurity", "Threats and Defences", "Analyse common cyber threats and layered protections.", ["Recognise attack methods", "Explain encryption and authentication", "Recommend proportionate controls"]],
  ],
  9: [
    ["Programming", "Programming Project", "Plan, implement, test, and refine a substantial program.", ["Analyse requirements", "Use modular design", "Document testing and improvements"]],
    ["Logic", "Logic Gates and Truth Tables", "Connect Boolean expressions, truth tables, and logic gates.", ["Evaluate Boolean expressions", "Complete truth tables", "Design simple logic circuits"]],
    ["Web and Data", "Web Technologies and Data", "Create data-driven web content and explain internet protocols.", ["Structure accessible pages", "Explain client-server requests", "Process data responsibly"]],
    ["Artificial Intelligence", "Artificial Intelligence and Machine Learning", "Understand what a model learns from data, and what it cannot.", ["Explain what machine learning is", "Describe how a model is trained on data", "Explain why training data can make a model biased"]],
    ["Programming", "Programming Languages and Paradigms", "Compare how different languages express the same solution, and the tools used to write them.", ["Compare high-level and low-level languages", "Compare procedural and object-oriented approaches", "Explain the purpose and features of an IDE"]],
    ["Impacts", "Ethics, Law and the Environment", "Evaluate impacts of digital technology on people and society.", ["Apply legal principles", "Discuss algorithmic bias", "Evaluate environmental costs"]],
  ],
  10: [
    ["Algorithms", "Algorithms and Efficiency", "Design, trace, and compare algorithms for computational problems.", ["Use searching and sorting", "Trace pseudocode", "Compare algorithm efficiency"]],
    ["Programming", "Programming Techniques", "Write robust programs using core constructs and data structures.", ["Use selection and iteration", "Manipulate arrays and strings", "Create reusable subprograms"]],
    ["Data", "Data Representation", "Calculate how numbers, text, images, and sound are represented.", ["Convert binary and hexadecimal", "Calculate file sizes", "Explain compression"]],
    ["Computer Systems", "Architecture and Storage", "Explain processor architecture, memory, storage, and embedded systems.", ["Describe CPU components", "Explain performance factors", "Compare storage technologies"]],
    ["Networks", "Networks, Protocols and Security", "Explain network operation and assess cybersecurity threats.", ["Compare network topologies", "Explain protocols and layers", "Recommend security controls"]],
    ["Programming", "Testing and Defensive Design", "Develop reliable programs with systematic validation and testing.", ["Choose test data", "Use validation and authentication", "Diagnose logic and syntax errors"]],
  ],
  11: [
    ["Data", "Databases and SQL", "Model relational data and construct accurate database queries.", ["Identify keys and relationships", "Write SQL queries", "Explain data validation"]],
    ["Logic and Languages", "Boolean Logic and Translators", "Apply Boolean logic and explain how source code becomes executable.", ["Simplify logic expressions", "Complete truth tables", "Compare compilers and interpreters"]],
    ["Programming", "Problem-solving Mastery", "Solve unfamiliar programming problems under assessment conditions.", ["Decompose requirements", "Implement robust solutions", "Evaluate maintainability"]],
    ["Systems Software", "Operating Systems and Utilities", "Explain how operating systems manage hardware and users.", ["Explain memory and process management", "Describe user interfaces", "Evaluate utility software"]],
    ["Impacts", "Ethical, Legal and Environmental Impacts", "Evaluate consequences of computing technologies using balanced evidence.", ["Apply relevant legislation", "Analyse privacy and bias", "Reach justified conclusions"]],
    ["Revision", "Computational Thinking and Exam Skills", "Integrate theory and programming knowledge in timed responses.", ["Trace code accurately", "Use technical vocabulary", "Plan extended responses"]],
  ],
};

const d = {
  7: [
    ["Design", "User Needs and Iterative Design", "Develop ideas from a clear understanding of users and contexts.", ["Research user needs", "Write a design brief", "Iterate from feedback"]],
    ["Materials", "Materials, Tools and Safety", "Select and work safely with common material categories.", ["Compare material properties", "Choose suitable tools", "Follow workshop safety"]],
    ["Communication", "Technical Drawing and CAD", "Communicate design ideas accurately by hand and with CAD.", ["Use orthographic drawing", "Add dimensions", "Create a simple CAD model"]],
    ["Food and Nutrition", "Food Hygiene and Healthy Eating", "Prepare food safely, and understand what a balanced diet is actually made of.", ["Apply food hygiene and safety rules", "Use a knife and a heat source safely", "Explain how the main nutrient groups are balanced in a diet"]],
    ["Structures", "Forces and Structures", "Design structures that manage loads efficiently.", ["Identify forces", "Use triangulation", "Test structural performance"]],
  ],
  8: [
    ["Mechanisms", "Motion and Mechanisms", "Use mechanisms to control movement and mechanical advantage.", ["Compare motion types", "Calculate simple ratios", "Prototype a mechanism"]],
    ["Electronics", "Electronic Systems", "Build and test input-process-output electronic systems.", ["Recognise components", "Read circuit diagrams", "Test system behaviour"]],
    ["Materials", "Textiles and Modern Materials", "Select processes for textiles, composites, and smart materials.", ["Compare material properties", "Join and finish accurately", "Evaluate material innovation"]],
    ["Food and Nutrition", "Cooking Skills and Food Provenance", "Cook a repertoire of savoury dishes, and find out where the ingredients came from.", ["Use a range of cooking techniques", "Explain where food is grown, reared and caught", "Evaluate the welfare and environmental cost of an ingredient"]],
    ["Manufacture", "Sustainable CAD/CAM", "Use digital manufacture while considering environmental impact.", ["Prepare a CAD model", "Explain CAM processes", "Complete a life-cycle analysis"]],
  ],
  9: [
    ["Systems", "Programmable Control", "Create a product using sensors, control logic, and outputs.", ["Select sensors", "Program control logic", "Test an interactive prototype"]],
    ["Manufacture", "Precision Manufacture", "Plan and execute accurate manufacture with quality control.", ["Write a manufacturing plan", "Use tolerances", "Apply quality checks"]],
    ["Design", "Inclusive and User-centred Design", "Design responsibly for diverse users and real constraints.", ["Create a user profile", "Apply ergonomic data", "Evaluate accessibility"]],
    ["Evaluation", "Product Analysis and Improvement", "Analyse existing products and justify evidence-led improvements.", ["Disassemble a product", "Evaluate function and manufacture", "Propose justified improvements"]],
  ],
  10: [
    ["Core Principles", "Materials and Their Properties", "Apply material properties to design and manufacturing decisions.", ["Classify material families", "Explain property selection", "Choose stock forms"]],
    ["Core Principles", "Energy, Systems and Mechanisms", "Explain energy sources, mechanisms, and electronic systems in products.", ["Analyse mechanical systems", "Interpret block diagrams", "Evaluate energy choices"]],
    ["Core Principles", "New and Emerging Technologies", "Understand what drives a product to market, and what automation does to how it is made.", ["Distinguish technology push from market pull", "Explain planned obsolescence and designing for repair", "Describe how automation and robotics changed manufacturing"]],
    ["Design Practice", "Investigation and Design Brief", "Investigate a contextual challenge and define a justified design direction.", ["Identify user needs", "Analyse existing products", "Write measurable specifications"]],
    ["Design Practice", "Generating and Developing Ideas", "Develop creative, feasible ideas through modelling and iteration.", ["Generate varied concepts", "Use CAD and physical models", "Respond to user feedback"]],
    ["Manufacture", "Processes and Quality", "Select accurate manufacturing processes and quality controls.", ["Plan production", "Justify process choices", "Apply tolerances and quality checks"]],
    ["Sustainability", "People, Society and Environment", "Evaluate ethical, social, and environmental design decisions.", ["Apply life-cycle thinking", "Consider inclusive design", "Evaluate responsible innovation"]],
  ],
  11: [
    ["NEA", "Prototype Manufacture", "Manufacture a high-quality prototype that responds to the specification.", ["Follow a production plan", "Use specialist tools safely", "Record quality control"]],
    ["NEA", "Testing and Evaluation", "Test a prototype with users and justify meaningful refinements.", ["Design measurable tests", "Gather user feedback", "Evaluate against the specification"]],
    ["Technical Principles", "Materials, Processes and Manufacture", "Consolidate material, process, and production-system knowledge.", ["Compare manufacturing scales", "Select processes", "Explain material treatments"]],
    ["Technical Principles", "Mechanisms, Electronics and Control", "Solve technical problems involving mechanical and electronic systems.", ["Calculate mechanical advantage", "Analyse circuits", "Explain programmable control"]],
    ["Design Maths", "Quantitative Design Skills", "Apply measurement, ratio, geometry, and statistics to design decisions.", ["Calculate area and volume", "Use ratios and tolerances", "Interpret performance data"]],
    ["Revision", "Design Decisions and Exam Practice", "Apply technical knowledge to unfamiliar products and extended responses.", ["Analyse a product", "Sketch communicated solutions", "Justify design decisions"]],
  ],
};

export const additionalCurriculumByYear = Object.fromEntries(
  [7, 8, 9, 10, 11].map((year) => [
    year,
    {
      stage: year < 10 ? "KS3" : "KS4",
      subjects: {
        History: buildTopics(year, "History", h[year], year >= 10),
        Geography: buildTopics(year, "Geography", g[year], year >= 10),
        Computing: buildTopics(year, "Computing", c[year], year >= 10),
        "Design & Technology": buildTopics(year, "Design & Technology", d[year], year >= 10),
      },
    },
  ])
);
