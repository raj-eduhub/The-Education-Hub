// Worked examples written by hand for sub-topics added in the September 2026
// specification sweep, keyed "topicId#outcomeIndex".
//
// An entry is either one example, used for every tier, or an object holding a
// Foundation and a Higher example. The seeder stores these as they are, with no
// model call, exactly as it stores the authored examples in topicGuides.js, so a
// normal seeding run puts them in production storage too.
//
// Every figure below was worked through, and every question carries all the
// data it needs, because the learner is shown no diagram or graph. Written with
// String.raw so LaTeX needs no doubled backslashes; none may contain "${".
const r = String.raw;

export const authoredWorkedExamples = {
  // ---- Maths, Year 10 ------------------------------------------------------
  "y10-maths-statistics#6": {
    Foundation: {
      formulae: [r`Change $=$ later value $-$ earlier value`],
      question: r`A café records its ice-cream sales each quarter. In 2024 it sold 120, 340, 410 and 150 in quarters 1 to 4. In 2025 it sold 140, 370, 450 and 170. Describe the seasonal pattern and the trend.`,
      steps: [
        r`Plot the eight values in time order, quarter 1 of 2024 to quarter 4 of 2025, and join the points with straight lines.`,
        r`Seasonal pattern: in both years sales are high in quarters 2 and 3 and low in quarters 1 and 4, so the graph rises and falls each summer and winter.`,
        r`To find the trend, compare like quarters rather than neighbouring ones: $140 - 120 = 20$, $370 - 340 = 30$, $450 - 410 = 40$ and $170 - 150 = 20$.`,
        r`Every quarter of 2025 is higher than the same quarter of 2024.`,
        r`Check with the yearly totals: $120 + 340 + 410 + 150 = 1020$ in 2024 and $140 + 370 + 450 + 170 = 1130$ in 2025.`,
      ],
      answer: r`Sales peak every summer and dip every winter, and the overall trend is upward: every quarter of 2025 beat the same quarter of 2024, and the yearly total rose from 1020 to 1130.`,
    },
    Higher: {
      formulae: [r`Percentage change $= \frac{\text{new} - \text{old}}{\text{old}} \times 100$`],
      question: r`A school's electricity use in kWh was 18 400 in autumn 2023, 21 000 in spring 2024 and 9800 in summer 2024, then 17 100 in autumn 2024, 19 300 in spring 2025 and 9100 in summer 2025. A new energy scheme started in September 2024. The head says use fell by more than half from spring 2025 to summer 2025, so the scheme worked. Judge the claim and give a fairer measure of the change.`,
      steps: [
        r`Spring 2025 to summer 2025: $\frac{19300 - 9100}{19300} \times 100 = 52.8\%$ fall.`,
        r`Spring 2024 to summer 2024, before the scheme: $\frac{21000 - 9800}{21000} \times 100 = 53.3\%$ fall. The same drop happens every year, because summer is a short, light, warm term.`,
        r`Compare like terms instead: autumn $\frac{18400 - 17100}{18400} \times 100 = 7.1\%$ fall, spring $\frac{21000 - 19300}{21000} \times 100 = 8.1\%$ fall, summer $\frac{9800 - 9100}{9800} \times 100 = 7.1\%$ fall.`,
        r`Yearly totals: $18400 + 21000 + 9800 = 49200$ kWh before, and $17100 + 19300 + 9100 = 45500$ kWh after.`,
        r`Change in the yearly total: $\frac{49200 - 45500}{49200} \times 100 = 7.5\%$ fall.`,
      ],
      answer: r`The claim is misleading, because a fall of about half from spring to summer is a seasonal pattern that happened the year before too. Compared term for term, use fell by about 7 to 8%, and the yearly total fell by 7.5%, which is the fair measure of the scheme.`,
    },
  },
  "y10-maths-ratio#6": {
    Foundation: {
      formulae: [r`Unit price $= \frac{\text{price}}{\text{quantity}}$`],
      question: r`Pack A holds 6 cans of drink for £3.30. Pack B holds 10 cans for £5.20. Which pack is better value?`,
      steps: [
        r`Change the prices to pence so the division is easier: £3.30 is 330p and £5.20 is 520p.`,
        r`Pack A: $330 \div 6 = 55$p per can.`,
        r`Pack B: $520 \div 10 = 52$p per can.`,
        r`The lower price per can is the better value.`,
      ],
      answer: r`Pack B is better value, at 52p a can against 55p.`,
    },
    Higher: {
      formulae: [r`Unit price $= \frac{\text{price}}{\text{quantity}}$`],
      question: r`Washing powder is sold in three sizes: 850 g for £2.55, 1.4 kg for £4.06, and 2.5 kg for £7.40 with 20% extra free. Which size is the best value?`,
      steps: [
        r`Put every size in the same unit: 850 g is 0.85 kg.`,
        r`The large box holds 20% extra: $2.5 \times 1.2 = 3$ kg.`,
        r`Small: $2.55 \div 0.85 = 3.00$, so £3.00 per kg.`,
        r`Medium: $4.06 \div 1.4 = 2.90$, so £2.90 per kg.`,
        r`Large: $7.40 \div 3 = 2.466\ldots$, so about £2.47 per kg.`,
      ],
      answer: r`The large box is the best value, at about £2.47 per kg, compared with £2.90 for the medium and £3.00 for the small.`,
    },
  },
  "y10-maths-probability#6": {
    Foundation: {
      formulae: [r`Product rule: $m$ ways then $n$ ways gives $m \times n$ ways`],
      question: r`A café's meal deal is one sandwich, one drink and one snack. There are 4 sandwiches, 3 drinks and 2 snacks to choose from. How many different meal deals are there?`,
      steps: [
        r`Each choice is made independently, so the product rule applies.`,
        r`Sandwich then drink: $4 \times 3 = 12$ combinations.`,
        r`Each of those can go with either snack: $12 \times 2 = 24$.`,
      ],
      answer: r`There are 24 different meal deals.`,
    },
    Higher: {
      formulae: [r`Product rule: $m$ ways then $n$ ways gives $m \times n$ ways`],
      question: r`A code is two different letters from A to Z followed by two digits from 0 to 9, which may repeat. How many codes are possible? A code is chosen at random. What is the probability that its two digits are the same?`,
      steps: [
        r`First letter: 26 choices. Second letter must be different: 25 choices.`,
        r`Letters: $26 \times 25 = 650$ ways.`,
        r`Digits: $10 \times 10 = 100$ ways, so the number of codes is $650 \times 100 = 65000$.`,
        r`Codes with matching digits: the first digit can be anything and the second must copy it, so $650 \times 10 \times 1 = 6500$.`,
        r`Probability $= \frac{6500}{65000} = \frac{1}{10}$.`,
      ],
      answer: r`There are 65 000 possible codes, and the probability that the two digits match is $\frac{1}{10}$.`,
    },
  },

  // ---- Maths, Year 11 ------------------------------------------------------
  "y11-maths-graphs#6": {
    formulae: [r`$y = a \times k^{x}$ passes through $(0, a)$`],
    question: r`A population of bacteria is modelled by $P = 200 \times 1.5^{t}$, where $t$ is the time in hours. Find $P$ when $t = 0$ and when $t = 4$, then describe the shape of the graph and explain why it never meets the $t$-axis.`,
    steps: [
      r`When $t = 0$: $1.5^{0} = 1$, so $P = 200$. The graph starts at $(0, 200)$.`,
      r`When $t = 4$: $1.5^{4} = 5.0625$, so $P = 200 \times 5.0625 = 1012.5$, about 1013.`,
      r`Each hour multiplies $P$ by 1.5, so the increase gets bigger every hour and the curve rises ever more steeply.`,
      r`A positive number raised to any power is positive, so $P$ can shrink towards 0 for negative $t$ but never reaches it.`,
    ],
    answer: r`$P = 200$ at the start and about 1013 after 4 hours. The graph is an exponential growth curve through $(0, 200)$ that gets steeper and steeper, and it never meets the $t$-axis because $1.5^{t}$ is always positive.`,
  },
  "y11-maths-graphs#7": {
    formulae: [r`$\sin x = \sin(180^\circ - x)$`],
    question: r`Given that $\sin 30^\circ = 0.5$, find every solution of $\sin x = 0.5$ and of $\sin x = -0.5$ for $0^\circ \le x \le 360^\circ$.`,
    steps: [
      r`The graph of $y = \sin x$ rises from 0 to 1 at $90^\circ$, falls to $-1$ at $270^\circ$, and returns to 0 at $360^\circ$.`,
      r`It is symmetrical about $x = 90^\circ$, so the second solution of $\sin x = 0.5$ is $180^\circ - 30^\circ = 150^\circ$.`,
      r`The negative half of the curve, from $180^\circ$ to $360^\circ$, is the positive half turned upside down, so $\sin x = -0.5$ at $180^\circ + 30^\circ = 210^\circ$.`,
      r`By symmetry about $x = 270^\circ$, the other solution is $360^\circ - 30^\circ = 330^\circ$.`,
    ],
    answer: r`$\sin x = 0.5$ when $x = 30^\circ$ or $150^\circ$, and $\sin x = -0.5$ when $x = 210^\circ$ or $330^\circ$.`,
  },
  "y11-maths-graphs#8": {
    formulae: [r`Gradient $= \frac{\text{change in } y}{\text{change in } x}$`],
    question: r`The distance a cyclist has travelled is $d = t^{2}$ metres after $t$ seconds. A tangent drawn to the curve at $t = 3$ passes through the points $(1.5, 0)$ and $(5, 21)$. Estimate the cyclist's speed at 3 seconds.`,
    steps: [
      r`The gradient of a distance-time graph is speed, and the gradient of the curve at a point is the gradient of the tangent there.`,
      r`Change in $d$: $21 - 0 = 21$ m.`,
      r`Change in $t$: $5 - 1.5 = 3.5$ s.`,
      r`Gradient $= \frac{21}{3.5} = 6$.`,
    ],
    answer: r`The cyclist's speed at 3 seconds is about 6 m/s.`,
  },
  "y11-maths-graphs#9": {
    formulae: [r`Area of a trapezium $= \frac{1}{2}(a + b)h$`],
    question: r`A car accelerates from rest. Its speed is 0 m/s at 0 s, 6 m/s at 2 s, 10 m/s at 4 s and 12 m/s at 6 s, and the speed-time graph is a smooth curve that gets less steep. Use three strips of equal width to estimate the distance travelled in 6 seconds, and say whether the estimate is too high or too low.`,
    steps: [
      r`The area under a speed-time graph is the distance travelled. Three strips from 0 to 6 s are each 2 s wide.`,
      r`First strip: $\frac{1}{2}(0 + 6) \times 2 = 6$ m.`,
      r`Second strip: $\frac{1}{2}(6 + 10) \times 2 = 16$ m.`,
      r`Third strip: $\frac{1}{2}(10 + 12) \times 2 = 22$ m.`,
      r`Total: $6 + 16 + 22 = 44$ m.`,
      r`The curve gets less steep, so it bulges above the straight top of each trapezium, and the trapezia miss a little area.`,
    ],
    answer: r`The car travels about 44 m, and this is an underestimate because the curve lies above the tops of the trapezia.`,
  },
  "y11-maths-circle#6": {
    formulae: [r`$x^{2} + y^{2} = r^{2}$`],
    question: r`A circle has equation $x^{2} + y^{2} = 25$. State its centre and radius, show that $(3, -4)$ lies on it, and find where it crosses the line $y = 4$.`,
    steps: [
      r`Comparing with $x^{2} + y^{2} = r^{2}$: the centre is $(0, 0)$ and $r^{2} = 25$, so $r = 5$.`,
      r`Substitute $(3, -4)$: $3^{2} + (-4)^{2} = 9 + 16 = 25$, so the point lies on the circle.`,
      r`Substitute $y = 4$: $x^{2} + 16 = 25$, so $x^{2} = 9$.`,
      r`$x = 3$ or $x = -3$.`,
    ],
    answer: r`The centre is $(0, 0)$ and the radius is 5. The point $(3, -4)$ satisfies the equation, and the circle crosses $y = 4$ at $(3, 4)$ and $(-3, 4)$.`,
  },
  "y11-maths-circle#7": {
    formulae: [r`Perpendicular gradients: $m_{1} \times m_{2} = -1$`],
    question: r`Find the equation of the tangent to the circle $x^{2} + y^{2} = 20$ at the point $(2, 4)$.`,
    steps: [
      r`Check the point is on the circle: $2^{2} + 4^{2} = 4 + 16 = 20$.`,
      r`The radius runs from $(0, 0)$ to $(2, 4)$, so its gradient is $\frac{4}{2} = 2$.`,
      r`A tangent is perpendicular to the radius at the point of contact, so its gradient is $-\frac{1}{2}$.`,
      r`Substitute $(2, 4)$ into $y = mx + c$: $4 = -\frac{1}{2} \times 2 + c$, so $c = 5$.`,
    ],
    answer: r`The tangent is $y = -\frac{1}{2}x + 5$.`,
  },
  "y11-maths-found-geometry#6": {
    formulae: [r`Image length $=$ scale factor $\times$ object length`],
    question: r`A triangle has vertices $A(2, 2)$, $B(8, 2)$ and $C(2, 6)$. It is enlarged by scale factor $\frac{1}{2}$ with centre $(0, 0)$. Find the vertices of the image and the length of its base.`,
    steps: [
      r`With the centre at the origin, each point's distance from the centre is halved, so each coordinate is multiplied by $\frac{1}{2}$.`,
      r`$A(2, 2)$ becomes $A'(1, 1)$.`,
      r`$B(8, 2)$ becomes $B'(4, 1)$.`,
      r`$C(2, 6)$ becomes $C'(1, 3)$.`,
      r`The base $AB$ is $8 - 2 = 6$ units, so $A'B'$ is $\frac{1}{2} \times 6 = 3$ units. Check: $4 - 1 = 3$.`,
    ],
    answer: r`The image has vertices $(1, 1)$, $(4, 1)$ and $(1, 3)$, and its base is 3 units, half the original 6.`,
  },
  "y11-maths-algebra#6": {
    formulae: [r`$fg(x) = f(g(x))$`],
    question: r`$f(x) = 3x - 1$ and $g(x) = x^{2} + 2$. Find $fg(2)$, and find $gf(x)$ in its simplest form.`,
    steps: [
      r`$fg(2)$ means apply $g$ first: $g(2) = 2^{2} + 2 = 6$.`,
      r`Then apply $f$: $f(6) = 3 \times 6 - 1 = 17$.`,
      r`$gf(x)$ means apply $f$ first, then square the result and add 2: $gf(x) = (3x - 1)^{2} + 2$.`,
      r`Expand: $(3x - 1)^{2} = 9x^{2} - 6x + 1$.`,
      r`So $gf(x) = 9x^{2} - 6x + 3$.`,
    ],
    answer: r`$fg(2) = 17$ and $gf(x) = 9x^{2} - 6x + 3$.`,
  },
  "y11-maths-algebra#7": {
    formulae: [r`$f^{-1}(f(x)) = x$`],
    question: r`$f(x) = \frac{2x + 5}{3}$. Find $f^{-1}(x)$, and check your answer using $f(2)$.`,
    steps: [
      r`Write $y = \frac{2x + 5}{3}$.`,
      r`Multiply both sides by 3: $3y = 2x + 5$.`,
      r`Rearrange to make $x$ the subject: $x = \frac{3y - 5}{2}$.`,
      r`Write it as a function of $x$: $f^{-1}(x) = \frac{3x - 5}{2}$.`,
      r`Check: $f(2) = \frac{4 + 5}{3} = 3$, and $f^{-1}(3) = \frac{9 - 5}{2} = 2$, which returns the input.`,
    ],
    answer: r`$f^{-1}(x) = \frac{3x - 5}{2}$.`,
  },
  "y11-maths-similarity#0": {
    formulae: [r`Area scale factor $= k^{2}$`, r`Volume scale factor $= k^{3}$`],
    question: r`Two cylinders are similar. The smaller is 6 cm tall, with a surface area of 80 cm² and a volume of 60 cm³. The larger is 9 cm tall. Find the surface area and the volume of the larger cylinder.`,
    steps: [
      r`Length scale factor: $k = \frac{9}{6} = 1.5$.`,
      r`Area scale factor: $k^{2} = 1.5^{2} = 2.25$.`,
      r`Surface area: $80 \times 2.25 = 180$ cm².`,
      r`Volume scale factor: $k^{3} = 1.5^{3} = 3.375$.`,
      r`Volume: $60 \times 3.375 = 202.5$ cm³.`,
    ],
    answer: r`The larger cylinder has a surface area of 180 cm² and a volume of 202.5 cm³.`,
  },
  "y11-maths-similarity#1": {
    formulae: [r`$k = \sqrt[3]{\text{volume scale factor}}$`, r`$k = \sqrt{\text{area scale factor}}$`],
    question: r`Two similar bottles have volumes of 250 cm³ and 2000 cm³. The smaller bottle is 12 cm tall. Find the height of the larger bottle, and the ratio of their surface areas.`,
    steps: [
      r`Volume scale factor: $\frac{2000}{250} = 8$.`,
      r`Length scale factor: $k = \sqrt[3]{8} = 2$.`,
      r`Height of the larger bottle: $12 \times 2 = 24$ cm.`,
      r`Area scale factor: $k^{2} = 2^{2} = 4$.`,
    ],
    answer: r`The larger bottle is 24 cm tall, and the surface areas are in the ratio $1 : 4$.`,
  },
  "y11-maths-similarity#2": {
    formulae: [r`Image point $=$ centre $+ k \times$ (object point $-$ centre)`],
    question: r`A triangle has vertices $(4, 2)$, $(8, 2)$ and $(4, 6)$. Enlarge it by scale factor $-\frac{1}{2}$ with centre $(0, 0)$, and describe how the image compares with the original.`,
    steps: [
      r`With the centre at the origin, multiply every coordinate by $-\frac{1}{2}$.`,
      r`$(4, 2)$ becomes $(-2, -1)$.`,
      r`$(8, 2)$ becomes $(-4, -1)$.`,
      r`$(4, 6)$ becomes $(-2, -3)$.`,
      r`Base: the original is $8 - 4 = 4$ units long and the image is $-2 - (-4) = 2$ units, half the length.`,
    ],
    answer: r`The image has vertices $(-2, -1)$, $(-4, -1)$ and $(-2, -3)$. It is half the size, on the opposite side of the centre, and turned upside down.`,
  },
  "y11-maths-similarity#3": {
    formulae: [r`Scale factor $= \frac{\text{image length}}{\text{object length}}$`],
    question: r`Triangle A has vertices $(1, 1)$, $(2, 1)$ and $(1, 3)$. Its image, triangle B, has vertices $(3, 1)$, $(5, 1)$ and $(3, 5)$, in the same order. Find the scale factor and the centre of the enlargement.`,
    steps: [
      r`Base of A: $2 - 1 = 1$. Base of B: $5 - 3 = 2$. Scale factor $= \frac{2}{1} = 2$.`,
      r`The centre lies on every line joining a point to its image. The line through $(1, 1)$ and $(3, 1)$ is $y = 1$.`,
      r`The line through $(1, 3)$ and $(3, 5)$ has gradient $\frac{5 - 3}{3 - 1} = 1$, so it is $y = x + 2$.`,
      r`Where they meet: $1 = x + 2$, so $x = -1$ and the centre is $(-1, 1)$.`,
      r`Check with $(2, 1)$: it is 3 units right of the centre, so its image should be 6 units right, at $(5, 1)$. It is.`,
    ],
    answer: r`An enlargement by scale factor 2 with centre $(-1, 1)$.`,
  },
  "y11-maths-similarity#4": {
    formulae: [r`Similar shapes: every $\frac{\text{image side}}{\text{object side}}$ is equal`],
    question: r`Triangle A has sides 5 cm, 7 cm and 9 cm. Triangle B has sides 12.5 cm, 17.5 cm and 22.5 cm. Triangle C has sides 10 cm, 14 cm and 20 cm. Which triangles are similar to A?`,
    steps: [
      r`Match the sides in order of size and divide each by the corresponding side of A.`,
      r`B: $\frac{12.5}{5} = 2.5$, $\frac{17.5}{7} = 2.5$, $\frac{22.5}{9} = 2.5$. Every ratio is equal.`,
      r`C: $\frac{10}{5} = 2$, $\frac{14}{7} = 2$, $\frac{20}{9} = 2.22\ldots$. The last ratio is different.`,
    ],
    answer: r`Only triangle B is similar to A, with scale factor 2.5. Triangle C is not, because its longest side is not in the same ratio as the others.`,
  },

  // ---- Science, Year 10 ----------------------------------------------------
  "y10-science-organisation#8": {
    Foundation: {
      formulae: [r`Rate $= \frac{\text{distance moved}}{\text{time}}$`],
      question: r`In a potometer, the air bubble moves 36 mm in 12 minutes as a leafy shoot takes up water. Calculate the rate of water uptake, then predict and explain what happens when a fan blows air over the leaves.`,
      steps: [
        r`Rate $= \frac{36}{12} = 3$ mm per minute.`,
        r`Water taken up by the shoot replaces water lost by transpiration, so the bubble measures how fast the leaves are losing water.`,
        r`Moving air carries water vapour away from the surface of the leaf.`,
        r`That keeps the air outside drier than the air spaces inside the leaf, so water vapour diffuses out of the stomata faster.`,
      ],
      answer: r`The rate is 3 mm per minute. With the fan on, the bubble moves faster, because the moving air removes water vapour from around the leaf and transpiration speeds up.`,
    },
    Higher: {
      formulae: [r`Volume $=$ distance moved $\times$ cross-sectional area`, r`Rate $= \frac{\text{volume}}{\text{time}}$`],
      question: r`A potometer's capillary tube has a cross-sectional area of 0.8 mm². In still air the bubble moves 45 mm in 5 minutes. With the shoot inside a clear plastic bag, it moves 15 mm in 5 minutes. Calculate both rates of water uptake in mm³ per minute, the percentage decrease, and explain the change.`,
      steps: [
        r`Still air: volume $= 45 \times 0.8 = 36$ mm³, so the rate is $\frac{36}{5} = 7.2$ mm³ per minute.`,
        r`In the bag: volume $= 15 \times 0.8 = 12$ mm³, so the rate is $\frac{12}{5} = 2.4$ mm³ per minute.`,
        r`Percentage decrease $= \frac{7.2 - 2.4}{7.2} \times 100 = 66.7\%$.`,
        r`The bag traps the water vapour the leaves lose, so the air around them becomes humid.`,
        r`The concentration gradient of water vapour between the air spaces in the leaf and the air outside is smaller, so less diffuses out of the stomata each minute.`,
      ],
      answer: r`Uptake falls from 7.2 to 2.4 mm³ per minute, a 66.7% decrease, because humid air reduces the water vapour concentration gradient and slows diffusion out of the stomata.`,
    },
  },
  "y10-science-atomic#7": {
    Foundation: {
      formulae: [r`Neutrons $=$ mass number $-$ atomic number`],
      question: r`A sodium atom has atomic number 11 and mass number 23. How many protons, neutrons and electrons does it have?`,
      steps: [
        r`The atomic number is the number of protons: 11.`,
        r`An atom is neutral, so it has as many electrons as protons: 11.`,
        r`Neutrons $=$ mass number $-$ atomic number $= 23 - 11 = 12$.`,
      ],
      answer: r`A sodium atom has 11 protons, 12 neutrons and 11 electrons.`,
    },
    Higher: {
      formulae: [r`Neutrons $=$ mass number $-$ atomic number`],
      question: r`Chlorine has atomic number 17. Find the numbers of protons, neutrons and electrons in an atom of chlorine-37 and in a chloride ion, $\mathrm{Cl^{-}}$, made from it. How does an atom of chlorine-35 differ?`,
      steps: [
        r`Chlorine-37 has mass number 37 and atomic number 17, so it has 17 protons and $37 - 17 = 20$ neutrons.`,
        r`The atom is neutral, so it has 17 electrons.`,
        r`The single negative charge on $\mathrm{Cl^{-}}$ means it has gained one electron: 18 electrons, still 17 protons and 20 neutrons.`,
        r`Chlorine-35 has $35 - 17 = 18$ neutrons, and the same 17 protons and 17 electrons.`,
      ],
      answer: r`The chlorine-37 atom has 17 protons, 20 neutrons and 17 electrons; the chloride ion has 17 protons, 20 neutrons and 18 electrons. Chlorine-35 is an isotope with two fewer neutrons, 18, so it has the same chemistry but a smaller mass.`,
    },
  },
  "y10-science-energy#9": {
    Foundation: {
      formulae: [r`$R = \frac{V}{I}$`],
      question: r`A component has a current of 0.40 A at 2.0 V, 0.80 A at 4.0 V and 1.20 A at 6.0 V. Calculate its resistance at each potential difference, and decide whether it is a resistor at constant temperature or a filament lamp.`,
      steps: [
        r`At 2.0 V: $R = \frac{2.0}{0.40} = 5.0$ Ω.`,
        r`At 4.0 V: $R = \frac{4.0}{0.80} = 5.0$ Ω.`,
        r`At 6.0 V: $R = \frac{6.0}{1.20} = 5.0$ Ω.`,
        r`The resistance stays the same, so the current is directly proportional to the potential difference and the I-V graph is a straight line through the origin.`,
      ],
      answer: r`The resistance is 5.0 Ω every time, so it is a resistor at constant temperature. A filament lamp's resistance would rise as the current increased.`,
    },
    Higher: {
      formulae: [r`$R = \frac{V}{I}$`],
      question: r`A component has a current of 0.20 A at 1.0 V, 0.50 A at 6.0 V and 0.60 A at 12.0 V, and reversing the potential difference gives the same currents in the opposite direction. Identify the component, and explain the shape of its I-V graph.`,
      steps: [
        r`At 1.0 V: $R = \frac{1.0}{0.20} = 5.0$ Ω.`,
        r`At 6.0 V: $R = \frac{6.0}{0.50} = 12$ Ω.`,
        r`At 12.0 V: $R = \frac{12.0}{0.60} = 20$ Ω.`,
        r`The resistance rises as the current rises. A larger current heats the filament, its ions vibrate more, and the electrons collide with them more often.`,
        r`Equal steps of potential difference give smaller and smaller increases in current, so the graph curves and flattens.`,
        r`It conducts equally in both directions, so it is not a diode, which lets almost no current through in reverse.`,
      ],
      answer: r`It is a filament lamp: its resistance rises from 5.0 Ω to 20 Ω as it heats up, so the I-V graph is a curve that flattens at higher potential differences and has the same shape in both directions.`,
    },
  },

  // ---- Science, Year 11 ----------------------------------------------------
  "y11-science-waves#6": {
    Foundation: {
      formulae: [r`Forces in the same direction add; opposite forces subtract`],
      question: r`A box is pushed to the right with a force of 45 N, and friction acts on it with a force of 15 N to the left. Find the resultant force on the box.`,
      steps: [
        r`The two forces act along the same line in opposite directions, so subtract the smaller from the larger.`,
        r`$45 - 15 = 30$ N.`,
        r`The resultant acts in the direction of the larger force, to the right.`,
      ],
      answer: r`The resultant force is 30 N to the right.`,
    },
    Higher: {
      formulae: [r`$F = ma$`],
      question: r`A car of mass 1200 kg has a driving force of 2400 N. Air resistance of 900 N and rolling friction of 300 N act against it. Find the resultant force and the car's acceleration.`,
      steps: [
        r`Total force backwards: $900 + 300 = 1200$ N.`,
        r`Resultant: $2400 - 1200 = 1200$ N forwards.`,
        r`Rearrange $F = ma$: $a = \frac{F}{m} = \frac{1200}{1200}$.`,
        r`$a = 1.0$ m/s².`,
      ],
      answer: r`The resultant force is 1200 N forwards, so the car accelerates at 1.0 m/s².`,
    },
  },
  "y11-science-waves#7": {
    Foundation: {
      formulae: [r`Work done $W = Fs$`],
      question: r`A shopper pushes a trolley 25 m along a level floor with a steady force of 40 N. How much work does the shopper do?`,
      steps: [
        r`Work done $=$ force $\times$ distance moved along the line of the force.`,
        r`$W = 40 \times 25$.`,
        r`$W = 1000$ J.`,
      ],
      answer: r`The shopper does 1000 J of work, which is 1000 J of energy transferred.`,
    },
    Higher: {
      formulae: [r`Work done $W = Fs$`, r`Power $P = \frac{W}{t}$`, r`Weight $W = mg$`],
      question: r`A crane lifts a 300 kg load 12 m straight up at a steady speed in 20 s. Taking $g = 9.8$ N/kg, find the work done on the load and the useful power of the crane.`,
      steps: [
        r`At a steady speed the lifting force equals the load's weight: $300 \times 9.8 = 2940$ N.`,
        r`Work done $= 2940 \times 12 = 35280$ J.`,
        r`Power $= \frac{35280}{20} = 1764$ W.`,
      ],
      answer: r`The crane does 35 280 J of work, about 35 kJ, at a useful power of 1764 W, about 1.8 kW.`,
    },
  },
  "y11-science-waves#8": {
    Foundation: {
      formulae: [r`Hooke's law $F = ke$`],
      question: r`A spring has a spring constant of 40 N/m. What force stretches it by 0.15 m, assuming it stays within its limit of proportionality?`,
      steps: [
        r`Use $F = ke$ with $k = 40$ N/m and $e = 0.15$ m.`,
        r`$F = 40 \times 0.15$.`,
        r`$F = 6.0$ N.`,
      ],
      answer: r`A force of 6.0 N stretches the spring by 0.15 m.`,
    },
    Higher: {
      formulae: [r`Hooke's law $F = ke$`],
      question: r`A spring is 12.0 cm long. Hanging a 4.5 N weight on it makes it 15.0 cm long. Find the spring constant, and predict its length with a 6.0 N weight, assuming it stays within its limit of proportionality.`,
      steps: [
        r`The extension is the increase in length, not the new length: $15.0 - 12.0 = 3.0$ cm, which is 0.030 m.`,
        r`$k = \frac{F}{e} = \frac{4.5}{0.030} = 150$ N/m.`,
        r`With 6.0 N: $e = \frac{6.0}{150} = 0.040$ m, which is 4.0 cm.`,
        r`New length: $12.0 + 4.0 = 16.0$ cm.`,
      ],
      answer: r`The spring constant is 150 N/m, and with a 6.0 N weight the spring would be 16.0 cm long.`,
    },
  },
  "y11-science-waves#9": {
    Foundation: {
      formulae: [r`Elastic potential energy $E_{e} = \frac{1}{2}ke^{2}$`],
      question: r`A spring with a spring constant of 200 N/m is stretched by 0.10 m. How much elastic potential energy does it store?`,
      steps: [
        r`Use $E_{e} = \frac{1}{2}ke^{2}$ with $k = 200$ N/m and $e = 0.10$ m.`,
        r`Square the extension first: $0.10^{2} = 0.01$.`,
        r`$E_{e} = \frac{1}{2} \times 200 \times 0.01 = 1.0$ J.`,
      ],
      answer: r`The spring stores 1.0 J of elastic potential energy.`,
    },
    Higher: {
      formulae: [r`Elastic potential energy $E_{e} = \frac{1}{2}ke^{2}$`, r`Kinetic energy $E_{k} = \frac{1}{2}mv^{2}$`],
      question: r`A catapult band with a spring constant of 500 N/m is pulled back 8.0 cm and released. All of its stored energy is transferred to a 20 g stone. Find the speed at which the stone leaves the catapult.`,
      steps: [
        r`Convert to SI units: $e = 0.080$ m and $m = 0.020$ kg.`,
        r`Stored energy: $E_{e} = \frac{1}{2} \times 500 \times 0.080^{2} = 1.6$ J.`,
        r`This all becomes kinetic energy: $\frac{1}{2} \times 0.020 \times v^{2} = 1.6$.`,
        r`$v^{2} = \frac{1.6 \times 2}{0.020} = 160$.`,
        r`$v = \sqrt{160} = 12.6$ m/s.`,
      ],
      answer: r`The stone leaves at about 12.6 m/s.`,
    },
  },
  "y11-science-moles#0": {
    formulae: [r`Moles $= \frac{\text{mass}}{M_{r}}$`],
    question: r`How many moles are in 11 g of carbon dioxide, $\mathrm{CO_{2}}$? What is the mass of 0.20 mol of calcium carbonate, $\mathrm{CaCO_{3}}$? Relative atomic masses: C = 12, O = 16, Ca = 40.`,
    steps: [
      r`$M_{r}$ of $\mathrm{CO_{2}}$ $= 12 + (2 \times 16) = 44$.`,
      r`Moles of $\mathrm{CO_{2}}$ $= \frac{11}{44} = 0.25$ mol.`,
      r`$M_{r}$ of $\mathrm{CaCO_{3}}$ $= 40 + 12 + (3 \times 16) = 100$.`,
      r`Rearrange: mass $=$ moles $\times M_{r} = 0.20 \times 100 = 20$ g.`,
    ],
    answer: r`11 g of carbon dioxide is 0.25 mol, and 0.20 mol of calcium carbonate has a mass of 20 g.`,
  },
  "y11-science-moles#1": {
    formulae: [r`Moles $= \frac{\text{mass}}{M_{r}}$`],
    question: r`4.8 g of magnesium is added to 7.3 g of hydrochloric acid, dissolved in water. The equation is $\mathrm{Mg} + 2\mathrm{HCl} \rightarrow \mathrm{MgCl_{2}} + \mathrm{H_{2}}$. Using Mg = 24 and $M_{r}$ of HCl = 36.5, identify the limiting reactant.`,
    steps: [
      r`Moles of Mg $= \frac{4.8}{24} = 0.20$ mol.`,
      r`Moles of HCl $= \frac{7.3}{36.5} = 0.20$ mol.`,
      r`The equation shows 1 mol of Mg needs 2 mol of HCl, so 0.20 mol of Mg would need 0.40 mol of HCl.`,
      r`Only 0.20 mol of HCl is present, so the acid runs out first, when only 0.10 mol of magnesium has reacted.`,
    ],
    answer: r`Hydrochloric acid is the limiting reactant; magnesium is in excess, and half of it is left over.`,
  },
  "y11-science-moles#3": {
    formulae: [r`Number of particles $=$ moles $\times 6.02 \times 10^{23}$`],
    question: r`How many water molecules are in 9.0 g of water, and how many atoms is that? Relative atomic masses: H = 1, O = 16. The Avogadro constant is $6.02 \times 10^{23}$ per mole.`,
    steps: [
      r`$M_{r}$ of $\mathrm{H_{2}O}$ $= (2 \times 1) + 16 = 18$.`,
      r`Moles $= \frac{9.0}{18} = 0.50$ mol.`,
      r`Molecules $= 0.50 \times 6.02 \times 10^{23} = 3.01 \times 10^{23}$.`,
      r`Each molecule has 3 atoms, so atoms $= 3 \times 3.01 \times 10^{23} = 9.03 \times 10^{23}$.`,
    ],
    answer: r`9.0 g of water contains $3.01 \times 10^{23}$ molecules, which is $9.03 \times 10^{23}$ atoms.`,
  },
  "y11-science-moles#4": {
    formulae: [r`Moles $= \frac{\text{mass}}{M_{r}}$`],
    question: r`5.6 g of iron reacts completely with chlorine gas, $\mathrm{Cl_{2}}$, to make 16.25 g of iron chloride, $\mathrm{FeCl_{3}}$. Using Fe = 56 and Cl = 35.5, work out the balanced equation from the masses.`,
    steps: [
      r`Mass of chlorine that reacted: $16.25 - 5.6 = 10.65$ g.`,
      r`Moles of Fe $= \frac{5.6}{56} = 0.10$; moles of $\mathrm{Cl_{2}}$ $= \frac{10.65}{71} = 0.15$.`,
      r`$M_{r}$ of $\mathrm{FeCl_{3}}$ $= 56 + (3 \times 35.5) = 162.5$, so moles of $\mathrm{FeCl_{3}}$ $= \frac{16.25}{162.5} = 0.10$.`,
      r`Mole ratio Fe : $\mathrm{Cl_{2}}$ : $\mathrm{FeCl_{3}}$ $= 0.10 : 0.15 : 0.10$. Divide by 0.05 to get $2 : 3 : 2$.`,
    ],
    answer: r`$2\mathrm{Fe} + 3\mathrm{Cl_{2}} \rightarrow 2\mathrm{FeCl_{3}}$`,
  },
  "y11-science-moles#5": {
    formulae: [r`Mass $=$ moles $\times M_{r}$`],
    question: r`6.0 g of magnesium is heated with 3.2 g of oxygen. The equation is $2\mathrm{Mg} + \mathrm{O_{2}} \rightarrow 2\mathrm{MgO}$. Using Mg = 24 and O = 16, find the limiting reactant and the maximum mass of magnesium oxide.`,
    steps: [
      r`Moles of Mg $= \frac{6.0}{24} = 0.25$; moles of $\mathrm{O_{2}}$ $= \frac{3.2}{32} = 0.10$.`,
      r`2 mol of Mg needs 1 mol of $\mathrm{O_{2}}$, so 0.25 mol of Mg would need 0.125 mol. Only 0.10 mol is present, so oxygen is limiting.`,
      r`1 mol of $\mathrm{O_{2}}$ makes 2 mol of MgO, so 0.10 mol makes 0.20 mol of MgO.`,
      r`$M_{r}$ of MgO $= 24 + 16 = 40$, so the mass is $0.20 \times 40 = 8.0$ g.`,
      r`Check by conservation of mass: 0.20 mol of Mg is 4.8 g, and $4.8 + 3.2 = 8.0$ g.`,
    ],
    answer: r`Oxygen is the limiting reactant, and at most 8.0 g of magnesium oxide forms.`,
  },
  "y11-science-moles#6": {
    formulae: [r`Concentration $= \frac{\text{mass of solute}}{\text{volume}}$ in g/dm³`, r`$1\,\text{dm}^{3} = 1000\,\text{cm}^{3}$`],
    question: r`25.0 g of sodium chloride is dissolved in water to make 500 cm³ of solution. Find the concentration in g/dm³ and the mass of salt in 40.0 cm³ of it. What would the concentration be if the same salt were dissolved to make 1000 cm³?`,
    steps: [
      r`Convert the volume: $500 \div 1000 = 0.500$ dm³.`,
      r`Concentration $= \frac{25.0}{0.500} = 50.0$ g/dm³.`,
      r`40.0 cm³ is 0.0400 dm³, so it holds $50.0 \times 0.0400 = 2.00$ g of salt.`,
      r`The same mass in twice the volume: $\frac{25.0}{1.00} = 25.0$ g/dm³, so doubling the volume halves the concentration.`,
    ],
    answer: r`The concentration is 50.0 g/dm³, 40.0 cm³ of it contains 2.00 g of salt, and made up to 1000 cm³ it would be 25.0 g/dm³.`,
  },
  "y11-science-moles#7": {
    formulae: [r`Cathode: positive ions gain electrons`, r`Anode: negative ions lose electrons`],
    question: r`Molten lead bromide, $\mathrm{PbBr_{2}}$, is electrolysed with inert electrodes. Write the half equation at each electrode, and say which is oxidation and which is reduction.`,
    steps: [
      r`Molten lead bromide contains $\mathrm{Pb^{2+}}$ and $\mathrm{Br^{-}}$ ions, free to move.`,
      r`Positive lead ions move to the cathode and each gains two electrons: $\mathrm{Pb^{2+}} + 2e^{-} \rightarrow \mathrm{Pb}$.`,
      r`Gaining electrons is reduction.`,
      r`Bromide ions move to the anode, and two of them lose an electron each to form a molecule: $2\mathrm{Br^{-}} \rightarrow \mathrm{Br_{2}} + 2e^{-}$.`,
      r`Losing electrons is oxidation.`,
    ],
    answer: r`Cathode: $\mathrm{Pb^{2+}} + 2e^{-} \rightarrow \mathrm{Pb}$, which is reduction. Anode: $2\mathrm{Br^{-}} \rightarrow \mathrm{Br_{2}} + 2e^{-}$, which is oxidation.`,
  },
  "y11-science-moles#9": {
    formulae: [r`Rate at an instant $=$ gradient of the tangent`, r`Mean rate $= \frac{\text{amount of product}}{\text{time}}$`],
    question: r`Marble chips react with acid, and the volume of carbon dioxide is measured. After 60 s, 38 cm³ has been collected. A tangent drawn to the volume-time curve at 60 s passes through the points (20 s, 18 cm³) and (100 s, 58 cm³). Find the rate at 60 s and the mean rate over the first 60 s, and explain why they differ.`,
    steps: [
      r`Gradient of the tangent $= \frac{58 - 18}{100 - 20} = \frac{40}{80} = 0.50$ cm³/s.`,
      r`Mean rate over the first 60 s $= \frac{38}{60} = 0.63$ cm³/s.`,
      r`The rate at 60 s is lower than the mean because the reaction is slowing down.`,
      r`As acid is used up its concentration falls, so there are fewer collisions each second between acid particles and the marble.`,
    ],
    answer: r`The rate at 60 s is 0.50 cm³/s, lower than the mean rate of 0.63 cm³/s over the first minute, because the acid is being used up and the reaction is slowing.`,
  },
  "y11-science-momentum#0": {
    formulae: [r`Momentum $p = mv$`],
    question: r`Find the momentum of a 1500 kg car moving at 20 m/s to the right, and of a 0.16 kg cricket ball moving at 35 m/s to the left. Take right as positive.`,
    steps: [
      r`Car: $p = 1500 \times 20 = 30000$ kg m/s.`,
      r`Ball: its velocity is $-35$ m/s because it moves left.`,
      r`$p = 0.16 \times (-35) = -5.6$ kg m/s.`,
    ],
    answer: r`The car has a momentum of 30 000 kg m/s to the right, and the ball 5.6 kg m/s to the left, written as $-5.6$ kg m/s.`,
  },
  "y11-science-momentum#1": {
    formulae: [r`Total momentum before $=$ total momentum after`, r`$p = mv$`],
    question: r`A 1200 kg car travelling at 15 m/s crashes into a stationary 800 kg car. The two cars lock together. Find their velocity just after the collision.`,
    steps: [
      r`Momentum before: $1200 \times 15 + 800 \times 0 = 18000$ kg m/s.`,
      r`After the collision they move as one object of mass $1200 + 800 = 2000$ kg.`,
      r`Momentum is conserved: $2000 \times v = 18000$.`,
      r`$v = \frac{18000}{2000} = 9.0$ m/s.`,
    ],
    answer: r`The cars move off together at 9.0 m/s, in the direction the first car was travelling.`,
  },
  "y11-science-momentum#4": {
    formulae: [r`$F = B \times I \times l$, flux density times current times length`],
    question: r`A straight wire 0.25 m long lies horizontally in a magnetic field of flux density 0.40 T that points north. A current of 3.0 A flows east along the wire. Find the size and direction of the force on the wire.`,
    steps: [
      r`The wire is at right angles to the field, so $F = BIl$ applies directly.`,
      r`$F = 0.40 \times 3.0 \times 0.25 = 0.30$ N.`,
      r`Fleming's left-hand rule: point the first finger north for the field and the second finger east for the current.`,
      r`The thumb then points straight up, which is the direction of the force.`,
    ],
    answer: r`The force on the wire is 0.30 N, acting vertically upwards.`,
  },

  // ---- Computing, Year 10 --------------------------------------------------
  "y10-computing-programming-techniques#7": {
    formulae: [r`RANDOM_INT(a, b) gives a whole number from a to b, including both`],
    question: r`Write pseudocode that simulates rolling a six-sided dice 100 times, counts how many sixes are rolled, and outputs the count. Explain how you would test it.`,
    steps: [
      r`Set a counter to zero before the loop: sixes ← 0.`,
      r`Repeat a known number of times with a count-controlled loop: FOR i ← 1 TO 100.`,
      r`Inside the loop, roll the dice: roll ← RANDOM_INT(1, 6).`,
      r`If the roll is a six, add one to the counter: IF roll = 6 THEN sixes ← sixes + 1 ENDIF.`,
      r`After ENDFOR, output the count: OUTPUT sixes.`,
      r`The output changes every run, so test the range rather than one value: roll must always be 1 to 6, sixes must be 0 to 100, and over many runs the count should average about $100 \div 6$, roughly 17.`,
    ],
    answer: r`sixes ← 0, then FOR i ← 1 TO 100 with roll ← RANDOM_INT(1, 6) and IF roll = 6 THEN sixes ← sixes + 1, then OUTPUT sixes. It is tested by checking every value stays in range and the average count is close to 17.`,
  },
  "y10-computing-data-representation#6": {
    formulae: [r`1 byte $= 8$ bits`, r`1 kB $= 1000$ bytes, 1 MB $= 1000$ kB, 1 GB $= 1000$ MB, 1 TB $= 1000$ GB`],
    question: r`A video file is 1.5 GB. Using decimal units, convert its size to megabytes, kilobytes and bits. How many copies of the file would fit on a 2 TB drive?`,
    steps: [
      r`Moving to a smaller unit means multiplying: $1.5 \times 1000 = 1500$ MB.`,
      r`$1500 \times 1000 = 1500000$ kB.`,
      r`$1500000 \times 1000 = 1500000000$ bytes.`,
      r`$1500000000 \times 8 = 12000000000$ bits.`,
      r`The drive holds $2 \times 1000 = 2000$ GB, and $2000 \div 1.5 = 1333.3$, so 1333 whole files fit.`,
      r`Edexcel uses binary prefixes, where each step is 1024 rather than 1000; the method is the same.`,
    ],
    answer: r`The file is 1500 MB, 1 500 000 kB or 12 000 000 000 bits, and 1333 copies fit on a 2 TB drive.`,
  },
};

// The example for one sub-topic at one tier, or null. A tiered entry with no
// example for the tier asked for returns null rather than the other tier's.
export function authoredWorkedExample(topicId, index, tier = null) {
  const entry = authoredWorkedExamples[`${topicId}#${index}`];
  if (!entry) return null;
  if (entry.Foundation || entry.Higher) return (tier && entry[tier]) || null;
  return entry;
}
