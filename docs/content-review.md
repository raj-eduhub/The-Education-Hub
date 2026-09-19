# Content review

Explanations, worked examples, practice questions, and exam questions are written by a model and shown to children aged 11 to 16. Content review is where an administrator reads that content and decides whether a learner should see it.

The need is not theoretical. A generated Year 10 worked example on sampling came back using t-distributions, finite population correction, and confidence intervals, none of which is GCSE content. Storing content centrally made that reviewable; this screen is what makes it actionable.

## Review states

Every stored row carries a `reviewStatus` of `pending`, `approved`, or `rejected`. New content is always `pending`.

Regeneration resets the state. If an administrator regenerates a row and the model returns different text, the row returns to `pending` and must be looked at again; if the text is byte-for-byte identical, the existing decision stands.

## The screen

`Content review` appears in the primary navigation for administrators only, and both the list and the decision endpoint refuse a non-administrator with 403. Reviewing decides what every learner sees, so it is not a parent-level permission.

Content can be filtered by status, type, year, and subject. Each card shows the stored content rendered the way a learner would see it, including typeset maths, along with its topic, sub-topic, storage key, and which model wrote it. Approve and Reject are single clicks, and the row leaves the list because the list is filtered by status.

## Serving only approved content

Set `REQUIRE_REVIEWED_CONTENT=true` to serve approved content only.

With the gate on, a learner request for content that is pending or rejected returns "waiting to be approved by a teacher" and **the model is not called**. That is deliberate: generating on a miss would only produce more unapproved content, at cost, that still could not be served. Administrators bypass the gate so they can continue reviewing.

The default is `false`, because switching it on before a year has been reviewed would leave learners with an empty lesson. The intended sequence is to seed a year, review it, then enable the gate.

## Clearing a backlog

Reviewing hundreds of rows one at a time is not a realistic workflow, so a decision can be applied to a whole batch.

In the screen, narrowing by type, year, or subject enables "Approve all matching" and "Reject all matching", which act on everything the filters select rather than only the rows on screen. A confirmation step stands between the button and the change. Without a narrowing filter the buttons are withheld, because the API refuses an unfiltered bulk decision: approving the entire table by accident would defeat the point of reviewing it.

From the command line, the realistic sequence is to read a sample from a batch and judge the batch:

```bash
npm run review:content -- --year 10 --subject Maths --type practice --sample 5
npm run review:content -- --year 10 --subject Maths --type practice --approve
npm run review:content -- --topic y10-maths-number --reject
```

Without `--approve` or `--reject` the script only reports and samples, so it is safe to run while deciding. A single bulk call is capped at 1000 rows.

Listing is paged with a cursor. Pages are consumed whole and the cursor only advances past a completed page, so no row is skipped or returned twice even though review status is filtered after the query.

## What is checked before a human sees it

Reviewing is the last gate, not the first. Before a generated row reaches the
review screen it has already been refused if it has no working or no mark scheme,
if it echoes the prompt's own field description, or if it cannot be parsed at all.
`npm run prune:content` then removes stored rows that break the curriculum rules:
content above the specification, questions that point at a diagram the learner is
never shown, and rows written against a topic or outcome the catalogue no longer
contains. Running it before a review session means the reviewer spends their time
on judgement rather than on rejecting obvious defects.

Explanations are not generated at all. They are authored in
`src/data/topicContent/` and written to storage on every seeding run, so the
review screen sees them only when the authored text changes.

## Limits

- Rejected content stays in the table and is simply not served. There is no bulk delete, and no way to edit content by hand: the options are approve, reject, or regenerate and review again.
- There is no reviewer queue, assignment, or audit trail beyond `reviewedBy` and `reviewedAt` on the row.
- Bulk decisions apply to every row matching the filters, including rows not yet loaded on screen. The count shown next to the buttons is the number loaded, not necessarily the number that will change.
- Approving does not check correctness. It records that a human looked. A bulk approval run recorded as "spot-check" approved twenty rows, one of which stated a length "to the nearest 0.5 cm" as 53.6 cm - a measurement that cannot occur. Bulk approval is for clearing a batch a human has actually sampled.

## Related: the billing webhook route

While testing the money path, `POST /api/billing/webhook` was found to be answered by the `billing` function rather than the webhook function: the wildcard route `billing/{action}` shadowed the literal route `billing/webhook`, so every Stripe delivery received 403 from the access check. A paid subscription would never have been activated in production.

The webhook is now handled inside the function that owns the route, before the access check, and `api/scripts/test-billing-routes.mjs` asserts over HTTP that the route is never again answered with 403. Unit tests could not have caught it: both functions were correct in isolation and only the routing was wrong.
