import React from "react";

// The Y7to11.AI logo, lifted off its exported background so it sits straight on
// whatever it is placed on. Both versions are in the page and the stylesheet
// shows one: the dark artwork by default, the light artwork only where a
// screen actually turns light in the light theme. Most screens with the logo -
// the sidebar and the sign-in pages - stay dark in both themes, so a plain
// theme switch would put light artwork on a dark background.
export function BrandLogo({ height = 40, className = "" }) {
  // 585 x 150, the shape of both header images.
  const size = { height, width: Math.round(height * 3.9) };
  return (
    <span className={`brand-logo ${className}`.trim()} role="img" aria-label="Y7to11.AI">
      <img alt="" className="brand-logo-dark" src="/brand/logo-header-dark.png" {...size} />
      <img alt="" className="brand-logo-light" src="/brand/logo-header-light.png" {...size} />
    </span>
  );
}

// The square app icon, for the places a small mark stands in for the name.
export function BrandIcon({ size = 48, className = "" }) {
  return <img alt="" className={`brand-icon ${className}`.trim()} height={size} src="/brand/icon-512.png" width={size} />;
}
