import {
  additionalCurriculumByYear,
  additionalQualifications,
  additionalSubjects,
} from "./additionalCurriculum.js";

export const subjects = ["Maths", "Science", "English", ...additionalSubjects];
export const examBoards = ["AQA", "Edexcel", "OCR"];
export const tiers = ["Foundation", "Higher"];

export const qualifications = {
  Maths: { AQA: "8300", Edexcel: "1MA1", OCR: "J560" },
  Science: { AQA: "8464", Edexcel: "1SC0", OCR: "J250" },
  English: { AQA: "8700 / 8702", Edexcel: "1EN0 / 1ET0", OCR: "J351 / J352" },
  ...additionalQualifications,
};

const topic = (id, unit, title, goal, outcomes, options = {}) => ({
  id,
  unit,
  title,
  goal,
  outcomes,
  ...options,
});

const gcse = (id, unit, title, goal, outcomes, applicableTiers = tiers) =>
  topic(id, unit, title, goal, outcomes, { examBoards, tiers: applicableTiers });

// DfE specifies KS3 content for the key stage as a whole. Years 7-9 are our
// recommended sequence and can be adjusted to match an individual school.
const coreCurriculumByYear = {
  7: {
    stage: "KS3",
    subjects: {
      Maths: [
        topic("y7-maths-number", "Number", "Integers and Place Value", "Build fluency with integers, decimals, factors, multiples, and directed number.", ["Order integers and decimals", "Use factors and multiples", "Calculate with negative numbers"]),
        topic("y7-maths-fractions", "Number", "Fractions, Decimals and Percentages", "Move confidently between common numerical representations.", ["Simplify and compare fractions", "Convert fractions, decimals and percentages", "Find fractions and percentages of amounts"]),
        topic("y7-maths-algebra", "Algebra", "Expressions and Equations", "Represent and solve simple relationships with algebra.", ["Collect like terms", "Substitute into expressions", "Solve one-step equations"]),
        topic("y7-maths-geometry", "Geometry", "Angles and 2D Shape", "Reason with angle facts and properties of polygons.", ["Use angle facts", "Classify polygons", "Calculate perimeter and area"]),
        topic("y7-maths-ratio", "Ratio and Proportion", "Ratio, Scale and Rates", "Use multiplicative reasoning to compare quantities and solve scale problems.", ["Write and simplify ratios", "Use unitary methods", "Interpret simple rates"]),
        topic("y7-maths-coordinates", "Geometry", "Coordinates and Transformations", "Describe positions and transformations accurately on coordinate grids.", ["Plot in four quadrants", "Reflect and rotate shapes", "Describe translations"]),
      ],
      Science: [
        topic("y7-science-cells", "Biology", "Cells and Organisation", "Connect cell structures to their functions in living organisms.", ["Compare plant and animal cells", "Explain specialised cells", "Link cells, tissues and organs"]),
        topic("y7-science-particles", "Chemistry", "Particles and States", "Use the particle model to explain states and changes of state.", ["Describe particle arrangements", "Explain changes of state", "Interpret diffusion"]),
        topic("y7-science-forces", "Physics", "Forces and Motion", "Describe forces and use speed to explain simple motion.", ["Identify types of force", "Calculate speed", "Interpret distance-time graphs"]),
        topic("y7-science-enquiry", "Working Scientifically", "Planning Investigations", "Plan fair tests and communicate reliable evidence.", ["Identify variables", "Choose suitable measurements", "Present results clearly"]),
        topic("y7-science-reproduction", "Biology", "Reproduction and Variation", "Explain human and plant reproduction and variation within species.", ["Describe reproductive processes", "Explain fertilisation", "Distinguish inherited and environmental variation"]),
        topic("y7-science-acids", "Chemistry", "Acids, Alkalis and Separation", "Use indicators and separation methods to investigate mixtures.", ["Use the pH scale", "Explain neutralisation", "Choose separation techniques"]),
      ],
      English: [
        topic("y7-english-fiction", "Reading", "Fiction: Character and Setting", "Support interpretations of fiction with precise textual evidence.", ["Retrieve and infer", "Select useful quotations", "Explain language choices"]),
        topic("y7-english-nonfiction", "Reading", "Non-fiction Viewpoints", "Identify purpose, audience, and viewpoint in non-fiction.", ["Recognise purpose and audience", "Summarise key ideas", "Identify persuasive methods"]),
        topic("y7-english-narrative", "Writing", "Narrative Craft", "Shape an engaging short narrative with deliberate structure and detail.", ["Plan a clear sequence", "Use sensory description", "Control sentences and paragraphs"]),
        topic("y7-english-speaking", "Spoken English", "Discussion and Presentation", "Express and justify ideas clearly for an audience.", ["Organise a presentation", "Use Standard English", "Respond constructively to questions"]),
        topic("y7-english-poetry", "Literature", "Poetry and Figurative Language", "Explore how poets create voice, imagery, and sound.", ["Recognise figurative language", "Comment on sound patterns", "Support an interpretation"]),
        topic("y7-english-vocabulary", "Language", "Vocabulary and Grammar", "Use increasingly precise vocabulary and secure sentence grammar.", ["Use context to infer meaning", "Recognise word classes", "Edit sentence boundaries"]),
      ],
    },
  },
  8: {
    stage: "KS3",
    subjects: {
      Maths: [
        topic("y8-maths-ratio", "Ratio and Proportion", "Ratio and Proportion", "Use multiplicative reasoning in recipes, scale, rates, and proportion.", ["Simplify and share ratios", "Use scale factors", "Solve proportion problems"]),
        topic("y8-maths-linear", "Algebra", "Linear Relationships", "Connect sequences, equations, tables, and straight-line graphs.", ["Find nth terms", "Solve two-step equations", "Plot linear graphs"]),
        topic("y8-maths-measures", "Geometry", "Area, Volume and Constructions", "Apply formulae and construct accurate geometric figures.", ["Calculate compound areas", "Find prism volumes", "Use ruler and compass constructions"]),
        topic("y8-maths-data", "Statistics", "Data and Averages", "Represent data and compare distributions using suitable measures.", ["Choose appropriate charts", "Calculate averages and range", "Compare data sets"]),
        topic("y8-maths-percentages", "Number", "Percentages and Financial Maths", "Use percentage change and proportional reasoning in financial contexts.", ["Calculate percentage change", "Use multipliers", "Solve profit, loss and interest problems"]),
        topic("y8-maths-transformations", "Geometry", "Transformations and Congruence", "Describe and combine geometric transformations.", ["Reflect and rotate accurately", "Translate with vectors", "Recognise congruent shapes"]),
      ],
      Science: [
        topic("y8-science-systems", "Biology", "Body Systems", "Explain how organ systems support movement, gas exchange, and digestion.", ["Describe digestion", "Explain gas exchange", "Link muscles and skeleton"]),
        topic("y8-science-reactions", "Chemistry", "Atoms and Chemical Reactions", "Represent elements, compounds, and common reactions.", ["Distinguish atoms and compounds", "Write word equations", "Use conservation of mass"]),
        topic("y8-science-energy", "Physics", "Energy Transfers", "Track energy stores and pathways through physical systems.", ["Identify energy stores", "Describe transfer pathways", "Calculate simple energy changes"]),
        topic("y8-science-ecosystems", "Biology", "Ecosystems", "Explain feeding relationships and interdependence in ecosystems.", ["Construct food webs", "Explain competition", "Describe environmental change"]),
        topic("y8-science-periodic", "Chemistry", "Periodic Table and Materials", "Relate elements, groups, and material properties to atomic patterns.", ["Use symbols and formulae", "Describe group patterns", "Compare metals and non-metals"]),
        topic("y8-science-waves", "Physics", "Sound and Light Waves", "Use wave models to explain sound, light, reflection, and refraction.", ["Describe wave properties", "Explain reflection and refraction", "Relate frequency to pitch and colour"]),
      ],
      English: [
        topic("y8-english-shakespeare", "Literature", "Shakespeare and Drama", "Analyse character, theme, and dramatic method in a Shakespeare play.", ["Track a character", "Analyse dramatic methods", "Explore interpretations"]),
        topic("y8-english-poetry", "Literature", "Poetry: Voice and Form", "Compare how poets use language, structure, and form.", ["Identify poetic methods", "Explain effects of form", "Build a comparison"]),
        topic("y8-english-argument", "Writing", "Argument and Persuasion", "Craft convincing arguments for different audiences.", ["Develop a viewpoint", "Use rhetorical methods", "Structure an argument"]),
        topic("y8-english-accuracy", "Language", "Grammar, Punctuation and Style", "Control sentences and punctuation for clarity and effect.", ["Vary sentence structures", "Use punctuation deliberately", "Edit for accuracy"]),
        topic("y8-english-novel", "Literature", "The Novel and Context", "Explore how a novel's context, narration, and structure shape meaning.", ["Analyse narrative viewpoint", "Track themes", "Use context to illuminate the text"]),
        topic("y8-english-comparison", "Reading", "Comparing Texts", "Make purposeful comparisons between writers' ideas and methods.", ["Select comparison points", "Compare evidence", "Connect methods to viewpoints"]),
      ],
    },
  },
  9: {
    stage: "KS3",
    subjects: {
      Maths: [
        topic("y9-maths-powers", "Number", "Powers, Roots and Standard Form", "Use index notation and standard form in complex calculations.", ["Apply index laws", "Estimate roots", "Calculate with standard form"]),
        topic("y9-maths-quadratics", "Algebra", "Quadratic Foundations", "Expand, factorise, and interpret simple quadratic expressions.", ["Expand double brackets", "Factorise quadratics", "Recognise quadratic graphs"]),
        topic("y9-maths-pythagoras", "Geometry", "Pythagoras and Trigonometry", "Solve right-angled triangle problems.", ["Apply Pythagoras' theorem", "Use trigonometric ratios", "Select an appropriate method"]),
        topic("y9-maths-probability", "Probability", "Combined Events", "Model combined events and interpret experimental probability.", ["Use sample spaces", "Draw probability trees", "Compare theoretical and experimental results"]),
        topic("y9-maths-equations", "Algebra", "Equations and Inequalities", "Form and solve multi-step equations and inequalities.", ["Solve equations with unknowns on both sides", "Represent inequalities", "Form equations from contexts"]),
        topic("y9-maths-statistics", "Statistics", "Statistical Enquiry", "Design a statistical enquiry and interpret multivariate evidence.", ["Choose a sampling method", "Construct suitable diagrams", "Distinguish correlation from causation"]),
      ],
      Science: [
        topic("y9-science-genetics", "Biology", "Genetics and Evolution", "Connect DNA, inheritance, variation, and natural selection.", ["Describe genes and chromosomes", "Explain inherited variation", "Outline natural selection"]),
        topic("y9-science-periodic", "Chemistry", "Periodic Table and Reactivity", "Use atomic structure and periodic patterns to explain behaviour.", ["Describe atomic structure", "Use group patterns", "Predict reactivity"]),
        topic("y9-science-electricity", "Physics", "Electricity and Magnetism", "Model current, potential difference, resistance, and magnetism.", ["Build circuit diagrams", "Explain current and voltage", "Describe electromagnets"]),
        topic("y9-science-climate", "Earth Science", "Earth, Atmosphere and Climate", "Use evidence to explain Earth's resources and changing climate.", ["Describe the carbon cycle", "Interpret climate evidence", "Evaluate resource use"]),
        topic("y9-science-bioenergetics", "Biology", "Photosynthesis and Respiration", "Connect cellular energy processes to organisms and ecosystems.", ["Write word equations", "Explain limiting factors", "Compare aerobic and anaerobic respiration"]),
        topic("y9-science-pressure", "Physics", "Pressure and Moments", "Apply force models to turning effects and pressure in fluids and solids.", ["Calculate moments", "Calculate pressure", "Explain floating and sinking"]),
      ],
      English: [
        topic("y9-english-novel", "Literature", "The 19th-century Novel", "Analyse character and theme within historical context.", ["Use context carefully", "Analyse narrative methods", "Develop a critical argument"]),
        topic("y9-english-comparison", "Reading", "Comparing Writers' Viewpoints", "Compare ideas and methods across challenging texts.", ["Summarise across texts", "Compare viewpoints", "Evaluate methods"]),
        topic("y9-english-essay", "Writing", "Analytical Essay Writing", "Build a coherent literary argument using evidence and analysis.", ["Form a thesis", "Embed concise evidence", "Link analysis across paragraphs"]),
        topic("y9-english-speech", "Spoken English", "Speech and Debate", "Present a sustained position and respond to challenge.", ["Research a position", "Use rhetoric deliberately", "Answer questions confidently"]),
        topic("y9-english-drama", "Literature", "Modern Drama", "Analyse how playwrights present conflict, relationships, and social ideas.", ["Analyse stagecraft", "Track dramatic tension", "Evaluate interpretations"]),
        topic("y9-english-transactional", "Writing", "Transactional Writing", "Write precise non-fiction for real audiences and purposes.", ["Match form to purpose", "Control register", "Organise ideas coherently"]),
      ],
    },
  },
  10: {
    stage: "KS4",
    subjects: {
      Maths: [
        gcse("y10-maths-number", "Number", "Accuracy, Bounds and Standard Form", "Apply numerical methods accurately in GCSE contexts.", ["Use standard form", "Calculate error intervals", "Apply bounds"]),
        gcse("y10-maths-algebra", "Algebra", "Equations and Quadratics", "Manipulate expressions and solve equations.", ["Rearrange formulae", "Solve simultaneous equations", "Solve quadratics"]),
        gcse("y10-maths-geometry", "Geometry", "Similarity and Trigonometry", "Use similarity and trigonometry in geometric problems.", ["Prove similarity", "Use trigonometric ratios", "Solve bearings problems"]),
        gcse("y10-maths-statistics", "Statistics", "Sampling and Distributions", "Interpret samples and compare distributions.", ["Evaluate sampling", "Compare distributions", "Interpret scatter graphs"]),
        gcse("y10-maths-ratio", "Ratio and Proportion", "Ratio, Rates and Growth", "Solve ratio, compound-measure, and growth problems.", ["Use compound units", "Solve direct proportion", "Apply repeated percentage change"]),
        gcse("y10-maths-graphs", "Algebra", "Sequences and Linear Graphs", "Connect sequences, equations, and straight-line graphs.", ["Generate sequence rules", "Find gradients and intercepts", "Interpret real-life graphs"]),
        gcse("y10-maths-probability", "Probability", "Probability Models", "Use diagrams and relative frequency to model combined events.", ["Use set notation", "Construct tree diagrams", "Estimate outcomes from experiments"]),
        gcse("y10-maths-mensuration", "Geometry", "Mensuration and Measures", "Calculate with compound shapes, circles, prisms, and units.", ["Use circle formulae", "Calculate surface area and volume", "Convert compound units"]),
        gcse("y10-maths-constructions", "Geometry", "Constructions and Loci", "Construct geometric figures and solve locus problems accurately.", ["Use ruler and compass", "Construct loci", "Interpret plans and elevations"]),
      ],
      Science: [
        gcse("y10-science-cell-biology", "Biology", "Cell Biology and Organisation", "Apply cell and transport models to organs and disease.", ["Use microscopy calculations", "Explain membrane transport", "Link tissues to organs"]),
        gcse("y10-science-atomic", "Chemistry", "Atomic Structure and Bonding", "Use models of atoms and bonding to explain properties.", ["Explain electronic structure", "Compare bonding", "Link structure and properties"]),
        gcse("y10-science-energy", "Physics", "Energy and Electricity", "Calculate energy transfers and analyse circuits.", ["Use energy equations", "Calculate electrical power", "Analyse circuits"]),
        gcse("y10-science-practicals", "Working Scientifically", "Required Practical Skills", "Plan, analyse, and evaluate GCSE investigations.", ["Identify variables", "Process data", "Evaluate uncertainty"]),
        gcse("y10-science-bioenergetics", "Biology", "Bioenergetics", "Explain photosynthesis, respiration, and responses to exercise.", ["Use photosynthesis equations", "Interpret limiting factors", "Compare respiration pathways"]),
        gcse("y10-science-infection", "Biology", "Infection and Response", "Explain communicable disease, defence, and medicine development.", ["Compare pathogen types", "Explain immune responses", "Evaluate drugs and vaccination"]),
        gcse("y10-science-chemical-changes", "Chemistry", "Chemical and Energy Changes", "Predict reactions and represent energy transfer in chemistry.", ["Use the reactivity series", "Explain electrolysis", "Interpret reaction profiles"]),
        gcse("y10-science-particles", "Physics", "Particle Model and Atomic Structure", "Use particle and atomic models in quantitative problems.", ["Calculate density", "Explain changes of state", "Describe radioactive decay"]),
        gcse("y10-science-earth", "Chemistry", "Earth, Atmosphere and Resources", "Explain atmospheric change and evaluate resource use.", ["Describe atmospheric evolution", "Explain greenhouse effects", "Evaluate life-cycle assessments"]),
      ],
      English: [
        gcse("y10-english-lang-reading", "English Language", "Fiction Reading", "Analyse and evaluate language and structural choices.", ["Interpret implicit ideas", "Analyse methods", "Evaluate with evidence"]),
        gcse("y10-english-lang-writing", "English Language", "Creative Writing", "Craft controlled descriptive or narrative writing.", ["Shape structure", "Use ambitious vocabulary", "Control accuracy"]),
        gcse("y10-english-shakespeare", "English Literature", "Shakespeare", "Develop an exam-ready argument about a Shakespeare play.", ["Use extract and whole text", "Analyse dramatic methods", "Integrate context"]),
        gcse("y10-english-century", "English Literature", "The 19th-century Novel", "Analyse a 19th-century novel as a coherent whole.", ["Track themes", "Analyse methods", "Use context to illuminate meaning"]),
        gcse("y10-english-nonfiction", "English Language", "Non-fiction Reading", "Analyse information, viewpoints, and methods in non-fiction.", ["Distinguish explicit and implicit ideas", "Summarise information", "Analyse persuasive methods"]),
        gcse("y10-english-transactional", "English Language", "Transactional Writing", "Write effective articles, letters, speeches, and essays.", ["Adapt tone to audience", "Structure an argument", "Use rhetoric accurately"]),
        gcse("y10-english-poetry", "English Literature", "Poetry Anthology", "Build comparative interpretations of studied poems.", ["Analyse language and form", "Compare themes", "Use contextual knowledge precisely"]),
        gcse("y10-english-modern", "English Literature", "Modern Prose or Drama", "Analyse ideas and methods in a modern set text.", ["Track character and theme", "Analyse structure", "Develop an evidence-led argument"]),
        gcse("y10-english-spoken", "Spoken Language", "Presentation and Response", "Plan and deliver a formal presentation with effective responses.", ["Organise a presentation", "Adapt delivery", "Answer audience questions"]),
      ],
    },
  },
  11: {
    stage: "KS4",
    subjects: {
      Maths: [
        gcse("y11-maths-proportion", "Ratio and Proportion", "Direct and Inverse Proportion", "Model proportional relationships algebraically and graphically.", ["Form proportion equations", "Interpret rates", "Solve growth and decay"]),
        gcse("y11-maths-graphs", "Algebra", "Functions and Graphs", "Interpret and transform linear, quadratic, and other graphs.", ["Solve graphically", "Interpret gradients", "Transform functions"], ["Higher"]),
        gcse("y11-maths-circle", "Geometry", "Circle Theorems and Vectors", "Construct multi-step geometric arguments and proofs.", ["Apply circle theorems", "Use vector notation", "Build a proof"], ["Higher"]),
        gcse("y11-maths-foundation", "Consolidation", "Foundation Problem Solving", "Connect core domains in multi-step problems.", ["Select efficient methods", "Show complete working", "Check solutions"], ["Foundation"]),
        gcse("y11-maths-found-number", "Number", "Foundation Number Mastery", "Consolidate calculations, fractions, percentages, bounds, and standard form.", ["Calculate accurately", "Use percentage multipliers", "Apply estimation and bounds"], ["Foundation"]),
        gcse("y11-maths-found-algebra", "Algebra", "Foundation Algebra and Graphs", "Solve equations and interpret sequences and graphs at Foundation tier.", ["Solve linear equations", "Generate sequence rules", "Interpret linear and quadratic graphs"], ["Foundation"]),
        gcse("y11-maths-found-geometry", "Geometry", "Foundation Geometry and Measures", "Apply angle, area, volume, Pythagoras, and trigonometry methods.", ["Use angle facts", "Calculate area and volume", "Solve right-angled triangles"], ["Foundation"]),
        gcse("y11-maths-found-probability", "Probability", "Foundation Probability", "Calculate probabilities for single and combined events.", ["Use probability scales", "Complete sample spaces", "Use tree diagrams"] , ["Foundation"]),
        gcse("y11-maths-found-statistics", "Statistics", "Foundation Statistics", "Represent, interpret, and compare data in GCSE contexts.", ["Choose statistical diagrams", "Calculate averages", "Interpret scatter graphs"], ["Foundation"]),
        gcse("y11-maths-found-ratio", "Ratio and Proportion", "Foundation Ratio and Rates", "Solve ratio, proportion, scale, and compound-measure problems.", ["Share in a ratio", "Use direct proportion", "Calculate speed and density"], ["Foundation"]),
        gcse("y11-maths-number", "Number", "Surds and Exact Calculation", "Manipulate exact values and advanced index forms.", ["Simplify surds", "Rationalise denominators", "Use fractional indices"], ["Higher"]),
        gcse("y11-maths-algebra", "Algebra", "Advanced Algebra", "Solve complex algebraic relationships and reason with functions.", ["Complete the square", "Solve quadratic inequalities", "Use iteration"], ["Higher"]),
        gcse("y11-maths-probability", "Probability", "Conditional Probability", "Represent and calculate dependent and conditional events.", ["Use tree diagrams", "Interpret Venn diagrams", "Calculate conditional probabilities"], ["Higher"]),
        gcse("y11-maths-statistics", "Statistics", "Histograms and Cumulative Frequency", "Interpret grouped continuous data and compare distributions.", ["Use frequency density", "Interpret cumulative frequency", "Compare box plots"], ["Higher"]),
        gcse("y11-maths-nonright", "Geometry", "Non-right-angled Trigonometry", "Solve general triangles using advanced trigonometry.", ["Apply sine and cosine rules", "Use triangle area formula", "Solve 3D problems"], ["Higher"]),
      ],
      Science: [
        gcse("y11-science-bioenergetics", "Biology", "Bioenergetics and Homeostasis", "Explain biological control and energy transfer.", ["Compare respiration and photosynthesis", "Explain control systems", "Interpret data"]),
        gcse("y11-science-rates", "Chemistry", "Rates, Equilibrium and Organic Chemistry", "Explain how conditions affect chemical systems.", ["Calculate reaction rates", "Apply collision theory", "Predict equilibrium changes"]),
        gcse("y11-science-waves", "Physics", "Forces, Waves and Electromagnetism", "Use models and equations to solve physical problems.", ["Analyse forces", "Use wave equations", "Explain electromagnetism"]),
        gcse("y11-science-ecology", "Biology", "Ecology and Human Impact", "Analyse ecosystems, biodiversity, and human impacts.", ["Interpret abundance data", "Explain material cycles", "Evaluate strategies"]),
        gcse("y11-science-inheritance", "Biology", "Inheritance, Variation and Evolution", "Use genetic models and evidence to explain inheritance and evolution.", ["Use genetic diagrams", "Explain variation", "Evaluate selective breeding and engineering"]),
        gcse("y11-science-quantitative", "Chemistry", "Quantitative Chemistry", "Calculate chemical quantities and interpret yields and concentrations.", ["Use relative formula mass", "Calculate moles", "Evaluate atom economy"]),
        gcse("y11-science-analysis", "Chemistry", "Chemical Analysis and Using Resources", "Identify substances and evaluate sustainable chemical processes.", ["Interpret chromatography", "Use gas tests", "Explain potable water treatment"]),
        gcse("y11-science-atomic", "Physics", "Atomic Physics", "Explain nuclear radiation, half-life, and associated risks.", ["Balance nuclear equations", "Interpret half-life", "Evaluate radiation uses"]),
        gcse("y11-science-space", "Physics", "Space Physics", "Explain stellar evolution, orbital motion, and cosmological evidence.", ["Describe star life cycles", "Explain stable orbits", "Interpret red-shift"], ["Higher"]),
      ],
      English: [
        gcse("y11-english-lang-nonfiction", "English Language", "Non-fiction Reading and Comparison", "Compare viewpoints and methods across unseen texts.", ["Synthesise information", "Compare perspectives", "Evaluate methods"]),
        gcse("y11-english-lang-transactional", "English Language", "Transactional Writing", "Write convincing non-fiction for audience and purpose.", ["Adopt a clear register", "Organise an argument", "Use rhetoric accurately"]),
        gcse("y11-english-modern", "English Literature", "Modern Text", "Develop a critical response to modern prose or drama.", ["Build an argument", "Analyse methods", "Connect context"]),
        gcse("y11-english-poetry", "English Literature", "Anthology and Unseen Poetry", "Compare poems and analyse unseen poetry independently.", ["Select comparison points", "Analyse form", "Respond to unseen poems"]),
        gcse("y11-english-fiction", "English Language", "Fiction Reading Mastery", "Sustain analysis and evaluation across an unseen fiction extract.", ["Synthesise inferences", "Analyse structure across a text", "Evaluate critically"]),
        gcse("y11-english-creative", "English Language", "Creative Writing Mastery", "Produce an assured narrative or description under timed conditions.", ["Plan efficiently", "Control whole-text structure", "Proofread accurately"]),
        gcse("y11-english-shakespeare", "English Literature", "Shakespeare Revision", "Connect extract analysis to a whole-play argument.", ["Recall precise references", "Analyse dramatic methods", "Evaluate interpretations"]),
        gcse("y11-english-century", "English Literature", "19th-century Novel Revision", "Sustain a conceptual argument across a whole novel.", ["Select whole-text evidence", "Analyse language and structure", "Integrate context"]),
        gcse("y11-english-unseen", "English Literature", "Unseen Poetry", "Analyse and compare unfamiliar poems independently.", ["Form an interpretation", "Analyse methods", "Build a concise comparison"]),
      ],
    },
  },
};

export const curriculumByYear = Object.fromEntries(
  Object.entries(coreCurriculumByYear).map(([year, plan]) => [
    year,
    {
      ...plan,
      subjects: {
        ...plan.subjects,
        ...additionalCurriculumByYear[year].subjects,
      },
    },
  ])
);

export const curriculum = Object.entries(curriculumByYear).flatMap(([year, plan]) =>
  Object.entries(plan.subjects).flatMap(([subject, entries]) =>
    entries.map((entry) => ({
      ...entry,
      year: Number(year),
      years: [Number(year)],
      stage: plan.stage,
      subject,
      exam: Number(year) >= 10 ? "GCSE" : `Year ${year}`,
      examBoards: entry.examBoards ?? [],
      tiers: entry.tiers ?? [],
    }))
  )
);

export function topicsFor({ year, subject, examBoard, tier }) {
  return curriculum.filter((entry) => {
    if (entry.year !== Number(year) || entry.subject !== subject) return false;
    if (entry.stage !== "KS4") return true;
    const boardMatch = !examBoard || entry.examBoards.includes(examBoard);
    const tierMatch = !["Maths", "Science"].includes(subject) || !tier || entry.tiers.includes(tier);
    return boardMatch && tierMatch;
  });
}
