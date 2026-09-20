import React from "react";

// Pythagoras, drawn as the squares it is actually about. "a squared plus b
// squared equals c squared" is recited as symbols; the theorem is a statement
// about area, and the 3-4-5 triangle shows 9 + 16 = 25 as squares you can count.
//
// The second visual is the one that decides marks: which side is the hypotenuse,
// and therefore whether you add or subtract.
const unit = 26;
// The right angle sits at the origin of the triangle, squares drawn outwards.
const ox = 250;
const oy = 150;

function Grid({ x, y, across, down, tone, delay, label }) {
  const cells = [];
  for (let column = 0; column < across; column += 1) {
    for (let row = 0; row < down; row += 1) {
      cells.push(<rect fill={tone} height={unit - 2} key={`${column}-${row}`} opacity="0.85"
        width={unit - 2} x={x + column * unit + 1} y={y + row * unit + 1} />);
    }
  }
  return <g className="square-grid" style={{ animationDelay: `${delay}ms` }}>
    {cells}
    <rect fill="none" height={down * unit} stroke={tone} strokeWidth="1.5" width={across * unit} x={x} y={y} />
    <text fill={tone} fontSize="13" fontWeight="600" textAnchor="middle"
      x={x + (across * unit) / 2} y={y + (down * unit) / 2 + 5}>{label}</text>
  </g>;
}

function ThreeFourFive() {
  return <figure className="lesson-visual">
    <svg role="img" viewBox="0 0 700 300" aria-label="A 3-4-5 right-angled triangle with a square drawn on each side. The square on the short side has 9 cells, the square on the other side has 16, and the square on the hypotenuse has 25. Nine plus sixteen equals twenty-five.">
      {/* Squares on the two shorter sides, then on the hypotenuse. */}
      <Grid x={ox - 3 * unit} y={oy} across={3} down={3} tone="#2364aa" delay={300} label="9" />
      <Grid x={ox} y={oy - 4 * unit} across={4} down={4} tone="#8a5807" delay={1100} label="16" />
      <Grid x={ox + 30} y={oy + 30} across={5} down={5} tone="#1f6b3a" delay={2000} label="25" />

      {/* The triangle itself, on top so the right angle stays readable. */}
      <polygon fill="#ffffff" fillOpacity="0.9" points={`${ox},${oy} ${ox - 3 * unit},${oy} ${ox},${oy - 4 * unit}`}
        stroke="#172033" strokeWidth="2" />
      <rect fill="none" height="12" stroke="#172033" strokeWidth="1.5" width="12" x={ox - 12} y={oy - 12} />
      <text fill="#172033" fontSize="12.5" textAnchor="middle" x={ox - 1.5 * unit} y={oy + 17}>3</text>
      <text fill="#172033" fontSize="12.5" textAnchor="end" x={ox - 6} y={oy - 2 * unit}>4</text>
      <text fill="#172033" fontSize="12.5" x={ox - 1.6 * unit} y={oy - 2.1 * unit}>5</text>
    </svg>
    <figcaption>
      The theorem is about areas, not letters: 9 + 16 = 25. Count the cells.
    </figcaption>
  </figure>;
}

function AddOrSubtract() {
  return <figure className="lesson-visual">
    <div className="visual-hops">
      <div className="visual-hop" style={{ animationDelay: "100ms" }}>
        <span className="visual-hop-number">c</span>
        <span className="visual-hop-power">
          Looking for the <strong>longest</strong> side, opposite the right angle? <strong>Add.</strong>
          &nbsp;c&sup2; = a&sup2; + b&sup2;
        </span>
      </div>
      <div className="visual-hop" style={{ animationDelay: "900ms" }}>
        <span className="visual-hop-number">a</span>
        <span className="visual-hop-power">
          Looking for a <strong>shorter</strong> side? <strong>Subtract.</strong>
          &nbsp;a&sup2; = c&sup2; &minus; b&sup2;
        </span>
      </div>
    </div>
    <p className="visual-result">
      Find the right angle first. The side facing it is always the longest.
    </p>
    <figcaption>
      Nearly every lost mark here is adding when the missing side is a short one.
      The answer must come out smaller than the hypotenuse - check it does.
    </figcaption>
  </figure>;
}

export default [
  { id: "three-four-five", render: () => <ThreeFourFive /> },
  { id: "add-or-subtract", render: () => <AddOrSubtract /> },
];
