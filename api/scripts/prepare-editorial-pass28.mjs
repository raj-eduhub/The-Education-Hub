import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {TableClient} from '@azure/data-tables';
const dir='output/curriculum-review/pass-28';mkdirSync(dir,{recursive:true});
const settings=JSON.parse(readFileSync(new URL('../local.settings.json',import.meta.url),'utf8').replace(/^\uFEFF/,'')).Values,table=settings.AZURE_STORAGE_CONTENT_TABLE??'EducationHubContent';
const client=TableClient.fromConnectionString(settings.AZURE_STORAGE_CONNECTION_STRING,table),changes=[];
async function amend(ref,reason,edit){const [partitionKey,rowKey]=ref.split('/'),e=await client.getEntity(partitionKey,rowKey);changes.push({ref,type:e.type,subtopicTitle:e.subtopicTitle,beforeHash:createHash('sha256').update(JSON.stringify([e.payload,e.subtopicTitle])).digest('hex'),payload:edit(JSON.parse(e.payload)),reason});}
await amend('y10-english-lang-writing/exam-4-AQA-core','Show paragraphing and avoid making every possible sentence type compulsory.',p=>({...p,markScheme:p.markScheme.map(s=>s.replace('short, medium, and long; questions and exclamations','for example short and extended sentences or a purposeful question')),answer:p.answer.replace(' I press my fingers','\n\nI press my fingers').replace(' The sun climbs','\n\nThe sun climbs').replace(' The scent of tar and sea salt fills my lungs.','')}));
await amend('y10-english-lang-writing/practice-0-AQA-core','Correct the narrative-shape terminology, sequence and paragraph structure.',p=>({...p,question:p.question.replace('a 500-word','an approximately 500-word').replace('a V-shaped narrative structure','a narrative arc'),answer:p.answer.replace(' Inside the Blue Café','\n\nInside the Blue Café').replace(' I followed the map','\n\nI followed the map').replace(' The diary’s pages argued with my questions.','\n\nThe diary’s pages argued with my questions.').replace(' The turning point landed like a gull strike: the map hadn’t led me to treasure, but to a truth that could heal us if I chose to share it.','The map had led me to a truth that could heal us if I shared it.').replace(' Back at the cliff edge, dawn','\n\nBack at the cliff edge, evening light').replace('the diary and the key','the diary').replace('He hasn’t spoken properly','He hadn’t spoken properly')}));
await amend('y10-english-lang-writing/practice-5-Edexcel-core','Provide a coherent tense, purposeful paragraphing, correctly punctuated dialogue and varied sentence lengths.',p=>({...p,answer:`By the time I reached the park, the evening light had turned the path orange. I was in Year 10, old enough to solve equations and take the bus alone, but apparently not old enough to balance on two wheels. My brother had lent me his bicycle and promised not to laugh. He was waiting beside the gate, studying the clouds with suspicious determination.

“Ready?” he asked.

I nodded, although the handlebars felt slippery and my stomach seemed to have slipped somewhere below the saddle. While he held the back of the seat, I placed one foot on a pedal, pushed with the other and tried to remember everything he had said about looking ahead, keeping my arms loose and trusting a machine that appeared determined to throw me into a hedge.

We moved. For three glorious seconds, we moved.

Then I looked down. The front wheel turned towards a patch of grass, my foot missed the pedal, and the whole arrangement folded sideways. I landed sitting upright, still gripping the handlebars as though I could persuade the bicycle that this had been deliberate. Somewhere beyond the trees, a car door slammed. Even that sounded like applause from an unkind audience.

My brother crouched beside me. “Again?”

“Give me a minute.”

The grass was cool through my trousers. A blackbird hopped along the fence, stopped and tilted its head. I imagined explaining the problem to it: two wheels, two feet, no agreement between them. Above the roofs, the remaining sunlight narrowed to a thin gold stripe. I could go home now. I could say we had run out of daylight.

Instead, I stood up.

This time I watched the bench at the far end of the path. I pushed steadily, listened to the chain clicking and let the small wobbles happen without trying to fight every one. My brother's footsteps followed me. Then they grew quieter. The path opened ahead, smooth and unexpectedly wide, and the wind touched my face as if somebody had opened a window.

“You're doing it!” he called.

I nearly turned to answer. Nearly. I kept my eyes on the bench, squeezed the brakes gently and put one foot down before the bicycle stopped completely. My legs were shaking, but the bike remained upright. So did I.

My brother reached me, breathing harder than I was. He held out his hand for the handlebars. I tightened my grip, feeling the rubber warm beneath my fingers, and glanced back along the empty path. The park had not changed: the same fence, the same bench, the same bird. Yet the distance between them had become something I could cross.

“One more go,” I said.`}));
await amend('y10-english-transactional/exam-5-Edexcel-core','Correct delivery chronology, meet length and demonstrate formal email layout.',p=>({...p,question:p.question.replace('The delivery date was promised as 12:00 today, but this did not arrive.','Delivery of the remaining bags was promised by 12:00 today, but they did not arrive.'),answer:`Subject: Missing bags from Order 3921

Dear Customer Services Manager,

I am writing about Order 3921 for 60 insulated lunch bags, which we need for our charity fair next Friday. Only 45 bags arrived two days ago; the remaining 15 have still not been delivered. We were promised delivery of the missing items by 12:00 today, but that deadline has passed.

The shortfall has disrupted our preparations. We cannot complete the planned sets for the fair, and volunteers need time to check and arrange the remaining bags. Finding alternatives at short notice would also take time away from organising the event.

Please arrange delivery of the missing 15 bags before the fair, or refund the cost of those items if delivery is impossible. Our preference is straightforward: we would like the complete order in time for the event. Please confirm the proposed delivery date and any tracking details in writing.

For clarity, this request concerns the missing items only (15 bags); the 45 delivered bags have been received. I would appreciate a prompt response so that we can make reliable arrangements and inform the volunteers.

Thank you for your assistance.

Yours faithfully,
Daniel Reed`}));
await amend('y10-english-transactional/exam-8-Edexcel-core','Match all weekdays, word range and three rhetorical devices in a properly formatted email.',p=>({...p,answer:`Subject: Request for extended library hours

Dear Head of Library,

I am writing as a Year 10 student to request that the library remain open until 6:00 pm, Monday to Friday, during term time. With mock exams approaching, students would benefit from a reliable place to revise after lessons.

We need a quiet desk. We need access to books. We need time to work without interruptions. For students whose homes are crowded or noisy, these are practical needs, not luxuries. How can we make revision opportunities fairer if a suitable study space is unavailable after school?

I propose an initial four-week trial of the weekday extension, followed by a review of attendance and staffing costs before deciding whether to continue throughout term time. The school could arrange appropriate adult supervision, publish clear behaviour expectations and ask students to register their interest. Staff availability and safe travel home would need consideration before the trial begins.

The extension would offer space, resources and reassurance. Please discuss the proposal with the headteacher and let the Student Council know whether a trial is feasible. We would be happy to gather students’ views and help explain the arrangements.

Thank you for considering this request.

Yours faithfully,
Alex Carter`}));
await amend('y10-english-transactional/exam-6-Edexcel-core','Distinguish the retailer request from a request for advice to a friend and display both emails clearly.',p=>({...p,question:p.question.replace('a clear request for action (replacement or refund)','a request for replacement or refund in email A, and a request for advice about that remedy in email B'),answer:p.answer.replace(' Dear Customer Services Team,','\n\nDear Customer Services Team,\n\n').replace(' Yours faithfully, Jamie Collins Subject:','\n\nYours faithfully,\nJamie Collins\n\nSubject:').replace(' Hi Alex,','\n\nHi Alex,\n\n').replace(' Cheerful regards, Jamie Collins','\n\nBest wishes,\nJamie Collins')}));
await amend('y10-english-transactional/practice-9-AQA-core','Address a plausible council contact while separating venue permission and any applicable local requirements.',p=>({...p,question:'Write a formal letter of 190–210 words to the local council’s community events team seeking advice about any council permission needed for a proposed school charity bag-pack at a supermarket. Use a fictional Saturday date and venue. Explain the purpose, proposed time, adult supervision and safeguarding arrangements. Recognise that permission to use the store belongs to its management and do not assume a particular licence is required. Begin Dear Sir or Madam and end Yours faithfully followed by your name.',working:['Identify the council team as the audience for advice, and store management as the venue contact.','Include purpose, fictional date and location, supervision and safe handling of donations.','Ask what local requirements apply without asserting an unverified rule.'],answer:`Dear Sir or Madam,

I am a Year 10 pupil at Riverside High School, writing to request advice about a proposed charity bag-pack at Greenfield Supermarket on Saturday 12 June, from 10:00 am to 2:00 pm. The event would raise funds for our school’s community outreach programme, including support for the local food bank.

We will seek the store manager’s permission to use the supermarket space. Please advise whether any council permission or other local requirements would apply to the proposed collection. We would not advertise the event as confirmed until the relevant arrangements had been agreed.

Two school staff members would supervise pupils, with a named teacher responsible for the rota and contact details. The school would complete its risk assessment and safeguarding arrangements, obtain the necessary parental agreement and agree safe handling of donations. Participation by customers would be entirely voluntary, and we would keep entrances and aisles clear.

Please let us know which council team should review the proposal and what information it needs. We would welcome guidance before finalising plans with the supermarket, families and volunteers.

Thank you for your time and assistance. I look forward to your reply.

Yours faithfully,
Alex Carter`}));
await amend('y11-english-creative/practice-6-AQA-core','Provide an efficient plan with consistent five-decade chronology and a 900-word story allocation.',p=>({...p,question:'Plan an original 800–1000 word short story; write the plan, not the finished story. A Year 11 student, Maya, discovers a locked metal box behind a shelf in a seaside school library. It contains five letters from five different decades, written by a woman who had a secret relationship with a former councillor. The letters challenge a local belief about the town’s history. Include an idea, setting, viewpoint, three-act outline, at least three turning points, showing techniques and a word allocation. Keep the plan concise and make clear how the locked box is opened.',working:['Choose one concrete historical dispute and keep the relationship relevant to it.','Use present-day first-person Maya and letters dated in five named decades.','Plan discovery, testing the apparent revelation and a decision about disclosure.','Allocate 900 words across three acts and identify showing techniques.'],answer:'Idea: Maya discovers that a town shelter credited to a councillor may have been planned and funded by the woman whose contribution he concealed. Their secret relationship complicates his public reputation.\n\nSetting and viewpoint: a present-day seaside town; first-person Maya, aged 16. The fictional letters date from 1958, 1966, 1974, 1983 and 1991.\n\nAct 1 — discovery, 200 words: the box falls behind a shelf during supervised library reorganisation. Maya gives it to the librarian, who finds its labelled key in the school archive cabinet. First turning point: an opened letter names a woman absent from the shelter’s commemorative plaque. Show curiosity through Maya rereading the signature and tracing the ink.\n\nAct 2 — investigation, 450 words: Maya reads brief extracts and compares them with the plaque and a surviving committee minute. Second turning point: a letter reveals the secret relationship. Third turning point: the later letter claims the woman accepted anonymity to protect someone else. Maya realises that a discovery does not automatically explain every motive. Use short dialogue with the librarian and the contrast between polished brass and fragile paper.\n\nAct 3 — decision, 250 words: Maya proposes an archive display presenting the evidence and its uncertainties, rather than an accusation. She returns to the plaque and notices its silence differently. End with an action — writing the woman’s name on a provisional display card — rather than a speech explaining the moral.\n\nPacing: 200 + 450 + 250 = 900 words for the future story. Keep letter quotations short, expand the moment when Maya’s first interpretation is challenged, and use a brief final paragraph to echo the opening discovery.'}));
await amend('y11-english-creative/practice-9-Edexcel-core','Use typical Year 11 ages consistently.',p=>JSON.parse(JSON.stringify(p).replaceAll('Mia, 17','Mia, 16').replaceAll('Lucas, 18','Lucas, 16').replaceAll('Mia (17)','Mia (16)').replaceAll('Lucas (18)','Lucas (16)')));
await amend('y9-english-transactional/exam-4-Edexcel-core','Retain the original completed-trip timeframe and remove invented arrangements.',p=>({...p,markScheme:p.markScheme.map(s=>s.replace('the day will be long','the day was lengthy')),answer:`Year 9 Science Visit: A Review

For parents and Year 9 students

Last week’s science trip gave pupils an opportunity to visit a real laboratory and learn about the ways scientists test ideas. A guide explained the work, helping students connect scientific investigation with a practical setting.

During the visit, pupils took part in short experiments and compared their results with those of other members of the class. This combination of explanation and participation was an important feature of the day. The original account describes the visit as lengthy but worthwhile, reflecting the value the pupil placed on the experience.

Students considering similar learning opportunities are encouraged to make detailed notes and ask questions. Recording more information than initially seems necessary can help when reviewing a visit afterwards; asking about unfamiliar ideas can also make explanations clearer.

Thank you to the students for sharing their reflections. This notice reports on the completed visit; it does not announce a future trip.`}));
await amend('y9-english-transactional/exam-7-Edexcel-core','Meet the requested article length and show headline, subheading and paragraphs.',p=>({...p,answer:`Reduce Plastic Waste in Our Canteen
A practical change for our school community

Our canteen should reduce avoidable plastic waste through a practical plan developed with students and staff. The aim should be to prevent unnecessary waste while keeping meals affordable and convenient.

There are three reasons to act. First, fewer disposable items would mean less material needing collection and disposal. Second, well-used refillable bottles and reusable containers could reduce repeated purchases, although cleaning and replacement costs must be considered. Third, clear routines would help students develop habits they can use beyond school.

The school could begin by counting the disposable items used during a typical week. Staff and students could then choose one manageable change, such as improving access to drinking-water refills. Any reusable container scheme should meet the canteen’s hygiene requirements and include an affordable option for pupils who cannot buy new equipment.

Clearly labelled bins would support correct sorting, but labels must match the local collection service. An item is not necessarily recyclable simply because it is plastic.

Please share suggestions with the Student Council and support a short trial. Measuring what changes will help the school decide which actions deserve to continue.`}));
await amend('y9-english-transactional/practice-4-Edexcel-core','Show notice layout and remove an invented sign-up deadline.',p=>({...p,answer:p.answer.replace('Club A new','Club\n\nA new').replace(' Each session','\n\nEach session').replace(' If you would','\n\nIf you would').replace(' Sign-ups close on Friday at 3:30 pm.',' Please contact Mrs Patel if you have questions about taking part or would like further information before joining.').replace(' We hope','\n\nWe hope')}));
const arc=changes.find(c=>c.ref==='y10-english-lang-writing/practice-0-AQA-core').payload;
arc.answer=arc.answer.replace('hurts.The map','hurts. The map').replace('a quiet certainty','a certainty').replace('older days','days');
const bike=changes.find(c=>c.ref==='y10-english-lang-writing/practice-5-Edexcel-core').payload;
bike.answer=bike.answer.replace('Instead, I stood up.','Instead, I stood up. I brushed a green stain from my knee and checked that the wheels still turned. My brother waited without speaking. For once, his silence felt helpful rather than embarrassing.');
const ages=changes.find(c=>c.ref==='y11-english-creative/practice-9-Edexcel-core').payload;
ages.answer=ages.answer.replace('Mia, 16','Mia, 17').replace('Lucas, 16','Lucas, 18');
ages.answer=ages.answer.replace('Subtle shift: brief third-person focus on Lucas in key moments to reveal his perspective without breaking Mia’s internal voice.','Keep the first-person viewpoint throughout. Reveal Lucas’s perspective through his dialogue and actions; Mia cannot directly narrate his unspoken thoughts.');
changes.find(c=>c.ref==='y11-english-creative/practice-9-Edexcel-core').reason='Keep a consistent first-person viewpoint; the prompt does not require the fictional characters to be Year 11 pupils.';
writeFileSync(`${dir}/correction-plan.json`,JSON.stringify({table,createdAt:new Date().toISOString(),changes},null,2));
for(const c of changes)console.log(c.ref,c.payload.answer?.trim().split(/\s+/).length);
