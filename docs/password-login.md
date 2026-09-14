# Username and password login

Open http://127.0.0.1:5173/ to use Log in or Sign up. The local development bypass is disabled. New registrations create parent accounts with no learning entitlement; subscription payment and the emailed learner-setup invitation remain required. Signup now creates credentials before checkout; student details and the permanent school year are collected after payment.

Passwords require 15-128 characters at registration. The server stores salted scrypt hashes (N=32768, r=8, p=3) in EducationHubAuth. Random session tokens are stored as SHA-256 hashes and delivered in HttpOnly, SameSite=Strict cookies, with Secure enabled outside local Development. Sessions expire after eight hours and logout removes the server record. No password or session token is stored in browser local storage.

Login attempts are limited to ten per username per fifteen-minute window using conditional Table writes. New accounts cannot select an elevated role. Completing the emailed paid invitation verifies email ownership, resets the account password and revokes existing sessions. Only verified password accounts whose email appears in ADMIN_EMAILS receive administrator access. Existing Google accounts need a credential migration process; they cannot be claimed through public registration.

Azure deployment requires AZURE_STORAGE_CONNECTION_STRING (or the existing managed-identity storage setting), plus the optional AZURE_STORAGE_AUTH_TABLE (default EducationHubAuth). Never enable DEV_AUTH_BYPASS in production. Stripe and email delivery must be configured to complete onboarding. Separate linked student credential provisioning is still pending.

## Password recovery

Log in offers "Forgot your password?", which posts the account email to `/api/auth/forgot`. Every well-formed request returns 202 whether or not the email matches an account, so the endpoint cannot be used to discover which addresses are registered. Requests are limited to five per email per fifteen-minute window using the same conditional Table writes as login. Storage and delivery faults are logged server-side and still return 202, so a misconfigured mailer looks identical to an unknown address in the response; check the Function logs for `Password reset request failure` when links are not arriving.

A matching account gets a 32-byte random token, stored only as a SHA-256 hash in EducationHubAuth with a one-hour expiry. Issuing a new token revokes any earlier unused one for that account. Azure Communication Services emails `APP_BASE_URL/?reset=<token>`, and because sign-in uses a username rather than the email address, the message also states the account username.

`/api/auth/reset` takes the token and a new 15-128 character password. It deletes the token row conditionally on its ETag before writing the password, so a replayed link cannot reset the account twice; an invalid, expired, or already-used token returns 410. A completed reset rehashes the password with a fresh salt, revokes every session and outstanding reset token for the account, and clears the caller's session cookie, so all devices must log in again. Recovery deliberately does not set `emailVerified`; only the paid signup invitation does, which keeps administrator eligibility tied to that flow.

Password recovery therefore depends on AZURE_COMMUNICATION_EMAIL_CONNECTION_STRING, AZURE_COMMUNICATION_EMAIL_SENDER, and APP_BASE_URL. Without them the reset request is accepted and logged but no link is delivered.

The backend retains Google token verification for existing clients, but the application login screen uses username and password. It no longer accepts caller-supplied x-ms-client-principal headers as authentication.

Run the integration check with Azurite and Functions running:

```powershell
$env:AZURE_STORAGE_CONNECTION_STRING='UseDevelopmentStorage=true'
node api/scripts/test-password-login.mjs
```

The check creates a temporary account, verifies login and role restrictions, tests logout revocation and forged-header rejection, then exercises password recovery end to end: reset requests are accepted for known and unknown emails, a token works once, the old password stops working, and existing sessions are revoked. It deletes its credentials and user record afterwards. The recovery steps call `createPasswordReset` directly rather than reading a mailbox, so they pass without email delivery configured.
