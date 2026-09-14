# Education Hub

An Azure-ready learning hub for KS3, KS4, and GCSE revision. The project includes a React frontend, an Azure Functions backend, and a server-side Azure AI Foundry model call.

## Cheapest Azure shape

Use this setup first:

| Layer | Azure resource | Cost posture |
| --- | --- | --- |
| Frontend | Azure Static Web Apps Free | Free hosting for a small personal app |
| Backend | Managed Functions inside Static Web Apps | No separate Function App required |
| Model | Azure AI Foundry deployment of `gpt-5-nano` | Lowest-cost GPT-5 family default for tutoring |
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
- Maths, Science, English, History, Geography, Computing, and Design Technology topic paths
- Learning goals and outcome checklists
- Paid onboarding with parent/guardian contact details and student name, date of birth, school, and an immutable Year 7-11 selection
- Per-subject GCSE exam board selection at signup, so a learner can sit AQA in one subject and Edexcel in another
- Short initial diagnostic of up to five questions with topic-level strengths, development areas, and next steps
- Personalised topic ordering that places priority areas first while retaining the complete curriculum
- Evidence-gated grade predictions; no grade is displayed before at least 15 assessment checks
- Broad curriculum catalogue with 210 modules and 630 outcomes across Years 7-11
- Automatic year, GCSE exam-board, tier, subject, and unit filtering
- AI tutor chat for explanations, original quiz questions, worked examples, and answer feedback
- Learn, Practice, Exam, and Review modes with Socratic teaching, adaptive questions, timed mark-based work, and spaced retrieval
- Azure Table Storage attempts and mastery records tracking accuracy, confidence, time, and last-practised dates
- Student and parent progress dashboards with subject mastery and support priorities
- Full curriculum tracker showing completed, in-progress, review-due, and not-started topics
- Subject and status filters, topic search, coverage totals, and direct links back into the learning hub
- Administrator dashboard for adding, deactivating, reactivating, and removing application users
- Subscription entry page with immediate monthly or annual payment and Stripe-hosted checkout
- One-time, 48-hour signup link emailed after confirmed payment through Azure Communication Services
- Self-service billing portal, privacy notice, subscription terms, and permanent Education Hub account deletion
- Azure Static Web Apps configuration in `staticwebapp.config.json`
- Server-side Azure AI Foundry integration in `api/src/functions/tutor.js`

## Azure AI settings

Set these in Azure Static Web Apps application settings:

```bash
AZURE_AI_FOUNDRY_ENDPOINT=https://your-foundry-resource.services.ai.azure.com/openai/v1
AZURE_AI_MODEL_DEPLOYMENT=gpt-5-nano
AZURE_AI_API_KEY=your-server-side-foundry-key
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
ADMIN_EMAILS=admin@example.com
AZURE_STORAGE_CONNECTION_STRING=your-server-side-storage-connection-string
AZURE_STORAGE_USERS_TABLE=EducationHubUsers
AZURE_STORAGE_ATTEMPTS_TABLE=EducationHubAttempts
AZURE_STORAGE_MASTERY_TABLE=EducationHubMastery
AZURE_STORAGE_SUBSCRIPTIONS_TABLE=EducationHubSubscriptions
AZURE_STORAGE_SIGNUP_INVITES_TABLE=EducationHubSignupInvites
AZURE_STORAGE_PROFILES_TABLE=EducationHubProfiles
AZURE_STORAGE_CONTENT_TABLE=EducationHubContent
REQUIRE_REVIEWED_CONTENT=false
APP_BASE_URL=https://your-static-web-app.azurestaticapps.net
STRIPE_SECRET_KEY=sk_live_server-side-only
STRIPE_WEBHOOK_SECRET=whsec_server-side-only
STRIPE_PRICE_MONTHLY=price_monthly
STRIPE_PRICE_ANNUAL=price_annual
AZURE_COMMUNICATION_EMAIL_CONNECTION_STRING=endpoint=https://your-resource.communication.azure.com/;accesskey=server-side-secret
AZURE_COMMUNICATION_EMAIL_SENDER=DoNotReply@your-verified-domain.example
```

Optional for managed identity or local Azure identity flows:

```bash
AZURE_AI_TOKEN_SCOPE=https://ai.azure.com/.default
```

Do not commit `.env`, `api/local.settings.json`, or real keys.

## Subscription setup

Create one Stripe product with monthly and annual recurring prices and no trial, then copy their price IDs into the server settings above. Configure a Stripe webhook for `https://your-static-web-app.azurestaticapps.net/api/billing/webhook` and subscribe it to `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, and `customer.subscription.deleted`.

The frontend never handles card details. It creates an authenticated checkout request and redirects to Stripe Checkout. After Stripe confirms successful payment, the signed webhook creates a hashed, one-use signup token and Azure Communication Services emails a 48-hour signup link to the payer. Configure the Stripe customer portal so account holders can update payment details and cancel.

The displayed GBP prices are product copy; the Stripe price objects are the billing source of truth. Confirm the final pricing, tax treatment, privacy wording, parental-consent flow, and UK consumer requirements with qualified legal and tax advisers before launch.

## Progress recording

Attempts are recorded automatically from the tutor's own marking in Practice and Exam mode, server-side, so the client never supplies an accuracy figure. Time on task and engagement are recorded for every mode and never touch a mastery score, and an automatically recorded attempt carries no confidence value rather than an invented one.

See [progress recording](docs/progress-recording.md) for what is observable, and what is deliberately left empty.

## Content review

Curriculum content is written by a model and read by children, so an administrator can approve or reject every stored row before learners see it. Set `REQUIRE_REVIEWED_CONTENT=true` to serve approved content only, in which case a miss returns "waiting to be approved" rather than generating more unapproved content.

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

### Seeding and coverage

```bash
npm run seed:content -- --explanations-only
npm run seed:content -- --year 10 --subject Maths --tier Higher --concurrency 4
npm run seed:content -- --year 7 --dry-run
npm run content:coverage -- --detail
```

Seeding skips anything already stored, so it is safe to re-run and resumable with `--limit`. Locally it reads Azure settings from the ignored `api/local.settings.json`; in Azure it uses the application settings. The coverage report shows how much of each year is stored and how much has been reviewed.

Regenerating replaces content every learner sees, so the "New example" control and the `refresh` flag on `POST /api/content` are restricted to administrators.

Generated examples are unreviewed model output, and pitch varies. Seed a year, review the stored rows, then move on; see [the curriculum model](docs/curriculum-model.md) for the review state that is still missing.

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
