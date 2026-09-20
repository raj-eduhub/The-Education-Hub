// Authored maths explanations, one per catalogue topic.
//
// These replace the old behaviour, where every topic's "explanation" was its
// one-line goal restated. A goal says what the topic is for; a learner opening
// Learn mode needs to be told the thing itself. Nothing here is generated, so
// no model call stands between a learner and the core teaching text.
//
// British English, KS3/KS4 vocabulary, and no content above the tier the topic
// belongs to. Formulae are written for the maths typesetter.
export const mathsContent = {
  // ---- Year 7 ------------------------------------------------------------
  "y7-maths-number": {
    explanation:
      "Place value tells you what a digit is worth: in 4,207 the 2 is worth two hundred, and in 0.42 it is worth two hundredths. Ordering numbers means comparing them column by column from the largest place value down, which is why 0.5 is larger than 0.45 even though 45 is larger than 5. Factors are the whole numbers that divide into a number exactly, multiples are what you get from its times table, and every whole number above 1 breaks down into prime factors in exactly one way. Negative numbers continue the number line to the left of zero, so subtracting a negative moves you back to the right.",
    keyIdeas: [
      "Compare decimals by place value, not by the number of digits.",
      "Factors divide into a number; multiples come out of its times table.",
      "The highest common factor and lowest common multiple come from prime factors.",
      "Adding a negative moves left; subtracting a negative moves right.",
    ],
    formulae: ["Subtracting a negative: $a - (-b) = a + b$", "Multiplying signs: $(-) \\times (-) = (+)$"],
  },
  "y7-maths-primes": {
    explanation:
      "A prime number has exactly two factors: itself and 1. That is why 1 is not prime, and why 2 is the only even prime. Every other whole number above 1 can be broken into primes multiplied together, and there is only one way to do it however you start, so $60 = 2 \times 2 \times 3 \times 5$ whether you split off the 6 first or the 10. Writing two numbers as products of primes is what makes the rest easy to see. The highest common factor is built from the primes they share, and it is the largest number that divides into both. The lowest common multiple is built from every prime either of them needs, and it is the smallest number they both divide into, which is what you want when two repeating events line up again.",
    keyIdeas: [
      "A prime has exactly two factors, so 1 is not prime and 2 is the only even one.",
      "Every whole number above 1 is a product of primes in exactly one way.",
      "The highest common factor is made from the primes both numbers share.",
      "The lowest common multiple takes every prime either number needs, at its higher power.",
    ],
    formulae: [
      "Product of primes: $60 = 2^{2} \times 3 \times 5$",
      "Linking the two: $\text{HCF} \times \text{LCM} = a \times b$",
    ],
  },
  "y7-maths-fractions": {
    explanation:
      "A fraction, a decimal and a percentage are three ways of writing the same amount: $\\frac{3}{4}$, $0.75$ and $75\\%$ are identical. Simplifying a fraction means dividing the numerator and denominator by the same number until no common factor is left. To compare fractions you need a common denominator, because quarters and fifths cannot be compared directly. Finding a fraction or percentage of an amount is multiplication: divide by the denominator and multiply by the numerator, or multiply by the percentage as a decimal.",
    keyIdeas: [
      "Fractions, decimals and percentages are the same quantity written differently.",
      "Simplify by dividing top and bottom by a common factor.",
      "Compare fractions by rewriting them with a common denominator.",
      "A percentage of an amount is found by multiplying, not by adding.",
    ],
    formulae: [
      "Percentage of an amount: $\\frac{\\text{percentage}}{100} \\times \\text{amount}$",
      "Fraction to decimal: divide the numerator by the denominator",
    ],
  },
  "y7-maths-algebra": {
    explanation:
      "Algebra uses a letter to stand for a number you do not yet know, so $3n$ means three lots of whatever $n$ is. Like terms contain exactly the same letter to the same power, so $4a$ and $7a$ collect into $11a$, but $4a$ and $7b$ cannot be combined. Substituting means replacing the letter with a given value and then calculating, following the usual order of operations. Solving an equation means undoing what has been done to the unknown, doing the same thing to both sides so the balance is kept.",
    keyIdeas: [
      "A letter stands for a number, and $3n$ means $3 \\times n$.",
      "Only like terms collect: $4a + 7a = 11a$, but $4a + 7b$ does not simplify.",
      "Substitute the value, then follow the order of operations.",
      "Whatever you do to one side of an equation, do to the other.",
    ],
    formulae: ["To solve $x + a = b$, use $x = b - a$", "To solve $ax = b$, use $x = \\frac{b}{a}$"],
  },
  "y7-maths-geometry": {
    explanation:
      "Angle facts let you find a missing angle without measuring. Angles on a straight line total $180^\\circ$, angles around a point total $360^\\circ$, and the angles in any triangle total $180^\\circ$. Polygons are named by their number of sides, and a regular polygon has all sides and all angles equal. Perimeter is the distance round the outside, measured in units of length; area is the space inside, measured in square units, and a compound shape can be split into rectangles and triangles whose areas are added.",
    keyIdeas: [
      "Angles on a straight line total $180^\\circ$; angles at a point total $360^\\circ$.",
      "The angles of any triangle total $180^\\circ$, whatever its shape.",
      "Perimeter uses length units; area uses square units.",
      "Split a compound shape into rectangles and triangles, then add the areas.",
    ],
    formulae: [
      "Rectangle area $= \\text{length} \\times \\text{width}$",
      "Triangle area $= \\frac{1}{2} \\times \\text{base} \\times \\text{height}$",
      "Angles in a triangle $= 180^\\circ$",
    ],
  },
  "y7-maths-ratio": {
    explanation:
      "A ratio compares two or more quantities without saying how much there is in total: $3:2$ says that for every 3 of the first there are 2 of the second. Ratios simplify like fractions, by dividing every part by a common factor. To share an amount in a ratio, add the parts to find how many parts there are altogether, divide the amount by that total to find one part, then multiply. The unitary method solves rate problems by first finding the value of one unit.",
    keyIdeas: [
      "A ratio compares parts; a fraction compares a part with the whole.",
      "Simplify a ratio by dividing every part by the same number.",
      "To share in a ratio: total the parts, find one part, then multiply.",
      "The unitary method finds the value of one, then scales up.",
    ],
    formulae: ["Value of one part $=$ total amount $\\div$ total number of parts"],
  },
  "y7-maths-coordinates": {
    explanation:
      "A coordinate pair $(x, y)$ gives a position: across first, then up or down. The axes divide the grid into four quadrants, and coordinates can be negative in three of them. A translation slides a shape without turning or resizing it, described by a vector giving the movement across and up. A reflection flips a shape across a mirror line, with each point ending the same distance from the line on the opposite side; a rotation turns it about a centre through a given angle and direction.",
    keyIdeas: [
      "Read coordinates across first, then up: $(x, y)$.",
      "A translation is described by a column vector.",
      "A reflected point sits the same distance from the mirror line, on the other side.",
      "A rotation needs a centre, an angle and a direction.",
    ],
    formulae: ["Translation by $\\binom{a}{b}$: $(x, y) \\rightarrow (x + a, y + b)$"],
  },

  // ---- Year 8 ------------------------------------------------------------
  "y8-maths-ratio": {
    explanation:
      "Proportional reasoning is multiplicative: if a recipe doubles, every ingredient doubles. A scale factor is the number you multiply by to get from one quantity to the corresponding one, found by dividing the new value by the original. Direct proportion means that as one quantity multiplies, so does the other, and their ratio stays constant. Recipes, maps, currency conversion and best-buy comparisons are all the same piece of mathematics wearing different clothes.",
    keyIdeas: [
      "Proportion works by multiplying, never by adding a fixed amount.",
      "Scale factor $=$ new value $\\div$ original value.",
      "In direct proportion the ratio between the quantities stays the same.",
      "Find the value of one unit to compare prices fairly.",
    ],
    formulae: ["Scale factor $= \\frac{\\text{new length}}{\\text{original length}}$"],
  },
  "y8-maths-linear": {
    explanation:
      "A linear sequence goes up or down by the same amount each time, and that common difference is the multiplier in its $n$th-term rule. If the difference is 3 the rule starts with $3n$, and you then adjust by whatever is needed to make the first term correct. A two-step equation is undone in reverse order: deal with the addition or subtraction first, then the multiplication or division. Plotting $y = mx + c$ gives a straight line whose steepness is $m$ and which crosses the $y$-axis at $c$.",
    keyIdeas: [
      "The common difference becomes the coefficient of $n$.",
      "Adjust the rule so that $n = 1$ gives the first term.",
      "Undo a two-step equation in reverse order.",
      "In $y = mx + c$, $m$ is the gradient and $c$ is the $y$-intercept.",
    ],
    formulae: ["Linear sequence: $n$th term $=$ difference $\\times n +$ adjustment", "Straight line: $y = mx + c$"],
  },
  "y8-maths-measures": {
    explanation:
      "The area of a parallelogram is base times perpendicular height, and a trapezium is the average of the two parallel sides times the height. A compound area is found by splitting the shape, or by subtracting a hole from a larger rectangle. A prism has the same cross-section all the way through, so its volume is the area of that cross-section multiplied by its length. Ruler-and-compass constructions produce exact results rather than measured ones: a perpendicular bisector and an angle bisector both come from arcs of equal radius.",
    keyIdeas: [
      "Always use the perpendicular height, not a slanted side.",
      "Split or subtract to find a compound area.",
      "A prism's volume is cross-sectional area times length.",
      "Constructions use arcs of equal radius, and the arcs stay on the page.",
    ],
    formulae: [
      "Parallelogram area $= b \\times h$",
      "Trapezium area $= \\frac{1}{2}(a + b)h$",
      "Prism volume $=$ cross-sectional area $\\times$ length",
    ],
  },
  "y8-maths-data": {
    explanation:
      "An average is a single number chosen to stand for a whole set. The mean shares the total equally and uses every value, so one extreme value can drag it; the median is the middle value once the data is in order and resists extremes; the mode is the most common value and is the only average that works for categories. The range measures spread, not centre, and a fair comparison of two sets quotes one of each. The chart must match the data: bar charts for categories, and a pie chart when the parts of a whole matter more than the counts.",
    keyIdeas: [
      "Mean uses every value; median resists extreme values; mode suits categories.",
      "Range measures spread and is not an average.",
      "Compare two data sets using one measure of centre and one of spread.",
      "Choose the chart from the type of data you have.",
    ],
    formulae: [
      "Mean $= \\frac{\\text{total of values}}{\\text{number of values}}$",
      "Range $=$ largest $-$ smallest",
    ],
  },
  "y8-maths-percentages": {
    explanation:
      "Every percentage change can be done in one step with a multiplier: an increase of 8% is $\\times 1.08$, a decrease of 5% is $\\times 0.95$. Multipliers chain, so two successive changes are found by multiplying both, which is why a 10% rise followed by a 10% fall does not return you to the start. Percentage change compares the change with the original amount, not the new one. Simple interest pays the same amount each year; compound interest pays on the running total, which is repeated multiplication.",
    keyIdeas: [
      "An increase of $p\\%$ is a multiplier of $1 + \\frac{p}{100}$.",
      "Successive changes multiply, so they do not cancel out.",
      "Percentage change is always measured against the original amount.",
      "Compound interest is repeated multiplication by the same multiplier.",
    ],
    formulae: [
      "Percentage change $= \\frac{\\text{change}}{\\text{original}} \\times 100$",
      "Compound total $= P \\times \\left(1 + \\frac{r}{100}\\right)^{n}$",
    ],
  },
  "y8-maths-probability": {
    explanation:
      "Probability measures how likely something is on a scale from 0, meaning impossible, to 1, meaning certain. When every outcome is equally likely, the probability of an event is the number of outcomes you want divided by the total number of outcomes, so one head from two equally likely faces is $\frac{1}{2}$. Because one of the outcomes must happen, all the probabilities add to 1, which is why the chance of an event not happening is 1 minus the chance that it does. Listing outcomes systematically rather than at random is what stops you missing one. Probability does not promise what will happen in any single trial; over many trials it predicts roughly how often, so 60 throws of a fair die should give about 10 sixes, not exactly 10.",
    keyIdeas: [
      "Probability runs from 0 for impossible to 1 for certain.",
      "With equally likely outcomes, probability is wanted outcomes over total outcomes.",
      "All the probabilities of an event add to 1, so $P(\text{not } A) = 1 - P(A)$.",
      "Expected results are what a long run should give roughly, not exactly.",
    ],
    formulae: [
      "Equally likely outcomes: $P(A) = \dfrac{\text{outcomes in } A}{\text{total outcomes}}$",
      "The complement: $P(\text{not } A) = 1 - P(A)$",
      "Expected number: $\text{trials} \times P(A)$",
    ],
  },
  "y8-maths-transformations": {
    explanation:
      "Reflections, rotations and translations all preserve the size and shape of an object, so the image is congruent to the original; only the position or orientation changes. A reflection needs a mirror line, a rotation needs a centre, angle and direction, and a translation needs a column vector. An enlargement is the exception: it changes size by a scale factor about a centre, so the image is similar rather than congruent. Describing a transformation fully means naming it and giving every piece of information needed to reproduce it.",
    keyIdeas: [
      "Reflection, rotation and translation all produce congruent images.",
      "Describe a transformation fully or it cannot be reproduced.",
      "An enlargement changes size and produces a similar shape.",
      "Congruent means identical in size and shape; similar means the same shape, different size.",
    ],
    formulae: ["Translation by $\\binom{a}{b}$: $(x, y) \\rightarrow (x + a, y + b)$"],
  },

  // ---- Year 9 ------------------------------------------------------------
  "y9-maths-powers": {
    explanation:
      "An index tells you how many times a number multiplies by itself, and the index laws follow from that: multiplying adds the indices, dividing subtracts them, and a power of a power multiplies them. Anything to the power zero is 1, and a negative index means a reciprocal. Standard form writes a number as $a \\times 10^{n}$ where $1 \\le a < 10$, which keeps very large and very small numbers readable. When calculating in standard form, deal with the numbers and the powers of ten separately, then adjust so that $a$ is back between 1 and 10.",
    keyIdeas: [
      "Multiplying powers adds indices; dividing subtracts them.",
      "$a^{0} = 1$ and $a^{-n} = \\frac{1}{a^{n}}$.",
      "In standard form the first part is always between 1 and 10.",
      "Handle the numbers and the powers of ten separately, then tidy up.",
    ],
    formulae: [
      "$a^{m} \\times a^{n} = a^{m+n}$",
      "$a^{m} \\div a^{n} = a^{m-n}$",
      "$(a^{m})^{n} = a^{mn}$",
      "Standard form: $a \\times 10^{n}$ with $1 \\le a < 10$",
    ],
  },
  "y9-maths-quadratics": {
    explanation:
      "Expanding two brackets multiplies every term in the first by every term in the second, which for $(x + a)(x + b)$ gives $x^{2} + (a + b)x + ab$. Factorising reverses this: for $x^{2} + bx + c$ you look for two numbers that multiply to $c$ and add to $b$. A quadratic graph is a parabola, symmetrical about a vertical line through its turning point, opening upwards when the $x^{2}$ coefficient is positive. Where the curve crosses the $x$-axis, $y = 0$, so those crossing points are the solutions of the quadratic equation.",
    keyIdeas: [
      "Expanding: multiply every term in one bracket by every term in the other.",
      "To factorise $x^{2} + bx + c$, find two numbers multiplying to $c$ and adding to $b$.",
      "A quadratic graph is a symmetrical parabola.",
      "The roots are where the curve crosses the $x$-axis.",
    ],
    formulae: ["$(x + a)(x + b) = x^{2} + (a + b)x + ab$", "Difference of two squares: $x^{2} - a^{2} = (x + a)(x - a)$"],
  },
  "y9-maths-pythagoras": {
    explanation:
      "In a right-angled triangle the hypotenuse is the longest side, always opposite the right angle. Pythagoras' theorem links the three sides and is used when you know two sides and want the third, with no angle involved. Trigonometry is used when an angle is involved: label the sides opposite, adjacent and hypotenuse relative to the angle you are working with, then choose sine, cosine or tangent according to which two sides the question gives you. To find an angle rather than a side, use the inverse function on your calculator.",
    keyIdeas: [
      "Pythagoras needs two sides and no angle; trigonometry involves an angle.",
      "Label opposite, adjacent and hypotenuse from the angle you are using.",
      "Choose the ratio that uses the two sides you know or want.",
      "Use the inverse ($\\sin^{-1}$, $\\cos^{-1}$, $\\tan^{-1}$) to find an angle.",
    ],
    formulae: [
      "Pythagoras: $a^{2} + b^{2} = c^{2}$",
      "$\\sin \\theta = \\frac{\\text{opposite}}{\\text{hypotenuse}}$",
      "$\\cos \\theta = \\frac{\\text{adjacent}}{\\text{hypotenuse}}$",
      "$\\tan \\theta = \\frac{\\text{opposite}}{\\text{adjacent}}$",
    ],
  },
  "y9-maths-probability": {
    explanation:
      "Probability measures how likely an outcome is, on a scale from 0 to 1, and the probabilities of all possible outcomes total 1. A sample space lists every equally likely outcome, so a two-dice grid has 36 entries and probabilities can be counted straight off it. A tree diagram handles two or more stages: multiply along the branches for a combined outcome, and add the results of the separate paths that satisfy the question. Experimental probability comes from what actually happened, and gets closer to the theoretical value as the number of trials grows.",
    keyIdeas: [
      "All the probabilities of a complete set of outcomes total 1.",
      "A sample space lists every equally likely outcome.",
      "Multiply along tree branches; add between separate paths.",
      "More trials bring experimental probability closer to theoretical.",
    ],
    formulae: [
      "$P(\\text{event}) = \\frac{\\text{favourable outcomes}}{\\text{total outcomes}}$",
      "$P(\\text{not } A) = 1 - P(A)$",
      "Relative frequency $= \\frac{\\text{times it happened}}{\\text{number of trials}}$",
    ],
  },
  "y9-maths-equations": {
    explanation:
      "When the unknown appears on both sides, collect the letters on one side and the numbers on the other, always doing the same thing to both sides. Brackets are expanded first, and a fraction is cleared by multiplying every term by the denominator. An inequality is solved the same way with one exception: multiplying or dividing by a negative number reverses the inequality sign. Forming an equation from a worded problem means naming the unknown, writing the relationship it satisfies, and only then solving.",
    keyIdeas: [
      "Do the same operation to both sides to keep the balance.",
      "Expand brackets and clear fractions before collecting terms.",
      "Multiplying or dividing an inequality by a negative reverses the sign.",
      "Define the letter before you write the equation.",
    ],
    formulae: ["An inequality: $-2x > 6$ gives $x < -3$ (sign reversed)"],
  },
  "y9-maths-statistics": {
    explanation:
      "A statistical enquiry starts with a question, then decides what data would answer it and how to collect it fairly. A sample is used because a whole population is usually out of reach, and the sample must be chosen so that it is not systematically unlike the population; a survey of your own friends will not describe a school. The diagram must suit the data, and a scatter graph is the right choice for two variables measured on the same individuals. Correlation shows that two variables move together, which is not the same as one causing the other.",
    keyIdeas: [
      "Start from the question, then decide what data answers it.",
      "A biased sample gives a confident but wrong answer.",
      "A scatter graph shows the relationship between two variables.",
      "Correlation is not causation: a third factor may explain both.",
    ],
    formulae: [],
  },

  // ---- Year 10 (GCSE) ----------------------------------------------------
  "y10-maths-number": {
    explanation:
      "Standard form keeps very large and very small numbers workable: $a \\times 10^{n}$ with $1 \\le a < 10$. A measurement is never exact, so a value given to the nearest unit carries an error interval of half a unit either side: 4.6 cm to the nearest 0.1 cm lies between 4.55 cm and 4.65 cm. When rounded values are combined, the bounds combine too, and you must think about which combination gives the largest and smallest result. For a difference or a division the answer may surprise you: the largest value of $a - b$ uses the upper bound of $a$ with the lower bound of $b$.",
    keyIdeas: [
      "Standard form: $a \\times 10^{n}$ with $1 \\le a < 10$.",
      "Rounding to the nearest unit gives an error interval of half a unit each way.",
      "Upper bounds are written with $<$, because the top value is never reached.",
      "For $a - b$, the maximum uses $a$'s upper bound and $b$'s lower bound.",
    ],
    formulae: [
      "Error interval: $x - \\frac{u}{2} \\le \\text{true value} < x + \\frac{u}{2}$",
      "Maximum of $a \\times b$: upper bound of $a$ $\\times$ upper bound of $b$",
      "Maximum of $a \\div b$: upper bound of $a$ $\\div$ lower bound of $b$",
    ],
  },
  "y10-maths-algebra": {
    explanation:
      "Rearranging a formula uses the same moves as solving an equation, applied to letters instead of numbers, and the subject is the letter left alone on one side. Simultaneous equations are solved by elimination, where you match the coefficient of one letter and add or subtract, or by substitution, where one equation is rearranged and put into the other. Quadratics are solved by factorising when possible, since a product is zero only if one of its factors is zero. When factorising fails, the quadratic formula always works, and the discriminant $b^{2} - 4ac$ tells you how many real solutions there are.",
    keyIdeas: [
      "Rearranging a formula is solving an equation with letters.",
      "Eliminate a variable by matching coefficients, then adding or subtracting.",
      "If a product equals zero, at least one factor is zero.",
      "The quadratic formula works when factorising does not.",
    ],
    formulae: [
      "Quadratic formula: $x = \\frac{-b \\pm \\sqrt{b^{2} - 4ac}}{2a}$",
      "Discriminant: $b^{2} - 4ac$",
    ],
  },
  "y10-maths-geometry": {
    explanation:
      "Two shapes are similar when one is an enlargement of the other: corresponding angles are equal and corresponding sides are in the same ratio. Proving similarity means quoting a reason such as two equal angles (AA), or all three sides in the same ratio, and the scale factor is found by dividing a pair of corresponding sides. In right-angled triangles, choose sine, cosine or tangent using the two sides involved, and remember the exact values for $30^\\circ$, $45^\\circ$ and $60^\\circ$. A bearing is measured clockwise from north, always written with three figures, and bearing problems are solved by drawing the north line and finding a right-angled triangle.",
    keyIdeas: [
      "Similar shapes have equal angles and sides in a constant ratio.",
      "Justify similarity with a reason: AA, SSS or SAS.",
      "Choose the trigonometric ratio from the sides you have and want.",
      "Bearings are clockwise from north and always written with three figures.",
    ],
    formulae: [
      "$\\sin \\theta = \\frac{\\text{opp}}{\\text{hyp}}$, $\\cos \\theta = \\frac{\\text{adj}}{\\text{hyp}}$, $\\tan \\theta = \\frac{\\text{opp}}{\\text{adj}}$",
      "Linear scale factor $k$: area scales by $k^{2}$, volume by $k^{3}$",
    ],
  },
  "y10-maths-statistics": {
    explanation:
      "A sample is used to say something about a population that is too large to measure, and the conclusion is only as good as the sample: if the way people were chosen makes some groups more likely to appear, the estimate is biased however many were asked. A larger sample reduces the effect of chance, but it does not fix bias. Comparing two distributions means comparing a measure of centre and a measure of spread, and writing the comparison in the context of the data rather than as bare numbers. A scatter graph shows whether two variables are related; a line of best fit lets you estimate between known points, though predicting beyond the data is unreliable.",
    keyIdeas: [
      "A sample must not systematically exclude part of the population.",
      "A bigger sample reduces chance variation but never removes bias.",
      "Compare distributions with one measure of centre and one of spread, in context.",
      "Interpolating within the data is safer than extrapolating beyond it.",
    ],
    formulae: [
      "Mean $= \\frac{\\sum x}{n}$",
      "Interquartile range $= Q_{3} - Q_{1}$",
      "Range $=$ largest $-$ smallest",
    ],
  },
  "y10-maths-ratio": {
    explanation:
      "A compound unit combines two measures, such as kilometres per hour or grams per cubic centimetre, and the word 'per' tells you which quantity is divided by which. Converting a compound unit means converting both parts, so changing m/s to km/h requires work on the length and on the time. Direct proportion can be written as $y = kx$, where $k$ is found from a known pair of values and then used for any other. Repeated percentage change is repeated multiplication by the same multiplier, which is how growth, depreciation and compound interest all behave.",
    keyIdeas: [
      "'Per' means divide: km per hour is distance divided by time.",
      "Converting a compound unit means converting both of its parts.",
      "Direct proportion is $y = kx$; find $k$ from a known pair.",
      "Repeated change multiplies: $n$ years means the multiplier to the power $n$.",
    ],
    formulae: [
      "Speed $= \\frac{\\text{distance}}{\\text{time}}$",
      "Density $= \\frac{\\text{mass}}{\\text{volume}}$",
      "Pressure $= \\frac{\\text{force}}{\\text{area}}$",
      "Repeated change: $N = N_{0} \\times k^{n}$",
    ],
  },
  "y10-maths-graphs": {
    explanation:
      "The $n$th term of a linear sequence comes from its constant difference; a quadratic sequence has a constant second difference, and half of it gives the coefficient of $n^{2}$. A straight line is $y = mx + c$, where the gradient $m$ is the change in $y$ divided by the change in $x$, and $c$ is where the line crosses the $y$-axis. Parallel lines share a gradient. On a real-life graph the gradient carries the units of the axes, so on a distance-time graph it is speed, and on a container-filling graph a steeper section means the level rising faster.",
    keyIdeas: [
      "Constant first difference means linear; constant second difference means quadratic.",
      "Gradient is the change in $y$ divided by the change in $x$.",
      "Parallel lines have equal gradients.",
      "On a real-life graph the gradient is a rate with units.",
    ],
    formulae: [
      "Straight line: $y = mx + c$",
      "Gradient $= \\frac{y_{2} - y_{1}}{x_{2} - x_{1}}$",
      "Quadratic sequence: $n$th term starts with $\\frac{\\text{second difference}}{2}n^{2}$",
    ],
  },
  "y10-maths-probability": {
    explanation:
      "A Venn diagram sorts outcomes into overlapping sets, and the notation names the regions: $A \\cap B$ is the overlap, $A \\cup B$ is everything in either set, and $A'$ is everything outside $A$. A tree diagram is better for events in stages, with the probabilities on each set of branches totalling 1; multiply along a path and add the paths that satisfy the question. If events are independent, the first outcome does not change the second; if the object is not replaced, the second set of probabilities changes and the denominator drops by one. Relative frequency estimates a probability from trials, and is the only tool available when outcomes are not equally likely.",
    keyIdeas: [
      "$A \\cap B$ is the intersection; $A \\cup B$ is the union; $A'$ is the complement.",
      "Each set of branches on a tree totals 1.",
      "Multiply along branches, add between paths.",
      "Without replacement, the second probability changes.",
    ],
    formulae: [
      "$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$",
      "Independent events: $P(A \\text{ and } B) = P(A) \\times P(B)$",
      "Expected number $= n \\times P(\\text{event})$",
    ],
  },
  "y10-maths-mensuration": {
    explanation:
      "Circle work rests on two formulae, circumference $2\\pi r$ and area $\\pi r^{2}$, and a sector or arc is simply a fraction of the whole circle given by its angle over $360^\\circ$. Surface area is the total of every face, so it is worth sketching the net rather than trying to hold the solid in your head. A prism's volume is its cross-sectional area times its length, while a cone or pyramid is one third of the surrounding prism. Answers must carry the right units: lengths in cm, areas in cm$^{2}$, volumes in cm$^{3}$, and a conversion between area or volume units is not the same factor as between lengths.",
    keyIdeas: [
      "A sector is $\\frac{\\theta}{360}$ of the whole circle, in both arc and area.",
      "Surface area is the sum of the faces; sketch the net.",
      "A pyramid or cone is one third of the prism around it.",
      "$1\\,\\text{m}^{2} = 10\\,000\\,\\text{cm}^{2}$, not 100.",
    ],
    formulae: [
      "Circumference $= 2\\pi r$",
      "Circle area $= \\pi r^{2}$",
      "Arc length $= \\frac{\\theta}{360} \\times 2\\pi r$",
      "Sector area $= \\frac{\\theta}{360} \\times \\pi r^{2}$",
      "Cylinder volume $= \\pi r^{2} h$",
    ],
  },
  "y10-maths-constructions": {
    explanation:
      "Constructions are done with a ruler and a pair of compasses only, and the arcs are left on the page because they are the evidence that the method was used. A perpendicular bisector is the set of points equidistant from two points; an angle bisector is the set of points equidistant from two lines. A locus is the path of every point obeying a rule: a fixed distance from a point gives a circle, a fixed distance from a line gives a pair of parallel lines with rounded ends. Plans and elevations show a solid from above, from the front and from the side, each drawn to the same scale.",
    keyIdeas: [
      "Keep the compass arcs: they show how the construction was made.",
      "A perpendicular bisector is every point equidistant from two points.",
      "An angle bisector is every point equidistant from two lines.",
      "Plan, front and side elevations are all drawn to the same scale.",
    ],
    formulae: ["Scale $1:n$ means a real length is $n \\times$ the drawn length"],
  },

  // ---- Year 11 (GCSE) ----------------------------------------------------
  "y11-maths-proportion": {
    explanation:
      "Direct proportion means $y = kx$: double $x$ and $y$ doubles. Inverse proportion means $y = \\frac{k}{x}$: double $x$ and $y$ halves, which is the shape of a journey where a higher speed means a shorter time. Proportion can also involve squares or roots, as in $y \\propto x^{2}$ or $y \\propto \\frac{1}{\\sqrt{x}}$; in every case the method is the same, write the relationship with $k$, use the given pair to find $k$, then answer the question. Growth and decay problems are proportional relationships applied repeatedly, with the multiplier raised to the number of periods.",
    keyIdeas: [
      "Direct: $y = kx$. Inverse: $y = \\frac{k}{x}$.",
      "Always find $k$ from the pair of values you are given.",
      "Proportion to a square or root follows the same three steps.",
      "Growth and decay raise the multiplier to the number of periods.",
    ],
    formulae: [
      "Direct: $y = kx$",
      "Inverse: $y = \\frac{k}{x}$",
      "Growth or decay: $N = N_{0}k^{n}$",
    ],
  },
  "y11-maths-graphs": {
    explanation:
      "Solving graphically means reading where two graphs cross, because at that point both equations are satisfied. The gradient of a curve changes from point to point and is estimated by drawing a tangent, which on a distance-time graph gives speed at an instant and on a speed-time graph gives acceleration; the area under a speed-time graph is the distance travelled. Function notation $f(x)$ names a rule, $f(3)$ means substitute 3, and $f^{-1}(x)$ reverses the rule. Transformations move a graph in predictable ways: $f(x) + a$ moves it up, $f(x + a)$ moves it left, $-f(x)$ reflects it in the $x$-axis.",
    keyIdeas: [
      "Solutions are where the graphs intersect.",
      "A tangent gives the gradient of a curve at a point.",
      "The area under a speed-time graph is distance.",
      "$f(x + a)$ shifts left; $f(x) + a$ shifts up.",
    ],
    formulae: [
      "$y = f(x) + a$: translation $\\binom{0}{a}$",
      "$y = f(x + a)$: translation $\\binom{-a}{0}$",
      "$y = -f(x)$: reflection in the $x$-axis",
    ],
  },
  "y11-maths-circle": {
    explanation:
      "The circle theorems all follow from symmetry, and each one must be quoted by name when used as a reason. The angle at the centre is twice the angle at the circumference on the same arc; angles in the same segment are equal; the angle in a semicircle is a right angle; opposite angles of a cyclic quadrilateral total $180^\\circ$; and a tangent meets a radius at a right angle. A vector has magnitude and direction, written as a column or as $\\overrightarrow{AB}$, and vectors are added nose to tail. A geometric proof states each step with its reason and ends with the statement it set out to show.",
    keyIdeas: [
      "Name the theorem you use: an unnamed reason earns no marks.",
      "Angle at the centre is twice the angle at the circumference.",
      "A tangent and the radius at the point of contact are perpendicular.",
      "Parallel vectors are multiples of each other, which is how collinearity is proved.",
    ],
    formulae: [
      "Angle at centre $= 2 \\times$ angle at circumference",
      "Cyclic quadrilateral: opposite angles total $180^\\circ$",
      "$\\overrightarrow{AB} = \\overrightarrow{AO} + \\overrightarrow{OB}$",
    ],
  },
  "y11-maths-foundation": {
    explanation:
      "Multi-step problems are marked on the method as well as the answer, so the working must show the route taken. Start by deciding what the question is really asking and what you would need to know to answer it, then work towards that rather than starting to calculate immediately. Keep full accuracy through the intermediate steps and round only at the end, because rounding early shifts the final answer. Check by estimating: if a rough calculation gives about 300 and your answer is 3,000, something has gone wrong by a factor of ten.",
    keyIdeas: [
      "Marks are given for method, so write the steps down.",
      "Work backwards from what the question asks for.",
      "Round only at the end, never in the middle.",
      "Estimate to check the size of your answer.",
    ],
    formulae: [],
  },
  "y11-maths-found-number": {
    explanation:
      "Accurate calculation rests on the order of operations, place value and confident work with fractions, decimals and negatives. Percentage problems are quickest with multipliers: an increase of 12% is $\\times 1.12$, and a reverse percentage divides by the multiplier to get back to the original. Estimation rounds every number to one significant figure to give a quick check on a calculation. Bounds describe the interval a rounded measurement could have come from, half a unit either side of the value given.",
    keyIdeas: [
      "Use a multiplier for every percentage change.",
      "A reverse percentage divides by the multiplier.",
      "Estimate by rounding each number to one significant figure.",
      "A rounded measurement carries bounds of half a unit each way.",
    ],
    formulae: [
      "Increase by $p\\%$: $\\times \\left(1 + \\frac{p}{100}\\right)$",
      "Reverse percentage: original $= \\frac{\\text{new amount}}{\\text{multiplier}}$",
    ],
  },
  "y11-maths-found-algebra": {
    explanation:
      "Solving a linear equation means undoing the operations in reverse order while keeping both sides balanced, and the same method rearranges a formula. A sequence rule is found from the constant difference, which becomes the coefficient of $n$. A straight-line graph is $y = mx + c$, and plotting it accurately means choosing three points and checking they line up. A quadratic graph curves symmetrically, and reading solutions from it means finding where the curve meets the $x$-axis or a given horizontal line.",
    keyIdeas: [
      "Keep the equation balanced: the same operation on both sides.",
      "The common difference becomes the coefficient of $n$.",
      "Plot three points for a straight line, as a check on accuracy.",
      "Read solutions from a graph where the curve meets the required line.",
    ],
    formulae: ["$y = mx + c$", "Linear sequence: $n$th term $= dn + (\\text{first term} - d)$"],
  },
  "y11-maths-found-geometry": {
    explanation:
      "Angle problems are solved by quoting facts: angles on a line total $180^\\circ$, in a triangle $180^\\circ$, in a quadrilateral $360^\\circ$, and parallel lines give equal alternate and corresponding angles. The interior angles of a polygon follow from splitting it into triangles, and the exterior angles of any polygon total $360^\\circ$. Area and volume formulae must be matched to the shape, using the perpendicular height. Right-angled triangles are handled with Pythagoras when no angle is involved and with sine, cosine or tangent when one is.",
    keyIdeas: [
      "Quote the angle fact you use as your reason.",
      "Exterior angles of any polygon total $360^\\circ$.",
      "Use the perpendicular height in every area formula.",
      "Pythagoras for three sides; trigonometry when an angle appears.",
    ],
    formulae: [
      "Interior angle sum $= (n - 2) \\times 180^\\circ$",
      "Exterior angle of a regular polygon $= \\frac{360^\\circ}{n}$",
      "$a^{2} + b^{2} = c^{2}$",
    ],
  },
  "y11-maths-found-probability": {
    explanation:
      "Probability runs from 0 (impossible) to 1 (certain), and can be written as a fraction, decimal or percentage but never as a ratio. The probabilities of a complete set of outcomes total 1, so the probability of an event not happening is 1 minus the probability that it does. A sample space diagram lists every equally likely outcome for one or two events, making the counting straightforward. Tree diagrams handle events in stages: multiply along the branches and add the separate paths that meet the condition.",
    keyIdeas: [
      "Probability is a number from 0 to 1, never a ratio.",
      "$P(\\text{not } A) = 1 - P(A)$.",
      "A sample space lists every equally likely outcome.",
      "Multiply along branches, add between paths.",
    ],
    formulae: [
      "$P(A) = \\frac{\\text{favourable}}{\\text{total}}$",
      "$P(\\text{not } A) = 1 - P(A)$",
      "Expected frequency $= n \\times P(A)$",
    ],
  },
  "y11-maths-found-statistics": {
    explanation:
      "Choosing the right diagram is part of the mark: bar charts compare categories, pie charts show proportions of a whole, and line graphs show change over time. For grouped data the mean is estimated using the midpoint of each class, and the answer is an estimate because the original values are lost. The modal class is the group with the highest frequency, and the median is found by counting to the middle value. A scatter graph shows correlation between two variables, and a line of best fit allows sensible estimates within the range of the data.",
    keyIdeas: [
      "Match the diagram to the type of data.",
      "For grouped data, use class midpoints and call the mean an estimate.",
      "The modal class is a group, not a single value.",
      "Use the line of best fit inside the data range only.",
    ],
    formulae: [
      "Estimated mean $= \\frac{\\sum fx}{\\sum f}$ using midpoints",
      "Pie chart angle $= \\frac{\\text{frequency}}{\\text{total}} \\times 360^\\circ$",
    ],
  },
  "y11-maths-found-ratio": {
    explanation:
      "Sharing in a ratio means totalling the parts, dividing to find one part, then multiplying up, and a check is that the shares add back to the original amount. Direct proportion problems are solved by finding the value of one unit first. Compound measures divide one quantity by another, and the triangle layout of speed, distance and time works equally for density and pressure. Converting a rate means converting both of its units, which is why 10 m/s is 36 km/h rather than 600.",
    keyIdeas: [
      "Total the parts, find one part, then multiply, and check the total.",
      "Find the value of one unit for direct proportion.",
      "Speed, density and pressure are all one quantity divided by another.",
      "Converting a rate means converting both units.",
    ],
    formulae: [
      "Speed $= \\frac{\\text{distance}}{\\text{time}}$",
      "Density $= \\frac{\\text{mass}}{\\text{volume}}$",
      "One part $= \\frac{\\text{amount}}{\\text{total parts}}$",
    ],
  },
  "y11-maths-number": {
    explanation:
      "A surd is a root that cannot be written exactly as a fraction, so it is kept in root form to stay exact. Surds simplify by pulling out square factors, and like surds add and subtract just as like terms do. Rationalising a denominator removes the root from the bottom by multiplying top and bottom by the same surd, or by the conjugate when the denominator is a sum. Fractional indices connect powers and roots: the denominator of the index is the root and the numerator is the power.",
    keyIdeas: [
      "Simplify a surd by taking out the largest square factor.",
      "Only like surds can be added or subtracted.",
      "Rationalise using the same surd, or the conjugate for a two-term denominator.",
      "$a^{\\frac{m}{n}}$ means the $n$th root of $a$, raised to the power $m$.",
    ],
    formulae: [
      "$\\sqrt{ab} = \\sqrt{a} \\times \\sqrt{b}$",
      "$a^{\\frac{1}{n}} = \\sqrt[n]{a}$",
      "$a^{\\frac{m}{n}} = \\left(\\sqrt[n]{a}\\right)^{m}$",
    ],
  },
  "y11-maths-algebra": {
    explanation:
      "Completing the square rewrites $x^{2} + bx + c$ as $(x + \\frac{b}{2})^{2} + \\left(c - \\frac{b^{2}}{4}\\right)$, which solves the equation and also reveals the turning point of the graph directly. A quadratic inequality is solved by finding the roots and then deciding, from the shape of the parabola, which region satisfies the inequality; a sketch is the safest way to get the direction right. Iteration finds approximate solutions by rearranging the equation into the form $x = g(x)$ and feeding each answer back in until the values settle. Algebraic fractions are handled exactly like numerical ones, with factorising used to cancel common factors.",
    keyIdeas: [
      "Completing the square gives both the solutions and the turning point.",
      "Sketch the parabola to decide which region an inequality describes.",
      "Iteration repeats $x_{n+1} = g(x_{n})$ until the values converge.",
      "Factorise before cancelling an algebraic fraction.",
    ],
    formulae: [
      "$x^{2} + bx + c = \\left(x + \\frac{b}{2}\\right)^{2} + c - \\frac{b^{2}}{4}$",
      "Turning point of $(x + p)^{2} + q$ is $(-p, q)$",
      "Iteration: $x_{n+1} = g(x_{n})$",
    ],
  },
  "y11-maths-probability": {
    explanation:
      "Conditional probability is the probability of one event given that another has already happened, and it appears whenever objects are not replaced. On a tree diagram the second set of branches changes: if one red counter has been removed from ten, only nine remain and one fewer is red. A Venn diagram makes conditional questions readable, because 'given that' restricts attention to one region and that region becomes the new denominator. Careful reading matters, since 'at least one' is usually quickest as one minus the probability of none.",
    keyIdeas: [
      "Without replacement, both the numerator and denominator change.",
      "'Given that' makes one region the new denominator.",
      "'At least one' is often $1 - P(\\text{none})$.",
      "Probabilities on each set of branches still total 1.",
    ],
    formulae: [
      "$P(A \\text{ and } B) = P(A) \\times P(B \\mid A)$",
      "$P(B \\mid A) = \\frac{P(A \\cap B)}{P(A)}$",
      "$P(\\text{at least one}) = 1 - P(\\text{none})$",
    ],
  },
  "y11-maths-statistics": {
    explanation:
      "A histogram shows continuous data in classes that may be unequal, so the bar height is frequency density rather than frequency and it is the area of each bar that represents the frequency. A cumulative frequency graph plots running totals against the upper boundary of each class, and reading across from half the total gives the median, with the quartiles read at a quarter and three quarters. A box plot shows the minimum, quartiles, median and maximum, which makes two distributions quick to compare. Comparisons should quote a measure of centre and a measure of spread, in context.",
    keyIdeas: [
      "In a histogram, area represents frequency and height is frequency density.",
      "Plot cumulative frequency against the upper class boundary.",
      "Median at $\\frac{n}{2}$, quartiles at $\\frac{n}{4}$ and $\\frac{3n}{4}$.",
      "Compare with a measure of centre and a measure of spread.",
    ],
    formulae: [
      "Frequency density $= \\frac{\\text{frequency}}{\\text{class width}}$",
      "Frequency $=$ frequency density $\\times$ class width",
      "Interquartile range $= Q_{3} - Q_{1}$",
    ],
  },
  "y11-maths-nonright": {
    explanation:
      "When a triangle has no right angle, Pythagoras and the basic ratios no longer apply. Use the sine rule when you have a matching pair of an angle and its opposite side, and the cosine rule when you know two sides and the angle between them, or all three sides and want an angle. The area of any triangle can be found from two sides and the included angle. In three dimensions, identify the right-angled or general triangle that contains the length or angle you want, sketch it separately, and solve it on its own.",
    keyIdeas: [
      "Sine rule needs a matching angle and opposite side.",
      "Cosine rule handles two sides and the included angle, or three sides.",
      "Area from two sides and the angle between them.",
      "In 3D, pull out the triangle you need and draw it flat.",
    ],
    formulae: [
      "Sine rule: $\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}$",
      "Cosine rule: $a^{2} = b^{2} + c^{2} - 2bc\\cos A$",
      "Area $= \\frac{1}{2}ab\\sin C$",
    ],
  },
};
