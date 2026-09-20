import React from "react";

// Visuals for Accuracy, Bounds and Standard Form.
//
// The point of these is to carry what a sentence cannot. "Upper bounds are
// written with <, because the top value is never reached" is a sentence a
// learner nods at and forgets; a hollow circle at 4.65 next to a filled one at
// 4.55 is a picture they can recall in the exam. Everything here is drawn to
// the same scale the numbers describe, so nothing is decorative.

const line = { left: 60, right: 660, y: 96 };
const span = { from: 4.5, to: 4.7 };
const at = (value) =>
  line.left + ((value - span.from) / (span.to - span.from)) * (line.right - line.left);

function Tick({ value, label, strong }) {
  const x = at(value);
  return <g>
    <line stroke={strong ? "#174d85" : "#b5c4d6"} strokeWidth={strong ? 1.5 : 1}
      x1={x} x2={x} y1={line.y - 7} y2={line.y + 7} />
    <text fill={strong ? "#172033" : "#5b6d86"} fontSize="13" textAnchor="middle" x={x} y={line.y + 26}>
      {label}
    </text>
  </g>;
}

// A measurement given to the nearest 0.1 cm, and the interval it really means.
function ErrorInterval() {
  const lower = at(4.55);
  const upper = at(4.65);
  return <figure className="lesson-visual">
    <svg role="img" viewBox="0 0 720 190" aria-label="A number line from 4.5 to 4.7. The interval from 4.55 to 4.65 is shaded. The lower bound at 4.55 is a filled circle because the value can equal it; the upper bound at 4.65 is a hollow circle because the value never reaches it.">
      {/* The interval, drawn first so the line and markers sit on top of it. */}
      <rect className="visual-band" x={lower} y={line.y - 30} width={upper - lower} height={60} rx="3" />

      <line stroke="#42526a" strokeWidth="1.5" x1={line.left} x2={line.right} y1={line.y} y2={line.y} />
      <polygon fill="#42526a" points={`${line.right},${line.y} ${line.right - 9},${line.y - 4.5} ${line.right - 9},${line.y + 4.5}`} />

      <Tick value={4.5} label="4.5" />
      <Tick value={4.55} label="4.55" strong />
      <Tick value={4.6} label="4.6" strong />
      <Tick value={4.65} label="4.65" strong />
      <Tick value={4.7} label="4.7" />

      {/* The measured value. */}
      <g className="visual-measured">
        <line stroke="#174d85" strokeDasharray="3 3" strokeWidth="1.5"
          x1={at(4.6)} x2={at(4.6)} y1={line.y - 52} y2={line.y} />
        <text fill="#174d85" fontSize="13" fontWeight="600" textAnchor="middle" x={at(4.6)} y={line.y - 60}>
          measured 4.6 cm
        </text>
      </g>

      {/* Filled: the true value can be exactly 4.55. Hollow: it never reaches
          4.65. This is the whole reason the notation is a mix of <= and <. */}
      <circle className="visual-endpoint" cx={lower} cy={line.y} r="7" fill="#174d85" />
      <circle className="visual-endpoint visual-endpoint-open" cx={upper} cy={line.y} r="7"
        fill="#ffffff" stroke="#174d85" strokeWidth="2.5" />

      <text className="visual-endpoint-label" fill="#1f6b3a" fontSize="12.5" textAnchor="middle" x={lower} y={line.y + 52}>
        4.55 ≤ true value
      </text>
      <text className="visual-endpoint-label" fill="#9f2d24" fontSize="12.5" textAnchor="middle" x={upper} y={line.y + 52}>
        true value &lt; 4.65
      </text>
    </svg>
    <figcaption>
      Half a unit either side. The lower bound is reachable, the upper bound never is.
    </figcaption>
  </figure>;
}

// Where the power of ten comes from: the decimal point moving.
function StandardForm() {
  const hops = [
    { digits: "4700", point: 4, power: 0 },
    { digits: "470.0", point: 3, power: 1 },
    { digits: "47.00", point: 2, power: 2 },
    { digits: "4.700", point: 1, power: 3 },
  ];
  return <figure className="lesson-visual">
    <div className="visual-hops">
      {hops.map((hop, index) => <div className="visual-hop" key={hop.digits}
        style={{ animationDelay: `${index * 700}ms` }}>
        <span className="visual-hop-number">{hop.digits}</span>
        <span className="visual-hop-power">
          {hop.power === 0 ? "as written" : <>&times; 10<sup>{hop.power}</sup></>}
        </span>
      </div>)}
    </div>
    <p className="visual-result">
      4700 = 4.7 &times; 10<sup>3</sup>
    </p>
    <figcaption>
      Each hop left divides the number by ten, so the power of ten goes up by one to compensate.
      Standard form stops when one non-zero digit is left in front of the point.
    </figcaption>
  </figure>;
}

// Beats are spliced into the lesson after the prose. Each carries its own
// narration, so the voice describes the picture rather than repeating the text.
export default [
  {
    id: "error-interval",
    after: "prose",
    speech: "Here is what that interval looks like. The measurement reads 4 point 6 centimetres, "
      + "but the true value lies anywhere in the shaded band. The filled circle at 4 point 5 5 "
      + "means the value can be exactly that. The hollow circle at 4 point 6 5 means it never is: "
      + "anything that far up would have rounded to 4 point 7 instead.",
    render: () => <ErrorInterval />,
  },
  {
    id: "standard-form",
    after: "prose",
    speech: "Standard form is just the decimal point moving. Start at 4700 and move the point left "
      + "one place at a time. Each hop makes the number ten times smaller, so the power of ten goes "
      + "up by one to keep the value the same. Stop when one non-zero digit is left in front of the "
      + "point: 4 point 7 times ten cubed.",
    render: () => <StandardForm />,
  },
];
