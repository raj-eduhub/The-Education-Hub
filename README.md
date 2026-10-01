# Education Hub

An Azure-ready learning hub for KS3, KS4, and GCSE revision. The project includes a React frontend, an Azure Functions backend, and a server-side Azure AI Foundry model call.

## Development handoff

Last updated: 1 October 2026

Keep this section current after each meaningful implementation session so work can resume without reconstructing the latest state from scratch. The entries describe files saved in the working tree; they do not imply that the changes have been committed to Git. Before continuing, run `git status --short` and inspect the relevant diff so existing work is preserved.

Latest saved update (1 October 2026, evening):

- **The Azure subscription was disabled and is now Pay-As-You-Go.** The free trial had ended (`ReadOnlyDisabledSubscription`, every model and speech call 401). It is upgraded, the spending limit is off, and the model and speech endpoints answer again.
- **Costs kept down.** Narration now uses a free F0 Speech resource, `education-hub-speech-free` in `rg-educationhub` (UK South); `AZURE_SPEECH_KEY`, `AZURE_SPEECH_REGION=uksouth` and `AZURE_SPEECH_ENDPOINT=https://uksouth.tts.speech.microsoft.com/cognitiveservices/v1` point at it, and existing recordings remain valid. A subscription budget, `education-hub-monthly`, emails the Azure sign-in at 50%, 80% and 100% of £20 actual spend and at 100% forecast. Speech previously accounted for £33.34 of £56.66 spent; models are the only metered cost left, plus email at a fraction of a penny per message.
- **Main model gpt-6-luna, backup gpt-5-nano.** `api/src/lib/foundry.js` asks `AZURE_AI_MODEL_DEPLOYMENT` first, with one retry, then `AZURE_AI_FALLBACK_DEPLOYMENT` with the full retries, if the main one fails or returns no text. A 401 or 403 is not passed to the backup, since both share the key. `callFoundryWithModel()` returns the model that answered, and stored content records it as `model`. Global Standard prices per million tokens (Azure retail price list, GBP): Luna £0.0755 input, £0.0075 cached input, £0.0943 cache writes, £0.3774 output; nano £0.0377 input, £0.0038 cached input, £0.3019 output. Output is most of the bill, so Luna costs roughly 1.25 times nano for the same tokens. Checked live: Luna answered; a call to a missing deployment fell back to nano.
- **Key rotated.** Key 1 of `rajkumaraiexpert-0649-resource` was exposed in a chat, so the app was moved to key 2 (`AZURE_AI_API_KEY` in `api/local.settings.json`) and key 1 was then regenerated; the old key is refused. Anything else that used key 1 needs the new one.
- The other resource in the subscription, `divalidate-hzmnqj4iayp7w` (PostgreSQL B1ms, `rg-dealintel-local`), belongs to another project and runs on the 12-month free allowance of 750 hours a month; it will be charged once that ends.

Earlier update (1 October 2026, later):

- **The free trial is now one topic for one week, with no card.** The week starts when the learner chooses the topic (`TRIAL_DAYS`, default 7), not at sign-up, so all of it is study time. When it ends everything locks and only the subscription page shows. The tutor allowance in the trial is now `TRIAL_MODEL_CALLS_PER_DAY` (default 20) a day instead of 10 in all. An account Stripe has ever billed gets no trial.
- **Paid and trial are separate records.** Onboarding no longer writes `status: "trial"`: `status` is Stripe's alone. The trial lives in `freeTopicId`, `trialStartedAt` and `trialEndsAt`, written together by `claimFreeTopic()` in `api/src/lib/subscriptionStore.js`, and `getSubscription()` adds `everPaid`. `getLearningAccess()` returns `trialEnded`, and `trialRefusal()` answers it with `code: "trial-ended"`; the topic routes now send every refusal through it. The payments dashboard shows "Free trial to <date>", "Trial ended" and "Trial not started" from those fields, with a free-trial count.
- App: a days-left banner, an offer panel and account text that say the topic is free for a week, and a subscription page that takes over, with no way back, when the week is over, including when it runs out with the page open. Website sign-up and the free-start email say "free for a week, no card".
- Verification: `npm run test:e2e` passes all 64 checks against the local stubs, now including the week starting on the choice, an expired week locking the free topic and refusing a restart, and payment reopening it. `test-model-budget.mjs` passes with the daily trial cap. `vite build` passes.

Earlier update (1 October 2026):

- **Free trial: one topic free.** An account that has not paid can finish learner setup, choose one topic from the learner's year, and study it in full: lessons, worked examples, practice and exam questions, progress, and up to `TRIAL_MODEL_CALLS` (default 10) tutor replies that reach the model. The choice is permanent and is made with an explicit "Make this my free topic" button, never by opening a topic, because the app opens the first Maths topic on its own at load. The placement check stays paid-only. Paying opens every topic, and setup, the free topic and its progress carry over. A cancelled subscriber falls back to the trial and keeps their free topic.
  - API: `api/src/lib/learningAccess.js` now returns `trial` and `freeTopicId` alongside `allowed`. `allowed` still means full paid access; the topic routes (`content`, `narration`, `progress` POST, `tutor`) opt a trial in only for its free topic through `mayStudyTopic()`, and refuse it with `trialRefusal()` (codes `trial-topic-unchosen` and `trial-topic-locked`). A route that does not opt in, such as `diagnostic`, stays closed to a trial.
  - `POST /api/billing/free-topic` (in `api/src/functions/billing.js`) accepts only a topic in the learner's own year. `claimFreeTopic()` in `api/src/lib/subscriptionStore.js` keeps the first choice with an etag, so two tabs cannot claim two topics. `GET /api/billing/status` now includes `freeTopicId`, and the payments totals count `trial` rows.
  - `api/src/functions/onboarding.js` accepts any account on the roster instead of requiring an active subscription, and `completeOnboarding()` marks a new row `status: "trial"`.
  - `api/src/lib/modelBudget.js` has a third, lifetime `trial` window, checked first and only for a trial. A spent allowance answers 429 with `code: "trial-tutor-used"` and no `Retry-After`.
  - Sign-up: `POST /api/auth/reserve` with `start: "free"` emails the set-password link at once (`sendFreeStartEmail()` in `api/src/lib/email.js`, seven-day link, rate-limited per address) instead of returning a checkout grant. Setting a password through `/api/auth/reset` now adds the account to the roster if it has no row yet; an existing row, including an inactive one, is left alone. The website handoff (`SignupHandoff` in `src/PasswordLogin.jsx`) leads with "Start with a free topic", with "Subscribe now" as the second button.
  - App (`src/main.jsx`): learner setup now comes before payment, and the subscription page is reached from the "Unlock every topic" prompts and has a way back. A trial sees a banner, "(free)" and "(locked)" labels in the topic dropdown, and an offer panel in place of a locked topic's lesson. No content, progress or tutor request is made for a locked topic. Tutor refusals (403 and 429) are now shown to the learner instead of a generic connection error. `src/AccountSettings.jsx`, `src/SubscriptionPage.jsx` and `src/SubscriberSignup.jsx` wording follows the trial; the styles are the `.trial-*` rules at the end of `src/styles.css`.
- **Fixed: starting a checkout undid learner setup.** `savePendingSubscription()` wrote `onboardingComplete: false`, so anyone who had already set up (a trial now, or someone resubscribing after cancelling) was sent back through setup once the payment cleared, and was locked out in the meantime. It now keeps the existing value and `createdAt`.
- **Topic dropdown in dark mode.** The unit headings (`<optgroup>`) had no colours of their own and showed the select's translucent background over the list Windows draws, which left near-white text on a pale background. `select optgroup` now has the same literal navy as `select option`, with blue-grey heading text, and `select { color-scheme: dark; }` makes the browser draw the open list and its scrollbar dark. Light mode has matching overrides. Rules are by the `select option` comment in `src/styles.css`. The open list is drawn by the OS, so this was not verifiable in a screenshot; check it by eye.
- **Narration coverage, checked.** In local storage (Azurite), all 18,715 lesson beats across the 240 topics and all 6,776 beats of the 616 stored worked examples are voiced; no example slot is unseeded. The check was `node api/scripts/synthesise-narration.mjs --dry-run --report-tag coverage-check-lessons` and `node api/scripts/synthesise-examples.mjs --dry-run`, which send nothing to the speech service. Deployed storage was not checked, and edited lesson text needs re-synthesising, so re-run the dry runs after content changes.
- Verification after this update: `npm run test:e2e` passes all 58 customer-journey checks, including the new trial sections, against the local stubs and an API on port 7075 started with the stub settings. `test-model-budget.mjs` (with the new trial checks), `test-billing.mjs`, `test-failed-payments.mjs`, `test-billing-routes.mjs` and `test-password-login.mjs` pass. A one-off script walked the website free start (reserve, email, set password, roster, sign in) and passed. `vite build` passes with the existing large-chunk warning. The full `npm test` run and a real-browser pass of the trial screens were not done.
- Committed as three commits on `feat/education-hub-application`: the curriculum session's sub-topic lessons and review (which shared `src/main.jsx`, `api/src/functions/content.js` and `src/styles.css` with this work and were split out of them), the dark-mode dropdown fix, and the free trial. The review's generated reports and snapshots in `output/` were left uncommitted.
- To see the trial in the browser, the API on port 7071 has to be restarted so it loads the new code.

Previous update (24 September 2026):

- **Sonia · Your AI Tutor** in the learning header now matches the compact rounded treatment of **Take the check**, with a distinct muted-bronze accent and icon so the two controls remain easy to distinguish.
- The User management table keeps every `<td>` as a native table cell, with the user identity and action-button layouts moved into inner wrappers. This fixes the staggered, disconnected row separators visible when the table was rendered at desktop width.
- The HTTP end-to-end test now follows the current checkout and learner setup contracts: it accepts either a hosted Stripe URL or embedded checkout secret, derives a Year 10 date of birth for the current academic year, and verifies that changing the date of birth to another school year is rejected. Run it with the local stubs and `E2E_BASE=http://127.0.0.1:7071/api npm run test:e2e` (PowerShell syntax is shown in the testing notes below).
- Design & Technology now uses the same selected sidebar treatment as the other subjects. Its `data-subject` colour selector in `src/styles.css` now exactly matches the button value, so the active tab keeps its intended orange accent instead of falling back to blue.
- Clicking Register on the website carries the entered parent or guardian email into a prefilled, read-only Email field in the registration handoff form; that displayed value is submitted to account reservation and later kept synchronized with learner setup. The handoff is in `src/main.jsx` and `src/PasswordLogin.jsx`, with learner setup synchronization in `src/SubscriberSignup.jsx`.
- The learner setup **Curriculum year** result now stacks the stage beneath the year and separates both from the permanent-year warning with consistent spacing and a divider. The markup is in `src/SubscriberSignup.jsx` and the layout is in `src/styles.css`.
- The four learning-mode controls stay in the same row position when Review is selected. `src/styles.css` now anchors the workspace grid rows to the top, preventing shorter Review content from stretching the header and dropping the mode menu.
- The Exam-mode timer now has direct start and reset controls, so the learner can start it independently and use Reset to stop it and return to `00:00`. Reset opens an **Are you sure?** confirmation dialog before clearing elapsed time. The timer state and controls are in `src/main.jsx`, with responsive control styling in `src/styles.css`.
- **Sonia · Your AI Tutor** in the learning header is now a button that opens the existing in-page chat, scrolls it into view, and focuses its message field. The implementation is in `src/main.jsx`, with its interactive styling in `src/styles.css`.
- The administrator user table now displays each account's persisted `updatedAt` value in a **Last updated** column. The UI and date formatting are in `src/AdminDashboard.jsx`, with the table layout and timestamp styling in `src/styles.css`.
- Local preview users in `src/main.jsx` receive `updatedAt` when created and whenever their status changes, matching the real API behaviour in `api/src/lib/userStore.js`.
- Verification after this update: `npm test` passes all suites, and `npm run test:e2e` passes all 46 customer-journey checks against the local Stripe and email stubs. A real-browser pass also confirmed the registration email handoff, Sonia chat focus, Design & Technology selected styling, Exam timer start/reset confirmation, and Review menu alignment. `npm run build` passes with Vite's existing large-chunk size warning.

When finishing future work, update the date, replace or extend the latest-change notes, and record the verification command that passed. Do not remove older project documentation or overwrite unrelated working-tree changes while doing so.

## Cheapest Azure shape

Use this setup first:

| Layer | Azure resource | Cost posture |
| --- | --- | --- |
| Frontend | Azure Static Web Apps Free | Free hosting for a small personal app |
| Backend | Managed Functions inside Static Web Apps | No separate Function App required |
| Model | Azure AI Foundry deployment of `gpt-6-luna`, with `gpt-5-nano` as the automatic backup | Luna costs about twice nano's input price and 1.25 times its output price; nano answers whenever Luna is throttled, unavailable or returns nothing |
| App data | Azure Table Storage on Standard LRS | Low-cost per-operation storage for access, attempts, mastery, and worked examples |
| Billing | Stripe Checkout and customer portal | Transaction fees apply to successful payments |
| Email | Azure Communication Services Email | Consumption-priced signup email delivery |
| Secrets | Static Web Apps application settings | Keeps keys out of browser code and Git |

The backend also supports `DefaultAzureCredential`, but managed identity is better suited to a separate Azure Functions app. Start with the Free Static Web Apps path, then upgrade only when you need production controls, managed identity, private networking, or an SLA.

## Architecture

```text
Browser
  -> React app in src/
  -> POST /api/tutor
Managed Azure Function in api/
  -> Azure AI Foundry OpenAI-compatible /responses endpoint
```

See [the detailed Azure architecture](docs/azure-architecture.md) for the resource diagram, request flow, credential handling, and upgrade path.

See [the curriculum model](docs/curriculum-model.md) for catalogue structure, GCSE mappings, source material, and validation notes.

The frontend never receives Azure credentials, API keys, or model tokens. It only sends the selected curriculum context and the student's question to the backend.

## User access

Users sign in with a Google or Gmail account through Google Identity Services. The administrator dashboard maintains an application access roster in Azure Table Storage; adding an email grants tutor access after that person signs in, while deactivating or removing it blocks tutor requests.

Set `ADMIN_EMAILS` to a comma-separated list of initial administrator Gmail addresses. These addresses can manage the roster but are never exposed to the frontend. The dashboard controls Education Hub access; it does not create or delete Google accounts.

## Google sign-in setup

Create an OAuth 2.0 Web application in Google Cloud Console and add the local and deployed site addresses as authorised JavaScript origins. Use the same client ID in both settings below:

```text
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

`VITE_GOOGLE_CLIENT_ID` is public configuration compiled into the frontend. Supply it to the GitHub Actions build environment. Store `GOOGLE_CLIENT_ID`, `ADMIN_EMAILS`, and storage/model configuration in Static Web Apps application settings. A Google client secret is not required for this ID-token flow.

## Features

- KS3 and KS4/GCSE stage switcher
- Maths, Science, English, History, Geography, Computing, and Design & Technology topic paths
- Learning goals and outcome checklists
- Register first, then subscribe: an account is created before payment, and learner setup happens in the app straight after checkout rather than through an emailed link
- Per-subject GCSE exam board selection at signup, so a learner can sit AQA in one subject and Edexcel in another
- Short initial diagnostic of up to five questions with topic-level strengths, development areas, and next steps
- Personalised topic ordering that places priority areas first while retaining the complete curriculum
- Evidence-gated grade predictions; no grade is displayed before at least 15 assessment checks
- Broad curriculum catalogue with 240 modules and 1,510 outcomes across Years 7-11, validated against the DfE subject content and the AQA specifications
- Authored explanations, key ideas and formulae for every one of the 240 topics, served from storage so the model is never asked to write the core teaching text
- Automatic year, GCSE exam-board, tier, subject, and unit filtering, with tiering applied only to the tiered qualifications
- `npm run validate:curriculum` enforcing catalogue structure, tiering, board coverage and authored-content coverage as part of `npm test`
- Every subject audited both ways: the catalogue read against the specifications and against real school schemes of work, and each piece of required content searched for across every year; see [the curriculum model](docs/curriculum-model.md#coverage-audits)
- AI tutor chat for explanations, original quiz questions, worked examples, and answer feedback
- Learn, Practice, Exam, and Review modes with Socratic teaching, adaptive questions, timed mark-based work, and spaced retrieval
- Azure Table Storage attempts and mastery records tracking accuracy, confidence, time, and last-practised dates
- Student and parent progress dashboards with subject mastery and support priorities
- Full curriculum tracker showing completed, in-progress, review-due, and not-started topics
- Subject and status filters, topic search, coverage totals, and direct links back into the learning hub
- Administrator dashboard for adding, deactivating, reactivating, and removing application users
- Payments screen listing every subscription with totals, monthly revenue read from Stripe, and a reconcile action that repairs a record when a webhook was missed
- Access continues through a late payment while Stripe retries, and stops when Stripe gives up or the paid period ends
- Safeguarding dashboard recording every message the tutor refused, with per-learner history, guardian contact details, and an email alert to administrators on a safety flag
- One subscription at £14.99 per month, with no free trial, through Stripe-hosted checkout
- Welcome email after confirmed payment through Azure Communication Services, carrying no token and no deadline
- Self-service billing portal, privacy notice, subscription terms, and permanent Education Hub account deletion
- Azure Static Web Apps configuration in `staticwebapp.config.json`
- Server-side Azure AI Foundry integration in `api/src/functions/tutor.js`

## Azure AI settings

Set these in Azure Static Web Apps application settings:

```bash
AZURE_AI_FOUNDRY_ENDPOINT=https://your-foundry-resource.services.ai.azure.com/openai/v1
AZURE_AI_MODEL_DEPLOYMENT=gpt-6-luna
AZURE_AI_FALLBACK_DEPLOYMENT=gpt-5-nano
AZURE_AI_API_KEY=your-server-side-foundry-key
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
ADMIN_EMAILS=admin@example.com
AZURE_STORAGE_CONNECTION_STRING=your-server-side-storage-connection-string
AZURE_STORAGE_USERS_TABLE=EducationHubUsers
AZURE_STORAGE_ATTEMPTS_TABLE=EducationHubAttempts
AZURE_STORAGE_MASTERY_TABLE=EducationHubMastery
AZURE_STORAGE_LESSONS_TABLE=EducationHubLessons
AZURE_STORAGE_SUBSCRIPTIONS_TABLE=EducationHubSubscriptions
AZURE_STORAGE_SIGNUP_INVITES_TABLE=EducationHubSignupInvites
AZURE_STORAGE_PROFILES_TABLE=EducationHubProfiles
AZURE_STORAGE_CONTENT_TABLE=EducationHubContent
AZURE_STORAGE_SAFEGUARDING_TABLE=EducationHubSafeguarding
SAFEGUARDING_ALERT_EMAILS=safeguarding@example.com
SAFEGUARDING_ALERT_COOLDOWN_MINUTES=60
REQUIRE_REVIEWED_CONTENT=false
APP_BASE_URL=https://your-static-web-app.azurestaticapps.net
STRIPE_SECRET_KEY=sk_live_server-side-only
STRIPE_WEBHOOK_SECRET=whsec_server-side-only
STRIPE_PRICE_MONTHLY=price_monthly
AZURE_COMMUNICATION_EMAIL_CONNECTION_STRING=endpoint=https://your-resource.communication.azure.com/;accesskey=server-side-secret
AZURE_COMMUNICATION_EMAIL_SENDER=DoNotReply@your-verified-domain.example
```

Optional for managed identity or local Azure identity flows:

```bash
AZURE_AI_TOKEN_SCOPE=https://ai.azure.com/.default
```

Do not commit `.env`, `api/local.settings.json`, or real keys.

## Subscription setup

Create one Stripe product with a single monthly recurring price of £14.99 and no trial, then copy that price ID into `STRIPE_PRICE_MONTHLY` above. Configure a Stripe webhook for `https://your-static-web-app.azurestaticapps.net/api/billing/webhook` and subscribe it to `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, and `customer.subscription.deleted`.

The frontend never handles card details. It creates an authenticated checkout request and redirects to Stripe Checkout. Configure the Stripe customer portal so account holders can update payment details and cancel.

## Running the whole flow locally

Stripe and Azure Communication Services are the only two paid services the signup
path touches, and `npm run stubs` stands in for both. The stub settings live in
`api/local.settings.json`, which is not committed, so nothing here reaches a
deployed environment. The Stripe and email overrides they switch on are refused
unless the Functions host is running in Development.

```bash
npm run stubs        # Stripe on 4242, email on 4243
npm run dev:all      # Azurite, the API on 7071, the site on 5173
```

Then open http://127.0.0.1:5173 and use it: register, set the learner up, choose
a free topic, subscribe, start learning. The Stripe stub has no card form, so "Continue to secure
payment" returns straight to the app - and, like Stripe, it then delivers the
signed `checkout.session.completed` webhook, which is what actually activates the
subscription. It arrives a beat late on purpose, so the "Confirming your
subscription" screen is exercised rather than skipped.

Everything either stub receives is written to `api/scripts/.stub-log.json`,
including the full text of every email that would have been sent - the welcome
receipt and any safeguarding alert.

To walk the same flow without a browser:

```bash
npm run test:e2e
```

It registers an account, checks that the tutor is refused before learner setup,
completes learner setup before payment, and walks the free trial: no topic is
served until one is chosen, the choice is limited to the learner's year and cannot
be changed, the free topic is served while every other topic, the tutor outside it
and the placement check are refused. It then creates a checkout session, delivers
a signed Stripe webhook (and checks an unsigned one is rejected), checks that setup
carried over and every topic opened, serves an authored explanation and a stored
practice question, records an attempt, and
confirms the tutor guard blocks an unsafe message and that a learner cannot read
safeguarding flags. The run is repeatable: it clears the previous account first.
Set `E2E_EMAIL` to use a particular address, and `E2E_BASE` to point at a
different host (`http://127.0.0.1:5173/api` goes through the site).

Storage, authentication, the curriculum content, the tutor guard and the model are
all real in that run. Only Stripe and the email service are stubbed.

## Registration flow

1. **Register or sign in** on the combined account screen, with a username and password or a Google account. A sign-up handed over from the website can start free (the set-password link is emailed straight away) or subscribe at once (the link follows payment).
2. **Learner setup** opens in the app once the email address is confirmed, paid or not: parent or guardian contact details, the student's name, date of birth and school, the immutable Year 7-11 selection, and per-subject exam boards from Year 9.
3. **The free week.** An account that has never paid gets one free trial, with no card. Every topic in the learner's year is listed, and the learner chooses one to study free for `TRIAL_DAYS` (default 7) days from the moment of choosing: its lessons, worked examples, practice and exam questions, progress, and up to `TRIAL_MODEL_CALLS_PER_DAY` (default 20) tutor replies a day that reach the model. The choice cannot be changed and the week cannot be restarted. The placement check and every other topic need the subscription. When the week ends, everything locks and the app shows only the subscription page. An account that has paid before gets no trial.
4. **Subscribe** at £14.99 per month through Stripe checkout, from the "Unlock every topic" prompts or once the week ends. The subscription itself has no trial period, so the first payment is taken immediately. Setup and progress carry over.

Paid and trial are kept apart. Whether an account has paid is Stripe's `status` on the subscription row, written only from Stripe's events. The trial is the app's own `freeTopicId`, `trialStartedAt` and `trialEndsAt`, set in one write when the topic is chosen. `getLearningAccess()` is the one place they are combined: `allowed` (paid, every topic), `trial` (never paid, week not over, one topic) or `trialEnded`. The routes that serve a topic (content, narration, progress, tutor) admit a trial only for its free topic through `mayStudyTopic()`, and answer an expired one with `code: "trial-ended"`, on which the app switches to the subscription page. Any route that does not opt in stays closed to a trial. The topic is chosen with `POST /api/billing/free-topic`, which takes only a topic in the learner's own year and keeps the first choice.

Stripe returns the customer before its webhook necessarily has, so the app waits and re-checks the subscription rather than showing the free trial to somebody who has just paid.

Learner setup used to happen through a one-time signup link emailed after payment, valid for 48 hours. That put a deadline and a spam filter between a paying customer and the product. The `/api/signup/{token}` route still accepts any link already sent, but no new invitations are issued.

The displayed GBP prices are product copy; the Stripe price objects are the billing source of truth. Confirm the final pricing, tax treatment, privacy wording, parental-consent flow, and UK consumer requirements with qualified legal and tax advisers before launch.

## Progress recording

Attempts are recorded automatically from the tutor's own marking in Practice and Exam mode, server-side, so the client never supplies an accuracy figure. Time on task and engagement are recorded for every mode and never touch a mastery score, and an automatically recorded attempt carries no confidence value rather than an invented one.

See [progress recording](docs/progress-recording.md) for what is observable, and what is deliberately left empty.

## Content review

Curriculum content is written by a model and read by children, so an administrator can approve or reject every stored row before learners see it. Set `REQUIRE_REVIEWED_CONTENT=true` to serve approved content only, in which case a miss returns "waiting to be approved" rather than generating more unapproved content.

Batches can be cleared without clicking through them:

```bash
npm run review:content -- --year 10 --subject Maths --type practice --sample 5
npm run review:content -- --year 10 --subject Maths --type practice --approve
```

See [content review](docs/content-review.md) for the review states and the rollout sequence.

## AI tutor guardrails

Every learner message is checked server-side before any model call: safety, prompt injection, academic integrity, and topic relevance. Blocked and redirected messages never reach the model, so they cost nothing and return in tens of milliseconds, and the model is given explicit scope rules for the cases the deterministic rules deliberately allow through. Learn-mode questions are also answered from stored study material when it already covers them.

See [the tutor guardrails](docs/tutor-guardrails.md) for the layers, the verdicts, and the known limits.

## Curriculum content routing

Topics, units, and outcomes stay in `src/data/curriculumCatalog.js`, where they are version-controlled and reviewable in a pull request. The lesson content built on top of them lives in Azure Table Storage, and a routing layer decides per request whether to answer from storage or from the model.

[`api/src/lib/contentPolicy.js`](api/src/lib/contentPolicy.js) holds the whole decision in one table, so the behaviour is auditable rather than scattered through request handlers:

| Content | Subject | Route | Behaviour |
| --- | --- | --- | --- |
| Explanation | every subject | `stored` | Served from storage only. Authored curriculum text, never generated. A miss returns 404 and asks for the seeding step, rather than inventing content. |
| Worked example | every subject | `stored-first` | Served from storage, generated by the model only when nothing is stored, then persisted so the next learner is free. |

Content is stored once and shared by every learner, so model spend is proportional to the size of the curriculum rather than to learners or page views. Years 10 and 11 keep an example per tier, because Foundation and Higher differ in demand; Years 7 to 9 share one example per sub-topic.

Maths worked examples are requested as LaTeX between single dollar signs and typeset in the browser with KaTeX, so working appears with real fractions, indices, and roots. Every other subject stays plain prose. Anything the typesetter cannot parse falls back to the original text rather than failing.

#### What a worked example has to satisfy

Steps that read perfectly well one at a time can still fail to answer the question. Reading a sample of stored examples found a defect in roughly a third of them, so [`api/src/lib/workedExample.js`](api/src/lib/workedExample.js) both instructs against each fault and refuses the content when the instruction does not hold:

- the question carries everything needed to answer it — an example asking a learner to compare "Text A and Text B" without the texts is unanswerable however good its steps are
- every number in a step is given in the question or worked out in an earlier step, so a method that subtracts an evapotranspiration nobody stated cannot be stored
- the answer is the answer, not a description of what a student could do
- no step promises its content will appear somewhere else
- the question is one a learner can finish on paper, not a brief to build a model or run software

These are refusals, not warnings: a refused example is logged and left unstored, so seeding writes it again rather than a learner being shown it.

The rules are enforced ahead of generation; what was already stored had to be found by reading it. Rules alone were not enough: measured against a sample marked by hand, the deterministic checks and a model sweep each caught about half the faults, and between them missed the ones that matter most — a question that cannot be answered as posed, an answer that addresses a different question, a step inserted for no reason. The faults that reached stored content included a Year 7 lesson on using a Bunsen burner safely that told a pupil to hold a beaker near the flame, a Year 7 lesson on pollination in which bees fertilise the ovule, and an English example closing "Yours faithfully" to a named recipient. A model sweep also has no concept of "correct but above the specification": it wanted the bromohydrin that aqueous bromine really produces in a Year 10 example, where every UK specification teaches the dibromide. Nothing here replaces reading the content.

One constraint is easy to miss: **every worked example is read aloud**, and the answer is spoken as "The answer is ...". So an answer can hold no markup, no code and no table — the narrator reads it character by character. Where a question would otherwise be answered with a file, ask instead for the rules or the elements that produce it.

Not every sub-topic warrants a worked example at all. "Write a number as a product of its prime factors" has a method to show; "Identify prime numbers" is a single step, and "Analyse dramatic methods" has no one right answer. Which outcomes qualify is decided per outcome rather than per subject, because a maths topic can contain an outcome with nothing to calculate and a geography topic can contain one that is pure arithmetic. The decision lives in [`src/data/workedExampleOutcomes.js`](src/data/workedExampleOutcomes.js) — **512 of 1,510 outcomes** — and is consulted in three places, because all three have to agree or the decision undoes itself: seeding skips those outcomes, the content endpoint serves a 404 rather than generating one on a miss, and the narration script does not count them as gaps waiting to be seeded.

A topic absent from that map keeps every outcome, so adding a topic to the catalogue never silently strips its examples before anyone has classified it.

### Seeding and coverage

```bash
npm run seed:content -- --explanations-only
npm run seed:content -- --year 10 --subject Maths --tier Higher --concurrency 4
npm run seed:content -- --year 7 --dry-run
npm run content:coverage -- --detail
```

Seeding skips anything already stored, so it is safe to re-run and resumable with `--limit`. Locally it reads Azure settings from the ignored `api/local.settings.json`; in Azure it uses the application settings. The coverage report shows how much of each year is stored and how much has been reviewed.

Regenerating replaces content every learner sees, so the "New example" control and the `refresh` flag on `POST /api/content` are restricted to administrators.

Explanations are authored and are written on every seeding run, so editing
`src/data/topicContent/` and re-running `npm run seed:content -- --explanations-only`
updates storage without calling the model at all.

Generated questions are unreviewed model output. The prompt now excludes content
above the specification and the parser refuses a question that echoes the prompt,
carries no working, or points at a diagram the learner cannot see, but pitch still
varies. Seed a year, run `npm run prune:content` to strip anything that breaks the
curriculum rules, review the stored rows, then move on; see
[the curriculum model](docs/curriculum-model.md) for the rules and the corrections
behind them.

## Narrated lessons

A topic can be played as a lesson rather than read: the authored explanation is
broken into beats, narrated, and the key ideas and formulae build up as they are
spoken. Where a topic has authored visuals, those play too. The beat sequence
lives in `src/lessonBeats.js`, which the player, the synthesis script and the API
all share so that the audio recorded matches the beats requested.

The voice is either recorded or the browser's own, never a mixture:

- **Recorded.** One neural voice for every learner, synthesised once and cached
  in Blob Storage. Served through `POST /api/narration`, behind the same access
  check as the lesson, because it reads the paid explanations aloud.
- **Fallback.** The device's own speech synthesis where a topic has not been
  voiced. Quality then depends on what the device has installed, which is the
  problem the recorded voice exists to solve.

```bash
npm run narration:cost                                  # what it would cost to voice everything
npm run narration:synthesise -- --dry-run               # beats and characters, calls nothing
npm run narration:synthesise -- --topic y10-maths-number
npm run narration:synthesise                            # the whole curriculum
```

Audio is keyed by a digest of the **spoken** text and the voice, so editing one
sentence re-synthesises that sentence alone, and correcting the LaTeX-to-words
rules invalidates exactly the beats those rules changed. Re-runs skip anything
already stored; `--force` overrides that.

Settings, alongside the others in `api/local.settings.json` or the Static Web
Apps application settings:

```
AZURE_SPEECH_KEY=your-speech-resource-key
AZURE_SPEECH_REGION=uksouth
AZURE_SPEECH_VOICE=en-GB-SoniaNeural
AZURE_STORAGE_NARRATION_CONTAINER=narration
```

Without `AZURE_SPEECH_KEY` nothing is recorded and every lesson uses the browser
voice, which is a degraded experience rather than a broken one.

Use a **free (F0) Speech resource** for the key. It includes 0.5 million neural
characters a month, always free, and the whole curriculum is about 209,000, so
even a full re-recording fits in one month. Only one F0 resource is allowed per
subscription. Its limits are lower than the paid tier's, which the scripts
absorb by honouring the service's 429 and `Retry-After`; `--concurrency 2` keeps
a large run smooth. Recordings are keyed by text and voice, not by resource, so
moving between Speech resources never invalidates them.

## Limiting model spend

Every call to the model costs money, and a signed-in learner could previously
make them without limit: the tutor guard refuses abusive *content*, but nothing
counted the calls themselves. A leaked session had an uncapped meter attached.

`checkModelBudget()` caps each learner over two windows, counted with the same
conditional write the sign-in limiter uses so the count holds across Functions
instances:

```
MODEL_CALLS_PER_MINUTE=12    catches a script or a stuck retry loop
MODEL_CALLS_PER_DAY=200      catches the slow, patient version
TRIAL_MODEL_CALLS_PER_DAY=20 a free trial's tutor replies, each day
```

Two properties are deliberate. It is checked **only where a call reaches the
model** - reading stored content, a guarded tutor message, and a question
answered from stored material all cost nothing, so a learner revising for hours
is never limited. And it **fails open**: if the table cannot be reached the
lesson still runs, because this protects a budget rather than data, and a
limiter that breaks the product when it breaks is worse than the overspend.

Set either to `0` to disable that window.

## Tests

```bash
npm test
```

Runs every suite. Storage settings are read from the ignored `api/local.settings.json`, so nothing needs an environment variable set by hand. Suites that need the API running are skipped with a message when it is not, so the command is safe to run at any time.

| Suite | Needs the API | Covers |
| --- | --- | --- |
| billing | no | Checkout activation, invitation delivery, replay protection, unpaid and orphan events, mail-outage resilience, lifecycle status changes, Stripe signature verification |
| billing routes | yes | That the Stripe webhook route is reachable and unauthenticated |
| password login | yes | Registration, roles, logout revocation, forged headers, password reset |

The billing suite needs no Stripe account: events are synthetic objects, and signature verification uses Stripe's own `generateTestHeaderString`. Email is injected, so the mail-outage path is exercised without a mailer.

The suite has been checked against deliberate regressions rather than only against passing code. Removing the paid-status check, the replay guard, or the mail-outage handling each makes it fail.

## Local development

Username/password login is now available, including emailed password recovery. See [password login configuration](docs/password-login.md) for the current account flow, session storage, recovery behaviour, and outstanding production setup. The development bypass is disabled by default in this workspace.

Requirements:

- Node.js 22, matching `.nvmrc` and the `engines` field
- Azure Functions Core Tools, if you want to run the API locally
- Azure Static Web Apps CLI, if you want to emulate the deployed app locally

Install frontend dependencies:

```bash
npm install
```

Install backend dependencies:

```bash
npm run install:api
```

Start Azurite, the Functions API, and the Vite frontend together:

```bash
npm run dev:all
```

The application is then available at `http://127.0.0.1:5173`. Vite proxies `/api` requests to the Functions host on port `7071`, and Functions use the Azurite services on ports `10000`-`10002`.

For local testing without Google credentials, open `http://127.0.0.1:5173/?local=1` with the local Functions development bypass enabled. This checks the real server session, opens learner setup, and uses Azurite and Foundry. The query option is disabled in production builds and does not grant access on the server. `?preview=app` continues to use sample responses instead.

To run the services separately:

```bash
npm run dev:storage
npm run dev:api
npm run dev -- --host 127.0.0.1 --port 5173
```

For local user management, set both `AzureWebJobsStorage` and `AZURE_STORAGE_CONNECTION_STRING` to `UseDevelopmentStorage=true` in the ignored Functions local settings. Set `DEV_AUTH_BYPASS=true` only in a local Functions environment; the bypass is ignored unless `AZURE_FUNCTIONS_ENVIRONMENT=Development`.

Run the combined Static Web Apps experience:

```bash
npm run start:swa
```

## Build

```bash
npm run build
```

The production frontend output is written to `dist/`.

## Learner profile privacy

The parent/guardian contact information and student profile are stored in Azure Table Storage after paid signup. The registered school year is immutable and is enforced by the tutor, diagnostic, and progress APIs. A working copy of the learner's curriculum preferences and detailed diagnostic feedback remains in browser local storage. Names, contact details, school, and date of birth are not sent to Azure AI Foundry. Answer text and tutor chats are not persisted in Table Storage.

## Deployment

Two GitHub Actions workflows are included.

`.github/workflows/ci.yml` runs on every push and pull request: it installs both dependency trees, starts Azurite, runs `npm test`, and builds the frontend. Suites that need the Functions host skip themselves, so CI covers the billing logic and the build without running the full stack.

`.github/workflows/azure-static-web-apps.yml` deploys to Azure Static Web Apps on a push to `main`, creates a preview environment for each pull request, and tears that environment down when the pull request closes.

### Repository secrets

| Secret | Purpose |
| --- | --- |
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | Deployment token from the Static Web App, under Manage deployment token |
| `VITE_GOOGLE_CLIENT_ID` | Public configuration compiled into the frontend bundle |

Every other setting is server-side and belongs in Static Web Apps application settings, never in the repository. The build uses these locations, which match the workflow:

```text
App location: /
API location: api
Output location: dist
Build command: npm run build
```

### Node version

The API targets Node 22. `staticwebapp.config.json` sets `"apiRuntime": "node:22"`, both `package.json` files declare `"engines": { "node": ">=22.0.0" }`, and `.nvmrc` pins 22 for version managers and for CI. Node 20 reached end of life in April 2026 and the Functions host warns about it on every start.

Oryx reads the `engines` field when it builds the managed API, so the engines declaration is what actually selects the deployed runtime; the `apiRuntime` setting covers the host.

## Existing Foundry sample

`run_model.py` is kept as a minimal Python smoke test for the same style of Foundry model endpoint.
