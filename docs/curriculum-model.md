# Curriculum Model

## Scope

Education Hub contains a broad curriculum map for Years 7-11 across Maths, Science, English, History, Geography, Computing, and Design Technology. The catalogue currently contains 210 modules and 630 measurable outcomes, with unit names, learning goals, GCSE tier applicability, and exam-board mappings.

| Year | Modules | Stage |
| --- | ---: | --- |
| 7 | 34 | KS3 |
| 8 | 34 | KS3 |
| 9 | 34 | KS3 |
| 10 | 52 | KS4 / GCSE |
| 11 | 56 | KS4 / GCSE and revision |

The catalogue is a product curriculum map, not an awarding-body endorsement. It should be reviewed by qualified UK teachers before it is used for high-stakes assessment or claims of complete specification coverage.

## Structure

```text
Year
  -> Key stage
  -> Subject
  -> Unit
  -> Topic
  -> Learning goal
  -> Measurable outcomes
  -> GCSE board and tier applicability
```

The canonical catalogue is composed in `src/data/curriculumCatalog.js`. Humanities and technology content lives in `src/data/additionalCurriculum.js`, and `src/curriculum.js` is a compatibility export for frontend consumers.

## Year Sequencing

The Department for Education specifies KS3 programmes of study for the key stage as a whole rather than prescribing a universal Year 7, Year 8, and Year 9 order. Education Hub therefore uses a recommended progression across those years. Schools and teachers should be able to override this sequence in a future curriculum-management feature.

Years 10-11 use GCSE-oriented units and support:

- Exam boards: AQA, Edexcel, and OCR
- Maths and Combined Science tiers: Foundation and Higher
- English, History, Geography, Computing, and Design Technology, which are not tiered

History options and named geographical case studies vary substantially between specifications and schools. The catalogue therefore describes common study types and skills; a future question bank must attach content to an exact board, option, and specification statement before presenting it as board-specific material.

Qualification identifiers are stored in the catalogue so later question banks and marking rubrics can target an exact specification.

| Subject | AQA | Edexcel | OCR |
| --- | --- | --- | --- |
| Maths | 8300 | 1MA1 | J560 |
| Combined Science | 8464 | 1SC0 | J250 |
| English Language / Literature | 8700 / 8702 | 1EN0 / 1ET0 | J351 / J352 |
| History | 8145 | 1HI0 | J411 (History B) |
| Geography | 8035 | 1GB0 (Geography B) | J384 (Geography B) |
| Computer Science | 8525 | 1CP2 | J277 |
| Design and Technology | 8552 | 1DT0 | J310 |

## Runtime Filtering

The learner profile stores school year and, for GCSE learners, exam board and tier. `topicsFor()` filters the catalogue before topics are rendered. The same year, board, and tier context is sent to the tutor API and included in its system prompt.

The date of birth and learner name are stored in the protected learner profile but are not sent to the model. The server supplies the immutable registered school year to model requests.

## Initial Diagnostic

The selected year and subject produce a short diagnostic of up to five questions sampled across the available curriculum. Each question targets one measurable topic outcome. Completed answers are marked in one authenticated Azure AI Foundry request and returned as bounded scores from 0 to 3 with a classification of priority, developing, or strength.

The browser stores detailed diagnostic feedback and orders the learning path as priority, developing, unassessed, then strength. The backend also records compact attempt and mastery metrics in Azure Table Storage so progress can be viewed across sessions. Answer text is not persisted. This is diagnostic evidence rather than a formal assessment result. Predicted grades remain locked until at least 15 evidence checks exist, and reaching that threshold only makes a learner eligible for a future teacher-reviewed estimate; it does not automatically generate a grade.

## Primary Sources

- [DfE mathematics programmes of study](https://www.gov.uk/government/publications/national-curriculum-in-england-mathematics-programmes-of-study)
- [DfE science programmes of study](https://www.gov.uk/government/publications/national-curriculum-in-england-science-programmes-of-study)
- [DfE English programmes of study](https://www.gov.uk/government/publications/national-curriculum-in-england-english-programmes-of-study)
- [DfE history programmes of study](https://www.gov.uk/government/publications/national-curriculum-in-england-history-programmes-of-study)
- [DfE geography programmes of study](https://www.gov.uk/government/publications/national-curriculum-in-england-geography-programmes-of-study)
- [DfE computing programmes of study](https://www.gov.uk/government/publications/national-curriculum-in-england-computing-programmes-of-study)
- [DfE design and technology programmes of study](https://www.gov.uk/government/publications/national-curriculum-in-england-design-and-technology-programmes-of-study)
- [DfE GCSE subject-content collection](https://www.gov.uk/government/collections/gcse-subject-content)
- [DfE GCSE combined-science content](https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/436828/GCSE_combined_science_content.pdf)
- [DfE GCSE English Language and Literature content](https://www.gov.uk/government/publications/gcse-english-language-and-gcse-english-literature-new-content)
- [AQA GCSE Mathematics 8300 subject content](https://www.aqa.org.uk/subjects/mathematics/gcse/mathematics-8300/specification/subject-content)
- [OCR GCSE Mathematics J560 content overview](https://www.ocr.org.uk/qualifications/post-16-mathematics-and-english/mathematics-j560-from-2015/specification-at-a-glance/)

## Exam boards

GCSE exam boards are chosen per subject during paid signup, because a school rarely enters every subject with the same board. Because GCSE preparation starts in Year 9, the board is chosen from Year 9 onwards, while Foundation or Higher tier entry is only settled for the exam years, 10 and 11. The signup form offers AQA and Edexcel as radio choices for each subject, and the selection is stored on the learner profile as a subject-to-board map. `boardFor(profile, subject)` resolves the board wherever a subject is in scope, falling back to the single `examBoard` recorded before per-subject entry existed.

OCR remains in the catalogue and in the qualification code table, but is not offered at signup. No topic is restricted to OCR alone, so topic filtering is unaffected. Offer it again by adding it to `signupBoards` in the signup form and in the API validation.

## Sub-topics and worked examples

The learning hub lists every topic for the learner's year in one dropdown grouped by unit, and presents that topic's curriculum outcomes as sub-topic cards. Outcomes are reused as sub-topics deliberately: the catalogue stays the single source of truth, and no parallel content tree has to be maintained alongside it. The catalogue currently holds 210 topics and 630 outcomes across Years 7 to 11.

Topic explanations and worked examples are held in the `EducationHubContent` table, and a routing policy decides where each request is answered from. Explanations are authored curriculum text and are served from storage only, so the model is never asked to invent them. Worked examples are served from storage and reach the model only when nothing has been seeded, after which the result is persisted for every later learner. Maths examples are stored as LaTeX and typeset in the browser. Content quality is the open risk. Examples are not reviewed before a learner sees them, and pitch varies: a Year 10 microscopy example came back correctly pitched at GCSE, while a Year 10 sampling example used t-distributions, finite population correction, and confidence intervals, none of which is GCSE content. Seeding a year ahead of time and reviewing the stored rows is the current mitigation; a teacher review state on each row is the missing piece.

## Validation against the published specifications

The catalogue and its stored content were checked against the DfE subject content
for GCSE mathematics, the DfE key stage 3 programmes of study, and the AQA
specifications for maths (8300) and Combined Science: Trilogy (8464). The
corrections that followed are listed here because each one was a factual error,
not a preference.

| Correction | Why |
| --- | --- |
| English GCSE topics no longer carry Foundation and Higher tiers | GCSE English Language and English Literature are untiered. Tiering them split their stored content in two for no reason. |
| Space Physics removed from Year 11 Science | Space physics is in separate Physics (8463), not Combined Science: Trilogy (8464), which is the qualification this subject maps to. It was also marked Higher-only, which it is not. |
| Year 11 "Bioenergetics and Homeostasis" became "Homeostasis and Response" | Year 10 already covered bioenergetics, so the topic duplicated it and reduced homeostasis to an afterthought. |
| "Organisation and Digestion" added to Year 10 Science | Organisation is a whole topic in the specification. It was previously implied by the title of the cell biology topic and taught nowhere. |
| Year 10 "Particle Model and Atomic Structure" became "Particle Model of Matter" | Radioactive decay is covered by Year 11 Atomic Physics; the two topics overlapped. |
| Year 10 "Sampling and Distributions" became "Sampling and Comparing Data" | The subject content asks only that a learner can infer population properties from a sample and know the limitations of sampling. The old title and the outcome "Evaluate sampling" produced generated questions using standard error, confidence intervals and named sampling schemes, none of which is GCSE content. |
| Year 10 geometry limited to right-angled trigonometry | The sine and cosine rules are a Year 11 Higher topic in this catalogue, but Year 10 questions were using them. |
| Year 10 Computing "Algorithms and Complexity" became "Algorithms and Efficiency" | GCSE compares algorithm efficiency informally. Complexity analysis is A-level. |
| Duplicate titles resolved in English and Computing | "Transactional Writing" appeared in Years 9, 10 and 11, and "The 19th-century Novel" in Years 9 and 10, so a learner could not tell the topics apart. |

`npm run validate:curriculum` enforces these as rules rather than as a one-off
clean-up: it fails on a duplicate title, on an untiered subject carrying tiers,
on a topic with no authored content, and on authored content that uses
vocabulary from above the specification. It runs as part of `npm test`.

## Authored content

Every topic has a written explanation, key ideas and, where they apply,
formulae, in `src/data/topicContent/`. This is the reason the routing policy can
keep explanations on the stored-only route: the model is never asked to invent
the core teaching text, and a learner never waits on a model call to read it.

Before this existed, `getTopicGuide` returned the topic's one-line goal as its
explanation for all 210 topics. Every stored explanation was therefore a
restatement of intent - a median of 61 characters - and Learn mode had no
teaching content in it at all. The authored explanations run to a median of
around 580 characters with four key ideas each, and 93 topics carry formulae.

The model is still used, deliberately, for the question banks, because practice
and exam questions need variety that authored content cannot provide. That is the
only route that calls it.

## Question bank rules

The generated question bank produced material that was mathematically correct but
unusable, so the prompt and the parser now enforce what the specification and the
interface require:

- Questions must be answerable from their own text. The learner is shown no
  images, so a question referring to "the diagram" cannot be answered.
- No question may ask for a drawing, a ruler-and-compass construction or a
  measurement, because the answer is typed into a text box.
- Content above the specification is named and excluded in the prompt: standard
  error, confidence intervals, named sampling schemes, standard deviation, the
  normal distribution, radians and calculus.
- Quantities must be internally consistent. A length "to the nearest 0.5 cm"
  must be a multiple of 0.5 cm; an approved question previously read 53.6 cm.
- A practice question with fewer than two steps of working is refused, exactly as
  an exam question with no mark scheme is. 94% of stored practice rows had no
  working at all, so the worked-answer reveal opened on an empty list.
- A response that echoes the prompt's own field description is refused. One
  stored question read "the practice question".

Topics that cannot be assessed by typed text - ruler-and-compass constructions,
workshop prototypes - are excluded from the question bank by
`supportsQuestionBank` and are taught through their explanation and worked
examples instead.

`npm run prune:content` removes stored rows that break any of these rules, or
that were written against a topic or outcome the catalogue no longer contains,
so a re-seed regenerates them.

## Next Curriculum Work

1. Add exact specification statement references to every GCSE topic for each board.
2. Have subject teachers review scope, sequencing, terminology, and outcomes. The
   corrections above were made against published specifications, not by a teacher.
3. Add prerequisite links between topics to form a curriculum graph.
4. Add licensed lesson resources and original question-bank references.
5. Introduce school-level sequence overrides without duplicating the canonical catalogue.
6. Seed question banks beyond Year 10 Maths. The bank currently covers Year 10
   Maths Higher for AQA and Edexcel; every other year, subject, tier and board
   generates on demand and is stored on first use.
