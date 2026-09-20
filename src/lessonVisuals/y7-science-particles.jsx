import React from "react";

// States of matter. The particle diagram is the single most-drawn picture in
// KS3 science, and the mark scheme is specific: touching and ordered, touching
// and disordered, far apart and random. Describing that in a sentence and
// asking a learner to picture it is the wrong way round.
//
// The second visual addresses the misconception the exam actually targets: that
// the particles themselves change when a substance melts. They do not - only
// their arrangement and energy do.
const states = [
  {
    id: "solid", name: "Solid", x: 40,
    note: "Touching, in a regular pattern. They vibrate on the spot.",
    // A neat lattice.
    points: Array.from({ length: 16 }, (_, index) => ({
      cx: 26 + (index % 4) * 30, cy: 26 + Math.floor(index / 4) * 30,
    })),
  },
  {
    id: "liquid", name: "Liquid", x: 250,
    note: "Still touching, but disordered. They slide past each other.",
    points: [
      { cx: 24, cy: 30 }, { cx: 54, cy: 22 }, { cx: 84, cy: 34 }, { cx: 112, cy: 24 },
      { cx: 30, cy: 60 }, { cx: 62, cy: 54 }, { cx: 92, cy: 64 }, { cx: 120, cy: 56 },
      { cx: 22, cy: 92 }, { cx: 52, cy: 86 }, { cx: 84, cy: 96 }, { cx: 114, cy: 88 },
      { cx: 40, cy: 118 }, { cx: 72, cy: 116 }, { cx: 102, cy: 122 },
    ],
  },
  {
    id: "gas", name: "Gas", x: 460,
    note: "Far apart and random. They move quickly in all directions.",
    points: [
      { cx: 20, cy: 22 }, { cx: 96, cy: 16 }, { cx: 58, cy: 52 }, { cx: 126, cy: 60 },
      { cx: 26, cy: 88 }, { cx: 100, cy: 104 }, { cx: 62, cy: 126 }, { cx: 132, cy: 20 },
    ],
  },
];

function ParticleBox({ state, index }) {
  return <g className="particle-box" style={{ animationDelay: `${index * 500}ms` }}
    transform={`translate(${state.x} 20)`}>
    <rect fill="#ffffff" height="150" rx="5" stroke="#b5c4d6" strokeWidth="1.5" width="155" />
    {state.points.map((point, position) => (
      <circle cx={point.cx + 6} cy={point.cy} fill="#2364aa" key={position} r="9" />
    ))}
    <text fill="#172033" fontSize="14" fontWeight="600" x="0" y="172">{state.name}</text>
  </g>;
}

function ThreeStates() {
  return <figure className="lesson-visual">
    <svg role="img" viewBox="0 0 640 210" aria-label="Three boxes of particles. In the solid they touch in a regular grid. In the liquid they touch but are disordered. In the gas they are far apart and randomly placed.">
      {states.map((state, index) => <ParticleBox index={index} key={state.id} state={state} />)}
    </svg>
    <dl className="visual-notes">
      {states.map((state) => (
        <div key={state.id}>
          <dt>{state.name}</dt>
          <dd>{state.note}</dd>
        </div>
      ))}
    </dl>
    <figcaption>
      The mark scheme wants both things: how close the particles are, and how ordered.
      Say both and the mark is yours.
    </figcaption>
  </figure>;
}

function WhatChanges() {
  return <figure className="lesson-visual">
    <div className="visual-hops">
      <div className="visual-hop" style={{ animationDelay: "100ms" }}>
        <span className="visual-hop-number">Same</span>
        <span className="visual-hop-power">The particles themselves. Melting ice does not change the water molecules.</span>
      </div>
      <div className="visual-hop" style={{ animationDelay: "800ms" }}>
        <span className="visual-hop-number">Changes</span>
        <span className="visual-hop-power">How much energy they have, and therefore how they are arranged.</span>
      </div>
    </div>
    <p className="visual-result">
      A change of state is physical, not chemical. It can be reversed.
    </p>
    <figcaption>
      This is why melting and boiling are reversible, and why no new substance is made.
    </figcaption>
  </figure>;
}

export default [
  { id: "three-states", render: () => <ThreeStates /> },
  { id: "what-changes", render: () => <WhatChanges /> },
];
