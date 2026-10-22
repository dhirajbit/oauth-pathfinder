# Spot-check verification (2026-10-23)

Three of the most consequential numeric / policy claims per guide were checked against the URL cited in `evidence.sources`. Pages were read with a plain fetcher where possible; `developer.salesforce.com` returns HTTP 403 to plain fetchers and curl, so a rendering fetcher was used. Result key: CONFIRMED (page says exactly this), CORRECTED (value changed in the JSON), COULD_NOT_VERIFY (moved to `evidence.unverified`).

Totals: 12 claims checked, 11 CONFIRMED, 1 CORRECTED, 0 COULD_NOT_VERIFY.

## google-workspace.json

| Claim | Source | Result | Note |
| --- | --- | --- | --- |
| Testing mode: max 100 test users; refresh tokens / authorizations expire 7 days after consent; unverified-app 100-user cap is lifetime and cannot be reset | https://support.google.com/cloud/answer/15549945 | CONFIRMED | "limited to up to 100 test users"; "Authorizations by a test user will expire seven days from the time of consent"; "100 new users in total ... applies over the entire lifetime of the project, and it cannot be reset or changed". Name/email/profile-only apps are exempt from the 7-day expiry, as the guide already says. |
| Review durations: brand 2-3 business days, sensitive 10 business days (FAQ) / 3-5 business days (process page), restricted 6 weeks | https://support.google.com/cloud/answer/13463817 and .../sensitive-scope-verification | CONFIRMED | FAQ table has exactly these three figures with "these estimates are not guaranteed"; the process page says "typically takes 3-5 business days". The guide's both-numbers wording is right. |
| CASA: $500-$4,500 USD, 2-3 weeks tier-2 / 4-6 weeks tier-3, annual; verdict.approvalWait.maxDays = 60 | https://developers.google.com/health/app-verification | CORRECTED | Fee range, durations and annual cadence confirmed verbatim. But maxDays 60 did not match the documented upper bound used in the note (6 weeks review + 3 weeks tier-2 CASA = 63 days). Changed `approvalWait.maxDays` 60 -> 63 and spelled out the arithmetic in the note. handsOnMinutes 20-90 is not on any page (judgement, left as is). |

## slack.json

| Claim | Source | Result | Note |
| --- | --- | --- | --- |
| Marketplace review: preliminary up to 10 business days; functional up to 10 weeks new / 6 weeks for published-app resubmissions; approvalWait = none | https://docs.slack.dev/slack-marketplace/slack-marketplace-review-guide | CONFIRMED | All three figures quoted verbatim. Nothing on the page suggests any review for unlisted distribution, consistent with approvalWait.required = none. |
| Token rotation: 12-hour tokens (expires_in 43200), single-use refresh tokens, cannot be turned off | https://docs.slack.dev/authentication/using-token-rotation | CONFIRMED | "always expire in 43,200 seconds, which is 12 hours"; "Refresh tokens are designed to be used once"; "Token rotation may not be turned off once it's turned on". |
| Listing threshold: 10+ active workspaces AND 10+ weekly active users; Tier 1 history limit (1 req/min, 15 messages) since 2025-05-29; config token 12 h | review guide, guidelines page, 2025-05-29 changelog, app-manifests page | CONFIRMED | Review guide states only the 10-workspace rule (28-day active window); the 10 weekly-active-users figure appears only on the guidelines page ("installed on less than 10 active workspaces and have less than 10 weekly active users"), which the prerequisite already cites. Changelog: Tier 3 -> Tier 1, "1 request per minute", limit max/default 15, effective May 29, 2025 for new apps/new installs. Config token: "expire 12 hours after it has been generated". No text changes needed; added tested lines noting which page carries the WAU figure. |

## salesforce.json

| Claim | Source | Result | Note |
| --- | --- | --- | --- |
| AppExchange security review: 1-2 weeks intake, 3-4 weeks first test, 2-3 weeks retest; free solutions pay no fee; approvalWait maxDays 42 | https://developer.salesforce.com/docs/atlas.en-us.packagingGuide.meta/packagingGuide/security_review_how_it_works.htm | CONFIRMED | Turnaround table matches exactly, flagged as estimates; "If you plan to distribute your solution for free, you don't pay the fee". No fee amount on the page (USD 999 claim stays in unverified). The source note previously said the figures were "seen via search snippet"; updated to say the page was read directly. |
| Connected-app creation restricted as of Spring '26; use External Client Apps; contact Support to keep creating connected apps | https://developer.salesforce.com/docs/platform/api-rest/guide/intro-oauth-and-connected-apps.html | CONFIRMED | Important box quoted verbatim. |
| 90-day refresh-token recommendation; emailed verification code before consumer key/secret is shown; http://localhost callback accepted; API on by default in Enterprise/Performance/Unlimited/Developer, Professional needs add-on, API_DISABLED_FOR_ORG | sfdx-dev-auth-eca.html and intro-rest-compatible-editions.html | CONFIRMED | "Setting a maximum of 90 days for the refresh token expiration is a security best practice"; "Check your email for a verification code"; callback example http://localhost:1717/OauthRedirect; editions sentence verbatim. |

## dropbox.json

| Claim | Source | Result | Note |
| --- | --- | --- | --- |
| 50 linked users starts a two-week window to obtain Production approval or linking freezes; 500-user Development cap; Enable additional users; Request early review | https://docs.dropboxapi.com/dropbox-api/docs/developer-resources/developer-guide | CONFIRMED | All quoted verbatim. The guide is silent on whether access type can be changed later. |
| Production review answered "within a few business days"; not reviewed until 50 users linked; name cannot be changed by you after Production (support ticket) | https://www.dropbox.com/developers/support | CONFIRMED | Verbatim. approvalWait maxDays 10 is a reasonable envelope for "a few business days"; left as is. |
| App folder vs Full Dropbox access type cannot be changed after creation | https://www.dropboxforum.com/.../td-p/152212 | CONFIRMED | URL 301-redirects to community.dropbox.com; the staff reply (Greg-DB) says "It's not currently possible to switch the permission on an existing app". Source URL updated to the live community.dropbox.com address (3 occurrences). Also re-confirmed the official OAuth guide gives no numeric token lifetime and no HTTPS/localhost rule, so those items correctly remain in unverified. |

## What we learned

- Primary-source numbers held up well: every duration, cap and cost that was attributed to an official page was on that page verbatim. The research agent's habit of quoting the page rather than paraphrasing paid off.
- The one correction was a derived number, not a sourced one: `approvalWait.maxDays` was a rounded sum (60) that did not match the two documented figures it was built from (6 weeks + 3 weeks = 63 days). Numbers that are computed from other numbers deserve a second look even when the inputs are right.
- Docs were silent exactly where the guides already said so: Dropbox never publishes the access-token lifetime, Slack never mentions a localhost redirect exception, Google's Calendar page prints no sensitivity labels, Salesforce prints no security-review fee amount. These stay in `evidence.unverified`; nothing silent was accidentally promoted to a fact.
- Several claims only exist on a secondary page or in a community thread, not on the "main" page a reader would expect: Slack's 10 weekly-active-users threshold is on the guidelines page, not the review guide; Dropbox's access-type immutability is only a staff forum reply; Google's CASA cost lives on a Health-API page. A reader who checks only the obvious page would call these unsourced.
- Vendor sites are not equally fetchable: developer.salesforce.com returns 403 to curl/plain fetchers, help.salesforce.com needs JS rendering, and the Dropbox forum domain moved (301). Verification tooling needs a rendering fetcher and should record the final URL, not the one originally cited.
- Claims that can only be settled by actually registering an app: the Salesforce "2-10 minute" consumer-key propagation delay, Dropbox's real expires_in value (14400s), current Dropbox App Console labels ("Scoped access"), whether Slack silently accepts http://localhost redirect URLs, and the Calendar per-scope sensitivity labels shown only inside the Google Cloud Console. None of these were changed; they remain marked unverified.
- Vendor time estimates are consistently hedged ("not guaranteed", "estimates", "nearly all"), so `approvalWait.maxDays` should be read as documented upper bounds, not SLAs; community-reported worst cases (Google 2-3 months with CASA remediation) are still only in vendor blogs.
