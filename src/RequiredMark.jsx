import React from "react";

// The star beside a required field's label. The input itself carries
// `required`, which is what a screen reader announces, so the star is hidden
// from them rather than read out as "star" after every label.
export function RequiredMark() {
  return <span aria-hidden="true" className="required-mark">*</span>;
}

// Said once per form, so the star does not have to explain itself.
export function RequiredNote() {
  return <p className="required-note"><RequiredMark /> Required</p>;
}
