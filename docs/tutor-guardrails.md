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

## What happens to a refused message

A refusal used to produce a reply to the child and a `context.warn` line, which nobody reads. Every refusal is now recorded in Azure Table Storage by [`api/src/lib/safeguardingStore.js`](../api/src/lib/safeguardingStore.js), and high-severity ones email the administrators.

### Severity decides who is interrupted

| Reason | Severity | What happens |
| --- | --- | --- |
| `unsafe` | high | Stored, and an email alert to the administrators |
| `injection`, `leak` | medium | Stored |
| `integrity`, `off-topic` | low | Stored |
| `empty`, `length` | not recorded | Nothing |

Structural refusals are deliberately not stored. An empty message box carries no safeguarding signal, and recording it would bury the ones that do. Off-topic and integrity refusals are stored but never alert, because a child asking about football during maths is history, not an emergency.

### Two deliberate departures

Learner rows elsewhere in this app are partitioned by a hash of the email and store no address, and the privacy notice says answer text is not kept. Safeguarding breaks both rules on purpose.

The row **names the learner**, because a safeguarding record that cannot identify the child cannot be acted on. The admin screen also shows the guardian's name, relationship, and phone number, read fresh from the profile rather than copied onto every flag, so the person reviewing a flag can reach someone.

The row **stores the message**. A flag no one can read is not a flag, only a count, and "a Year 8 learner triggered the self-harm rule" is not something a responsible adult can judge without the words that triggered it. The stored text is capped at 500 characters, and the privacy notice now says this happens.

### The alert deliberately says less than the record

The email names the learner, the rule, the subject, and the time, and links to the dashboard. It does not contain the message. A disclosure by a child should not be sitting in mailboxes to be forwarded on; it belongs behind an administrator sign-in.

One alert is sent per learner per hour (`SAFEGUARDING_ALERT_COOLDOWN_MINUTES`). A distressed child repeating themselves should not decide how many emails an administrator receives, and every repeat is still recorded either way. Delivery failure is written to the row rather than thrown: a mail outage must not decide whether the flag is stored, and the child is still waiting for a reply.

## The safeguarding screen

`Safeguarding` appears in the primary navigation for administrators only, and every endpoint refuses a non-administrator with 403. This is not a parent-level permission: a flag may concern the household the parent account belongs to.

The queue defaults to open flags, newest first, and filters by severity and status. Each card shows the learner, their year and topic, the message as written, whether an alert went out, and the guardian's contact details. One click shows that learner's whole history, because "has this happened before?" is the next question an adult asks.

A flag is closed by recording what was done: `Acknowledge`, `Escalate`, or `Close`, each with a free-text note of the action taken. The reviewer and time are stored with it, and a later decision never erases the note an earlier reviewer wrote.

Flags are deleted with the account, because the privacy notice promises deletion and this app makes no separate retention promise. An operator whose safeguarding policy requires retention should change `deleteFlags` in [`api/src/functions/account.js`](../api/src/functions/account.js) and say so in the notice.

## Known limits

- The rules are lexical, not semantic. A question phrased entirely in synonyms the curriculum never uses can be redirected as off-topic, and a fluent off-topic question that happens to reuse curriculum words will be allowed through to the model, where the scope instructions are the only defence.
- Patterns are English-only.
- The safety list is a starting point, not a substitute for a moderation service. What the guard cannot match, it cannot flag, so the dashboard is only as complete as the patterns above.
- The alert goes to the administrators, not to the parent. Contacting the family is a human decision made from the dashboard, deliberately, rather than an automatic email to a household about their own child.
- The admin queue is a cross-partition query, so it scans the table. That is fine at the volume a refused message occurs; a busy deployment would need a partition keyed by date rather than by learner.
- Nothing expires. There is no retention window, so flags live until the account is deleted.
