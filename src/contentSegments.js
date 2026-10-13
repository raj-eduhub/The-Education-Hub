// Whether a string carries typesettable maths, for subjects other than Maths
// (which always typesets). Two shapes count:
//   - a dollar span holding a LaTeX control character or command, as before;
//   - a tight dollar span, "$p = mv$" or "$-4$": no space inside either dollar
//     and no digit straight after the closing one. That is the rule Pandoc
//     uses, and it is what tells "$V = IR$" from a price such as "$5 and $10",
//     whose closing dollar follows a space. Spans with neither were shown raw,
//     dollars and all, in Science, Computing, Geography and D&T.
// Code, fenced or inline, is left out first: a dollar in code is a character.
const latexPattern = /\$[^$]*(?:[\^_{}]|\\[a-zA-Z])[^$]*\$/;
const tightPattern = /\$[^\s$](?:[^$]*[^\s$])?\$(?!\d)/;

export function hasMaths(value) {
  const prose = String(value ?? "").replace(/```[\s\S]*?```|`[^`\n]*`/g, "");
  return latexPattern.test(prose) || tightPattern.test(prose);
}

// Preserve fenced code before looking for inline maths: dollars and powers in
// code are literal characters, never typesetting instructions.
export function contentSegments(value, maths = true) {
  const text = String(value ?? ''), segments = [];
  function prose(value) {
    if (!maths) { if (value) segments.push({text:value}); return; }
    let cursor=0;
    for(const match of value.matchAll(/\$([^$]+)\$/g)) {
      if(match.index>cursor)segments.push({text:value.slice(cursor,match.index)});
      segments.push({math:match[1]});cursor=match.index+match[0].length;
    }
    if(cursor<value.length)segments.push({text:value.slice(cursor)});
  }
  let cursor=0;
  for(const match of text.matchAll(/```[^\n]*\n([\s\S]*?)```/g)) {
    prose(text.slice(cursor,match.index));
    segments.push({code:match[1].replace(/\n$/,'')});cursor=match.index+match[0].length;
  }
  prose(text.slice(cursor));
  return segments;
}
