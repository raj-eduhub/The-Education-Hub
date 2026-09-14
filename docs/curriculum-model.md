# Curriculum Model

## Scope

Education Hub contains a broad curriculum map for Years 7-11 across Maths, Science, English, History, Geography, Computing, and Design Technology. The catalogue currently contains 210 modules and 630 measurable outcomes, with unit names, learning goals, GCSE tier applicability, and exam-board mappings.

| Year | Modules | Stage |
| --- | ---: | --- |
| 7 | 34 | KS3 |
| 8 | 34 | KS3 |
| 9 | 34 | KS3 |
| 10 | 51 | KS4 / GCSE |
| 11 | 57 | KS4 / GCSE and revision |

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

## Next Curriculum Work

1. Add exact specification statement references to every GCSE topic for each board.
2. Have subject teachers review scope, sequencing, terminology, and outcomes.
3. Add prerequisite links between topics to form a curriculum graph.
4. Add licensed lesson resources and original question-bank references.
5. Introduce school-level sequence overrides without duplicating the canonical catalogue.
6. Add a teacher review state to stored worked examples so only approved content reaches learners.
