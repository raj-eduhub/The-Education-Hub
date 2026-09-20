import React from "react";

// Percentage change. Two misconceptions, both worth a picture:
//
//   - that a 20% rise followed by a 20% fall returns you to where you started
//   - that reversing a percentage means taking the same percentage off again
//
// Both come from treating a percentage as an amount rather than a multiplier.
// Drawn as bars to scale, the gap is visible rather than argued.
const barLeft = 150;
const barMax = 470;
const scale = (value, top) => (value / top) * barMax;

function Bar({ y, value, top, label, amount, tone, delay }) {
  return <g>
    <text fill="#42526a" fontSize="12.5" textAnchor="end" x={barLeft - 12} y={y + 15}>{label}</text>
    <rect className="bar" fill={tone} height="22" rx="3" style={{ animationDelay: `${delay}ms` }}
      width={scale(value, top)} x={barLeft} y={y} />
    <text fill="#172033" fontSize="12.5" fontWeight="600" x={barLeft + scale(value, top) + 10} y={y + 16}>
      {amount}
    </text>
  </g>;
}

function UpThenDown() {
  const top = 120;
  return <figure className="lesson-visual">
    <svg role="img" viewBox="0 0 700 140" aria-label="Bars comparing 100 pounds, 120 pounds after a 20 percent rise, and 96 pounds after a 20 percent fall from 120. The final bar is shorter than the first.">
      <Bar y={10} value={100} top={top} label="Start" amount="£100" tone="#b5c4d6" delay={100} />
      <Bar y={48} value={120} top={top} label="+20%" amount="£120" tone="#2364aa" delay={800} />
      <Bar y={86} value={96} top={top} label="then −20%" amount="£96" tone="#9f2d24" delay={1600} />
      {/* The original level, so the shortfall is seen and not just stated. */}
      <line stroke="#42526a" strokeDasharray="3 3" strokeWidth="1"
        x1={barLeft + scale(100, top)} x2={barLeft + scale(100, top)} y1={4} y2={118} />
    </svg>
    <figcaption>
      &times;1.2 then &times;0.8 is &times;0.96, not &times;1. The 20% comes off a bigger number
      than it went on to, so you land £4 short.
    </figcaption>
  </figure>;
}

function Reversing() {
  return <figure className="lesson-visual">
    <div className="visual-hops">
      <div className="visual-hop" style={{ animationDelay: "100ms" }}>
        <span className="visual-hop-number">£80</span>
        <span className="visual-hop-power">the price before VAT</span>
      </div>
      <div className="visual-hop" style={{ animationDelay: "800ms" }}>
        <span className="visual-hop-number">&times; 1.2</span>
        <span className="visual-hop-power">add 20%</span>
      </div>
      <div className="visual-hop" style={{ animationDelay: "1500ms" }}>
        <span className="visual-hop-number">£96</span>
        <span className="visual-hop-power">the price you pay</span>
      </div>
    </div>
    <p className="visual-result">
      To go back: &divide; 1.2, not &minus; 20%. Taking 20% off £96 gives £76.80.
    </p>
    <figcaption>
      Reversing a percentage undoes the multiplier. Subtracting the same percentage
      takes it off the wrong number.
    </figcaption>
  </figure>;
}

export default [
  { id: "up-then-down", render: () => <UpThenDown /> },
  { id: "reversing", render: () => <Reversing /> },
];
