// Authored science explanations, one per catalogue topic.
//
// Pitched at the stated year group and, at KS4, at AQA Combined Science
// Trilogy (8464) demand: no separate-science-only or A-level material, and no
// quantitative treatments the specification does not ask for.
export const scienceContent = {
  // ---- Year 7 ------------------------------------------------------------
  "y7-science-safety": {
    explanation:
      "A laboratory is safe because of what people do in it, not because of the room. Before any practical you work out what could go wrong and what will stop it: eye protection against splashes and anything heated, hair tied back and bags off the floor, and you stand rather than sit when something is hot. Hazard symbols on a bottle are the warning in advance, so the flame means flammable and keep it away from a Bunsen, the corrosive symbol means it attacks skin, and the exclamation mark means an irritant. Apparatus is chosen for the measurement you actually need: a measuring cylinder for volume read at the bottom of the curve your eye is level with, a balance for mass with the container zeroed first, a thermometer left in the liquid while you read it. A Bunsen burner is lit with the air hole shut, giving the yellow safety flame you can see, and only opened to the roaring blue flame while you are heating.",
    keyIdeas: [
      "Decide what could go wrong, and what will prevent it, before you start.",
      "Hazard symbols warn you what a substance will do before you handle it.",
      "Choose apparatus for the measurement, and read it at eye level.",
      "Light a Bunsen on the yellow safety flame; open the air hole only to heat.",
    ],
    formulae: [],
  },
  "y7-science-substances": {
    explanation:
      "An element is a substance made of only one kind of atom, and the periodic table lists every one of them with its own symbol, written with a capital first letter and, if present, a lower-case second letter, so Co is cobalt but CO is carbon and oxygen joined. A compound is two or more elements chemically bonded, in a fixed ratio, and it behaves as a new substance: sodium is a metal that reacts violently with water and chlorine is a poisonous gas, yet sodium chloride is table salt. A mixture is substances simply put together without bonding, in any proportion, each keeping its own properties, which is why a mixture can be separated by physical means such as filtering or distilling and a compound cannot. Air is a mixture, roughly four-fifths nitrogen and one-fifth oxygen with small amounts of argon and carbon dioxide. A physical change alters form but makes no new substance, so ice melting is still water; a chemical change makes one, and you can often tell by a colour change, a gas given off, a temperature change or a precipitate.",
    keyIdeas: [
      "An element is one kind of atom; a compound is elements chemically bonded.",
      "A mixture is not bonded, so physical methods can separate it.",
      "A compound's properties are nothing like those of the elements in it.",
      "Air is a mixture: about 78% nitrogen and 21% oxygen.",
      "A chemical change makes a new substance; a physical change does not.",
    ],
    formulae: [],
  },
  "y7-science-space": {
    "explanation": "The Sun is a star, and eight planets orbit it, held in their orbits by gravity: the four rocky inner planets, then the four gas and ice giants, with moons orbiting the planets in the same way. Gravity is a force of attraction between any two masses, stronger for a larger mass and weaker with distance, which is why weight changes from world to world while mass does not; the same astronaut has the same mass on the Moon but weighs about a sixth as much. Day and night come from the Earth spinning once every 24 hours, so the half facing the Sun has day. The seasons come from something different: the Earth's axis is tilted, so for half the year the northern hemisphere leans towards the Sun and gets longer days and light striking more directly, which is summer, while the southern hemisphere has winter at the same time. The Moon orbits Earth in about 27.3 days relative to the distant stars, while a full cycle of phases takes about 29.5 days. The phases show how much of its sunlit half we can see; the periods differ because Earth and the Moon also move around the Sun.",
    "keyIdeas": [
      "Gravity holds the solar system together and is stronger for larger masses.",
      "Mass stays the same everywhere; weight depends on the gravitational field.",
      "Day and night come from the Earth's rotation, not from its orbit.",
      "The seasons come from the tilt of the Earth's axis, not from distance to the Sun.",
      "The phases of the Moon are how much of its lit half faces us."
    ],
    "formulae": [
      "Weight: $W = m \\times g$",
      "Near Earth’s surface: $g \\approx 9.8\\ \\text{N/kg}$; use $10\\ \\text{N/kg}$ when a question specifies this approximation."
    ]
  },
  "y7-science-cells": {
    "explanation": "All living things are made of cells. A typical animal cell has a nucleus controlling the cell, cytoplasm where reactions happen, a cell membrane controlling what enters and leaves, and mitochondria releasing energy. A typical plant cell also has a cellulose cell wall and a large permanent vacuole containing cell sap. Photosynthetic plant cells have chloroplasts containing chlorophyll, which absorbs light; many root cells do not have chloroplasts. Cells become specialised for a job, so a red blood cell loses its nucleus to carry more oxygen and a root hair cell has a long extension to absorb water, and cells of one type group into tissues, tissues into organs, and organs into organ systems.",
    "keyIdeas": [
      "Nucleus controls the cell; mitochondria release energy from respiration.",
      "Typical plant cells have a cellulose wall and a large permanent vacuole; chloroplasts occur in photosynthetic cells.",
      "Specialised cells have shapes that suit their function.",
      "Cells to tissues to organs to organ systems to organism."
    ],
    "formulae": []
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
  "y8-science-metals": {
    explanation:
      "The reactivity series orders metals by how readily they react. Carbon and hydrogen are often included as non-metal reference points. A more reactive metal can displace a less reactive metal from a solution of its compound: magnesium reacts with copper sulfate solution to form magnesium sulfate and copper. Carbon can reduce the oxides of many metals below it in the series, removing oxygen to leave the metal. In a blast furnace, carbon monoxide is an important reducing agent for iron oxide. Metals above carbon, such as aluminium, require other extraction methods; aluminium is produced by electrolysis of aluminium oxide dissolved in molten cryolite. Unreactive metals such as gold may occur uncombined. An ore is a rock containing enough of a metal or its compound to make extraction economically worthwhile.",
    keyIdeas: ["The reactivity series orders metals; carbon and hydrogen can be included as non-metal reference points.","A more reactive metal can displace a less reactive metal from a solution of its compound.","Carbon can reduce many metal oxides below it in the series.","Aluminium extraction uses electrolysis; an unreactive metal such as gold may occur uncombined."],
    formulae: [
      "Displacement: $\\text{magnesium} + \\text{copper sulfate} \\rightarrow \\text{magnesium sulfate} + \\text{copper}$",
      "Extraction with carbon: $\\text{iron oxide} + \\text{carbon} \\rightarrow \\text{iron} + \\text{carbon dioxide}$",
    ],
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
      "DNA carries inherited information. In the nucleus of a typical plant or animal cell it is packaged into chromosomes, each containing many genes. Most human body cells with a nucleus normally have 23 chromosome pairs; human gametes normally have 23 single chromosomes. Alleles are versions of genes, and inherited variation arises from different alleles and their combinations. Natural selection occurs when inherited differences affect reproductive success in a particular environment, so some alleles become more common over generations. Separated populations may eventually form new species. Evidence for evolution includes fossils, similarities between organisms and observed changes such as the spread of antibiotic resistance in bacterial populations.",
    keyIdeas: [
      "Genes are sections of DNA; many carry instructions for making proteins.",
      "Most nucleated human body cells normally have chromosome pairs; gametes have a single set.",
      "Natural selection acts on existing variation and changes populations over generations.",
      "Antibiotic resistance can spread when resistant bacteria survive treatment and reproduce.",
    ],
    formulae: [],
  },
  "y9-science-periodic": {
    explanation:
      "An atom has a tiny nucleus of protons and neutrons surrounded by electrons in shells. The atomic number is the number of protons and identifies the element; the mass number counts protons plus neutrons. Electrons fill shells from the inside out, holding two in the first shell and eight in the next two, and the number in the outer shell determines how the element reacts. Reactivity trends follow from this: group 1 metals become more reactive down the group as the outer electron is further from the nucleus and more easily lost, while group 7 non-metals become less reactive down the group as an electron is harder to attract.",
    keyIdeas: [
      "Atomic number is the proton count and identifies the element.",
      "For the first twenty elements, use the shell model with up to 2 electrons in the first shell and 8 in the next two; potassium and calcium begin a fourth shell (2,8,8,1 and 2,8,8,2).",
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
      "Eukaryotic cells, including plant and animal cells, have a nucleus holding the genetic material; prokaryotic cells such as bacteria are much smaller, have no nucleus, and carry their DNA as a single loop plus plasmids. A light microscope magnifies enough to see cells and nuclei; an electron microscope has far higher magnification and resolution and reveals sub-cellular structures. Magnification calculations connect the image size, the real size and the magnification, and answers usually need converting between millimetres and micrometres. Substances move in and out of cells by diffusion down a concentration gradient, by osmosis when water moves across a partially permeable membrane, and by active transport against the gradient, which requires energy from respiration. As an organism develops, most cells differentiate, gaining the sub-cellular structures their job needs; most animal cells differentiate early in life, while many plant cells can differentiate throughout it. Stem cells are undifferentiated cells that can become other types: embryonic stem cells can become almost any cell, adult stem cells in bone marrow form only some types such as blood cells, and meristem tissue at plant root and shoot tips can form any plant cell, which is why plants can be cloned quickly from cuttings. Stem cells may one day treat conditions such as diabetes and paralysis, and therapeutic cloning would give cells the patient's body does not reject, but that benefit is weighed against the risk of transferring viral infection and against ethical and religious objections to using embryos.",
    keyIdeas: [
      "Prokaryotic cells have no nucleus; eukaryotic cells do.",
      "Electron microscopes give higher magnification and higher resolution.",
      "Osmosis is the movement of water across a partially permeable membrane.",
      "Active transport works against the gradient and needs energy.",
      "Stem cells are undifferentiated and can become other cell types.",
      "Embryonic stem cells are more versatile than adult bone marrow stem cells.",
      "Meristems let plants differentiate throughout life, so they clone easily.",
    ],
    formulae: [
      "Magnification $= \\frac{\\text{image size}}{\\text{real size}}$",
      "$1\\,\\text{mm} = 1000\\,\\mu\\text{m}$",
    ],
  },
  "y10-science-organisation": {
    explanation:
      "Cells of one type form tissues, tissues form organs, and organs work together as organ systems. Enzymes are proteins that catalyse reactions, each with an active site shaped to fit one substrate, which is why raising the temperature too far or changing the pH denatures the enzyme and stops it working. The digestive system uses enzymes to break carbohydrates into simple sugars, proteins into amino acids and lipids into fatty acids and glycerol, with bile emulsifying fat to increase the surface area for lipase. The circulatory system carries the absorbed products: the heart pumps blood through arteries, capillaries and veins, and the blood carries red cells, white cells, platelets and plasma. A leaf is a plant organ: the upper epidermis is transparent, the palisade mesophyll is packed with chloroplasts for photosynthesis, the spongy mesophyll has air spaces for gas exchange, and guard cells open and close the stomata. Xylem is made of hollow dead cells strengthened by lignin and carries water and mineral ions up from the roots; phloem is living tissue that carries dissolved sugars both up and down the plant, which is called translocation. Transpiration is the loss of water vapour from the leaves through the stomata, which draws water up the xylem, and it is faster when it is hotter, drier, windier or brighter, because each of those speeds evaporation or opens the stomata.",
    keyIdeas: [
      "An enzyme's active site fits one substrate; heat and pH can denature it.",
      "Carbohydrase, protease and lipase break down the three food groups.",
      "Bile emulsifies fat, increasing surface area rather than digesting it.",
      "Arteries carry blood away from the heart, veins return it.",
      "Xylem carries water and minerals upward; phloem carries sugars both ways.",
      "Transpiration is water vapour lost through stomata, pulling water up the xylem.",
      "Heat, light, wind and dry air all increase the rate of transpiration.",
    ],
    formulae: [
      "Rate of reaction $= \\frac{1000}{\\text{time in seconds}}$ (s$^{-1}$)",
      "Food tests: Benedict's for sugars, iodine for starch, Biuret for protein",
      "Rate of transpiration $= \\frac{\\text{volume of water taken up}}{\\text{time}}$",
    ],
  },
  "y10-science-atomic": {
    explanation:
      "Electrons occupy shells, and it is the outer shell that determines bonding. Ionic bonding transfers electrons from a metal to a non-metal, producing oppositely charged ions held by strong electrostatic attraction in a giant lattice, which gives high melting points and conduction only when molten or dissolved. Covalent bonding shares pairs of electrons between non-metal atoms; simple molecular substances have strong bonds inside the molecule but weak forces between molecules, so they melt easily and do not conduct. Giant covalent structures such as diamond and graphite, and metallic bonding with its sea of delocalised electrons, explain hardness, conductivity and malleability from structure alone. An atom has a nucleus of protons and neutrons with electrons around it, and because the atom is neutral the number of electrons equals the number of protons. The atomic number is the number of protons, which fixes the element; the mass number is protons plus neutrons, so the number of neutrons is the mass number minus the atomic number. Isotopes are atoms of the same element with different numbers of neutrons, so they react identically but differ in mass, which is why the relative atomic mass on the periodic table is an average rather than a whole number.",
    keyIdeas: [
      "Ionic: electrons transferred, giant lattice, conducts when molten or dissolved.",
      "Simple molecular: weak forces between molecules, so low melting points.",
      "Graphite conducts because each carbon has a delocalised electron.",
      "Metals are malleable because layers of ions can slide over each other.",
      "Atomic number is the number of protons; mass number is protons plus neutrons.",
      "Isotopes have the same number of protons but different numbers of neutrons.",
    ],
    formulae: [
      "Electron shells fill 2, 8, 8 for the first twenty elements",
      "Neutrons $=$ mass number $-$ atomic number",
    ],
  },
  "y10-science-energy": {
    explanation:
      "Energy is transferred between stores, and calculations at GCSE use kinetic energy, gravitational potential energy and the energy needed to raise the temperature of a material. Power is the rate of transfer, measured in watts, and efficiency compares the useful output with the total input. In electrical circuits, potential difference, current and resistance are linked by $V = IR$, and electrical power can be calculated from current and potential difference. The National Grid uses transformers to raise the potential difference for transmission, which reduces the current and therefore the energy wasted as heat in the cables. A resistor at constant temperature has a fixed resistance, so its I-V graph is a straight line through the origin. A filament lamp's graph curves because the filament heats up as the current rises and its resistance increases, and a diode lets current flow in one direction only, having a very high resistance the other way. The resistance of a thermistor falls as its temperature rises, and that of a light-dependent resistor falls as the light gets brighter, which is why they are the sensors in thermostats and automatic lights.",
    keyIdeas: [
      "Power is energy transferred per second, measured in watts.",
      "Efficiency compares useful output with total input.",
      "$V = IR$ links the three circuit quantities.",
      "High transmission voltage means low current and less wasted heating.",
      "A resistor at constant temperature gives a straight-line I-V graph.",
      "A filament lamp's resistance rises as it heats; a diode conducts one way only.",
      "Thermistor resistance falls as it warms; LDR resistance falls as light increases.",
    ],
    formulae: [
      "$E_{k} = \\frac{1}{2}mv^{2}$",
      "$E_{p} = mgh$",
      "$E = mc\\Delta\\theta$",
      "$P = VI$ and $P = I^{2}R$",
      "Efficiency $= \\frac{\\text{useful output}}{\\text{total input}}$",
      "$R = \\frac{V}{I}$",
    ],
  },
  "y10-science-motion": {
    explanation:
      "Speed is how much distance is covered each second, and it is a scalar: it has a size and nothing else. Velocity is speed in a stated direction, which makes it a vector, so a car going round a roundabout at a steady 30 mph is changing velocity the whole way round even though its speed never changes. Acceleration is how quickly velocity changes, measured in metres per second squared, and it is negative when something slows down. Graphs carry the same information in a form you can read at a glance. On a distance-time graph the gradient is the speed, so a horizontal line means stationary and a steeper line means faster. On a velocity-time graph the gradient is the acceleration and the area underneath is the distance travelled, which is why a flat line high up covers ground quickly while accelerating not at all. Stopping a car needs thinking distance plus braking distance; tiredness, alcohol and distraction lengthen the first, and wet roads, worn tyres and speed lengthen the second.",
    keyIdeas: [
      "Speed is a scalar; velocity is a vector, so direction is part of it.",
      "On a distance-time graph the gradient is the speed.",
      "On a velocity-time graph the gradient is acceleration and the area is distance.",
      "Stopping distance is thinking distance plus braking distance.",
    ],
    formulae: [
      "Speed: $s = \\dfrac{d}{t}$",
      "Acceleration: $a = \\dfrac{\\Delta v}{t}$",
      "Uniform acceleration: $v^{2} - u^{2} = 2as$",
    ],
  },
  "y10-science-organic": {
    "explanation": "Crude oil is the remains of ancient plankton, and it is a mixture of hydrocarbons: compounds of hydrogen and carbon only. Because it is a mixture, it can be separated physically, and fractional distillation does it by boiling point. The oil is heated until it vaporises and fed into a column that is hot at the bottom and cool at the top; each fraction rises until it reaches a level cool enough to condense, so the short molecules travel furthest and the long ones drain out low down. Molecule length decides the properties: short chains have weaker forces between them, so they boil at lower temperatures, flow more easily and ignite more readily, which is why petrol is a better fuel than bitumen. The problem is that distillation gives far more long-chain fractions than anyone wants, so cracking breaks them into shorter ones using heat with a catalyst or steam. Cracking produces alkenes as well as alkanes, and alkenes are the starting point for polymers. An alkene decolourises bromine water; an alkane leaves it orange.",
    "keyIdeas": [
      "A hydrocarbon contains hydrogen and carbon only.",
      "Fractional distillation separates a mixture by boiling point.",
      "Shorter chains boil lower, flow more easily and ignite more readily.",
      "Cracking turns surplus long chains into useful short ones and alkenes.",
      "Bromine water is decolourised by an alkene, not by an alkane."
    ],
    "formulae": [
      "Alkanes: $\\mathrm{C}_{n}\\mathrm{H}_{2n+2}$",
      "Complete combustion: $\\text{hydrocarbon} + \\text{oxygen} \\rightarrow \\text{carbon dioxide} + \\text{water}$"
    ]
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
    "explanation": "Photosynthesis uses light energy to turn carbon dioxide and water into glucose and oxygen. This is an endothermic process carried out in cells containing chloroplasts. Light intensity, carbon dioxide concentration, temperature and chlorophyll content affect its rate. Increasing light intensity may increase the rate, but eventually further increases may have little effect because another factor limits the process. In a pondweed investigation, measure oxygen produced in a fixed time and control other conditions, such as temperature and carbon dioxide availability. Glucose is used in respiration, converted to starch for storage, used to make cellulose, or converted to fats and oils. Plants also need nitrate ions to make amino acids and proteins. Aerobic respiration uses glucose and oxygen and releases energy for living processes. Anaerobic respiration in muscles releases less energy per glucose molecule and produces lactic acid. After exercise, breathing and heart rate remain raised during recovery. Metabolism is the sum of all chemical reactions in a cell or the body, including building larger molecules and breaking others down.",
    "keyIdeas": [
      "Photosynthesis transfers light energy into chemical stores; respiration releases energy for living processes.",
      "A rate measurement needs a quantity and a time interval.",
      "Control other variables when investigating the effect of light intensity.",
      "Nitrate ions supply nitrogen for making amino acids.",
      "Anaerobic respiration in muscles produces lactic acid."
    ],
    "formulae": [
      "$6\\mathrm{CO_{2}} + 6\\mathrm{H_{2}O} \\rightarrow \\mathrm{C_{6}H_{12}O_{6}} + 6\\mathrm{O_{2}}$",
      "$\\mathrm{C_{6}H_{12}O_{6}} + 6\\mathrm{O_{2}} \\rightarrow 6\\mathrm{CO_{2}} + 6\\mathrm{H_{2}O}$"
    ],
    "higher": {
      "explanation": "At Higher tier, use the inverse-square relationship between light intensity and distance from an approximately point-like source: doubling the distance reduces intensity to one quarter. This model assumes other conditions remain the same; photosynthesis rate only follows light intensity while light is the limiting factor. Interpret the interaction of limiting factors rather than assuming that one change always increases the rate. Oxygen debt is the extra oxygen needed after exercise to react with the accumulated lactic acid and remove it; the lactic acid is transported in the blood to the liver and converted back to glucose.",
      "keyIdeas": [
        "Doubling distance gives one quarter of the light intensity under the inverse-square model.",
        "Another limiting factor can prevent photosynthesis rate from increasing."
      ],
      "formulae": [
        "Light intensity is proportional to $1/d^{2}$"
      ]
    }
  },
  "y10-science-infection": {
    "explanation": "Communicable diseases are caused by pathogens. Pathogens include some bacteria, viruses, protists and fungi; most microorganisms are not pathogens. Bacteria can multiply rapidly and some produce toxins. Viruses reproduce inside living cells and can damage them. Skin, mucus and stomach acid help stop pathogens entering or surviving in the body. White blood cells defend the body by ingesting pathogens, making antibodies and making antitoxins. Antibodies recognise particular antigens. Vaccination exposes the immune system to antigens in a form designed to stimulate protection without causing the target disease. It can lead to memory cells, allowing a quicker antibody response if the same pathogen is encountered later. Vaccination reduces the risk of disease, but protection is not always complete. Antibiotics treat bacterial infections and do not kill viruses. Antibiotic use can select for resistant bacteria, so these strains become more common; bacteria do not deliberately become resistant because they need to.",
    "keyIdeas": [
      "Only disease-causing microorganisms are pathogens.",
      "White blood cells can ingest pathogens and produce antibodies or antitoxins.",
      "Vaccination prepares the immune system for later exposure.",
      "A faster secondary response helps reduce disease risk.",
      "Antibiotic resistance spreads through selection of resistant bacteria."
    ],
    "formulae": []
  },
  "y10-science-chemical-changes": {
    "explanation": "The reactivity series places metals in order of their tendency to react. A more reactive metal can displace a less reactive metal from a solution of its salt. Carbon can remove oxygen from oxides of metals below carbon in the reactivity series; more reactive metals need electrolysis for extraction. During electrolysis, an ionic compound must be molten or dissolved so its ions can move. Positive ions move to the negative cathode and negative ions to the positive anode. An exothermic reaction transfers energy to the surroundings, so the products are at a lower energy level than the reactants. An endothermic reaction takes in energy and has products at a higher energy level. The activation energy is the minimum energy needed for a reaction to occur. The pH scale describes acidity and alkalinity: acidic solutions are below 7, neutral solutions are at 7 and alkaline solutions are above 7 at room temperature. Universal indicator estimates pH; a pH probe gives a numerical reading. To prepare a soluble salt from an acid and an insoluble base, add the base in excess, filter off the unreacted solid and crystallise the salt from the solution.",
    "keyIdeas": [
      "Use the reactivity series to predict displacement, not the order in which metals are named.",
      "Positive ions move to the cathode; negative ions move to the anode.",
      "Reaction profiles show reactant and product energy levels and the activation-energy barrier.",
      "A lower pH means a more acidic solution; pH alone does not define the degree of acid ionisation.",
      "Excess insoluble base removes the acid; filtration removes the excess solid."
    ],
    "formulae": [],
    "higher": {
      "explanation": "At Higher tier, distinguish acid strength from concentration. A strong acid is completely ionised in aqueous solution; a weak acid is only partly ionised. Concentration describes the amount of dissolved substance per unit volume. For a given concentration, a stronger acid has a lower pH. A decrease of one pH unit means a tenfold increase in hydrogen-ion concentration; logarithms and acid dissociation constants are not needed here. Bond-energy calculations use the energy needed to break bonds minus the energy released when new bonds form. Breaking bonds requires energy; forming bonds releases energy.",
      "keyIdeas": [
        "Strong and weak describe ionisation, not how much acid was dissolved.",
        "A dilute strong acid and a concentrated weak acid are both possible.",
        "Count every bond represented in the balanced equation before adding bond energies."
      ],
      "formulae": [
        "Energy change = energy needed to break bonds − energy released when bonds form"
      ]
    }
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
    "explanation": "Homeostasis regulates internal conditions within suitable limits despite changes inside or outside the body. Receptors detect a change, coordination centres process information and effectors produce a response. In a withdrawal reflex, receptors in the skin detect a harmful stimulus. Impulses travel along a sensory neurone to the spinal cord, then through a relay neurone and a motor neurone to a muscle. The muscle contracts before a conscious decision is needed. Not every reflex is coordinated in the spinal cord; some involve the brainstem. The endocrine system uses hormones carried in the blood to target organs. When blood glucose rises, the pancreas releases insulin. Insulin causes glucose to move from the blood into cells and promotes its storage as glycogen in liver and muscle, lowering blood glucose. Type 1 diabetes involves insufficient insulin production; type 2 involves cells responding less effectively to insulin.",
    "keyIdeas": [
      "Homeostasis regulates conditions within limits, rather than holding every measurement exactly constant.",
      "A reflex is rapid and automatic; the withdrawal reflex is coordinated through the spinal cord.",
      "Hormones travel in blood and act on target organs.",
      "Insulin lowers blood glucose and promotes glycogen storage."
    ],
    "formulae": [],
    "higher": {
      "explanation": "When blood glucose is too low, the pancreas releases glucagon. Glucagon causes the liver to convert glycogen to glucose and release glucose into the blood. Insulin and glucagon act in a negative feedback system: the response reduces the original change, so the stimulus for hormone release falls as blood glucose returns towards its usual range.",
      "keyIdeas": [
        "Glucagon raises blood glucose by promoting release of glucose from the liver.",
        "Negative feedback reduces the change that triggered the response."
      ],
      "formulae": []
    }
  },
  "y11-science-rates": {
    explanation:
      "The rate of a reaction describes how quickly reactants are used or products formed. Mean rate is the quantity used or formed divided by the time taken. On an amount-against-time graph, a steeper slope indicates a faster reaction; a tangent helps compare the slopes of a curve. For AQA Combined Science, calculating the gradient of a tangent at a specific time is Higher-tier content. Reactions happen when particles collide with enough energy. Increasing concentration, gas pressure or a solid's exposed surface area increases collision frequency; increasing temperature also makes collisions more energetic. A catalyst provides a pathway with lower activation energy and is not used up overall. In a reversible reaction the products can react to form the original reactants. In a closed system, dynamic equilibrium occurs when forward and reverse reactions have equal rates, so the amounts remain constant but need not be equal. Equilibrium shifts are covered in our dedicated Higher-tier topic.",
    keyIdeas: [
      "Calculate mean rate from quantity divided by time; compare curve slopes using tangents.",
      "More frequent or more energetic collisions mean a faster rate.",
      "A catalyst lowers activation energy and is not consumed.",
      "At dynamic equilibrium both reactions continue at equal rates in a closed system.",
    ],
    formulae: [
      "Mean rate $= \\frac{\\text{quantity of product formed}}{\\text{time}}$",
      "Mean rate $= \\frac{\\text{quantity of reactant used}}{\\text{time}}$",
    ],
  },
  "y11-science-waves": {
    explanation:
      "Forces are vectors, so a free-body diagram and a resultant are the starting point for any force problem: forces along the same line add if they act the same way and subtract if they oppose, and Newton's laws then connect the resultant force to acceleration. When a force moves an object, work is done and energy is transferred, one joule for every newton moved through one metre. A force can also stretch or compress an object, and for a spring the extension is directly proportional to the force up to the limit of proportionality, which is Hooke's law and the basis of a required practical; the work done stretching the spring is stored as elastic potential energy. Stopping distance is the sum of thinking distance, which depends on reaction time and speed, and braking distance, which depends on speed, brakes, tyres and road conditions. Waves are described by frequency, wavelength, amplitude and speed, with the wave equation linking three of them, and the electromagnetic spectrum runs from radio waves to gamma rays in order of increasing frequency. A current in a magnetic field experiences a force, which is the motor effect.",
    keyIdeas: [
      "Resolve forces to a resultant before applying $F = ma$.",
      "Work done is force multiplied by distance moved along the line of the force.",
      "Extension is proportional to force up to the limit of proportionality.",
      "Stopping distance is thinking distance plus braking distance.",
      "The wave equation links speed, frequency and wavelength.",
      "The motor effect: a current in a magnetic field feels a force.",
    ],
    formulae: [
      "$F = ma$",
      "$v = f\\lambda$",
      "Weight $W = mg$",
      "Work done $W = Fs$",
      "Hooke's law $F = ke$",
      "Elastic potential energy $E_{e} = \\frac{1}{2}ke^{2}$",
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
      "Sexual reproduction involves meiosis, producing gametes with half the chromosome number and genetically varied, while asexual reproduction uses mitosis and produces genetically identical offspring. An allele is a version of a gene; a dominant allele is expressed if one copy is present, a recessive allele needs two. A Punnett square predicts the proportions of genotypes in the offspring, and the phenotype is the characteristic that results. Variation arises from the combination of alleles at fertilisation and from mutation, and selective breeding, genetic engineering and cloning all apply this understanding, each with benefits and risks worth weighing. Living things are classified into groups. Linnaeus sorted them by structure into kingdom, phylum, class, order, family, genus and species, and named each species with two words, its genus then its species, as in Homo sapiens. Microscopes and chemical analysis later showed that some organisms that looked alike were not closely related, so Carl Woese proposed three domains: Archaea, a domain distinct from bacteria and including organisms adapted to extreme conditions; Bacteria; and Eukaryota, which includes animals, plants, fungi and protists. Evolutionary trees show how closely organisms are related, built from current classification data and, for extinct species, from fossils.",
    keyIdeas: [
      "Meiosis halves the chromosome number and produces variation.",
      "A recessive characteristic needs two copies of the allele.",
      "A Punnett square gives expected proportions, not guaranteed outcomes.",
      "Selective breeding reduces variation within a population.",
      "Linnaeus: kingdom, phylum, class, order, family, genus, species.",
      "A binomial name is the genus followed by the species.",
      "The three domains are archaea, bacteria and eukaryota.",
      "Genotype: homozygous (BB or bb) or heterozygous (Bb)",
    ],
    formulae: [],
  },
  "y11-science-quantitative": {
    explanation:
      "The relative formula mass of a compound is the total of the relative atomic masses of all the atoms in its formula, and it is the bridge between masses and amounts. A balanced symbol equation has the same number of each kind of atom on both sides, which is what conservation of mass means at the level of atoms: the total mass of the products equals the total mass of the reactants. An apparent change in mass in an open container is explained by a gas entering or escaping, so magnesium burning in air gains mass as it combines with oxygen, while a metal carbonate that gives off carbon dioxide loses it. The concentration of a solution is the mass of solute dissolved in each cubic decimetre of solution. Every measurement carries some uncertainty, and a calculated answer should be given to no more significant figures than the least precise measurement that went into it.",
    keyIdeas: [
      "Relative formula mass is the total of the relative atomic masses in the formula.",
      "A balanced equation has the same atoms on each side, so mass is conserved.",
      "A mass change in an open vessel means a gas moved in or out.",
      "Concentration is the mass of solute in each cubic decimetre of solution.",
    ],
    formulae: [
      "Concentration $= \\frac{\\text{mass of solute}}{\\text{volume}}$ (g/dm$^{3}$)",
      "$1\\,\\text{dm}^{3} = 1000\\,\\text{cm}^{3}$",
    ],
  },
  "y11-science-analysis": {
    "explanation": "In chemistry, a pure substance contains one element or one compound. A mixture contains substances that are not chemically combined. A formulation is a mixture made with carefully chosen proportions to give useful properties, such as a paint. A pure substance has a characteristic sharp melting point; impurities often lower and broaden the melting range. Measurements must be compared under the same conditions, and a melting point alone is not conclusive identification. Paper chromatography separates dissolved substances because they differ in their attraction to the paper and solvent. Measure both a spot and the solvent front from the same pencil baseline. An Rf value can be compared with reference substances using the same solvent and conditions; a match supports an identification but is not unique proof. Standard gas tests are useful evidence: hydrogen gives a squeaky pop with a lighted splint, oxygen relights a glowing splint, carbon dioxide turns limewater milky and chlorine bleaches damp litmus paper. Potable water is safe to drink and may contain dissolved minerals; it need not be chemically pure. Fresh water can be filtered and sterilised; seawater needs desalination, which requires energy.",
    "keyIdeas": [
      "A pure compound is still a pure substance even though it contains more than one element.",
      "A formulation is a deliberately designed mixture.",
      "Compare Rf values only under matching conditions.",
      "Gas identification requires a diagnostic test, not just observing bubbles.",
      "Potable means safe to drink; it does not mean chemically pure."
    ],
    "formulae": [
      "$R_f = \\frac{\\text{distance travelled by the substance}}{\\text{distance travelled by the solvent front}}$"
    ]
  },
  "y11-science-atomic": {
    explanation:
      "An unstable nucleus decays at random, emitting alpha particles, beta particles or gamma radiation. An alpha particle is two protons and two neutrons, so it reduces the mass number by four and the atomic number by two; a beta particle is a fast electron from a neutron turning into a proton, so the mass number is unchanged and the atomic number rises by one; gamma radiation is energy alone and changes neither. The three types differ in penetration and ionising power: alpha is the most ionising and least penetrating, gamma the reverse. Half-life is the time taken for the activity of a source to halve, which makes decay predictable in bulk even though each individual decay is random. Radiation is hazardous because it ionises atoms in living cells, which can kill them or damage their DNA and cause cancer. Irradiation is exposure to radiation from a source outside the object; it stops when the source is removed or shielded, and the object does not become radioactive. Contamination is the unwanted presence of radioactive atoms on or inside something, and it is more dangerous because the exposure carries on, so an alpha source is the most harmful inside the body and the least harmful outside it. Protection means limiting the time, keeping your distance, shielding the source and handling it with tongs, and findings about the effects of radiation are trusted only once other scientists have checked them through peer review.",
    keyIdeas: [
      "Alpha: mass number $-4$, atomic number $-2$.",
      "Beta: mass number unchanged, atomic number $+1$.",
      "Alpha ionises most and penetrates least; gamma is the opposite.",
      "Half-life is the time for activity to halve, and each decay is random.",
      "Irradiation stops when the source is removed; contamination carries on.",
      "Inside the body alpha is the most dangerous radiation; outside it, the least.",
    ],
    formulae: [
      "Alpha decay: $^{A}_{Z}X \\rightarrow\\ ^{A-4}_{Z-2}Y + ^{4}_{2}\\alpha$",
      "Beta decay: $^{A}_{Z}X \\rightarrow\\ ^{A}_{Z+1}Y + ^{0}_{-1}\\beta$",
    ],
  },
  "y11-science-moles": {
    explanation:
      "Chemists count particles in moles. One mole of any substance contains $6.02 \\times 10^{23}$ particles, the Avogadro constant, and has a mass in grams equal to its relative formula mass, so 44 g of carbon dioxide is one mole and contains that many molecules. Dividing a mass by the relative formula mass gives the number of moles, and the balancing numbers in an equation are mole ratios, which is how the mass of product from a given mass of reactant is calculated, and how an equation is balanced from measured reacting masses. In most reactions one reactant runs out first: it is the limiting reactant, it alone fixes how much product forms, and the others are in excess. In a closed system a reversible reaction reaches equilibrium, where the forward and backward reactions go at the same rate, and Le Chatelier's principle predicts the response to a change: the equilibrium shifts to counteract it, so raising the temperature favours the endothermic direction and raising the pressure favours the side with fewer molecules of gas. In electrolysis, half equations show what happens at each electrode: positive ions gain electrons at the cathode, which is reduction, and negative ions lose electrons at the anode, which is oxidation. On a curved graph of amount against time, the rate at one moment is the gradient of the tangent drawn at that time.",
    keyIdeas: [
      "Moles $=$ mass $\\div M_{r}$, and one mole contains $6.02 \\times 10^{23}$ particles.",
      "The balancing numbers in an equation are mole ratios.",
      "The limiting reactant is used up first and sets the amount of product.",
      "An equilibrium shifts to oppose any change in its conditions.",
      "Oxidation is loss of electrons; reduction is gain.",
    ],
    formulae: [
      "$n = \\frac{m}{M_{r}}$",
      "Avogadro constant $= 6.02 \\times 10^{23}$ per mole",
      "Cathode: $\\mathrm{Cu^{2+}} + 2e^{-} \\rightarrow \\mathrm{Cu}$",
      "Anode: $2\\mathrm{Cl^{-}} \\rightarrow \\mathrm{Cl_{2}} + 2e^{-}$",
    ],
  },
  "y11-science-momentum": {
    explanation:
      "Momentum is a property of every moving object, equal to its mass multiplied by its velocity, and because velocity has a direction, so does momentum. In a closed system the total momentum before an event equals the total momentum after it, so in a collision the momentum lost by one object is gained by the other, and in an explosion that starts from rest the pieces fly apart with equal and opposite momenta that total zero. Inertia is the tendency of an object to stay at rest or keep moving at a steady velocity, and inertial mass measures how hard that velocity is to change: it is the force applied divided by the acceleration produced. A wire carrying a current at right angles to a magnetic field feels a force, and Fleming's left-hand rule gives its direction, with the first finger along the field, the second finger along the current and the thumb giving the motion; its size is the magnetic flux density multiplied by the current and the length of wire in the field. In a motor the current flows in opposite directions along the two sides of a coil, so one side is pushed up and the other down, and a split-ring commutator reverses the current every half turn so the coil keeps turning the same way. Refraction can be explained with wave fronts: when a wave front meets a slower medium at an angle, the part that enters first slows first, so the wave front swings round and the wave changes direction.",
    keyIdeas: [
      "Momentum $= mv$, and it has a direction.",
      "Total momentum is conserved in collisions and explosions.",
      "Inertial mass is force divided by acceleration.",
      "Fleming's left-hand rule: first finger field, second finger current, thumb motion.",
      "A commutator reverses the current every half turn, so a motor keeps turning.",
    ],
    formulae: [
      "$p = mv$",
      "Total momentum before $=$ total momentum after",
      "$F = B \\times I \\times l$, flux density times current times length",
      "Inertial mass $= \\frac{F}{a}$",
    ],
  },
};
