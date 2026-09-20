import React from "react";

// Directed number. The misconception this exists for is "two minuses make a
// plus" recited as a rule with no picture behind it, which then gets applied to
// -3 + -4 and gives 7. A number line makes subtracting a negative a direction,
// not a spell.
const left = 40;
const right = 660;
const mid = 70;
const from = -8;
const to = 8;
const at = (value) => left + ((value - from) / (to - from)) * (right - left);

function Line({ marks = true }) {
  return <g>
    <line stroke="#42526a" strokeWidth="1.5" x1={left} x2={right} y1={mid} y2={mid} />
    <polygon fill="#42526a" points={`${right},${mid} ${right - 9},${mid - 4.5} ${right - 9},${mid + 4.5}`} />
    <polygon fill="#42526a" points={`${left},${mid} ${left + 9},${mid - 4.5} ${left + 9},${mid + 4.5}`} />
    {marks && Array.from({ length: to - from + 1 }, (_, index) => {
      const value = from + index;
      return <g key={value}>
        <line stroke={value === 0 ? "#174d85" : "#c3cede"} strokeWidth={value === 0 ? 1.5 : 1}
          x1={at(value)} x2={at(value)} y1={mid - 6} y2={mid + 6} />
        <text fill={value === 0 ? "#174d85" : "#5b6d86"} fontSize="11.5" textAnchor="middle"
          x={at(value)} y={mid + 24}>{value}</text>
      </g>;
    })}
  </g>;
}

// An arc from one value to another, labelled with the move that made it.
function Hop({ start, end, label, tone = "#2364aa", lift = 34, delay = 0 }) {
  const x1 = at(start);
  const x2 = at(end);
  const peak = mid - lift;
  return <g className="hop" style={{ animationDelay: `${delay}ms` }}>
    <path d={`M ${x1} ${mid - 8} Q ${(x1 + x2) / 2} ${peak - 14} ${x2} ${mid - 8}`}
      fill="none" stroke={tone} strokeWidth="2" markerEnd="" />
    <polygon fill={tone} points={`${x2},${mid - 7} ${x2 - (x2 > x1 ? 8 : -8)},${mid - 14} ${x2 - (x2 > x1 ? 8 : -8)},${mid - 1}`} />
    <text fill={tone} fontSize="12.5" fontWeight="600" textAnchor="middle" x={(x1 + x2) / 2} y={peak - 20}>
      {label}
    </text>
  </g>;
}

function SubtractingANegative() {
  return <figure className="lesson-visual">
    <svg role="img" viewBox="0 0 700 150" aria-label="A number line from minus 8 to 8. Starting at 3, subtracting 5 moves five places left to minus 2. Starting at 3, subtracting negative 5 moves five places right to 8.">
      <Line />
      <Hop start={3} end={-2} label="− 5  moves left" tone="#9f2d24" delay={200} />
      <Hop start={3} end={8} label="− (−5)  moves right" tone="#1f6b3a" lift={54} delay={1400} />
      <circle cx={at(3)} cy={mid} fill="#174d85" r="5" />
      <text fill="#174d85" fontSize="12" fontWeight="600" textAnchor="middle" x={at(3)} y={mid + 42}>start at 3</text>
    </svg>
    <figcaption>
      Subtracting moves left. Subtracting a negative reverses that, so it moves right.
      The rule is a direction, not a trick.
    </figcaption>
  </figure>;
}

function AddingNegatives() {
  return <figure className="lesson-visual">
    <svg role="img" viewBox="0 0 700 130" aria-label="A number line. Starting at minus 3, adding negative 4 moves four places further left to minus 7.">
      <Line />
      <Hop start={-3} end={-7} label="+ (−4)  still moves left" tone="#9f2d24" delay={200} />
      <circle cx={at(-3)} cy={mid} fill="#174d85" r="5" />
      <text fill="#174d85" fontSize="12" fontWeight="600" textAnchor="middle" x={at(-3)} y={mid + 42}>start at −3</text>
    </svg>
    <figcaption>
      Two minus signs do not always make a plus. Adding a negative still moves left:
      −3 + (−4) = −7, not 7.
    </figcaption>
  </figure>;
}

export default [
  { id: "subtracting-a-negative", render: () => <SubtractingANegative /> },
  { id: "adding-negatives", render: () => <AddingNegatives /> },
];
