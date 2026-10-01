import { contentFor } from "./data/topicContent/index.js";
import { explanationForTier } from './data/explanationTier.js';
import { subtopicLessons } from './data/subtopicLessons.js';
import { authoredWorkedExample } from "./data/authoredWorkedExamples.js";
import { editorialExamples } from './data/editorialExamples.js';
import { warrantsFormulae, warrantsWorkedExample } from "./data/workedExampleOutcomes.js";

const mathsExamples = {
  "y7-maths-number": {
    formulae: ["Subtracting a negative: a - (-b) = a + b"],
    question: "Calculate 7 - (-5).",
    steps: ["A negative is being subtracted.", "Replace subtracting a negative with addition: 7 + 5.", "Calculate 7 + 5 = 12."],
    answer: "12",
  },
  "y7-maths-fractions": {
    formulae: ["Percentage of an amount = (percentage / 100) x amount"],
    question: "Find 35% of 80.",
    steps: ["Write 35% as 35 / 100.", "Substitute: (35 / 100) x 80.", "Calculate 0.35 x 80 = 28."],
    answer: "28",
  },
  "y7-maths-algebra": {
    formulae: ["To solve x + a = b, use x = b - a"],
    question: "Solve x + 7 = 19.",
    steps: ["Undo the +7 by subtracting 7 from both sides.", "x = 19 - 7.", "Calculate x = 12."],
    answer: "x = 12",
  },
  "y7-maths-geometry": {
    formulae: ["Angles in a triangle total 180 degrees", "Rectangle area = length x width"],
    question: "A triangle has angles of 48 degrees and 67 degrees. Find the third angle.",
    steps: ["Add the known angles: 48 + 67 = 115 degrees.", "Subtract from the triangle total: 180 - 115.", "The missing angle is 65 degrees."],
    answer: "65 degrees",
  },
  "y7-maths-ratio": {
    formulae: ["Value of one part = total amount / total ratio parts"],
    question: "Share GBP 40 in the ratio 3:2.",
    steps: ["Find total parts: 3 + 2 = 5.", "Find one part: 40 / 5 = 8.", "Calculate each share: 3 x 8 = 24 and 2 x 8 = 16."],
    answer: "GBP 24 and GBP 16",
  },
  "y7-maths-coordinates": {
    formulae: ["Translation by vector (a, b): (x, y) becomes (x + a, y + b)"],
    question: "Translate (2, -1) by the vector (3, 4).",
    steps: ["Add 3 to the x-coordinate: 2 + 3 = 5.", "Add 4 to the y-coordinate: -1 + 4 = 3.", "Write the new coordinate as (5, 3)."],
    answer: "(5, 3)",
  },
  "y8-maths-ratio": {
    formulae: ["Scale factor = new length / original length"],
    question: "A recipe for 4 uses 300 g of flour. How much is needed for 10?",
    steps: ["Find the scale factor: 10 / 4 = 2.5.", "Multiply the flour by the same factor: 300 x 2.5.", "300 x 2.5 = 750."],
    answer: "750 g",
  },
  "y8-maths-linear": {
    formulae: ["Linear sequence nth term = difference x n + adjustment"],
    question: "Find the nth term of 5, 8, 11, 14, ...",
    steps: ["The common difference is 3, so begin with 3n.", "When n = 1, 3n gives 3, but the sequence gives 5.", "Add 2, so the nth term is 3n + 2."],
    answer: "3n + 2",
  },
  "y8-maths-measures": {
    formulae: ["Prism volume = cross-sectional area x length"],
    question: "A prism has cross-sectional area 12 cm squared and length 7 cm. Find its volume.",
    steps: ["Write the formula: volume = cross-sectional area x length.", "Substitute: V = 12 x 7.", "Calculate V = 84 and include cubic units."],
    answer: "84 cm cubed",
  },
  "y8-maths-data": {
    formulae: ["Mean = total of values / number of values", "Range = highest - lowest"],
    question: "Find the mean of 4, 7, 7 and 10.",
    steps: ["Add the values: 4 + 7 + 7 + 10 = 28.", "There are 4 values.", "Divide: 28 / 4 = 7."],
    answer: "7",
  },
  "y8-maths-percentages": {
    formulae: ["New amount = original amount x percentage multiplier"],
    question: "Increase GBP 60 by 15%.",
    steps: ["An increase of 15% uses multiplier 1.15.", "Substitute: 60 x 1.15.", "Calculate 60 x 1.15 = 69."],
    answer: "GBP 69",
  },
  "y8-maths-transformations": {
    formulae: ["Translation by vector (a, b): (x, y) becomes (x + a, y + b)"],
    question: "Translate (-2, 3) by the vector (5, -1).",
    steps: ["Add 5 to x: -2 + 5 = 3.", "Add -1 to y: 3 - 1 = 2.", "The translated point is (3, 2)."],
    answer: "(3, 2)",
  },
  "y9-maths-powers": {
    formulae: ["a^m x a^n = a^(m+n)", "Standard form: A x 10^n where 1 <= A < 10"],
    question: "Calculate (3 x 10^4)(2 x 10^3).",
    steps: ["Multiply the numbers: 3 x 2 = 6.", "Add the powers: 10^4 x 10^3 = 10^7.", "Combine them: 6 x 10^7."],
    answer: "6 x 10^7",
  },
  "y9-maths-quadratics": {
    formulae: ["(x + a)(x + b) = x^2 + (a + b)x + ab"],
    question: "Expand (x + 3)(x + 5).",
    steps: ["Multiply x by both terms: x^2 + 5x.", "Multiply 3 by both terms: 3x + 15.", "Collect like terms: x^2 + 8x + 15."],
    answer: "x^2 + 8x + 15",
  },
  "y9-maths-pythagoras": {
    formulae: ["Pythagoras: a^2 + b^2 = c^2", "SOH CAH TOA"],
    question: "A right triangle has shorter sides 6 cm and 8 cm. Find the hypotenuse.",
    steps: ["Use a^2 + b^2 = c^2.", "Substitute: 6^2 + 8^2 = c^2, so 36 + 64 = 100.", "Square root both sides: c = square root of 100 = 10."],
    answer: "10 cm",
  },
  "y9-maths-probability": {
    formulae: ["P(A and B) = P(A) x P(B), for independent events"],
    question: "A fair coin is tossed twice. Find the probability of two heads.",
    steps: ["The probability of a head is 1/2 on each toss.", "Multiply independent probabilities: 1/2 x 1/2.", "Simplify to 1/4."],
    answer: "1/4",
  },
  "y9-maths-equations": {
    formulae: ["Keep an equation balanced by doing the same operation to both sides"],
    question: "Solve 5x - 4 = 21.",
    steps: ["Add 4 to both sides: 5x = 25.", "Divide both sides by 5: x = 5.", "Check: 5(5) - 4 = 21."],
    answer: "x = 5",
  },
  "y9-maths-statistics": {
    formulae: ["Estimated mean = sum of (midpoint x frequency) / total frequency"],
    question: "A scatter graph rises from left to right. What relationship does it suggest?",
    steps: ["Look at the overall direction of the points.", "As one variable increases, the other generally increases.", "Describe this as positive correlation, without claiming causation."],
    answer: "Positive correlation",
  },
  "y10-maths-number": {
    formulae: ["Rounded value - half unit <= true value < rounded value + half unit"],
    question: "A length is 8.4 cm correct to the nearest 0.1 cm. State its error interval.",
    steps: ["Half of 0.1 is 0.05.", "Lower bound: 8.4 - 0.05 = 8.35.", "Upper bound: 8.4 + 0.05 = 8.45, which is not included."],
    answer: "8.35 <= length < 8.45 cm",
  },
  "y10-maths-algebra": {
    formulae: ["Quadratic formula: x = (-b +/- square root of (b^2 - 4ac)) / 2a"],
    question: "Solve x^2 - 5x + 6 = 0 by factorising.",
    steps: ["Find two numbers that multiply to 6 and add to -5: -2 and -3.", "Factorise: (x - 2)(x - 3) = 0.", "Set each bracket to zero: x = 2 or x = 3."],
    answer: "x = 2 or x = 3",
  },
  "y10-maths-geometry": {
    formulae: ["SOH CAH TOA", "For similar shapes, corresponding lengths have the same scale factor"],
    question: "In a right triangle, the opposite side is 6 cm and hypotenuse is 10 cm. Find angle theta.",
    steps: ["Choose sine because opposite and hypotenuse are known.", "sin(theta) = 6 / 10 = 0.6.", "Use inverse sine: theta = sin^-1(0.6) = 36.9 degrees."],
    answer: "36.9 degrees (1 d.p.)",
  },
  "y10-maths-statistics": {
    formulae: ["Range = highest value - lowest value"],
    question: "Class A has median 18 and range 6; Class B has median 16 and range 3. Compare them.",
    steps: ["Compare centres: Class A's median is higher.", "Compare spread: Class B's range is smaller.", "Conclude that A is typically higher, while B is more consistent."],
    answer: "Class A is typically higher; Class B is more consistent",
  },
  "y10-maths-ratio": {
    formulae: ["Speed = distance / time", "Repeated growth: final = initial x multiplier^number of periods"],
    question: "GBP 500 grows by 4% each year for 3 years. Find the final amount.",
    steps: ["The growth multiplier is 1.04.", "Substitute: 500 x 1.04^3.", "Calculate 500 x 1.124864 = 562.432 and round to money."],
    answer: "GBP 562.43",
  },
  "y10-maths-graphs": {
    formulae: ["Straight line: y = mx + c", "Gradient m = change in y / change in x"],
    question: "Find the equation of a line with gradient 3 and y-intercept -2.",
    steps: ["Start with y = mx + c.", "Substitute m = 3 and c = -2.", "Write y = 3x - 2."],
    answer: "y = 3x - 2",
  },
  "y10-maths-probability": {
    formulae: ["P(not A) = 1 - P(A)", "Expected frequency = probability x number of trials"],
    question: "The probability of rain is 0.3. Find the probability that it does not rain.",
    steps: ["The probabilities of an event and its complement total 1.", "Calculate 1 - 0.3.", "The result is 0.7."],
    answer: "0.7",
  },
  "y10-maths-mensuration": {
    formulae: ["Circle area = pi r^2", "Circumference = 2 pi r", "Prism volume = cross-sectional area x length"],
    question: "Find the area of a circle with radius 5 cm.",
    steps: ["Use A = pi r^2.", "Substitute r = 5: A = pi x 5^2 = 25pi.", "Evaluate and round if required: 25pi = 78.5."],
    answer: "25pi cm squared, or 78.5 cm squared (1 d.p.)",
  },
  "y10-maths-constructions": {
    formulae: ["A perpendicular bisector contains points equidistant from both endpoints"],
    question: "Construct the perpendicular bisector of a line segment AB.",
    steps: ["Set compasses to more than half of AB and draw arcs from A.", "Without changing the width, draw intersecting arcs from B.", "Join the two arc intersections with a straight line."],
    answer: "The new line bisects AB at 90 degrees",
  },
  "y11-maths-proportion": {
    formulae: ["Direct proportion: y = kx", "Inverse proportion: y = k/x"],
    question: "y is directly proportional to x. When x = 4, y = 10. Find y when x = 7.",
    steps: ["Use y = kx and substitute 10 = 4k.", "Find k = 10 / 4 = 2.5.", "When x = 7, y = 2.5 x 7 = 17.5."],
    answer: "17.5",
  },
  "y11-maths-graphs": {
    formulae: ["Straight line: y = mx + c", "Gradient m = change in y / change in x"],
    question: "Find the gradient between (2, 3) and (6, 11).",
    steps: ["Find the change in y: 11 - 3 = 8.", "Find the change in x: 6 - 2 = 4.", "Divide: m = 8 / 4 = 2."],
    answer: "2",
  },
  "y11-maths-circle": {
    formulae: ["The angle at the centre is twice the angle at the circumference on the same arc"],
    question: "An angle at the circumference is 38 degrees. Find the angle at the centre on the same arc.",
    steps: ["Identify the same arc for both angles.", "Use centre angle = 2 x circumference angle.", "Calculate 2 x 38 = 76 degrees."],
    answer: "76 degrees",
  },
  "y11-maths-foundation": {
    formulae: ["Choose a formula, substitute values with units, calculate, then check"],
    question: "A taxi costs GBP 3 plus GBP 1.80 per mile. Find the cost of 7 miles.",
    steps: ["Write the model: cost = 3 + 1.80 x miles.", "Substitute 7 miles: 3 + 1.80 x 7.", "Calculate 3 + 12.60 = 15.60."],
    answer: "GBP 15.60",
  },
  "y11-maths-found-number": {
    formulae: ["Percentage multiplier = 1 +/- percentage change / 100"],
    question: "Reduce GBP 240 by 15%.",
    steps: ["A 15% decrease uses multiplier 0.85.", "Substitute: 240 x 0.85.", "Calculate 240 x 0.85 = 204."],
    answer: "GBP 204",
  },
  "y11-maths-found-algebra": {
    formulae: ["Straight line: y = mx + c"],
    question: "Solve 3x + 8 = 26.",
    steps: ["Subtract 8 from both sides: 3x = 18.", "Divide both sides by 3: x = 6.", "Check: 3(6) + 8 = 26."],
    answer: "x = 6",
  },
  "y11-maths-found-geometry": {
    formulae: ["Pythagoras: a^2 + b^2 = c^2", "Triangle area = 1/2 x base x height"],
    question: "Find the area of a triangle with base 12 cm and perpendicular height 7 cm.",
    steps: ["Use A = 1/2 x b x h.", "Substitute: A = 1/2 x 12 x 7.", "Calculate A = 42 and include square units."],
    answer: "42 cm squared",
  },
  "y11-maths-found-probability": {
    formulae: ["P(event) = favourable outcomes / total outcomes"],
    question: "A bag has 3 red and 7 blue counters. Find P(red).",
    steps: ["Count favourable outcomes: 3 red counters.", "Count all outcomes: 3 + 7 = 10.", "Write the probability as 3 / 10."],
    answer: "3/10",
  },
  "y11-maths-found-statistics": {
    formulae: ["Mean = total / frequency", "Range = highest - lowest"],
    question: "Find the range of 12, 18, 9, 15 and 21.",
    steps: ["Identify the highest value: 21.", "Identify the lowest value: 9.", "Subtract: 21 - 9 = 12."],
    answer: "12",
  },
  "y11-maths-found-ratio": {
    formulae: ["Speed = distance / time", "Density = mass / volume"],
    question: "A car travels 150 miles in 3 hours. Find its average speed.",
    steps: ["Use speed = distance / time.", "Substitute: speed = 150 / 3.", "Calculate 50 and include the correct units."],
    answer: "50 mph",
  },
  "y11-maths-number": {
    formulae: ["square root of a x square root of b = square root of ab"],
    question: "Simplify square root of 50.",
    steps: ["Find the largest square factor: 50 = 25 x 2.", "Split the root: square root of 25 x square root of 2.", "Simplify square root of 25 to 5."],
    answer: "5 square root of 2",
  },
  "y11-maths-algebra": {
    formulae: ["Quadratic formula: x = (-b +/- square root of (b^2 - 4ac)) / 2a"],
    question: "Write x^2 + 6x + 2 in completed-square form.",
    steps: ["Half the coefficient of x: 6 / 2 = 3.", "Write (x + 3)^2, which expands to x^2 + 6x + 9.", "Subtract the extra 9: (x + 3)^2 - 7."],
    answer: "(x + 3)^2 - 7",
  },
  "y11-maths-probability": {
    formulae: ["P(A given B) = P(A and B) / P(B)"],
    question: "P(A and B) = 0.18 and P(B) = 0.6. Find P(A given B).",
    steps: ["Use conditional probability: P(A given B) = P(A and B) / P(B).", "Substitute: 0.18 / 0.6.", "Calculate 0.3."],
    answer: "0.3",
  },
  "y11-maths-statistics": {
    formulae: ["Frequency density = frequency / class width"],
    question: "A class interval 10 < x <= 15 has frequency 20. Find its frequency density.",
    steps: ["Find class width: 15 - 10 = 5.", "Use frequency density = frequency / class width.", "Calculate 20 / 5 = 4."],
    answer: "4",
  },
  "y11-maths-nonright": {
    formulae: ["Sine rule: a/sin A = b/sin B", "Cosine rule: a^2 = b^2 + c^2 - 2bc cos A", "Triangle area = 1/2 ab sin C"],
    question: "Find the area of a triangle with sides 8 cm and 11 cm enclosing an angle of 40 degrees.",
    steps: ["Use A = 1/2 ab sin C.", "Substitute: A = 1/2 x 8 x 11 x sin 40 degrees.", "Calculate A = 28.3 cm squared to 1 decimal place."],
    answer: "28.3 cm squared (1 d.p.)",
  },
};

const subjectMethods = {
  Science: ["Identify the scientific idea or model named in the question.", "Apply it to the stated situation using precise scientific vocabulary.", "Link the evidence to the conclusion and include units in any calculation."],
  English: ["Make a focused point that answers the question.", "Use a short example or quotation, then identify the writer's method.", "Explain the effect and connect it back to the main idea."],
  History: ["Make a clear claim about the event, person, or interpretation.", "Support it with accurate evidence such as a date, action, or consequence.", "Explain why that evidence proves the claim and weigh its importance."],
  Geography: ["Name and locate the process, pattern, or place being discussed.", "Explain the links in the process using cause-and-effect language.", "Support the explanation with specific evidence and reach a justified conclusion."],
  Computing: ["Break the problem into small, ordered steps.", "Trace each step with a simple input and record how the data changes.", "Check the output and explain why the method works."],
  "Design & Technology": ["Identify the user's need and the design requirement.", "Choose a material, process, or mechanism and justify it using its properties.", "Evaluate the result against the requirement and suggest a measurable improvement."],
};

export function getTopicGuide(subject, topic, tier = null) {
  // Authored teaching text first. Until this existed, every explanation was the
  // topic's one-line goal restated, which told a learner what the topic was for
  // and nothing about the topic itself.
  const raw = contentFor(topic.id);
  const authored = raw && tier ? explanationForTier(raw, tier) : raw;
  const keyIdeas = authored?.keyIdeas?.length
    ? authored.keyIdeas
    : topic.outcomes.map((outcome) => `${outcome}.`);
  const explanation = authored?.explanation ?? topic.goal;
  const formulae = authored?.formulae ?? [];
  const lessons = subtopicLessons[topic.id];
  const subtopics = lessons ? { subtopics: lessons } : {};

  const maths = subject === "Maths" ? mathsExamples[topic.id] : null;
  if (maths) {
    // The maths entry supplies the worked example. Its formulae predate the
    // authored content and are plain-text restatements of it, so they are a
    // fallback, not an override: taking them first meant every one of the 42
    // maths topics served "Rounded value - half unit <= true value" in place of
    // the authored, typeset "$x - \frac{u}{2} \le \text{true value}$", and the
    // authored formulae reached no learner at all.
    return { explanation, keyIdeas, ...maths, formulae: authored ? formulae : (maths.formulae ?? []), ...(authored?.higher ? {higher: authored.higher} : {}), ...subtopics };
  }

  const method = subjectMethods[subject] ?? [
    "Identify the key knowledge required by the question.",
    "Apply it to a clear example.",
    "Check the result against the learning goal.",
  ];
  return {
    ...subtopics,
    explanation,
    keyIdeas,
    formulae,
    ...(authored?.higher ? {higher: authored.higher} : {}),
    question: `Show how you would ${topic.outcomes[0].charAt(0).toLowerCase()}${topic.outcomes[0].slice(1)} in a question about ${topic.title}.`,
    steps: method,
    answer: `A strong response demonstrates ${topic.outcomes[0].toLowerCase()} and explains each decision using accurate subject knowledge.`,
  };
}

// The authored worked example for a topic, when one exists. Kept separate from
// getTopicGuide because that falls back to a generic template for subjects with
// no authored example, and a template is not worth storing or showing.
// An authored example for one sub-topic at one tier. The per-outcome examples
// in authoredWorkedExamples.js are checked first; the older one-per-topic Maths
// examples below only ever covered the first outcome.
export function getAuthoredExample(subject, topic, index = 0, tier = null) {
  if (!warrantsWorkedExample(topic.id, index)) return null;
  const perOutcome = editorialExamples[`${topic.id}/example-${index}-${tier ?? 'core'}`] ?? authoredWorkedExample(topic.id, index, tier);
  if (perOutcome) return { formulae: warrantsFormulae(topic.id, index) ? perOutcome.formulae ?? [] : [], question: perOutcome.question, steps: perOutcome.steps, answer: perOutcome.answer };
  if (index !== 0) return null;
  const authored = subject === "Maths" ? mathsExamples[topic.id] : null;
  if (!authored?.question || !authored.steps?.length) return null;
  return { formulae: warrantsFormulae(topic.id, index) ? authored.formulae ?? [] : [], question: authored.question, steps: authored.steps, answer: authored.answer };
}

export function formatTopicGuide(subject, topic, tier = null) {
  const guide = getTopicGuide(subject, topic, tier);
  const example = getAuthoredExample(subject, topic, 0, tier);
  const formulaSection = guide.formulae.length
    ? `\n\nKEY FORMULAS\n${guide.formulae.map((formula) => `- ${formula}`).join("\n")}`
    : "";
  return [
    `CLEAR EXPLANATION\n${guide.explanation}`,
    `KEY IDEAS\n${guide.keyIdeas.map((idea) => `- ${idea}`).join("\n")}${formulaSection}`,
    ...(example ? [`WORKED EXAMPLE\nQuestion: ${example.question}\n${example.steps.map((step, index) => `${index + 1}. ${step}`).join("\n")}\nAnswer: ${example.answer}`] : []),
    `CHECK YOUR UNDERSTANDING\nWhich step would you like me to explain, or would you like a similar question to try?`,
  ].join("\n\n");
}
