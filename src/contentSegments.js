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
