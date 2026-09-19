// Authored science explanations, one per catalogue topic.
//
// Pitched at the stated year group and, at KS4, at AQA Combined Science
// Trilogy (8464) demand: no separate-science-only or A-level material, and no
// quantitative treatments the specification does not ask for.
export const scienceContent = {
  // ---- Year 7 ------------------------------------------------------------
  "y7-science-cells": {
    explanation:
      "All living things are made of cells. Animal cells have a nucleus controlling the cell, cytoplasm where reactions happen, a cell membrane controlling what enters and leaves, and mitochondria releasing energy. Plant cells have all of those plus a cell wall for support, a permanent vacuole holding sap, and chloroplasts containing the chlorophyll that traps light. Cells become specialised for a job, so a red blood cell loses its nucleus to carry more oxygen and a root hair cell has a long extension to absorb water, and cells of one type group into tissues, tissues into organs, and organs into organ systems.",
    keyIdeas: [
      "Nucleus controls the cell; mitochondria release energy from respiration.",
      "Plant cells add a cell wall, vacuole and chloroplasts.",
      "Specialised cells have shapes that suit their function.",
      "Cells to tissues to organs to organ systems to organism.",
    ],
    formulae: [],
  },
  "y7-science-particles": {
    explanation:
      "The particle model explains matter as tiny particles in constant motion. In a solid they are packed in a fixed arrangement and only vibrate, so a solid holds its shape; in a liquid they touch but can slide past each other, so a liquid flows and takes the shape of its container; in a gas they are far apart and move quickly in all directions, so a gas fills the space available. Heating gives particles more energy, so they move faster and eventually break free of their neighbours, which is what melting and boiling are. Diffusion is the spreading of particles from where they are more concentrated to where they are less, and it happens faster in gases and at higher temperatures.",
    keyIdeas: [
      "Solid, liquid and gas differ in particle arrangement and movement, not in the particles.",
      "Heating increases particle energy and movement.",
      "Melting, boiling, freezing and condensing are changes of state, not new substances.",
      "Diffusion spreads particles from high to low concentration.",
    ],
    formulae: [],
  },
  "y7-science-forces": {
    explanation:
      "A force is a push or a pull, measured in newtons, and it can change an object's speed, direction or shape. Contact forces such as friction and air resistance act when surfaces touch; non-contact forces such as gravity and magnetism act at a distance. When the forces on an object are balanced its motion does not change, and when they are unbalanced it speeds up, slows down or changes direction. Speed is the distance travelled in a given time, and on a distance-time graph a steeper line means a greater speed while a horizontal line means the object is stationary.",
    keyIdeas: [
      "Forces are measured in newtons and can change speed, direction or shape.",
      "Balanced forces mean no change in motion.",
      "Speed is distance divided by time.",
      "On a distance-time graph, gradient is speed and a flat line means stopped.",
    ],
    formulae: ["Speed $= \\frac{\\text{distance}}{\\text{time}}$ (m/s)"],
  },
  "y7-science-enquiry": {
    explanation:
      "A fair test changes one thing and keeps everything else the same, so any difference in the results can be blamed on the one change. The variable you change is the independent variable, the one you measure is the dependent variable, and everything held constant is a control variable. Choosing the right measuring instrument and taking repeat readings improves the quality of the evidence, and an anomalous result is one that does not fit the pattern and should be identified rather than quietly ignored. Results belong in a table with headings and units, and then in a graph that shows the relationship.",
    keyIdeas: [
      "Change one variable, measure one, control the rest.",
      "Repeat readings and take a mean to reduce the effect of random error.",
      "Identify anomalies rather than hiding them.",
      "Tables and graphs need headings, units and sensible scales.",
    ],
    formulae: ["Mean $= \\frac{\\text{total of repeats}}{\\text{number of repeats}}$"],
  },
  "y7-science-reproduction": {
    explanation:
      "Sexual reproduction joins a male gamete and a female gamete, and in humans fertilisation is the fusion of a sperm nucleus with an egg nucleus to form a zygote, which divides to become an embryo and implants in the uterus lining. Flowering plants follow the same principle: pollen carries the male gamete to the stigma, a pollen tube grows to the ovule, and fertilisation produces a seed. Because offspring get half their genetic information from each parent they are similar to, but not identical to, either. Variation that is inherited is passed on in genes; variation caused by surroundings, such as a plant grown in poor light, is not.",
    keyIdeas: [
      "Fertilisation is the fusion of two gamete nuclei.",
      "Pollination moves pollen; fertilisation happens later, at the ovule.",
      "Offspring inherit half their genes from each parent.",
      "Environmental variation is not passed on to offspring.",
    ],
    formulae: [],
  },
  "y7-science-acids": {
    explanation:
      "The pH scale runs from 0 to 14: below 7 is acidic, 7 is neutral, and above 7 is alkaline. Universal indicator gives a colour for each pH, while litmus only distinguishes acid from alkali. Neutralisation is the reaction of an acid with a base or alkali to make a salt and water, which is why indigestion tablets relieve excess stomach acid. Mixtures can be separated by physical means chosen to match the difference between the components: filtration for an insoluble solid, evaporation or crystallisation for a dissolved solid, distillation when the liquid itself is wanted, and chromatography to separate dissolved substances.",
    keyIdeas: [
      "pH below 7 is acidic, 7 neutral, above 7 alkaline.",
      "Acid + alkali gives salt + water.",
      "Filtration separates an insoluble solid; evaporation recovers a dissolved one.",
      "Distillation keeps the liquid; chromatography separates dissolved substances.",
    ],
    formulae: ["acid + alkali $\\rightarrow$ salt + water", "acid + metal carbonate $\\rightarrow$ salt + water + carbon dioxide"],
  },

  // ---- Year 8 ------------------------------------------------------------
  "y8-science-systems": {
    explanation:
      "Digestion breaks large insoluble food molecules into small soluble ones that can be absorbed into the blood. Enzymes in the mouth, stomach and small intestine speed this up, and the small intestine is adapted for absorption with a huge surface area of villi. Gas exchange happens in the alveoli of the lungs, whose thin walls, large surface area and rich blood supply let oxygen diffuse into the blood and carbon dioxide diffuse out. Movement comes from muscles pulling on bones across joints, and because a muscle can only pull, muscles work in antagonistic pairs such as the biceps and triceps.",
    keyIdeas: [
      "Digestion makes food molecules small and soluble enough to absorb.",
      "Villi give the small intestine a large surface area.",
      "Alveoli are thin, numerous and well supplied with blood.",
      "Muscles pull but cannot push, so they work in antagonistic pairs.",
    ],
    formulae: [],
  },
  "y8-science-reactions": {
    explanation:
      "An element contains only one type of atom, a compound contains different atoms chemically bonded in fixed proportions, and a mixture contains substances that are not bonded and can be separated physically. In a chemical reaction the atoms are rearranged, not created or destroyed, which is why the total mass of the products equals the total mass of the reactants. A word equation names the reactants on the left and the products on the right, with an arrow showing the direction of change. Common reaction types include combustion, thermal decomposition, and the reaction of acids with metals.",
    keyIdeas: [
      "Compounds are bonded in fixed proportions; mixtures are not bonded.",
      "Atoms are rearranged in a reaction, never created or destroyed.",
      "Total mass of reactants equals total mass of products.",
      "Reactants go on the left of the arrow, products on the right.",
    ],
    formulae: ["magnesium + oxygen $\\rightarrow$ magnesium oxide", "metal + acid $\\rightarrow$ salt + hydrogen"],
  },
  "y8-science-energy": {
    explanation:
      "Energy is stored in a number of ways: kinetic in moving objects, gravitational potential in raised objects, chemical in fuels and food, elastic in stretched springs, and thermal in hot objects. Energy is not used up; it is transferred between stores by pathways such as heating, mechanical work, electrical work and radiation. In any real transfer some energy is dissipated to the surroundings, usually by heating, so it becomes spread out and less useful even though the total is unchanged. Efficiency compares the useful energy transferred with the total supplied, and insulation and lubrication reduce the wasteful transfers.",
    keyIdeas: [
      "Energy is stored, then transferred by a pathway; it is never used up.",
      "The total energy before and after a transfer is the same.",
      "Dissipated energy is still there but spread out and less useful.",
      "Efficiency is useful energy out divided by total energy in.",
    ],
    formulae: ["Efficiency $= \\frac{\\text{useful energy transferred}}{\\text{total energy supplied}}$"],
  },
  "y8-science-ecosystems": {
    explanation:
      "A food chain shows the transfer of energy from a producer, which makes its own food by photosynthesis, along to consumers; the arrows point in the direction the energy travels. A food web joins the chains in a habitat and shows that most organisms have several food sources, which is why removing one species affects many others. Organisms compete for the resources in short supply: plants for light, water and minerals, animals for food, territory and mates. A change in the environment, such as pollution or a new predator, changes the numbers of every population connected to it.",
    keyIdeas: [
      "Arrows in a food chain show the direction energy travels.",
      "Producers make their own food by photosynthesis.",
      "Competition is for whichever resource is in short supply.",
      "A change to one population affects the ones connected to it.",
    ],
    formulae: [],
  },
  "y8-science-periodic": {
    explanation:
      "Elements are arranged in the periodic table by atomic number, with groups running down and periods across. Elements in the same group have similar chemical properties because they have the same number of electrons in their outer shell: group 1 metals are soft and reactive, group 7 halogens are coloured non-metals, and group 0 noble gases are unreactive because their outer shell is full. Metals are typically shiny, dense, malleable and good conductors; non-metals are typically dull, brittle when solid, and poor conductors. Chemical formulae use symbols and numbers to say exactly how many atoms of each element a compound contains.",
    keyIdeas: [
      "Groups run down, periods run across; group number relates to outer electrons.",
      "Group 1 reactivity increases down the group; group 7 decreases.",
      "Noble gases are unreactive because their outer shell is full.",
      "A formula gives the number of atoms of each element.",
    ],
    formulae: ["$\\mathrm{H_{2}O}$: two hydrogen atoms and one oxygen atom", "$\\mathrm{CO_{2}}$: one carbon and two oxygen atoms"],
  },
  "y8-science-waves": {
    explanation:
      "Waves transfer energy without transferring matter. Sound is a longitudinal wave that needs a medium, so it cannot travel through a vacuum, and its frequency determines pitch while its amplitude determines loudness. Light is a transverse wave that travels through a vacuum at a far higher speed, which is why lightning is seen before thunder is heard. Light reflects from a mirror with the angle of incidence equal to the angle of reflection, and refracts, changing direction, when it passes between materials of different density.",
    keyIdeas: [
      "Waves transfer energy, not matter.",
      "Sound needs a medium; light does not.",
      "Higher frequency means higher pitch; larger amplitude means louder.",
      "Angle of incidence equals angle of reflection.",
    ],
    formulae: ["Wave speed $=$ frequency $\\times$ wavelength"],
  },

  // ---- Year 9 ------------------------------------------------------------
  "y9-science-genetics": {
    explanation:
      "DNA is a long molecule held in the chromosomes of the nucleus, and a gene is a section of DNA coding for a particular protein. Humans have 23 pairs of chromosomes, one of each pair from each parent, which is the source of inherited variation. Natural selection follows from variation: individuals whose characteristics suit the environment are more likely to survive, reproduce and pass those characteristics on, so over many generations the population changes. Evidence for evolution comes from fossils, from the anatomy of related species, and from observable examples such as antibiotic resistance in bacteria.",
    keyIdeas: [
      "A gene is a section of DNA coding for a protein.",
      "Chromosomes come in pairs, one of each pair from each parent.",
      "Natural selection acts on variation that already exists.",
      "Antibiotic resistance is natural selection happening quickly enough to watch.",
    ],
    formulae: [],
  },
  "y9-science-periodic": {
    explanation:
      "An atom has a tiny nucleus of protons and neutrons surrounded by electrons in shells. The atomic number is the number of protons and identifies the element; the mass number counts protons plus neutrons. Electrons fill shells from the inside out, holding two in the first shell and eight in the next two, and the number in the outer shell determines how the element reacts. Reactivity trends follow from this: group 1 metals become more reactive down the group as the outer electron is further from the nucleus and more easily lost, while group 7 non-metals become less reactive down the group as an electron is harder to attract.",
    keyIdeas: [
      "Atomic number is the proton count and identifies the element.",
      "Electron shells fill 2, 8, 8 for the first twenty elements.",
      "Outer-shell electrons determine chemical behaviour.",
      "Group 1 gets more reactive down the group; group 7 gets less.",
    ],
    formulae: ["Number of neutrons $=$ mass number $-$ atomic number"],
  },
  "y9-science-electricity": {
    explanation:
      "Current is the rate of flow of charge, measured in amperes, and it is the same at every point in a series circuit but splits between the branches of a parallel circuit. Potential difference, measured in volts, is the energy given to the charge, and it is shared between components in series but is the same across each branch in parallel. Resistance opposes the flow of current and is measured in ohms. A current in a wire produces a magnetic field, and winding the wire into a coil around an iron core makes an electromagnet whose strength can be switched, which is the basis of relays, motors and loudspeakers.",
    keyIdeas: [
      "Series: current is the same everywhere, potential difference is shared.",
      "Parallel: potential difference is the same, current splits.",
      "Resistance opposes current and is measured in ohms.",
      "An electromagnet can be switched off, unlike a permanent magnet.",
    ],
    formulae: ["$V = IR$", "Charge $Q = It$"],
  },
  "y9-science-climate": {
    explanation:
      "Carbon cycles between the atmosphere, living things, the oceans and rocks: photosynthesis removes carbon dioxide, respiration, decay and combustion return it. Burning fossil fuels releases carbon that had been locked away for millions of years, raising the concentration of carbon dioxide in the atmosphere. Greenhouse gases absorb the long-wavelength radiation the Earth emits, which warms the atmosphere, and the evidence for that warming comes from temperature records, ice cores and sea-level measurements. Evaluating resource use means weighing benefits against costs, including the energy needed to extract and process materials and what happens to them at end of life.",
    keyIdeas: [
      "Photosynthesis removes carbon dioxide; respiration, decay and combustion return it.",
      "Fossil fuel burning releases carbon stored over geological time.",
      "Greenhouse gases absorb the radiation the Earth emits back out.",
      "Evidence comes from records, ice cores and sea-level data, not from one source.",
    ],
    formulae: [],
  },
  "y9-science-bioenergetics": {
    explanation:
      "Photosynthesis uses light energy to convert carbon dioxide and water into glucose and oxygen, and it happens in the chloroplasts of plant cells. Its rate is limited by whichever factor is in shortest supply: light intensity, carbon dioxide concentration or temperature. Respiration releases energy from glucose in every living cell, all the time; aerobic respiration uses oxygen and releases much more energy per glucose molecule, while anaerobic respiration works without oxygen and in muscle produces lactic acid. Photosynthesis and respiration are not opposites of one another so much as two halves of the same carbon and energy cycle.",
    keyIdeas: [
      "Photosynthesis needs light; respiration happens continuously in all living cells.",
      "A limiting factor is whatever is in shortest supply.",
      "Aerobic respiration releases far more energy than anaerobic.",
      "Anaerobic respiration in muscle produces lactic acid.",
    ],
    formulae: [
      "Photosynthesis: carbon dioxide + water $\\rightarrow$ glucose + oxygen",
      "Aerobic respiration: glucose + oxygen $\\rightarrow$ carbon dioxide + water",
    ],
  },
  "y9-science-pressure": {
    explanation:
      "A moment is the turning effect of a force about a pivot, found by multiplying the force by the perpendicular distance from the pivot, which is why a longer spanner loosens a stiff nut more easily. When an object is balanced, the total clockwise moment equals the total anticlockwise moment. Pressure is force spread over an area, so the same force gives a much greater pressure through a drawing pin than through a flat hand. In a fluid, pressure increases with depth and acts in all directions, and an object floats when the upthrust from the fluid equals its weight.",
    keyIdeas: [
      "Moment is force times perpendicular distance from the pivot.",
      "Balanced means clockwise moments equal anticlockwise moments.",
      "Smaller area for the same force means greater pressure.",
      "Floating happens when upthrust equals weight.",
    ],
    formulae: [
      "Moment $=$ force $\\times$ perpendicular distance (Nm)",
      "Pressure $= \\frac{\\text{force}}{\\text{area}}$ (Pa)",
    ],
  },

  // ---- Year 10 (GCSE) ----------------------------------------------------
  "y10-science-cell-biology": {
    explanation:
      "Eukaryotic cells, including plant and animal cells, have a nucleus holding the genetic material; prokaryotic cells such as bacteria are much smaller, have no nucleus, and carry their DNA as a single loop plus plasmids. A light microscope magnifies enough to see cells and nuclei; an electron microscope has far higher magnification and resolution and reveals sub-cellular structures. Magnification calculations connect the image size, the real size and the magnification, and answers usually need converting between millimetres and micrometres. Substances move in and out of cells by diffusion down a concentration gradient, by osmosis when water moves across a partially permeable membrane, and by active transport against the gradient, which requires energy from respiration.",
    keyIdeas: [
      "Prokaryotic cells have no nucleus; eukaryotic cells do.",
      "Electron microscopes give higher magnification and higher resolution.",
      "Osmosis is the movement of water across a partially permeable membrane.",
      "Active transport works against the gradient and needs energy.",
    ],
    formulae: [
      "Magnification $= \\frac{\\text{image size}}{\\text{real size}}$",
      "$1\\,\\text{mm} = 1000\\,\\mu\\text{m}$",
    ],
  },
  "y10-science-organisation": {
    explanation:
      "Cells of one type form tissues, tissues form organs, and organs work together as organ systems. Enzymes are proteins that catalyse reactions, each with an active site shaped to fit one substrate, which is why raising the temperature too far or changing the pH denatures the enzyme and stops it working. The digestive system uses enzymes to break carbohydrates into simple sugars, proteins into amino acids and lipids into fatty acids and glycerol, with bile emulsifying fat to increase the surface area for lipase. The circulatory system carries the absorbed products: the heart pumps blood through arteries, capillaries and veins, and the blood carries red cells, white cells, platelets and plasma.",
    keyIdeas: [
      "An enzyme's active site fits one substrate; heat and pH can denature it.",
      "Carbohydrase, protease and lipase break down the three food groups.",
      "Bile emulsifies fat, increasing surface area rather than digesting it.",
      "Arteries carry blood away from the heart, veins return it.",
    ],
    formulae: [
      "Rate of reaction $= \\frac{1000}{\\text{time in seconds}}$ (s$^{-1}$)",
      "Food tests: Benedict's for sugars, iodine for starch, Biuret for protein",
    ],
  },
  "y10-science-atomic": {
    explanation:
      "Electrons occupy shells, and it is the outer shell that determines bonding. Ionic bonding transfers electrons from a metal to a non-metal, producing oppositely charged ions held by strong electrostatic attraction in a giant lattice, which gives high melting points and conduction only when molten or dissolved. Covalent bonding shares pairs of electrons between non-metal atoms; simple molecular substances have strong bonds inside the molecule but weak forces between molecules, so they melt easily and do not conduct. Giant covalent structures such as diamond and graphite, and metallic bonding with its sea of delocalised electrons, explain hardness, conductivity and malleability from structure alone.",
    keyIdeas: [
      "Ionic: electrons transferred, giant lattice, conducts when molten or dissolved.",
      "Simple molecular: weak forces between molecules, so low melting points.",
      "Graphite conducts because each carbon has a delocalised electron.",
      "Metals are malleable because layers of ions can slide over each other.",
    ],
    formulae: ["Electron shells fill 2, 8, 8 for the first twenty elements"],
  },
  "y10-science-energy": {
    explanation:
      "Energy is transferred between stores, and calculations at GCSE use kinetic energy, gravitational potential energy and the energy needed to raise the temperature of a material. Power is the rate of transfer, measured in watts, and efficiency compares the useful output with the total input. In electrical circuits, potential difference, current and resistance are linked by $V = IR$, and electrical power can be calculated from current and potential difference. The National Grid uses transformers to raise the potential difference for transmission, which reduces the current and therefore the energy wasted as heat in the cables.",
    keyIdeas: [
      "Power is energy transferred per second, measured in watts.",
      "Efficiency compares useful output with total input.",
      "$V = IR$ links the three circuit quantities.",
      "High transmission voltage means low current and less wasted heating.",
    ],
    formulae: [
      "$E_{k} = \\frac{1}{2}mv^{2}$",
      "$E_{p} = mgh$",
      "$E = mc\\Delta\\theta$",
      "$P = VI$ and $P = I^{2}R$",
      "Efficiency $= \\frac{\\text{useful output}}{\\text{total input}}$",
    ],
  },
  "y10-science-practicals": {
    explanation:
      "Every required practical is assessed through the same skills: identifying the independent, dependent and control variables, choosing suitable apparatus and ranges, and recording results in a table with units in the headings. Repeat readings allow a mean to be calculated and anomalies to be spotted, which reduces the effect of random error; systematic error shifts every reading the same way and is not fixed by repeating. Resolution is the smallest change an instrument can detect, accuracy is closeness to the true value, and precision is how closely repeats agree. An evaluation says what limited the confidence in the conclusion and how the method could be improved, rather than listing generic mistakes.",
    keyIdeas: [
      "Independent is changed, dependent is measured, control variables are held constant.",
      "Repeats reduce random error but never fix systematic error.",
      "Precision is agreement between repeats; accuracy is closeness to the true value.",
      "An evaluation names a specific limitation and a specific improvement.",
    ],
    formulae: ["Mean $= \\frac{\\text{sum of repeats}}{\\text{number of repeats}}$ (excluding anomalies)"],
  },
  "y10-science-bioenergetics": {
    explanation:
      "Photosynthesis is endothermic: light energy transferred to chloroplasts converts carbon dioxide and water into glucose and oxygen. Its rate depends on light intensity, carbon dioxide concentration, temperature and the amount of chlorophyll, and at any moment one of these is the limiting factor holding the rate back. The glucose made is used for respiration, converted to starch for storage, used to make cellulose and proteins, or stored as oils. Respiration is exothermic and continuous; aerobic respiration releases much more energy per glucose molecule than anaerobic, and during hard exercise anaerobic respiration in muscle produces lactic acid and creates an oxygen debt.",
    keyIdeas: [
      "Photosynthesis is endothermic; respiration is exothermic.",
      "The limiting factor is whichever requirement is in shortest supply.",
      "Light intensity follows an inverse square relationship with distance.",
      "Anaerobic respiration in muscle produces lactic acid and an oxygen debt.",
    ],
    formulae: [
      "$6\\mathrm{CO_{2}} + 6\\mathrm{H_{2}O} \\rightarrow \\mathrm{C_{6}H_{12}O_{6}} + 6\\mathrm{O_{2}}$",
      "$\\mathrm{C_{6}H_{12}O_{6}} + 6\\mathrm{O_{2}} \\rightarrow 6\\mathrm{CO_{2}} + 6\\mathrm{H_{2}O}$",
    ],
  },
  "y10-science-infection": {
    explanation:
      "Communicable diseases are caused by pathogens: bacteria, which often produce toxins; viruses, which reproduce inside cells and damage them; protists, often carried by a vector; and fungi. The body defends itself with physical and chemical barriers, such as skin, mucus and stomach acid, and then with white blood cells that ingest pathogens, produce antibodies specific to the antigen, and produce antitoxins. Vaccination introduces a small quantity of dead or inactive pathogen so that the immune system produces antibodies and memory cells, giving a rapid response if the real pathogen arrives. Antibiotics kill bacteria but have no effect on viruses, and their overuse has selected for resistant strains.",
    keyIdeas: [
      "Bacteria, viruses, protists and fungi are all pathogens but act differently.",
      "Antibodies are specific to one antigen.",
      "Vaccination produces memory cells without causing the disease.",
      "Antibiotics do not work on viruses, and overuse breeds resistance.",
    ],
    formulae: [],
  },
  "y10-science-chemical-changes": {
    explanation:
      "The reactivity series orders metals by their tendency to form positive ions, and a more reactive metal displaces a less reactive one from its compound. Metals above carbon are extracted by electrolysis; those below can be reduced with carbon. Electrolysis splits an ionic compound that is molten or in solution, with positive ions attracted to the cathode and negative ions to the anode; in aqueous solutions, hydrogen is produced at the cathode unless the metal is less reactive than hydrogen. Energy changes accompany every reaction: exothermic reactions transfer energy to the surroundings and their products sit lower on a reaction profile, while endothermic reactions take energy in.",
    keyIdeas: [
      "A more reactive metal displaces a less reactive one.",
      "Metals above carbon need electrolysis; below carbon, reduction with carbon works.",
      "Positive ions go to the cathode; negative ions to the anode.",
      "Exothermic releases energy; endothermic absorbs it.",
    ],
    formulae: [
      "Reactivity: K, Na, Ca, Mg, Al, (C), Zn, Fe, (H), Cu, Ag, Au",
      "Energy change $=$ bonds broken $-$ bonds made",
    ],
  },
  "y10-science-particles": {
    explanation:
      "Density is the mass of a material in a given volume, and it is determined by how heavy the particles are and how closely they are packed, which is why the same substance is usually densest as a solid. Changing state is a physical change: the particles gain or lose energy and their arrangement changes, but the substance and its mass stay the same, so the change can be reversed. Heating a substance either raises its temperature, which increases the internal energy stored kinetically, or changes its state, which increases the potential store while the temperature holds still. Gas pressure comes from particles colliding with the container walls, so heating a fixed volume of gas raises the pressure.",
    keyIdeas: [
      "Density depends on particle mass and how closely packed they are.",
      "A change of state is physical and reversible; mass is conserved.",
      "During a change of state the temperature does not change.",
      "Gas pressure is caused by particle collisions with the walls.",
    ],
    formulae: [
      "Density $\\rho = \\frac{m}{V}$",
      "$E = mc\\Delta\\theta$",
      "$E = mL$ (latent heat)",
    ],
  },
  "y10-science-earth": {
    explanation:
      "The early atmosphere was probably mostly carbon dioxide released by volcanic activity, with little or no oxygen; oxygen built up once algae and plants began to photosynthesise, and carbon dioxide fell as it was locked into oceans, sedimentary rocks and fossil fuels. Greenhouse gases such as carbon dioxide, methane and water vapour let short-wavelength radiation through but absorb the long-wavelength radiation the Earth re-emits, which warms the atmosphere. Human activities increase these gases, and the consequences considered at GCSE include rising sea levels, changing rainfall patterns and shifts in the distribution of species. A life-cycle assessment weighs the whole environmental cost of a product, from extracting raw materials through manufacture and use to disposal.",
    keyIdeas: [
      "Oxygen in the atmosphere came from photosynthesis by algae and plants.",
      "Greenhouse gases absorb the long-wavelength radiation Earth emits.",
      "Carbon dioxide was removed into oceans, rocks and fossil fuels.",
      "A life-cycle assessment covers extraction, manufacture, use and disposal.",
    ],
    formulae: [],
  },

  // ---- Year 11 (GCSE) ----------------------------------------------------
  "y11-science-homeostasis": {
    explanation:
      "Homeostasis keeps internal conditions steady despite changes outside, using receptors to detect change, a coordination centre to process it, and effectors to act; the correction then reduces the original change, which is negative feedback. The nervous system carries fast electrical impulses, and a reflex arc bypasses the conscious brain so that the response is quicker: receptor, sensory neurone, relay neurone in the spinal cord, motor neurone, effector. The endocrine system is slower and longer-lasting, using hormones carried in the blood. Blood glucose is controlled by the pancreas: insulin lowers it by causing glucose to be stored as glycogen, and glucagon raises it again.",
    keyIdeas: [
      "Receptor, coordination centre, effector, then negative feedback.",
      "Reflexes are fast because they do not involve conscious thought.",
      "Nervous responses are fast and brief; hormonal responses are slower and longer.",
      "Insulin lowers blood glucose; glucagon raises it.",
    ],
    formulae: ["Reflex arc: stimulus $\\rightarrow$ receptor $\\rightarrow$ sensory $\\rightarrow$ relay $\\rightarrow$ motor $\\rightarrow$ effector"],
  },
  "y11-science-rates": {
    explanation:
      "The rate of a reaction is how quickly reactants are used or products formed, and it is found from the gradient of a graph, using a tangent where the graph is curved. Collision theory explains every rate factor: a reaction happens when particles collide with at least the activation energy, so raising the concentration, pressure, surface area or temperature increases the frequency or energy of collisions. A catalyst speeds a reaction by providing a pathway of lower activation energy and is not used up. A reversible reaction in a closed system reaches equilibrium, and Le Chatelier's principle predicts that a change in conditions shifts the position of equilibrium to oppose that change.",
    keyIdeas: [
      "Rate is read from the gradient; use a tangent on a curve.",
      "More frequent or more energetic collisions mean a faster rate.",
      "A catalyst lowers activation energy and is not consumed.",
      "Equilibrium shifts to oppose the change you impose.",
    ],
    formulae: [
      "Mean rate $= \\frac{\\text{quantity of product formed}}{\\text{time}}$",
      "Mean rate $= \\frac{\\text{quantity of reactant used}}{\\text{time}}$",
    ],
  },
  "y11-science-waves": {
    explanation:
      "Forces are vectors, so a free-body diagram and a resultant are the starting point for any force problem; Newton's laws then connect the resultant force to acceleration. Stopping distance is the sum of thinking distance, which depends on reaction time and speed, and braking distance, which depends on speed, brakes, tyres and road conditions. Waves are described by frequency, wavelength, amplitude and speed, with the wave equation linking three of them, and the electromagnetic spectrum runs from radio waves to gamma rays in order of increasing frequency. A current in a magnetic field experiences a force, which is the motor effect, and moving a conductor in a field induces a potential difference.",
    keyIdeas: [
      "Resolve forces to a resultant before applying $F = ma$.",
      "Stopping distance is thinking distance plus braking distance.",
      "The wave equation links speed, frequency and wavelength.",
      "The motor effect: a current in a magnetic field feels a force.",
    ],
    formulae: [
      "$F = ma$",
      "$v = f\\lambda$",
      "Momentum $p = mv$",
      "Weight $W = mg$",
    ],
  },
  "y11-science-ecology": {
    explanation:
      "Organisms depend on one another and on the physical environment for the resources they need, and a stable community is one in which all the species and environmental factors are in balance. Abundance is estimated by sampling, using quadrats placed randomly to avoid bias or along a transect to study how distribution changes across a gradient, then scaling the mean up to the whole area. Materials cycle continuously: the carbon cycle returns carbon through respiration, decay and combustion, and the water cycle moves and purifies water. Human population growth and rising living standards increase the use of resources and the production of waste, while measures such as breeding programmes and habitat protection work to slow the loss of biodiversity.",
    keyIdeas: [
      "Quadrats must be placed randomly, or the estimate is biased.",
      "A transect shows how distribution changes across a gradient.",
      "Decomposers return carbon and mineral ions to the environment.",
      "Biodiversity gives ecosystems stability against change.",
    ],
    formulae: [
      "Estimated population $= \\text{mean per quadrat} \\times \\frac{\\text{total area}}{\\text{quadrat area}}$",
    ],
  },
  "y11-science-inheritance": {
    explanation:
      "Sexual reproduction involves meiosis, producing gametes with half the chromosome number and genetically varied, while asexual reproduction uses mitosis and produces genetically identical offspring. An allele is a version of a gene; a dominant allele is expressed if one copy is present, a recessive allele needs two. A Punnett square predicts the proportions of genotypes in the offspring, and the phenotype is the characteristic that results. Variation arises from the combination of alleles at fertilisation and from mutation, and selective breeding, genetic engineering and cloning all apply this understanding, each with benefits and risks worth weighing.",
    keyIdeas: [
      "Meiosis halves the chromosome number and produces variation.",
      "A recessive characteristic needs two copies of the allele.",
      "A Punnett square gives expected proportions, not guaranteed outcomes.",
      "Selective breeding reduces variation within a population.",
    ],
    formulae: ["Genotype: homozygous (BB or bb) or heterozygous (Bb)"],
  },
  "y11-science-quantitative": {
    explanation:
      "The relative formula mass of a compound is the total of the relative atomic masses of all the atoms in its formula, and it is the bridge between masses and amounts. Conservation of mass means the total mass of the products equals the total mass of the reactants, and an apparent change in mass in an open container is explained by a gas entering or escaping. Concentration of a solution is mass of solute per volume of solvent. Percentage yield compares the actual yield with the theoretical maximum, and atom economy compares the mass of the desired product with the total mass of the products, which is why a reaction with a high yield may still be wasteful.",
    keyIdeas: [
      "Relative formula mass is the total of the relative atomic masses in the formula.",
      "Mass is conserved; a change in an open vessel means a gas moved.",
      "Percentage yield measures how much you actually obtained.",
      "Atom economy measures how much of the product mass is the substance you wanted.",
    ],
    formulae: [
      "Percentage yield $= \\frac{\\text{actual}}{\\text{theoretical}} \\times 100$",
      "Atom economy $= \\frac{M_{r}\\text{ of desired product}}{M_{r}\\text{ of all products}} \\times 100$",
      "Concentration $= \\frac{\\text{mass of solute}}{\\text{volume}}$ (g/dm$^{3}$)",
    ],
  },
  "y11-science-analysis": {
    explanation:
      "A pure substance in chemistry melts and boils at a single fixed temperature, so a range indicates a mixture; a formulation is a mixture designed in measured quantities for a purpose, such as a paint or a fuel. Paper chromatography separates a mixture because components differ in how strongly they are attracted to the stationary and mobile phases, and the R$_{f}$ value identifies a component by comparison with known substances. Gas tests are memorised and specific: hydrogen pops with a lit splint, oxygen relights a glowing splint, carbon dioxide turns limewater milky, and chlorine bleaches damp litmus paper. Potable water is treated by filtering and sterilising, and where fresh water is scarce, desalination by distillation or reverse osmosis is used at greater energy cost.",
    keyIdeas: [
      "A pure substance melts and boils at a fixed temperature.",
      "R$_{f}$ identifies a component by comparing distances travelled.",
      "Each gas test is specific: pop, relight, milky, bleach.",
      "Potable water is safe to drink but not chemically pure.",
    ],
    formulae: [
      "$R_{f} = \\frac{\\text{distance moved by substance}}{\\text{distance moved by solvent}}$",
    ],
  },
  "y11-science-atomic": {
    explanation:
      "An unstable nucleus decays at random, emitting alpha particles, beta particles or gamma radiation. An alpha particle is two protons and two neutrons, so it reduces the mass number by four and the atomic number by two; a beta particle is a fast electron from a neutron turning into a proton, so the mass number is unchanged and the atomic number rises by one; gamma radiation is energy alone and changes neither. The three types differ in penetration and ionising power: alpha is the most ionising and least penetrating, gamma the reverse. Half-life is the time taken for the activity of a source to halve, which makes decay predictable in bulk even though each individual decay is random.",
    keyIdeas: [
      "Alpha: mass number $-4$, atomic number $-2$.",
      "Beta: mass number unchanged, atomic number $+1$.",
      "Alpha ionises most and penetrates least; gamma is the opposite.",
      "Half-life is the time for activity to halve, and each decay is random.",
    ],
    formulae: [
      "Alpha decay: $^{A}_{Z}X \\rightarrow\\ ^{A-4}_{Z-2}Y + ^{4}_{2}\\alpha$",
      "Beta decay: $^{A}_{Z}X \\rightarrow\\ ^{A}_{Z+1}Y + ^{0}_{-1}\\beta$",
    ],
  },
};
