# Curriculum Model

## Scope

Education Hub contains a broad curriculum map for Years 7-11 across Maths, Science, English, History, Geography, Computing, and Design Technology. The catalogue currently contains 235 modules and 1,439 measurable outcomes, with unit names, learning goals, GCSE tier applicability, and exam-board mappings.

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

The learning hub lists every topic for the learner's year in one dropdown grouped by unit, and presents that topic's curriculum outcomes as sub-topic cards. Outcomes are reused as sub-topics deliberately: the catalogue stays the single source of truth, and no parallel content tree has to be maintained alongside it. The catalogue currently holds 235 topics and 1,439 outcomes across Years 7 to 11.

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

### Coverage audits

#### Maths

The corrections above were found by reading the catalogue against the
specifications. Coverage was then checked the other way round, by taking each
piece of required content and searching all five years for the words it would
have to use if it were taught. Two passes were run: `gpt-5-nano` was asked to
audit each year with the whole subject in front of it, and a scripted sweep
checked sixty statements of required content by search. The model found one real
gap and two topics it would merely have sequenced differently; the sweep found
the rest and disproved two of the model's. Neither pass alone was sufficient.

| Gap | Resolution |
| --- | --- |
| Primes, prime factorisation, HCF and LCM appeared nowhere in Maths, although the Year 7 number topic's key ideas already referred to them | New Year 7 topic "Primes, Factors and Multiples". KS3 programme of study, and N4 at GCSE. |
| Probability began at Year 9 with tree diagrams and combined events, so the single event they are built from was never taught | New Year 8 topic "Probability of Single Events". |
| The order of operations was never stated; the only mention was a Year 9 line applying it to powers and roots | Appended to Year 7 "Integers and Place Value". |
| Recurring decimals to fractions appeared nowhere | Appended to Year 11 "Surds and Exact Calculation", which is Higher tier, matching N10. |

Two candidate gaps were rejected on inspection. Compound interest is already
carried by Year 11 "Direct and Inverse Proportion" under the specification's own
name, growth and decay, and the validator refuses it anywhere else: R16 is Higher
tier, and the key stage 3 programme of study names simple interest only.
Cumulative frequency is Year 11 Higher, which is where AQA places it.

Outcomes are appended to the end of a topic's list, never inserted. Worked
examples are stored as `example-{index}-{tier}`, so an outcome that changed
position would point stored content at a different sub-topic without anything
failing.

#### Science, key stage 3

Checked against a school's published Year 7 and Year 8 schemes of work for
Biology, Chemistry and Physics, and then against the DfE programme of study to
decide whether each difference was a gap or only a difference of sequence.

Sequence differences were deliberately left alone. That school teaches digestion
and energy in Year 7 where this catalogue has Year 8, and electricity,
magnetism and photosynthesis in Year 8 where it has Year 9. All of that content
sits inside key stage 3, which the DfE specifies for the key stage as a whole,
and the header of `curriculumCatalog.js` already says Years 7 to 9 are a
recommended sequence. Re-ordering to match one school would have cost every
other school the same amount.

Four things were absent from key stage 3 altogether, and those were added.

| Gap | Resolution |
| --- | --- |
| Nothing anywhere taught how to work safely in a laboratory or which apparatus to use | New Year 7 topic "Laboratory Safety and Apparatus". |
| Elements, compounds and mixtures were touched on by three topics and taught by none | New Year 7 topic "Elements, Compounds and Mixtures", which also carries physical against chemical change and the composition of the air. |
| The reactivity series, displacement, ores and extraction appeared nowhere, although the reactivity series is named in the programme of study | New Year 8 topic "Metals, Reactivity and Extraction", including extraction with carbon and why electrolysis is needed above it. |
| Space physics is a named strand of the programme of study and was in no year at all | New Year 7 topic "Space Physics". |

Sub-topics were appended for work that was touched on but never set out:
chemical formulae and naming a compound from its formula, the halogens, how the
model of the atom and the periodic table were arrived at, the properties of
solids, liquids and gases, and the energy change behind melting and boiling.

All 44 topics in the three schemes now resolve somewhere in Years 7 to 9.

#### Science, key stage 4

Checked against the same school's Year 9, 10 and 11 schemes of work. That school
sits the three separate sciences, AQA Biology 8461, Chemistry 8462 and Physics
8463. This catalogue maps Science to Combined Science: Trilogy 8464, so the two
lists were split before anything was added: content in Combined Science was
added, and content belonging only to the separate GCSEs was not, because
`validate-curriculum.mjs` fails it on the grounds that a Combined learner would
be taught something their paper cannot ask about.

Three gaps in Combined Science content:

| Gap | Resolution |
| --- | --- |
| Motion was one outcome, "analyse forces", inside a Year 11 topic about three other things, although 4.5.6 covers speed, velocity, acceleration and motion graphs | New Year 10 topic "Motion and Acceleration", with stopping distances and the scalar/vector distinction. |
| Crude oil, fractional distillation and cracking appeared nowhere; only alkanes and alkenes were named | New Year 10 topic "Crude Oil and Fuels". |
| Mains electricity and domestic safety, 4.2.4, were represented only by the National Grid | Appended to Year 10 "Energy and Electricity": the plug, fuses and circuit breakers, and a.c. against d.c. |

Alloys and the preparation of a soluble salt were appended for the same reason.
All 45 Combined Science topics in the three schemes now resolve in Years 9 to 11.

Thirteen topics in those schemes are separate-science content and were
deliberately not added: transition metals, nanoparticles, titrations, polymers,
bond energy calculations, chemical cells and fuel cells, corrosion, composites,
glass and ceramics, the Haber process and fertilisers, lenses, space physics at
GCSE, transformers and induction, and the eye and the brain. Supporting them
would mean offering Biology, Chemistry and Physics as separate subjects with
their own specifications rather than one Science subject mapped to 8464. That is
a product decision, not a catalogue correction, and it is recorded in
"Next Curriculum Work" rather than half-made here.

#### English

Checked against the same school's Year 7 to Year 11 schemes of work, for AQA
English Language 8700 and English Literature 8702.

Key stage 4 needed nothing. Every unit in their Years 9, 10 and 11 already
resolved, including the spoken-language endorsement, which they assess in the
summer of Year 10 exactly where this catalogue places it. Their set texts are
deliberately not named: `english.js` teaches method rather than a particular
novel or play, because set texts vary by school and by board. An Inspector
Calls is served by the modern text topic, Macbeth by the Shakespeare topics,
Jekyll and Hyde by the 19th-century novel topics, and Power and Conflict by the
anthology topics, without any of them being written into the catalogue.

Three gaps, all at key stage 3:

| Gap | Resolution |
| --- | --- |
| How English changed over time appeared nowhere, although that school gives it two units and it is what makes a pre-1914 text hard to read | New Year 8 topic "How English Has Changed": Old, Middle and Early Modern English, borrowing, why the spelling is irregular, and how word meanings drift. |
| No topic anywhere was about genre conventions, so a myths unit or a dystopian unit had nothing to sit on | New Year 7 topic "Myths, Legends and Story Structure", plus genre-convention outcomes on the Year 8 novel topic. |
| Only one Shakespeare topic existed at key stage 3, although the programme of study asks for two plays across the key stage | New Year 7 topic "Shakespeare: Comedy and Performance", which also gives the comedies a home; the Year 8 topic carries tragedy and history. |

The narrative poem was appended to Year 8 poetry, a form the catalogue named
nowhere despite covering rhythm, form and imagery.

All 29 units in the five schemes now resolve in Years 7 to 11.

#### History

Checked against the same school's Year 7 to Year 11 schemes of work.

Key stage 4 needed no new topics. The GCSE topics here are paper-shaped rather
than content-shaped - British Depth Study, Period Study, Thematic Study,
Historic Environment, Sources, Interpretations - so a school's chosen options
sit inside them whichever board set them. International Relations 1919-1991,
the USA depth study and Conflict in the Middle East all resolve that way
without being named.

Three gaps at key stage 3, each of them named in the programme of study:

| Gap | Resolution |
| --- | --- |
| The Crusades appeared nowhere, and with them the only non-European study in the subject, although the programme of study requires at least one study of a significant society in world history | New Year 7 topic "The Crusades and the Islamic World", which treats the medieval Islamic world on its own terms and not only as a backdrop to European history. |
| The Enlightenment appeared nowhere, although it is named in "ideas, political power, industry and empire" | New Year 8 topic "The Age of Enlightenment", including the limits those arguments were given on slavery and on women. |
| History began abruptly at Hastings, although the programme of study asks for a theme extending chronology before 1066 | New Year 7 topic "Britain Before 1066", so the conquest reads as a change of ruler over an organised kingdom rather than the start of English history. |

Medieval science and technology was appended to the Year 7 crisis topic.
All 19 of the school's non-Ancient units now resolve in Years 7 to 11.

That school's Ancient History option is OCR J198, a separate qualification
that nothing here covered. Rather than add a board and a specification for it,
its four topics - Greece and Persia, Alexander the Great, Rome and its
Neighbours, and Hannibal and the Second Punic War - are carried by the existing
History subject under both boards, in a unit named "Ancient World (Wider
Reading)". Every authored explanation opens by saying it is beyond the AQA and
Edexcel specifications, because an AQA paper will not ask about Hannibal and a
learner should not be left thinking otherwise.

One thing is still reported rather than built. They sit CIE 0977 for Modern
History, and this catalogue offers AQA and Edexcel only. Because the GCSE
topics are paper-shaped the teaching still fits, but the board cannot be
selected and the qualification code shown would be wrong.

#### Computing

Checked against the same school's Year 7 to Year 11 schemes of work. Their
board is OCR J277 and this catalogue carries AQA 8525 and Edexcel 1CP2; the
three overlap almost completely at topic level, so everything added sits under
both boards and none of it is OCR-only.

Two gaps large enough to be topics:

| Gap | Resolution |
| --- | --- |
| Artificial intelligence and machine learning appeared in no year, although the school gives it a unit and it is the part of computing a learner is most likely to meet outside school | New Year 9 topic "Artificial Intelligence and Machine Learning", covering what a model learns from data, what it cannot, and why training data makes it biased while it still looks neutral. |
| Translators were covered but comparing languages was not, and the IDE was named nowhere | New Year 9 topic "Programming Languages and Paradigms", covering machine code through high-level languages, compilers against interpreters, procedural against object-oriented, and what an IDE supplies. |

Four smaller additions were appended to topics that already existed: the
input-process-output model, trace tables, hexadecimal at key stage 3, and data
types. That last one was the most surprising find in the subject - variables,
arrays and records were all taught without the word "type" appearing anywhere
in Computing, in either key stage, although both specifications list data types
as programming fundamentals.

All 30 curriculum units in the schemes now resolve in Years 7 to 11. Two
further entries were platform rather than curriculum, a school's own systems
induction and CodeCombat, and were not added.

#### Design and Technology

Checked against the same school's Year 7 to Year 11 schemes of work. Their
board is AQA 8552, which this catalogue already carries, so nothing here was a
board mismatch. Designing, making, materials and the NEA sequence were all
covered. Two gaps:

| Gap | Resolution |
| --- | --- |
| Food and nutrition was absent from the subject entirely, although "Cooking and nutrition" is a named strand of the key stage 3 programme of study and is one of that school's three key stage 3 rotations | New Year 7 topic "Food Hygiene and Healthy Eating" and new Year 8 topic "Cooking Skills and Food Provenance", covering hygiene and knife safety, nutrient balance, cooking methods, and where food is grown, reared and caught. |
| New and emerging technologies, AQA 3.1.1, is a whole specification section and was represented only by a general outcome about social and ethical impacts | New Year 10 topic "New and Emerging Technologies": technology push against market pull, planned obsolescence against design for repair, automation and robotics, flexible manufacturing, just in time and lean manufacturing. |

Three smaller additions were appended: stiffening and reinforcing materials
(3.1.4), cams and followers, and the difference between alkaline and
rechargeable batteries.

All 40 units in the schemes now resolve in Years 7 to 11.

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
explanation for all 235 topics. Every stored explanation was therefore a
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
6. Decide whether to offer the three separate sciences. Science currently maps
   to Combined Science: Trilogy (8464). Schools that sit AQA Biology 8461,
   Chemistry 8462 and Physics 8463 teach thirteen topics this catalogue
   deliberately excludes, listed under the key stage 4 science audit above.
   Supporting them means three subjects with their own specifications, not more
   outcomes on the existing one.
7. Decide which exam boards to offer. Only AQA and Edexcel can be selected,
   and `examBoards` is enforced at signup, in validation and in the storage key.
   Schools sitting CIE or OCR - including CIE 0977 History and OCR J198 Ancient
   History - have no board to choose, and Ancient History has no content at all.
8. Seed question banks beyond Year 10 Maths. The bank currently covers Year 10
   Maths Higher for AQA and Edexcel; every other year, subject, tier and board
   generates on demand and is stored on first use.
