// Editorial corrections, verified against the database. Not formal teacher approval.
// Regenerate with node api/scripts/persist-editorial-source.mjs after applying reviewed plans.
export const editorialExamples = {
  "y10-computing-data-representation/example-3-core": {
    "formulae": [],
    "question": "Add two 8-bit binary numbers: A = 10110101 and B = 01101011. Show the full binary addition with carries and then shift the 8-bit result left by one bit.",
    "steps": [
      "A = 10110101 (8-bit), B = 01101011 (8-bit).",
      "A = 181 in decimal; B = 107 in decimal.",
      "181 + 107 = 288.",
      "288 ÷ 256 = 1 remainder 32, so 8-bit sum = 32, in binary 00100000.",
      "Therefore carry out from the addition = 1.",
      "Bit 0 (LSB): A0 = 1, B0 = 1, carry_in = 0 → sum0 = 0, carry_out = 1.",
      "Bit 1: A1 = 0, B1 = 1, carry_in = 1 → sum1 = 0, carry_out = 1.",
      "Bit 2: A2 = 1, B2 = 0, carry_in = 1 → sum2 = 0, carry_out = 1.",
      "Bit 3: A3 = 0, B3 = 1, carry_in = 1 → sum3 = 0, carry_out = 1.",
      "Bit 4: A4 = 1, B4 = 0, carry_in = 1 → sum4 = 0, carry_out = 1.",
      "Bit 5: A5 = 1, B5 = 1, carry_in = 1 → sum5 = 1, carry_out = 1.",
      "Bit 6: A6 = 0, B6 = 1, carry_in = 1 → sum6 = 0, carry_out = 1.",
      "Bit 7: A7 = 1, B7 = 0, carry_in = 1 → sum7 = 0, carry_out = 1.",
      "The 8-bit sum from MSB to LSB is 0 0 1 0 0 0 0 0, i.e., 00100000, with carry out 1.",
      "Now perform a left shift of the 8-bit sum by 1 bit: 00100000 << 1 = 01000000.",
      "The shifted result is 01000000 in binary (decimal 64); the carry out of the shift is 0."
    ],
    "answer": "8-bit sum = 00100000 (decimal 32); carry out = 1; after left shift by 1 bit the result = 01000000 (decimal 64); shift carry out = 0.",
    "notation": false
  },
  "y10-maths-algebra/example-0-Foundation": {
    "formulae": [],
    "question": "The perimeter of a rectangle is $P = 2l + 2w$. Rearrange the formula to make $l$ the subject. Find $l$ when $P = 26$ cm and $w = 5$ cm.",
    "steps": [
      "Subtract $2w$ from both sides: $P - 2w = 2l$.",
      "Divide both sides by 2: $l = \\frac{P - 2w}{2}$.",
      "Substitute the values: $l = \\frac{26 - 10}{2} = 8$ cm."
    ],
    "answer": "$l = \\frac{P - 2w}{2}$; the length is $8$ cm.",
    "notation": true
  },
  "y10-maths-probability/example-0-Foundation": {
    "formulae": [],
    "question": "In a class of 30 pupils, set $A$ contains the 18 pupils who play football and set $B$ contains the 12 who swim. Five pupils do both. State the number in each of the four Venn diagram regions, including outside both sets. Find $P(A \\cup B)$ for a pupil selected at random.",
    "steps": [
      "Start with the intersection: $A \\cap B$ contains 5 pupils.",
      "Football only: $18 - 5 = 13$. Swimming only: $12 - 5 = 7$.",
      "The union contains everyone in either set: $13 + 5 + 7 = 25$.",
      "Outside both sets: $30 - 25 = 5$.",
      "Therefore $P(A \\cup B) = \\frac{25}{30} = \\frac{5}{6}$."
    ],
    "answer": "$A$ only: 13; both: 5; $B$ only: 7; neither: 5. $P(A \\cup B) = \\frac{5}{6}$.",
    "notation": true
  },
  "y10-maths-probability/example-0-Higher": {
    "formulae": [],
    "question": "In a class of 30 pupils, set $A$ contains the 18 pupils who play football and set $B$ contains the 12 who swim. Five pupils do both. State the number in each of the four Venn diagram regions, including outside both sets. Find $P(A \\cup B)$ for a pupil selected at random.",
    "steps": [
      "Start with the intersection: $A \\cap B$ contains 5 pupils.",
      "Football only: $18 - 5 = 13$. Swimming only: $12 - 5 = 7$.",
      "The union contains everyone in either set: $13 + 5 + 7 = 25$.",
      "Outside both sets: $30 - 25 = 5$.",
      "Therefore $P(A \\cup B) = \\frac{25}{30} = \\frac{5}{6}$."
    ],
    "answer": "$A$ only: 13; both: 5; $B$ only: 7; neither: 5. $P(A \\cup B) = \\frac{5}{6}$.",
    "notation": true
  },
  "y10-maths-statistics/example-1-Higher": {
    "formulae": [
      "$ \\text{mean} = \\dfrac{\\text{sum of values}}{n} $",
      "$ \\text{range} = \\max(\\text{values}) - \\min(\\text{values}) $"
    ],
    "question": "Two classes took the same maths test. Class A scores: 72, 85, 90, 66, 78, 92, 70, 68, 88. Class B scores: 60, 75, 80, 85, 70, 65, 95, 78, 82, 74. Compare the distributions using the mean and range.",
    "steps": [
      "The Class A scores are $72, 85, 90, 66, 78, 92, 70, 68, 88$ points.",
      "The Class B scores are $60, 75, 80, 85, 70, 65, 95, 78, 82, 74$ points.",
      "Compute the sum for Class A: $72 + 85 + 90 + 66 + 78 + 92 + 70 + 68 + 88 = 709$.",
      "Compute the sum for Class B: $60 + 75 + 80 + 85 + 70 + 65 + 95 + 78 + 82 + 74 = 764$.",
      "Using the mean formula, mean for Class A is $\\dfrac{709}{9} \\approx 78.8$ points.",
      "Using the mean formula, mean for Class B is $\\dfrac{764}{10} = 76.4$ points.",
      "For Class A, the minimum score is $66$ and the maximum is $92$.",
      "Range_A = $92 - 66 = 26$ points.",
      "For Class B, the minimum score is $60$ and the maximum is $95$.",
      "Range_B = $95 - 60 = 35$ points.",
      "The average for Class A is higher than Class B, since $78.8$ points is greater than $76.4$ points.",
      "The spread is greater for Class B, with a range of $35$ points compared with Class A's $26$ points."
    ],
    "answer": "Class A has the higher average score on the maths test (approximately $78.8$ points) while Class B shows more variability in scores (range $35$ points).",
    "notation": true
  },
  "y10-maths-statistics/example-6-Foundation": {
    "formulae": [],
    "question": "A café records its ice-cream sales each quarter. In 2024 it sold 120, 340, 410 and 150 in quarters 1 to 4. In 2025 it sold 140, 370, 450 and 170. Describe the seasonal pattern and the trend.",
    "steps": [
      "Plot the eight values in time order, quarter 1 of 2024 to quarter 4 of 2025, and join the points with straight lines.",
      "Seasonal pattern: in both years sales are high in quarters 2 and 3 and low in quarters 1 and 4, showing the same broad seasonal pattern in the two observed years.",
      "To find the trend, compare like quarters rather than neighbouring ones: $140 - 120 = 20$, $370 - 340 = 30$, $450 - 410 = 40$ and $170 - 150 = 20$.",
      "Every quarter of 2025 is higher than the same quarter of 2024.",
      "Check with the yearly totals: $120 + 340 + 410 + 150 = 1020$ in 2024 and $140 + 370 + 450 + 170 = 1130$ in 2025."
    ],
    "answer": "In both recorded years, sales are highest in quarter 3 and lower in quarters 1 and 4. Every quarter of 2025 is higher than its 2024 counterpart, and the annual total rises from 1020 to 1130. This suggests an upward trend over these two years; it does not establish what happens every year.",
    "notation": true
  },
  "y10-maths-statistics/example-6-Higher": {
    "formulae": [],
    "question": "A school's electricity use in kWh was 18 400 in autumn 2023, 21 000 in spring 2024 and 9800 in summer 2024, then 17 100 in autumn 2024, 19 300 in spring 2025 and 9100 in summer 2025. A new energy scheme started in September 2024. The head says use fell by more than half from spring 2025 to summer 2025, so the scheme worked. Judge the claim and give a fairer measure of the change.",
    "steps": [
      "Spring 2025 to summer 2025: $\\frac{19300 - 9100}{19300} \\times 100 = 52.8\\%$ fall.",
      "Spring 2024 to summer 2024, before the scheme: $\\frac{21000 - 9800}{21000} \\times 100 = 53.3\\%$ fall. A similar spring-to-summer fall occurred before the scheme; these two years do not establish a universal pattern or its cause.",
      "Compare like terms instead: autumn $\\frac{18400 - 17100}{18400} \\times 100 = 7.1\\%$ fall, spring $\\frac{21000 - 19300}{21000} \\times 100 = 8.1\\%$ fall, summer $\\frac{9800 - 9100}{9800} \\times 100 = 7.1\\%$ fall.",
      "Yearly totals: $18400 + 21000 + 9800 = 49200$ kWh before, and $17100 + 19300 + 9100 = 45500$ kWh after.",
      "Change in the yearly total: $\\frac{49200 - 45500}{49200} \\times 100 = 7.5\\%$ fall."
    ],
    "answer": "The spring-to-summer fall alone is weak evidence for the scheme, because a similar fall occurred the previous year. Like-for-like term comparisons show reductions of about 7 to 8%, and the annual total fell by 7.5%. These comparisons better describe the change, but do not isolate the scheme's effect from other possible influences.",
    "notation": true
  },
  "y10-science-bioenergetics/example-0-Foundation": {
    "formulae": [],
    "question": "Complete the word equation for photosynthesis using carbon dioxide, water, glucose and oxygen. Then check that 6 CO2 + 6 H2O → C6H12O6 + 6 O2 is balanced and explain the role of light.",
    "steps": [
      "The reactants are carbon dioxide and water; the products are glucose and oxygen.",
      "The word equation is carbon dioxide + water → glucose + oxygen.",
      "The left side of the symbol equation has 6 carbon, 12 hydrogen and 18 oxygen atoms. The right side has the same totals.",
      "Light transfers energy for this endothermic process; it is not a chemical substance to add when balancing atoms."
    ],
    "answer": "Carbon dioxide + water → glucose + oxygen. The supplied symbol equation balances, and photosynthesis requires light energy.",
    "notation": false
  },
  "y10-science-bioenergetics/example-0-Higher": {
    "formulae": [],
    "question": "Complete the word equation for photosynthesis using carbon dioxide, water, glucose and oxygen. Then check that 6 CO2 + 6 H2O → C6H12O6 + 6 O2 is balanced and explain the role of light.",
    "steps": [
      "The reactants are carbon dioxide and water; the products are glucose and oxygen.",
      "The word equation is carbon dioxide + water → glucose + oxygen.",
      "The left side of the symbol equation has 6 carbon, 12 hydrogen and 18 oxygen atoms. The right side has the same totals.",
      "Light transfers energy for this endothermic process; it is not a chemical substance to add when balancing atoms."
    ],
    "answer": "Carbon dioxide + water → glucose + oxygen. The supplied symbol equation balances, and photosynthesis requires light energy.",
    "notation": false
  },
  "y10-science-chemical-changes/example-2-Foundation": {
    "formulae": [],
    "question": "A reaction profile has reactants above the products and a peak between them. Explain whether the reaction is exothermic or endothermic, what the peak represents and how a catalyst changes the profile.",
    "steps": [
      "The products are at a lower energy level than the reactants.",
      "Energy is transferred to the surroundings, so the reaction is exothermic.",
      "The rise from the reactant level to the peak represents the activation energy.",
      "A catalyst provides a different pathway with a lower activation energy. It does not change the reactant or product energy levels."
    ],
    "answer": "The reaction is exothermic. The peak represents the activation-energy barrier; a catalyst lowers this barrier without changing the overall energy change.",
    "notation": false
  },
  "y10-science-chemical-changes/example-2-Higher": {
    "formulae": [],
    "question": "A reaction profile has reactants at 20 kJ and products at 80 kJ, with a peak at 120 kJ. These values refer to the same stated quantity of reacting material. Calculate the overall energy change and forward activation energy. Can these values alone establish the reaction rate?",
    "steps": [
      "Overall energy change is $80 - 20 = 60$ kJ: the reaction is endothermic.",
      "Forward activation energy is $120 - 20 = 100$ kJ.",
      "The profile alone does not determine a rate. Temperature, concentrations and other conditions also matter."
    ],
    "answer": "The energy change is +60 kJ and the forward activation energy is 100 kJ. The profile alone is insufficient to calculate or rank reaction rates.",
    "notation": false
  },
  "y10-science-chemical-changes/example-6-Foundation": {
    "formulae": [],
    "question": "In a supervised school practical, how would you obtain pure, dry copper sulfate crystals from dilute sulfuric acid and insoluble copper oxide? Explain why each separation step is needed.",
    "steps": [
      "Wear eye protection and follow the teacher’s risk assessment. Gently warm the dilute acid without boiling it.",
      "Add copper oxide a little at a time with stirring until some solid remains. This excess solid shows that the acid has reacted.",
      "Filter the mixture. Excess copper oxide stays on the filter paper; copper sulfate solution passes through.",
      "Gently evaporate some water from the filtrate, without heating it to dryness, then leave it to cool so crystals form.",
      "Filter out the crystals, rinse with a little cold distilled water and dry between filter papers. These are hydrated crystals: drying removes surface water, not their water of crystallisation."
    ],
    "answer": "React the acid with excess copper oxide, filter off the excess, concentrate the solution and allow it to crystallise. Separate, rinse and dry the crystals. Using excess insoluble base avoids leaving unreacted acid in the solution.",
    "notation": false
  },
  "y10-science-chemical-changes/example-6-Higher": {
    "formulae": [],
    "question": "In a supervised school practical, how would you obtain pure, dry copper sulfate crystals from dilute sulfuric acid and insoluble copper oxide? Explain why each separation step is needed.",
    "steps": [
      "Wear eye protection and follow the teacher’s risk assessment. Gently warm the dilute acid without boiling it.",
      "Add copper oxide a little at a time with stirring until some solid remains. This excess solid shows that the acid has reacted.",
      "Filter the mixture. Excess copper oxide stays on the filter paper; copper sulfate solution passes through.",
      "Gently evaporate some water from the filtrate, without heating it to dryness, then leave it to cool so crystals form.",
      "Filter out the crystals, rinse with a little cold distilled water and dry between filter papers. These are hydrated crystals: drying removes surface water, not their water of crystallisation."
    ],
    "answer": "React the acid with excess copper oxide, filter off the excess, concentrate the solution and allow it to crystallise. Separate, rinse and dry the crystals. Using excess insoluble base avoids leaving unreacted acid in the solution.",
    "notation": false
  },
  "y10-science-chemical-changes/example-7-Foundation": {
    "formulae": [],
    "question": "At room temperature, solutions A, B and C have measured pH values of 3, 7 and 11. Classify each solution and describe how universal indicator can be used to estimate pH.",
    "steps": [
      "A has pH below 7, so it is acidic.",
      "B has pH 7, so it is neutral; C has pH above 7, so it is alkaline.",
      "Add universal indicator to a small sample and compare its colour with the supplied pH colour chart.",
      "Use a pH probe if a more precise numerical measurement is required."
    ],
    "answer": "A is acidic, B is neutral and C is alkaline. Universal indicator estimates pH by comparison with a colour chart.",
    "notation": false
  },
  "y10-science-chemical-changes/example-7-Higher": {
    "formulae": [],
    "question": "Hydrochloric acid and ethanoic acid have the same concentration. Explain which is expected to have the lower pH. A third acid solution has pH 2 rather than pH 4: how many times greater is its hydrogen-ion concentration?",
    "steps": [
      "Hydrochloric acid is a strong acid: it is completely ionised in aqueous solution.",
      "Ethanoic acid is a weak acid: it is only partly ionised, so at the same concentration it produces fewer hydrogen ions and has a higher pH.",
      "Each decrease of one pH unit increases hydrogen-ion concentration by a factor of 10.",
      "From pH 4 to pH 2 is two units, giving $10 \\times 10 = 100$."
    ],
    "answer": "At equal concentration, hydrochloric acid has the lower pH. The pH 2 solution has 100 times the hydrogen-ion concentration of the pH 4 solution.",
    "notation": false
  },
  "y10-science-infection/example-1-Foundation": {
    "question": "A bacterium enters the body. Explain three ways white blood cells can defend the body, and explain why antibodies against a different pathogen might not recognise this bacterium.",
    "steps": [
      "Some white blood cells ingest pathogens.",
      "White blood cells can produce antibodies that recognise particular antigens on pathogens.",
      "They can also make antitoxins that neutralise toxins.",
      "Antibodies are specific to particular antigens, so an antibody against a different antigen may not bind."
    ],
    "answer": "Some white blood cells ingest pathogens. White blood cells can produce antibodies that recognise particular antigens on pathogens. They can also make antitoxins that neutralise toxins. Antibodies are specific to particular antigens, so an antibody against a different antigen may not bind.",
    "formulae": [],
    "notation": false
  },
  "y10-science-infection/example-4-Foundation": {
    "formulae": [],
    "question": "A person receives a vaccine containing antigens from a pathogen in a form that does not cause the target disease. Explain why they may respond more quickly if they meet the same pathogen later.",
    "steps": [
      "The immune system recognises the antigens as foreign.",
      "White blood cells produce antibodies that recognise those antigens.",
      "Memory cells remain after the first response.",
      "On later exposure to the same pathogen, memory cells enable a quicker antibody response.",
      "A faster response helps destroy the pathogen before it causes serious illness, although protection is not always complete."
    ],
    "answer": "Vaccination can produce memory cells and prepare the immune system to make specific antibodies more quickly on later exposure, reducing the risk of disease.",
    "notation": false
  },
  "y10-science-infection/example-4-Higher": {
    "formulae": [],
    "question": "A person receives a vaccine containing antigens from a pathogen in a form that does not cause the target disease. Explain why they may respond more quickly if they meet the same pathogen later.",
    "steps": [
      "The immune system recognises the antigens as foreign.",
      "White blood cells produce antibodies that recognise those antigens.",
      "Memory cells remain after the first response.",
      "On later exposure to the same pathogen, memory cells enable a quicker antibody response.",
      "A faster response helps destroy the pathogen before it causes serious illness, although protection is not always complete."
    ],
    "answer": "Vaccination can produce memory cells and prepare the immune system to make specific antibodies more quickly on later exposure, reducing the risk of disease.",
    "notation": false
  },
  "y11-computing-databases-and-sql/example-4-core": {
    "formulae": [],
    "question": "A new student, Amelia Carter (student_id 102), is joining Year 11 with no prior results. An existing student, ID 101, has an average score of 82.0 marks from 9 exams. A new exam score of 78 marks is recorded for student 101. Show how to insert the new student record and update the existing student's average using INSERT and UPDATE statements. Use SQLite table students(student_id INTEGER PRIMARY KEY, name TEXT, year INTEGER, average_mark REAL, exams_done INTEGER). average_mark may be NULL when no exams have been taken. The supplied old average is exact for this exercise.",
    "steps": [
      "Insert the new student with NULL for an average that is not yet defined:\n```sql\nINSERT INTO students (student_id, name, year, average_mark, exams_done)\nVALUES (102, 'Amelia Carter', 11, NULL, 0);\n```",
      "For student 101, the previous total is 82.0 × 9 = 738. The new total is 738 + 78 = 816 over 10 exams.",
      "The new average is 816 ÷ 10 = 81.6.",
      "Update only student 101:\n```sql\nUPDATE students\nSET average_mark = 81.6, exams_done = 10\nWHERE student_id = 101;\n```"
    ],
    "answer": "Student 102 is inserted with no average yet (NULL) and zero exams. Student 101 now has average_mark 81.6 and exams_done 10.",
    "notation": false
  },
  "y11-maths-found-ratio/example-5-Foundation": {
    "formulae": [
      "$\\text{Percentage decrease} = \\frac{\\text{original} - \\text{new}}{\\text{original}} \\times 100\\%$"
    ],
    "question": "The price of a notebook falls from £4.80 to £3.60. Calculate the percentage decrease.",
    "steps": [
      "The price falls by $4.80 - 3.60 = 1.20$ pounds.",
      "Divide the decrease by the original price: $\\frac{1.20}{4.80} = 0.25$.",
      "The percentage decrease is $0.25 \\times 100\\% = 25\\%$."
    ],
    "answer": "A $25\\%$ decrease.",
    "notation": true
  },
  "y11-maths-found-ratio/example-6-Foundation": {
    "formulae": [
      "New amount = previous amount × percentage multiplier"
    ],
    "question": "£500 is saved at 4% compound interest per year. No money is added or withdrawn. Find the balance after two years.",
    "steps": [
      "A 4% increase uses the multiplier $1.04$.",
      "After year one: $500 \\times 1.04 = 520$, so the balance is £520.",
      "After year two: $520 \\times 1.04 = 540.80$. Interest in the second year is calculated on £520, not the original £500."
    ],
    "answer": "The balance after two years is £540.80.",
    "notation": true
  },
  "y11-maths-found-ratio/example-7-Foundation": {
    "formulae": [
      "Time = distance ÷ speed"
    ],
    "question": "A car covers a fixed distance of 120 km. At a constant speed of 40 km/h it takes 3 hours. How long would the journey take at 60 km/h? Assume there are no stops.",
    "steps": [
      "For the same distance, a greater speed means a shorter time.",
      "Use $\\text{time} = \\text{distance} \\div \\text{speed}$.",
      "The new time is $120 \\div 60 = 2$ hours.",
      "The speed is multiplied by $1.5$, so the time is divided by $1.5$: $3 \\div 1.5 = 2$."
    ],
    "answer": "The journey takes 2 hours.",
    "notation": true
  },
  "y11-science-analysis/example-1-Foundation": {
    "formulae": [],
    "question": "In a supervised demonstration, gas A relights a glowing splint, gas B gives a squeaky pop with a lighted splint, and gas C turns limewater milky. Identify each gas using the stated tests.",
    "steps": [
      "Relighting a glowing splint identifies oxygen, so A is oxygen.",
      "A squeaky pop with a lighted splint identifies hydrogen, so B is hydrogen.",
      "Turning limewater milky identifies carbon dioxide, so C is carbon dioxide.",
      "Bubbling or putting out a flame alone would not distinguish all these gases."
    ],
    "answer": "A is oxygen, B is hydrogen and C is carbon dioxide.",
    "notation": false
  },
  "y11-science-analysis/example-1-Higher": {
    "formulae": [],
    "question": "In a supervised demonstration, gas A relights a glowing splint, gas B gives a squeaky pop with a lighted splint, and gas C turns limewater milky. Identify each gas using the stated tests.",
    "steps": [
      "Relighting a glowing splint identifies oxygen, so A is oxygen.",
      "A squeaky pop with a lighted splint identifies hydrogen, so B is hydrogen.",
      "Turning limewater milky identifies carbon dioxide, so C is carbon dioxide.",
      "Bubbling or putting out a flame alone would not distinguish all these gases."
    ],
    "answer": "A is oxygen, B is hydrogen and C is carbon dioxide.",
    "notation": false
  },
  "y11-science-analysis/example-3-Foundation": {
    "formulae": [],
    "question": "Sample A is a single compound and melts sharply at 80 °C. Sample B contains several substances and melts over 62–70 °C. Paint C contains carefully chosen proportions of pigment, solvent and binder. Classify A, B and C and explain your evidence.",
    "steps": [
      "A pure substance is a single element or a single compound. A is a pure compound, and its sharp melting point is consistent with that description.",
      "B is a mixture because it contains more than one substance. Its melting range is also consistent with a mixture.",
      "C is a formulation: a mixture deliberately designed so its components give particular properties.",
      "Do not identify a substance from melting point alone; different substances can have similar melting points."
    ],
    "answer": "A is a pure compound, B is a mixture and C is a formulation. A formulation is also a mixture.",
    "notation": false
  },
  "y11-science-analysis/example-3-Higher": {
    "formulae": [],
    "question": "Sample A is a single compound and melts sharply at 80 °C. Sample B contains several substances and melts over 62–70 °C. Paint C contains carefully chosen proportions of pigment, solvent and binder. Classify A, B and C and explain your evidence.",
    "steps": [
      "A pure substance is a single element or a single compound. A is a pure compound, and its sharp melting point is consistent with that description.",
      "B is a mixture because it contains more than one substance. Its melting range is also consistent with a mixture.",
      "C is a formulation: a mixture deliberately designed so its components give particular properties.",
      "Do not identify a substance from melting point alone; different substances can have similar melting points."
    ],
    "answer": "A is a pure compound, B is a mixture and C is a formulation. A formulation is also a mixture.",
    "notation": false
  },
  "y11-science-analysis/example-4-Foundation": {
    "formulae": [
      "$R_f = \\frac{\\text{distance travelled by substance}}{\\text{distance travelled by solvent front}}$"
    ],
    "question": "In paper chromatography, two dye spots travel 2.0 cm and 6.0 cm from the pencil baseline. The solvent front travels 8.0 cm from that baseline. Calculate both Rf values. Reference dyes tested under the same conditions have Rf values of 0.25 for A and 0.75 for B. What do the results suggest?",
    "steps": [
      "Divide each spot distance by the solvent-front distance, measured from the same baseline.",
      "First spot: $2.0 \\div 8.0 = 0.25$.",
      "Second spot: $6.0 \\div 8.0 = 0.75$.",
      "These match the reference values for A and B under the same conditions, supporting those identifications; matching Rf values are not unique proof of identity."
    ],
    "answer": "The Rf values are 0.25 and 0.75. They are consistent with dyes A and B.",
    "notation": false
  },
  "y11-science-analysis/example-4-Higher": {
    "formulae": [
      "$R_f = \\frac{\\text{distance travelled by substance}}{\\text{distance travelled by solvent front}}$"
    ],
    "question": "In paper chromatography, two dye spots travel 2.0 cm and 6.0 cm from the pencil baseline. The solvent front travels 8.0 cm from that baseline. Calculate both Rf values. Reference dyes tested under the same conditions have Rf values of 0.25 for A and 0.75 for B. What do the results suggest?",
    "steps": [
      "Divide each spot distance by the solvent-front distance, measured from the same baseline.",
      "First spot: $2.0 \\div 8.0 = 0.25$.",
      "Second spot: $6.0 \\div 8.0 = 0.75$.",
      "These match the reference values for A and B under the same conditions, supporting those identifications; matching Rf values are not unique proof of identity."
    ],
    "answer": "The Rf values are 0.25 and 0.75. They are consistent with dyes A and B.",
    "notation": false
  },
  "y11-science-homeostasis/example-1-Foundation": {
    "formulae": [],
    "question": "Blood glucose rises after a meal. Explain how insulin helps bring it back towards its usual range.",
    "steps": [
      "The pancreas detects the rise in blood glucose and releases insulin.",
      "Insulin causes glucose to move from the blood into cells.",
      "It promotes conversion of glucose to glycogen for storage in liver and muscle.",
      "These changes lower blood glucose towards its usual range."
    ],
    "answer": "Insulin from the pancreas lowers blood glucose by promoting uptake and glycogen storage.",
    "notation": false
  },
  "y11-science-homeostasis/example-1-Higher": {
    "formulae": [],
    "question": "Explain how insulin and glucagon help correct both a rise and a fall in blood glucose.",
    "steps": [
      "A rise in blood glucose stimulates the pancreas to release insulin.",
      "Insulin promotes glucose uptake and storage as glycogen in liver and muscle, reducing blood glucose.",
      "A fall in blood glucose stimulates the pancreas to release glucagon.",
      "Glucagon causes the liver to convert glycogen to glucose and release it into the blood.",
      "As blood glucose returns towards its usual range, the original stimulus is reduced: this is negative feedback."
    ],
    "answer": "Insulin lowers blood glucose and glucagon raises it. Negative feedback reduces the change that triggered hormone release.",
    "notation": false
  },
  "y11-science-quantitative/example-3-Foundation": {
    "question": "In the balanced equation 2 H2 + O2 → 2 H2O, explain the ratio of hydrogen molecules to oxygen molecules. How many water molecules form when 8 hydrogen molecules react completely with enough oxygen?",
    "steps": [
      "The coefficients give a ratio of 2 hydrogen molecules to 1 oxygen molecule.",
      "Eight hydrogen molecules react with 4 oxygen molecules.",
      "They form 8 water molecules, because the hydrogen-to-water molecule ratio is 2 to 2, equivalent to 1 to 1."
    ],
    "answer": "The coefficients give a ratio of 2 hydrogen molecules to 1 oxygen molecule. Eight hydrogen molecules react with 4 oxygen molecules. They form 8 water molecules, because the hydrogen-to-water molecule ratio is 2 to 2, equivalent to 1 to 1.",
    "formulae": [],
    "notation": false
  },
  "y11-science-quantitative/example-5-Foundation": {
    "question": "A measurement is recorded as 70.46 g. Round it to three significant figures and explain why it should not be reported with extra invented decimal places.",
    "steps": [
      "The first three significant digits are the two digits before the decimal point and the 4 after it.",
      "The next digit is 6, so the rounded value is 70.5 g.",
      "Extra invented digits would imply more precision than the measurement provides."
    ],
    "answer": "70.5 g to three significant figures.",
    "formulae": [],
    "notation": false
  },
  "y11-science-rates/example-0-Foundation": {
    "question": "A reaction produces 40 cm³ of gas in 20 seconds. Calculate its mean rate in cm³/s. Does this mean the rate was constant throughout?",
    "steps": [
      "Mean rate is total gas volume divided by the time interval.",
      "40 ÷ 20 = 2 cm³/s.",
      "This is an average; the rate may have changed during the interval."
    ],
    "answer": "The mean rate is 2 cm³/s. It does not show that the rate stayed constant.",
    "formulae": [
      "Mean rate = quantity of product formed ÷ time"
    ],
    "notation": false
  },
  "y7-computing-algorithms-and-decomposition/example-4-core": {
    "formulae": [],
    "question": "In the sorted list [3, 7, 12, 18, 21, 28, 34, 41], find the value 28 using linear search and binary search. Count the number of comparisons made in each method. For binary search, choose the lower middle item when there are two middle items.",
    "steps": [
      "Linear search: compare 28 with element at index 0 (3); 28 ≠ 3.",
      "Linear search: compare 28 with element at index 1 (7); 28 ≠ 7.",
      "Linear search: compare 28 with element at index 2 (12); 28 ≠ 12.",
      "Linear search: compare 28 with element at index 3 (18); 28 ≠ 18.",
      "Linear search: compare 28 with element at index 4 (21); 28 ≠ 21.",
      "Linear search: compare 28 with element at index 5 (28); 28 = 28; found.",
      "Binary search first compares 28 with 18, the lower middle value. As 28 is larger, keep [21, 28, 34, 41].",
      "Compare 28 with the lower middle value of that remaining group: 28. It is found on the second comparison."
    ],
    "answer": "Linear search finds 28 after 6 comparisons; Binary search finds 28 after 2 comparisons.",
    "notation": false
  },
  "y7-computing-programming-foundations/example-4-core": {
    "formulae": [],
    "question": "This Python program should print the mean of 2, 4, 6 and 8. Correct its missing colon and its incorrect divisor.\n\n```python\nnumbers = [2, 4, 6, 8]\ntotal = 0\nfor n in numbers\n    total += n\naverage = total / 3\nprint(\"Average is\", average)\n```",
    "steps": [
      "Add a colon after `for n in numbers:` so the loop header is valid.",
      "The indented addition runs once for each number: 2 + 4 + 6 + 8 = 20.",
      "There are four numbers. Divide by `len(numbers)`, which is 4, instead of 3.",
      "The mean is 20 ÷ 4 = 5.0. The comma in the print call allows the text and number to be printed together."
    ],
    "answer": "```python\nnumbers = [2, 4, 6, 8]\ntotal = 0\nfor n in numbers:\n    total += n\naverage = total / len(numbers)\nprint(\"Average is\", average)\n```\nOutput: Average is 5.0",
    "notation": false
  },
  "y7-design-technology-forces-and-structures/example-1-core": {
    "formulae": [],
    "question": "A model rectangular frame has four stiff strips joined by pivots at the corners. When pushed sideways, it leans into a parallelogram. Explain how one extra strip can make the frame resist this movement.",
    "steps": [
      "Notice that the pivot joints let the rectangle change its corner angles while the four side lengths stay the same.",
      "Add a stiff diagonal brace between two opposite corners.",
      "The diagonal divides the frame into two triangles. A triangle with fixed side lengths cannot change shape without a member deforming or a joint moving.",
      "Secure the brace and compare the frame before and after using the same gentle sideways push."
    ],
    "answer": "Fix a diagonal brace between opposite corners. It forms two triangles and reduces sideways racking, provided the members and connections are sufficiently stiff and secure.",
    "notation": false
  },
  "y7-design-technology-materials-tools-and-safety/example-4-core": {
    "formulae": [],
    "question": "A piece of timber is 200 mm long and 60 mm wide. A line must be marked right across the 60 mm width, exactly 6.5 cm from the left-hand end. Using a steel rule, a try square and a pencil, describe how to mark it accurately. Assume the left end is already square to the straight long reference edge; check this before marking.",
    "steps": [
      "Convert the measurement into the units marked on the rule: 6.5 cm = 6.5 x 10 = 65 mm.",
      "Lay the timber flat on the bench with the left-hand end towards you, and pick one long edge as the face edge to work from.",
      "Lay the steel rule along the timber with its 0 mm mark flush against the left-hand end, and mark a light pencil point at 65 mm.",
      "Hold the stock of the try square firmly against the face edge, which is the long edge and not the end, and slide it until the blade meets the 65 mm mark.",
      "Draw along the blade to mark the line right across the 60 mm width. Because the stock ran along the face edge, the line is square to that edge, and so runs parallel to the left-hand end.",
      "Check it by measuring from the left-hand end to the line at both sides of the timber: both should read 65 mm. If they differ, recheck the original end for squareness, the rule position, the pencil marks and contact between the stock and reference edge."
    ],
    "answer": "A pencil line across the full 60 mm width, 65 mm from the left-hand end, square to the face edge and so parallel to that end. Measuring 65 mm at both sides of the timber is what confirms it.",
    "notation": false
  },
  "y7-science-reproduction/example-4-core": {
    "formulae": [],
    "question": "A flowering plant is pollinated and later produces seeds. Explain the sequence from pollination to fertilisation, seed dispersal and germination. In a test, 14 of 20 seeds germinate after a week. Calculate the percentage that germinated.",
    "steps": [
      "Pollination transfers pollen from an anther to a stigma. Pollen grains contain male gametes; a pollen grain is not itself a gamete.",
      "After pollination, a pollen tube can grow towards an ovule. A male gamete fuses with the egg cell during fertilisation.",
      "After fertilisation, the ovule develops into a seed. Seeds are then dispersed, for example by wind or animals.",
      "Germination needs suitable water, oxygen and temperature; the embryo resumes growth.",
      "The percentage that germinated is 14 ÷ 20 × 100 = 70%."
    ],
    "answer": "Pollination is followed by fertilisation, seed formation and dispersal. Germination occurs in suitable conditions. In this test, 70% of the seeds germinated.",
    "notation": false
  },
  "y8-english-accuracy/example-4-core": {
    "formulae": [],
    "question": "mary said i cant wait for the weekend Rewrite the sentence with correct punctuation for direct speech in British English, including capital letters for the speaker's name and for I, enclosing the spoken words in quotation marks, and placing a comma after the reporting clause.",
    "steps": [
      "Identify the three parts of the sentence: mary / said / i cant wait for the weekend",
      "Capitalise the name and the pronoun and correct cant to can't; the spoken words become I can't wait for the weekend",
      "Add quotation marks around the spoken words and a comma after the reporting clause: Mary said, 'I can't wait for the weekend'",
      "End the direct speech with a full stop inside the closing quotation marks: Mary said, 'I can't wait for the weekend.'"
    ],
    "answer": "Mary said, “I can’t wait for the weekend.”",
    "notation": false
  },
  "y8-english-argument/example-2-core": {
    "formulae": [],
    "question": "Argue for or against the statement 'Year 8 students should have longer lunch breaks at school.' Your answer must present a clear claim, at least two reasons with simple evidence or examples, a counter-argument with a rebuttal, and a conclusion. Use linking words to show the structure. The final judgement should be written in the single sentence you will place in the ANSWER line.",
    "steps": [
      "Claim and first reason: Year 8 students should have a slightly longer lunch break. Firstly, more time would help pupils eat without rushing, especially when queues are long.",
      "Second reason and explanation: Secondly, time to talk or take part in a quiet activity could help pupils return to lessons feeling settled. Different pupils may prefer different activities.",
      "Counterargument and rebuttal: Some argue that longer lunch would cost too much teaching time. That concern is not a reason to reject every small change: a carefully scheduled extension could be worthwhile if pupils return ready to learn. A short trial should test the benefits against the timetable cost.",
      "Conclusion: Therefore, the school should trial a modest extension and evaluate its effect on eating time, punctuality and afternoon learning."
    ],
    "answer": "The school should trial a modestly longer Year 8 lunch break and review the benefits alongside its effect on the timetable.",
    "notation": false
  },
  "y8-history-stuarts-and-civil-war/example-4-core": {
    "formulae": [],
    "question": "Describe the trial and execution of Charles I.",
    "steps": [
      "After the Civil War had ended with Parliamentarian victory, Charles I was captured and held prisoner. Parliament then set up the High Court of Justice to try him.",
      "The High Court sat at Westminster Hall and charged Charles with high treason for waging war against Parliament and the people; he refused to recognise the court's authority.",
      "He entered no plea, on the grounds that no court could lawfully try its own king. Because he refused to plead and offered no defence, the court heard only the case against him before reaching its verdict.",
      "The court found him guilty of high treason and sentenced him to death.",
      "On 30 January 1649 Charles I was beheaded with an axe on a scaffold outside the Banqueting House at Whitehall. The executioner's identity is uncertain.",
      "The execution shocked many and helped bring about the temporary end of the monarchy, leading to the Commonwealth in 1649; Cromwell became Lord Protector in 1653."
    ],
    "answer": "Charles I was tried by a High Court of Justice set up by Parliament, found guilty of high treason, and beheaded on 30 January 1649 at Whitehall; his death led to the temporary abolition of the monarchy and the rise of the Commonwealth.",
    "notation": false
  },
  "y8-maths-data/example-3-core": {
    "formulae": [
      "$\\text{Sector angle} = \\frac{\\text{frequency}}{\\text{total frequency}} \\times 360^\\circ$"
    ],
    "question": "In a Year 8 maths class, a survey of favourite fruit was completed by 35 students. The results were apples 12, bananas 8, oranges 10, and grapes 5. Construct and interpret a pie chart for these data.",
    "steps": [
      "Calculate the total number of responses: $T = 12 + 8 + 10 + 5 = 35$.",
      "Apples angle: $\\text{angle}_{\\text{Apples}} = \\left( \\frac{12}{35} \\right) \\times 360^\\circ = \\frac{4320}{35} \\approx 123.43^\\circ$.",
      "Bananas angle: $\\text{angle}_{\\text{Bananas}} = \\left( \\frac{8}{35} \\right) \\times 360^\\circ = \\frac{2880}{35} \\approx 82.29^\\circ$.",
      "Oranges angle: $\\text{angle}_{\\text{Oranges}} = \\left( \\frac{10}{35} \\right) \\times 360^\\circ = \\frac{3600}{35} \\approx 102.86^\\circ$.",
      "Grapes angle: $\\text{angle}_{\\text{Grapes}} = \\left( \\frac{5}{35} \\right) \\times 360^\\circ = \\frac{1800}{35} \\approx 51.43^\\circ$.",
      "Check total: $123.43^\\circ + 82.29^\\circ + 102.86^\\circ + 51.43^\\circ \\approx 360.01^\\circ$, which is about $360^\\circ$.",
      "Rounding each sector independently to a whole degree gives 123°, 82°, 103° and 51°, totalling 359°.",
      "For a practical whole-degree construction, use 124°, 82°, 103° and 51° so the chart closes at 360°. This deliberately adjusts the largest remaining fractional sector by 1°; it is an approximation, not independent nearest-degree rounding.",
      "Label the sectors and add a key. Apples is the largest group: 12 of 35, about 34.3%."
    ],
    "answer": "Exact sector angles are approximately 123.43°, 82.29°, 102.86° and 51.43°. One practical whole-degree construction is 124°, 82°, 103° and 51°, totalling 360°. Apples forms the largest sector.",
    "notation": true
  },
  "y8-science-reactions/example-2-core": {
    "formulae": [
      "m_before = m_after"
    ],
    "question": "A sealed container holds 3.0 g of magnesium (Mg) and 2.0 g of oxygen gas (O2). They react to form magnesium oxide (MgO). Since the container is sealed, no mass can escape. What is the mass of the contents before and after the reaction?",
    "steps": [
      "Mass of magnesium = 3.0 g; mass of oxygen gas = 2.0 g.",
      "Total mass before reaction = 3.0 g + 2.0 g = 5.0 g.",
      "After reaction, inside the sealed container nothing escapes, so mass after reaction = 5.0 g.",
      "Therefore m_before = m_after = 5.0 g; conservation of mass is demonstrated."
    ],
    "answer": "The mass of the contents is 5.0 g before the reaction and 5.0 g after it. No matter enters or leaves the sealed container.",
    "notation": false
  },
  "y9-computing-artificial-intelligence-and-machine-learning/example-1-core": {
    "question": "A school wants a model to classify photographs as containing a bicycle or not. Explain how labelled examples could be used to train and test the model.",
    "steps": [
      "Collect a suitable range of photographs and label each correctly as bicycle or no bicycle. Include varied backgrounds and viewpoints.",
      "Set aside a separate set of labelled photographs for testing; do not use them to train the model.",
      "During training, the learning algorithm uses the labelled examples to adjust the model so its predictions better match the training labels.",
      "Test the trained model on the held-out photographs and compare its predictions with their labels.",
      "Inspect mistakes and limitations. Good performance on training photographs alone does not show that the model will work on unfamiliar photographs."
    ],
    "answer": "Train using varied, correctly labelled examples and assess performance on separate, unseen test examples. Check mistakes and bias before relying on its predictions.",
    "formulae": [],
    "notation": false
  },
  "y9-history-war-and-the-holocaust/example-0-core": {
    "formulae": [],
    "question": "Explain how persecution escalated from discrimination to mass murder in Nazi Germany and occupied Europe between 1933 and 1942.",
    "steps": [
      "Nazi antisemitic persecution began in 1933 with boycotts, exclusionary laws and violence. The Nuremberg Laws of 1935 further excluded Jews from citizenship and restricted marriage and relationships.",
      "The November 1938 pogrom, often called Kristallnacht, escalated organised violence: synagogues and businesses were attacked, Jews were murdered and around 30,000 Jewish men were sent to concentration camps.",
      "After the invasion of Poland in 1939, German occupation brought forced segregation, dispossession and ghettos with overcrowding, hunger and disease.",
      "The invasion of the Soviet Union in 1941 was followed by mass shootings of Jews by German killing units and collaborators. Mass murder was already under way before January 1942.",
      "The Wannsee Conference in January 1942 coordinated governmental participation in the Nazi programme of genocide. Killing centres and deportations formed part of its systematic implementation.",
      "Escalation resulted from Nazi racist ideology, state decisions, wartime conquest and collaboration; it was not an automatic or inevitable sequence."
    ],
    "answer": "Persecution escalated from exclusion and violence from 1933 to dispossession and ghettos, then systematic mass murder during the war. The 1942 Wannsee Conference coordinated an existing genocidal programme; it did not mark the first murder of Jews or the beginning of Nazi persecution.",
    "notation": false
  },
  "y9-maths-powers/example-0-core": {
    "formulae": [
      "$a^m \\times a^n = a^{m+n}$",
      "$a^m \\div a^n = a^{m-n}$, for $a \\ne 0$"
    ],
    "question": "Simplify $\\frac{x^5 \\times x^2}{x^3}$, where $x \\ne 0$.",
    "steps": [
      "The numerator multiplies powers with the same base, so add the indices: $x^5 \\times x^2 = x^7$.",
      "Divide powers with the same non-zero base by subtracting the indices: $x^7 \\div x^3 = x^{7-3}$.",
      "Simplify the index: $7-3=4$."
    ],
    "answer": "$x^4$",
    "notation": true
  },
  "y9-maths-powers/example-1-core": {
    "formulae": [],
    "question": "Estimate $\\sqrt{50}$ to one decimal place without a calculator. Show how you check the rounding.",
    "steps": [
      "Since $7^2=49$ and $8^2=64$, the root lies between $7$ and $8$.",
      "Since $7.0^2=49$ and $7.1^2=50.41$, it lies between $7.0$ and $7.1$.",
      "The rounding midpoint is $7.05$. Its square is $49.7025$, which is less than $50$, so the root is above $7.05$.",
      "The root is between $7.05$ and $7.1$, so it rounds to $7.1$ to one decimal place."
    ],
    "answer": "$\\sqrt{50} \\approx 7.1$ to one decimal place.",
    "notation": true
  },
  "y9-maths-powers/example-2-core": {
    "formulae": [
      "$(a \\times 10^m)(b \\times 10^n) = ab \\times 10^{m+n}$"
    ],
    "question": "Calculate $(4 \\times 10^5)(3 \\times 10^{-2})$. Give your answer in standard form.",
    "steps": [
      "Multiply the coefficients: $4 \\times 3=12$.",
      "Multiply the powers of ten by adding their indices: $10^5 \\times 10^{-2}=10^3$.",
      "The product is $12 \\times 10^3$. Rewrite $12$ as $1.2 \\times 10$ to obtain $1.2 \\times 10^4$.",
      "Check using ordinary numbers: $400000 \\times 0.03=12000$."
    ],
    "answer": "$1.2 \\times 10^4$",
    "notation": true
  },
  "y9-maths-powers/example-3-core": {
    "formulae": [
      "$x \\times 10^{-n}=x \\div 10^n$"
    ],
    "question": "Calculate $4.56 \\times 10^3$ and $4.56 \\times 10^{-2}$.",
    "steps": [
      "$10^3=1000$. Multiplying $4.56$ by $1000$ moves its digits three place-value columns to the left: $4560$.",
      "$10^{-2}=\\frac{1}{100}$. Multiplying by this is dividing by $100$, which gives $0.0456$.",
      "Check the sizes: multiplying by $1000$ increases this positive number, while dividing by $100$ reduces it."
    ],
    "answer": "$4560$ and $0.0456$, respectively.",
    "notation": true
  },
  "y9-maths-powers/example-4-core": {
    "formulae": [],
    "question": "Write $0.00072$ in standard form, then write $5.3 \\times 10^4$ as an ordinary number.",
    "steps": [
      "For $0.00072$, choose the coefficient $7.2$, which is at least $1$ and less than $10$.",
      "To recover $0.00072$ from $7.2$, divide by $10000$, so use the exponent $-4$: $7.2 \\times 10^{-4}$.",
      "For the second number, multiply $5.3$ by $10000$ to get $53000$.",
      "Reverse each conversion to check that its value has stayed the same."
    ],
    "answer": "$7.2 \\times 10^{-4}$ and $53000$, respectively.",
    "notation": true
  },
  "y9-maths-powers/example-5-core": {
    "formulae": [],
    "question": "Calculate $3^2 + \\sqrt{(16+9)} \\times 2$.",
    "steps": [
      "Evaluate the brackets under the root sign: $16+9=25$.",
      "Evaluate the power and root: $3^2=9$ and $\\sqrt{25}=5$. The expression becomes $9+5 \\times 2$.",
      "Multiply before adding: $5 \\times 2=10$.",
      "Finally add: $9+10=19$."
    ],
    "answer": "$19$",
    "notation": true
  },
  "y9-science-bioenergetics/example-3-core": {
    "formulae": [
      "6 CO2 + 6 H2O → C6H12O6 + 6 O2",
      "C6H12O6 + 6 O2 → 6 CO2 + 6 H2O"
    ],
    "question": "Write balanced symbol equations for photosynthesis and aerobic respiration. Explain the direction of energy transfer in each process.",
    "steps": [
      "Photosynthesis uses carbon dioxide and water to make glucose and oxygen.",
      "Balance the atoms: 6 CO2 + 6 H2O → C6H12O6 + 6 O2. Both sides contain 6 carbon, 12 hydrogen and 18 oxygen atoms.",
      "Photosynthesis requires energy transferred from light; energy is not a chemical substance in the balanced equation.",
      "Aerobic respiration uses glucose and oxygen: C6H12O6 + 6 O2 → 6 CO2 + 6 H2O. The atoms balance.",
      "Respiration releases energy for living processes. It occurs in plant cells as well as animal cells."
    ],
    "answer": "Photosynthesis: 6 CO2 + 6 H2O → C6H12O6 + 6 O2 (requires light energy). Aerobic respiration: C6H12O6 + 6 O2 → 6 CO2 + 6 H2O (releases energy).",
    "notation": false
  },
  "y9-science-genetics/example-4-core": {
    "formulae": [],
    "question": "In pea plants, seed shape is controlled by a single gene with the dominant allele R for Round and the recessive allele r for Wrinkled. If two heterozygous plants (Rr) are crossed, what are the probabilities for the offspring genotypes and phenotypes?",
    "steps": [
      "Parental genotypes are Rr × Rr; each parent can produce gametes R or r.",
      "Possible gametes from each parent are R and r, so the gamete options combine as R with R, R with r, r with R, and r with r.",
      "Create a 2×2 Punnett square with columns labeled R and r (from one parent) and rows labeled R and r (from the other parent).",
      "Fill the four boxes with the offspring genotypes: RR, Rr, Rr, rr.",
      "Count the four equally likely allele combinations: RR appears once, Rr twice and rr once. These are possible outcomes, not four guaranteed offspring.",
      "Determine phenotypes: Round (dominant) for RR and Rr; Wrinkled for rr.",
      "Calculate genotype probabilities: P(RR) = 1/4 = 25%; P(Rr) = 2/4 = 50%; P(rr) = 1/4 = 25%.",
      "Calculate phenotype probabilities: P(Round) = P(RR) + P(Rr) = 3/4 = 75%; P(Wrinkled) = P(rr) = 1/4 = 25%."
    ],
    "answer": "Genotypes: RR 25%, Rr 50%, rr 25%; Phenotypes: Round 75%, Wrinkled 25%",
    "notation": false
  }
};
