# AI tutor guardrails

The tutor is used by children aged 11 to 16, so every learner message passes through a deterministic guard before any model call, and the model is given explicit scope rules on top. The guard lives in [`api/src/lib/tutorGuard.js`](../api/src/lib/tutorGuard.js) and runs server-side, where a modified client cannot skip it.

## Design principle: act on evidence, not on its absence

A relevance score alone is not safe to gate on. "what is 35% of 80" is a perfectly good question about percentages, but once digits and stop words are stripped it contains no dictionary words at all and scores zero against any topic. A naive relevance gate would refuse it.

The guard therefore blocks only on positive evidence of drift, and treats ambiguity as permission. A question is redirected as off-topic only when it contains at least three meaningful words and not one of them appears anywhere in the topic title, unit, goal, outcomes, the other topic titles in that subject, or the stored study material for the topic. Everything thinner than that is passed to the model, whose system prompt carries the scope rules.

## Layers

| Layer | Runs | Cost | Catches |
| --- | --- | --- | --- |
| Structural | Before the model | none | Empty and over-long messages |
| Safety patterns | Before the model | none | Self-harm, drugs, sexual content, weapons |
| Injection patterns | Before the model | none | "Ignore previous instructions", "you are now...", prompt extraction |
| Academic integrity | Before the model | none | "Write my essay", "just give me the answers" |
| Topic relevance | Before the model | none | Questions with no curriculum vocabulary at all |
| Scope instructions | In the system prompt | tokens | Ambiguous cases the rules deliberately allow through |
| Answer check | After the model | none | System prompt leaking into a reply |

A blocked or redirected message returns a written reply and never reaches the model, so it costs nothing and returns in tens of milliseconds. Each one is logged with its reason through `context.warn` for safeguarding review.

## Verdicts

- `block` — injection, unsafe content, malformed input. The learner gets a calm redirect; the self-harm reply points them to a trusted adult.
- `redirect` — off-topic or an integrity request. The tutor declines and offers the current topic instead.
- `allow` — on topic, a conversational follow-up, or ambiguous.

Short follow-ups such as "why?" or "can you show another one" carry no topic vocabulary but continue an on-topic conversation, so they are allowed whenever there is prior conversation history.

## Answering from stored study material

[`api/src/lib/tutorRetrieval.js`](../api/src/lib/tutorRetrieval.js) tries to answer a Learn-mode question from content already stored for the topic before calling the model. Matching is asymmetric on purpose: it scores how much of the *question* the stored text covers, not how alike the two texts are. Cosine-style similarity punishes a short question scored against a long worked example, and missed a stored example that covered every word of the question.

A question needs at least two meaningful words and 75% coverage before it is answered from storage. Observed round trips are 23 to 27 milliseconds from storage against 15 to 25 seconds from the model.

## Known limits

- The rules are lexical, not semantic. A question phrased entirely in synonyms the curriculum never uses can be redirected as off-topic, and a fluent off-topic question that happens to reuse curriculum words will be allowed through to the model, where the scope instructions are the only defence.
- Patterns are English-only.
- The safety list is a starting point, not a substitute for a moderation service. Anything genuinely concerning should be escalated to a human; there is currently no alert path to a parent or administrator, only a server log line.
- Flags are not yet stored, so there is no per-learner history of blocked attempts and nothing to review in the admin dashboard.
