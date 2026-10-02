# Going live

The steps between this repository and a public Y7to11.AI that takes real money, in the order to do them, with what it will cost.

Last updated: 2 October 2026

## Where things stand

- **Nothing is deployed.** `main` holds only the initial commit. The work is on `feat/education-hub-application`, 46 commits ahead, with more uncommitted.
- **Some Azure resources already exist:** the email service (`education-hub-email` in `rg-educationhub`), a free F0 Speech resource (`education-hub-speech-free`), the Foundry deployments `gpt-6-luna` and `gpt-5-nano` (`rajkumaraiexpert-0649-resource` in `rg-rajkumar.aiexpert-1140`), and the `education-hub-monthly` budget, which alerts at £20.
- **Still to create:** the Static Web App for the app, another for the marketing site, and the production storage account.
- **The Azure subscription is a Free Trial.** On 1 October it showed the state "Warned", went read-only, and model calls returned 401. It must be upgraded to Pay-As-You-Go before anything else here will work.
- **The content exists only locally.** Every lesson, worked example and narration clip is in Azurite (`.azurite`, 1.8 GB). Production storage starts empty.

## 1. Fix the repository

- [ ] **Pass the Stripe key to the production build.** [stripeCheckout.js](src/stripeCheckout.js) reads `VITE_STRIPE_PUBLISHABLE_KEY`, but [azure-static-web-apps.yml](.github/workflows/azure-static-web-apps.yml) passes only `VITE_GOOGLE_CLIENT_ID` to the build, so checkout would be broken once deployed. Add it to the workflow's `env:` block and as a repository secret.
- [ ] **Point the website at the real app.** [marketing/index.html](marketing/index.html) sets `APP_URL = "http://127.0.0.1:5173"`. Until it is changed to `https://app.y7to11.ai`, every sign-up and log-in button on the public site leads nowhere.
- [ ] **Add security headers.** [staticwebapp.config.json](staticwebapp.config.json) has no `globalHeaders`. For a paid site used by children, add a Content-Security-Policy (allowing Stripe, and Google if sign-in with Google returns), `Strict-Transport-Security`, `X-Content-Type-Options: nosniff` and `Referrer-Policy`.
- [ ] **Record token usage.** [foundry.js](api/src/lib/foundry.js) discards the `usage` block Azure returns, so the cost of a tutor reply is estimated, not measured (see [Costs](#costs)). Log it before launch.
- [ ] **Commit the work in progress and open a pull request into `main`.** Each pull request gets its own preview environment, which serves as staging.
- [ ] **Turn on branch protection for `main`** so CI must pass before a merge. The deploy workflow does not wait for the tests.

## 2. Register the domain

`y7to11.ai` was available on 2 October 2026.

- [ ] **Register it.** About $80 a year at Cloudflare or Porkbun; some registrars ask for two years up front. Cloudflare is the suggested registrar: it sells at cost, includes DNS, and can point the bare domain at a Static Web App.
- [ ] Turn on auto-renew, the registrar lock and two-factor sign-in. If a .ai domain lapses, someone else can register it.
- [ ] Optional: register `y7to11.co.uk` and `y7to11.com` (about £10 each) to stop look-alikes, and search the UK IPO trade mark register for "Y7to11".

### DNS layout

| Name | Points to | Purpose |
| --- | --- | --- |
| `y7to11.ai` and `www` | Marketing Static Web App | The public website |
| `app.y7to11.ai` | App Static Web App | The app; the trial-reminder workflow already expects this address |
| Verification TXT, SPF, two DKIM CNAMEs, DMARC | Azure Communication Services | Lets `DoNotReply@y7to11.ai` send receipts, password resets and trial reminders without landing in spam |
| MX | A mailbox provider | Receives mail for `hello@` and `support@`, which the marketing site already shows |

Nothing receives `hello@` or `support@` yet. Cloudflare Email Routing forwards them to an existing inbox for free; Google Workspace or Microsoft 365 (about £5–6 per mailbox a month) are needed to reply as `support@y7to11.ai`. The domain must have a single SPF record naming both Azure Communication Services and the mailbox provider.

## 3. Create the Azure resources

All in one UK region, after the subscription is on Pay-As-You-Go.

- [ ] **Static Web App for the app, Free plan.** Microsoft labels Free "for personal projects", but nothing restricts a paid service to Standard, and the app fits within Free's limits (see below).
- [ ] **Check the slowest model call against the timeout.** Managed functions appear to stop a request at about 45 seconds. A slow Luna attempt, its retry, then the fallback to nano could approach that.

### Starting on the Free plan

| Free plan limit | This app |
| --- | --- |
| 250 MB per environment | The built site is 6.5 MB |
| 2 custom domains | The app needs only `app.y7to11.ai`; the marketing site is a separate app with its own two |
| Managed functions, HTTP triggers only | Already built around this; the trial emails run from a GitHub Actions schedule |
| Built-in sign-in providers only | Unaffected: sign-in is the app's own password login |
| No managed identity | Unaffected: keys are kept in application settings |

What Free gives up:

- **No SLA and no formal support.** An Azure outage carries no promise from Microsoft.
- **100 GB of bandwidth a month, shared by the whole subscription, with no paid overage.** Microsoft does not say what happens at the cap. Narration is the main use, at about 360 KB per minute of audio; at about five hours of listening per learner a month, the cap is reached at roughly 900 active learners, sooner if the marketing site is in the same subscription. Audio is marked cacheable, so replays do not count again.
- **3 preview environments rather than 10**, so no more than three pull requests with preview sites at once.

**Move to Standard** (about £7 a month) when either of these happens:

- an outage would cost enough paying parents that the SLA and support are worth having, or
- bandwidth passes about 70 GB a month (data transfer is shown under Metrics in the portal).

Switching takes Settings → Hosting plan → Standard in the portal, with no redeploy. Standard raises the preview environments to 10, adds paid bandwidth beyond 100 GB at $0.20 per GB, and allows a separate Function App later, which brings managed identity and timer triggers. Some users report that each preview environment is billed as another $9 on Standard; check before leaving many pull requests open.
- [ ] **Static Web App for the marketing site**, Free plan, serving `marketing/`. No workflow deploys it yet.
- [ ] **Storage account**, Standard LRS, for the tables and the `narration` blob container.
- [ ] **Application Insights**, connected to the app's Static Web App. There is no production monitoring at present. The first 5 GB of logs a month are free.
- [ ] **Verify `y7to11.ai` in Azure Communication Services**, using the DNS records above.
- [ ] **Raise the budget alert** once subscribers arrive, to about twice the expected spend, and add one scoped to the Foundry resource.

## 4. Copy the content to production

- [ ] Write a one-off script that copies the `EducationHubContent` table and the `narration` blob container from Azurite to the new storage account. Do **not** copy the learner tables (users, auth, profiles, subscriptions, attempts, mastery, lessons, safeguarding, support): they hold local test accounts.
- [ ] Re-run the narration dry runs against production storage, which has never been checked:

  ```bash
  node api/scripts/synthesise-narration.mjs --dry-run --report-tag coverage-check-production
  node api/scripts/synthesise-examples.mjs --dry-run
  ```

## 5. Application settings

Set these in the app's Static Web App, under Settings → Environment variables. They are server-side and never belong in the repository.

| Setting | Value |
| --- | --- |
| `APP_BASE_URL` | `https://app.y7to11.ai` |
| `ADMIN_EMAILS` | Administrator addresses, comma-separated |
| `AZURE_AI_FOUNDRY_ENDPOINT` | The Foundry `/openai/v1` endpoint |
| `AZURE_AI_API_KEY` | The Foundry key |
| `AZURE_AI_MODEL_DEPLOYMENT` | `gpt-6-luna` |
| `AZURE_AI_FALLBACK_DEPLOYMENT` | `gpt-5-nano` |
| `AZURE_STORAGE_CONNECTION_STRING` | The production storage account |
| `AZURE_COMMUNICATION_EMAIL_CONNECTION_STRING` | The email service |
| `AZURE_COMMUNICATION_EMAIL_SENDER` | `DoNotReply@y7to11.ai` |
| `STRIPE_SECRET_KEY` | `sk_live_…` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_…` from the live webhook |
| `STRIPE_PRICE_MONTHLY` | The live £14.99 price ID |
| `TRIAL_REMINDER_KEY` | A random value of 32 characters or more |
| `SAFEGUARDING_ALERT_EMAILS` | Who is told when the tutor blocks a safety message (falls back to `ADMIN_EMAILS`) |
| `SUPPORT_ALERT_EMAILS` | Who is told about support tickets (falls back to `ADMIN_EMAILS`) |
| `REQUIRE_REVIEWED_CONTENT` | `true` to serve learners only reviewed content; decide before launch |

Optional, with sensible defaults: `TRIAL_DAYS` (7), `MODEL_CALLS_PER_MINUTE` (12), `MODEL_CALLS_PER_DAY` (200), `TRIAL_MODEL_CALLS_PER_DAY` (20), `SAFEGUARDING_ALERT_COOLDOWN_MINUTES` (60), and the `AZURE_STORAGE_*_TABLE` names. `GOOGLE_CLIENT_ID` is needed only if Google sign-in returns.

**Never set in production:** `DEV_AUTH_BYPASS`, `STRIPE_API_BASE`.

### GitHub repository secrets

| Secret | Value |
| --- | --- |
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | The app's deployment token |
| `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_live_…` |
| `VITE_GOOGLE_CLIENT_ID` | Only if Google sign-in returns |
| `APP_BASE_URL` | `https://app.y7to11.ai`, for the trial-reminder workflow |
| `TRIAL_REMINDER_KEY` | The same value as the app setting |

## 6. Stripe live mode

- [ ] Confirm the test secret key that was pasted into a chat session has been rolled ([STRIPE_INTEGRATION_TODO.md](STRIPE_INTEGRATION_TODO.md)).
- [ ] Create the live product and its £14.99 monthly price, with no trial on the price (the trial is set at checkout).
- [ ] Create the live webhook at `https://app.y7to11.ai/api/billing/webhook` for `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated` and `customer.subscription.deleted`.
- [ ] Configure the customer portal so parents can update their card and cancel.
- [ ] Set the statement descriptor (the name parents see on their bank statement) to `Y7TO11.AI`.

## 7. Before taking real money

- [ ] **Smoke test.** Point `E2E_BASE` at a staging copy wired to Stripe test mode and run `npm run test:e2e`. Then make one real purchase on the live site and refund it.
- [ ] **Backups.** Table Storage has no point-in-time restore. Schedule an export of the learner and subscription tables.
- [ ] **ICO registration.** The data protection fee is £52 a year for a micro business. It is needed because the service holds children's data.
- [ ] **Data protection impact assessment**, and a check against the Children's Code (the Age Appropriate Design Code).
- [ ] **Legal and tax review** of the terms, privacy notice, parental consent, pricing and VAT, as the README already advises.

## Costs

Figures are in GBP, exclude VAT, and were checked on 2 October 2026.

### Fixed, each month

| Item | Cost |
| --- | --- |
| App Static Web App, Free (Standard, when needed: about £7) | £0 |
| Marketing Static Web App, Free | £0 |
| Storage: about 2 GB of tables and audio, plus requests | under £1 |
| Application Insights, within the 5 GB free allowance | £0 |
| Speech: narration is recorded, and edits fit the free tier | £0 |
| `y7to11.ai` (about $80 a year) | about £5 |
| Mailbox for `support@` (optional; forwarding is free) | £0–6 |
| **Total** | **about £5–11** (about £12–17 on Standard) |

### Each paying subscriber, each month (£14.99)

| Item | Cost |
| --- | --- |
| Stripe card fee, UK cards (1.5% + 20p) | £0.42 |
| Stripe Billing (0.7% of billing volume) | £0.10 |
| Tutor: about 300 replies at roughly 0.1p each | about £0.30 |
| Emails | under 1p |
| **Total** | **about £0.80, leaving about £14.20** |

A trial that does not convert costs at most 14p: 20 replies a day for seven days. Stripe charges nothing when nothing is billed. The heaviest possible learner, at the 200-replies-a-day limit every day, costs about £6 a month, still less than they pay.

### At scale

| Subscribers | Revenue | Running costs | Share of revenue |
| --- | --- | --- | --- |
| 10 | £150 | about £15 | 10% |
| 100 | £1,500 | about £90 | 6% |
| 1,000 | £15,000 | about £800–850 | 5.5% |

The first two rows assume the Free plan. At 1,000 subscribers the narration alone passes Free's 100 GB, so that row assumes Standard, with a few pounds of extra bandwidth.

### What could change these figures

- **VAT.** Once registered (compulsory above £90,000 turnover a year), £2.50 of each £14.99 goes to HMRC, leaving £12.49.
- **The cost per tutor reply is an estimate.** The calls set no reasoning effort, and reasoning tokens are billed at the output price, so the real figure could be two or three times higher. Logging token usage (step 1) settles it.
- **September's £56.66** was build work, mostly recording narration and generating content. It is not a guide to running costs.
- **One-off costs:** copying the content to Azure costs pennies; legal and tax advice is likely to run from a few hundred pounds to the low thousands.

### Sources

- [Azure Static Web Apps plans](https://learn.microsoft.com/en-us/azure/static-web-apps/plans)
- [Azure Static Web Apps quotas](https://learn.microsoft.com/en-us/azure/static-web-apps/quotas)
- [Report of unexpected Static Web Apps charges](https://learn.microsoft.com/en-us/answers/questions/5862727/unexpected-charges-for-azure-static-web-app-began)
- [Azure Communication Services email pricing](https://learn.microsoft.com/azure/communication-services/concepts/email-pricing)
- [Application Insights FAQ](https://learn.microsoft.com/en-us/azure/azure-monitor/app/application-insights-faq)
- [Stripe fees in the UK, 2026](https://www.wearefounders.uk/stripe-fees-uk-2026/)
- [Stripe Billing's 0.7% fee](https://usagebox.com/articles/stripe-billing-fees-2026-the-07-percent-math)
- [.ai domain prices compared](https://domainoffer.net/tld/ai)
