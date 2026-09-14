# Progress recording

Progress is recorded automatically, but only from evidence the system can actually observe. Nothing is inferred and nothing is filled in with a placeholder, because mastery scores and review scheduling are reported to parents and drive what the learner is shown next.

## What is observable

`masteryScore` is computed directly from `accuracy` ([`progressStore.js`](../api/src/lib/progressStore.js)), and the spaced-repetition interval uses accuracy and confidence. So the question is not "can we record something automatically" but "what can we record without inventing attainment".

| Signal | Source | Affects mastery |
| --- | --- | --- |
| Marks | The tutor marking the learner's own answer in Practice or Exam mode | yes |
| Time on task | Elapsed time with a topic open | no |
| Sub-topics opened | Worked examples the learner viewed | no |
| Questions asked | Messages sent to the tutor | no |
| Confidence | Only the learner, through the manual recorder | yes, when given |

## Automatic marking

In Practice and Exam mode the tutor already marks the learner's answer, which is better evidence than a fourteen-year-old grading themselves. It is asked to end a marking reply with a line of exactly the form `MARK: earned/available`.

The API parses that line, records the attempt **server-side** through the existing `recordAttempt` path, and strips the line before the reply reaches the learner. Recording server-side matters: the client never supplies the accuracy, so a modified client cannot inflate a progress record.

The instruction appears twice, in the system prompt and again at the end of the turn. With the system prompt alone the model emitted the line inconsistently; repeated at the end of the turn it emitted it in four of four marking turns under test. It is still a prompt-following behaviour rather than a guarantee: the model sometimes chooses to re-explain rather than mark, and that turn simply records nothing. A mark of `earned > available` is rejected rather than stored.

## Confidence is left empty

An automatically recorded attempt has no confidence, because only the learner knows it. The value is omitted from the stored row rather than defaulted, the mastery average is kept over `confidenceSamples` (the attempts that actually reported one), and `nextInterval` falls back to deciding on accuracy alone when confidence is absent.

This was worth being careful about. The first implementation checked `Number.isFinite(Number(input.confidence))`, and because `Number(null)` is `0`, a missing confidence was silently stored as `1` — the exact fabrication the design was meant to avoid. Absence is now checked before coercion.

## Engagement

Time on task, sub-topics opened, and questions asked are flushed when the learner moves to another topic, subject, or mode. They are written to the attempts table with `kind: "activity"`, carry no accuracy, and never touch a mastery score. Sessions shorter than twenty seconds are discarded, because glancing at a topic is not study.

## Limits

- Marking depends on the model following the format. There is no retry, so an unmarked turn is simply not recorded.
- The tutor marks its own generated question, so the mark is only as good as the model's judgement of the learner's answer.
- Engagement records are written by the browser and could be forged by a modified client. They carry no attainment, so the blast radius is a wrong time-on-task figure.
- Activity rows are stored but not yet surfaced anywhere: the progress dashboard is still built entirely from mastery rows.
