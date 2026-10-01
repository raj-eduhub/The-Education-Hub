// Stored explanations keep common teaching and an optional Higher extension.
// Both the API and narration builder must select before building lesson beats.
export function explanationForTier(content, tier) {
  const { higher, ...core } = content;
  if (tier !== 'Higher' || !higher) return core;
  return {
    ...core,
    explanation: [core.explanation, higher.explanation].filter(Boolean).join(' '),
    keyIdeas: [...(core.keyIdeas ?? []), ...(higher.keyIdeas ?? [])],
    formulae: [...(core.formulae ?? []), ...(higher.formulae ?? [])],
  };
}
