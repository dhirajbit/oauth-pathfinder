/**
 * The 100-app library index. Every entry supports OAuth 2.0 for user connections.
 *
 * `tier` is a quick triage estimate (what a developer should expect before
 * reading a full guide). It is upgraded to a full, sourced guide when a
 * `data/guides/<slug>.json` exists (hand-researched + verified) or when a
 * developer generates one live. `managed` mirrors Composio's managed-auth
 * directory (docs.composio.dev/toolkits/managed-auth, read 2026-10-23).
 */
export type Tier = "easy" | "moderate" | "hard" | "very-hard";

export interface CatalogEntry {
  slug: string;
  name: string;
  website: string;
  category: string;
  composioSlug?: string;
  managed: boolean;
  tier: Tier;
  /** One line: the thing that decides difficulty for this app. */
  hook: string;
}

const E = "easy", M = "moderate", H = "hard", V = "very-hard";

export const CATALOG: CatalogEntry[] = [
  // ---- Productivity / docs ----
  { slug: "google-workspace", name: "Google Workspace (Gmail, Calendar, Drive)", website: "https://developers.google.com", category: "Productivity", composioSlug: "GMAIL", managed: true, tier: H, hook: "Restricted scopes need verification + CASA security assessment; testing mode caps 100 users" },
  { slug: "microsoft-graph", name: "Microsoft 365 (Outlook, OneDrive, Teams)", website: "https://learn.microsoft.com/graph", category: "Productivity", composioSlug: "OUTLOOK", managed: true, tier: M, hook: "Tenant admin consent and publisher verification gate real-world installs" },
  { slug: "notion", name: "Notion", website: "https://developers.notion.com", category: "Productivity", composioSlug: "NOTION", managed: true, tier: E, hook: "Public integration is self-serve; users must share pages with it" },
  { slug: "dropbox", name: "Dropbox", website: "https://www.dropbox.com/developers", category: "File storage", composioSlug: "DROPBOX", managed: true, tier: M, hook: "50-user cap in development until production approval" },
  { slug: "box", name: "Box", website: "https://developer.box.com", category: "File storage", composioSlug: "BOX", managed: true, tier: M, hook: "Custom apps need admin authorization in each enterprise" },
  { slug: "confluence", name: "Confluence (Atlassian)", website: "https://developer.atlassian.com", category: "Productivity", composioSlug: "CONFLUENCE", managed: true, tier: M, hook: "OAuth 2.0 (3LO) is self-serve; Marketplace listing reviewed" },
  { slug: "jira", name: "Jira (Atlassian)", website: "https://developer.atlassian.com", category: "Project management", composioSlug: "JIRA", managed: true, tier: M, hook: "Same 3LO app as Confluence; cloud ID lookup required" },
  { slug: "asana", name: "Asana", website: "https://developers.asana.com", category: "Project management", composioSlug: "ASANA", managed: true, tier: E, hook: "Self-serve OAuth; no review unless app directory listing" },
  { slug: "trello", name: "Trello", website: "https://developer.atlassian.com/cloud/trello", category: "Project management", composioSlug: "TRELLO", managed: true, tier: E, hook: "Power-Up admin portal; OAuth 1.0a style authorize flow" },
  { slug: "clickup", name: "ClickUp", website: "https://clickup.com/api", category: "Project management", composioSlug: "CLICKUP", managed: true, tier: E, hook: "Create app in workspace settings; tokens don't expire" },
  { slug: "monday", name: "monday.com", website: "https://developer.monday.com", category: "Project management", composioSlug: "MONDAY", managed: true, tier: E, hook: "Self-serve developer center; marketplace review optional" },
  { slug: "linear", name: "Linear", website: "https://linear.app/developers", category: "Project management", composioSlug: "LINEAR", managed: true, tier: E, hook: "OAuth app from workspace settings; no review" },
  { slug: "todoist", name: "Todoist", website: "https://developer.todoist.com", category: "Productivity", composioSlug: "TODOIST", managed: true, tier: E, hook: "App console self-serve; simple scopes" },
  { slug: "ticktick", name: "TickTick", website: "https://developer.ticktick.com", category: "Productivity", composioSlug: "TICKTICK", managed: true, tier: E, hook: "Developer portal; minimal docs" },
  { slug: "airtable", name: "Airtable", website: "https://airtable.com/developers", category: "Databases", composioSlug: "AIRTABLE", managed: true, tier: E, hook: "OAuth integrations self-serve; PKCE required" },
  { slug: "coda", name: "Coda", website: "https://coda.io/developers", category: "Productivity", managed: false, tier: M, hook: "OAuth only for Packs; otherwise API tokens" },
  { slug: "evernote", name: "Evernote", website: "https://dev.evernote.com", category: "Productivity", managed: false, tier: H, hook: "Sandbox key then production key request via email" },
  { slug: "miro", name: "Miro", website: "https://developers.miro.com", category: "Design", composioSlug: "MIRO", managed: true, tier: E, hook: "Self-serve; Marketplace review optional" },
  { slug: "figma", name: "Figma", website: "https://www.figma.com/developers", category: "Design", composioSlug: "FIGMA", managed: true, tier: E, hook: "OAuth app self-serve; scopes are simple" },
  { slug: "canva", name: "Canva", website: "https://www.canva.dev", category: "Design", composioSlug: "CANVA", managed: true, tier: M, hook: "Connect API public release requires Canva review" },
  { slug: "mural", name: "Mural", website: "https://developers.mural.co", category: "Design", composioSlug: "MURAL", managed: true, tier: E, hook: "Self-serve app registration" },
  { slug: "typeform", name: "Typeform", website: "https://www.typeform.com/developers", category: "Forms", composioSlug: "TYPEFORM", managed: true, tier: E, hook: "Self-serve; scoped tokens" },
  { slug: "calendly", name: "Calendly", website: "https://developer.calendly.com", category: "Scheduling", composioSlug: "CALENDLY", managed: true, tier: M, hook: "OAuth app requires a developer account application" },
  { slug: "cal-com", name: "Cal.com", website: "https://cal.com/docs", category: "Scheduling", composioSlug: "CAL", managed: true, tier: E, hook: "OAuth clients via platform plan" },
  { slug: "zoom", name: "Zoom", website: "https://developers.zoom.us", category: "Communication", composioSlug: "ZOOM", managed: true, tier: M, hook: "Unpublished apps limited to your account; publishing needs Marketplace review" },
  { slug: "webex", name: "Webex", website: "https://developer.webex.com", category: "Communication", composioSlug: "WEBEX", managed: true, tier: E, hook: "Self-serve integrations; Hub listing optional" },
  { slug: "slack", name: "Slack", website: "https://api.slack.com", category: "Communication", composioSlug: "SLACK", managed: true, tier: E, hook: "Manifest-based creation; distribution needs no review (Marketplace does)" },
  { slug: "discord", name: "Discord", website: "https://discord.com/developers", category: "Communication", composioSlug: "DISCORD", managed: true, tier: E, hook: "Self-serve; bot verification only past 100 servers" },
  { slug: "microsoft-teams", name: "Microsoft Teams", website: "https://learn.microsoft.com/microsoftteams/platform", category: "Communication", composioSlug: "MICROSOFT_TEAMS", managed: true, tier: H, hook: "Entra app + Teams app package + admin consent" },
  { slug: "whatsapp", name: "WhatsApp Business (Meta)", website: "https://developers.facebook.com/docs/whatsapp", category: "Communication", composioSlug: "WHATSAPP", managed: true, tier: V, hook: "Meta app review, business verification, Tech Provider status" },
  { slug: "telegram", name: "Telegram", website: "https://core.telegram.org", category: "Communication", managed: false, tier: E, hook: "No OAuth app; bot tokens via BotFather" },
  { slug: "intercom", name: "Intercom", website: "https://developers.intercom.com", category: "Support", composioSlug: "INTERCOM", managed: true, tier: M, hook: "Public apps need Intercom app review" },
  { slug: "zendesk", name: "Zendesk", website: "https://developer.zendesk.com", category: "Support", composioSlug: "ZENDESK", managed: true, tier: M, hook: "OAuth client per subdomain; global client needs Zendesk approval" },
  { slug: "freshdesk", name: "Freshdesk", website: "https://developers.freshdesk.com", category: "Support", managed: false, tier: M, hook: "Marketplace app OAuth; API key otherwise" },
  { slug: "help-scout", name: "Help Scout", website: "https://developer.helpscout.com", category: "Support", composioSlug: "HELP_SCOUT", managed: false, tier: E, hook: "Self-serve OAuth app" },
  { slug: "gorgias", name: "Gorgias", website: "https://developers.gorgias.com", category: "Support", composioSlug: "GORGIAS", managed: true, tier: M, hook: "OAuth apps require partner request" },
  // ---- CRM / sales / marketing ----
  { slug: "salesforce", name: "Salesforce", website: "https://developer.salesforce.com", category: "CRM", composioSlug: "SALESFORCE", managed: true, tier: M, hook: "Connected/External Client App; AppExchange listing needs security review" },
  { slug: "hubspot", name: "HubSpot", website: "https://developers.hubspot.com", category: "CRM", composioSlug: "HUBSPOT", managed: true, tier: E, hook: "Developer account; scope/tier mismatch breaks installs" },
  { slug: "pipedrive", name: "Pipedrive", website: "https://developers.pipedrive.com", category: "CRM", managed: false, tier: M, hook: "Developer sandbox; public apps need marketplace review" },
  { slug: "zoho-crm", name: "Zoho CRM", website: "https://www.zoho.com/crm/developer", category: "CRM", composioSlug: "ZOHO", managed: true, tier: M, hook: "Region-specific accounts servers; self-client vs server-based" },
  { slug: "attio", name: "Attio", website: "https://developers.attio.com", category: "CRM", composioSlug: "ATTIO", managed: true, tier: E, hook: "Self-serve OAuth app" },
  { slug: "capsule-crm", name: "Capsule CRM", website: "https://developer.capsulecrm.com", category: "CRM", composioSlug: "CAPSULE_CRM", managed: true, tier: E, hook: "Self-serve registration" },
  { slug: "close", name: "Close", website: "https://developer.close.com", category: "CRM", managed: false, tier: E, hook: "OAuth app self-serve" },
  { slug: "copper", name: "Copper", website: "https://developer.copper.com", category: "CRM", managed: false, tier: M, hook: "OAuth by request; API keys otherwise" },
  { slug: "freshsales", name: "Freshsales", website: "https://developers.freshworks.com/crm", category: "CRM", composioSlug: "FRESHSALES", managed: false, tier: M, hook: "Freshworks marketplace apps" },
  { slug: "dynamics-365", name: "Microsoft Dynamics 365", website: "https://learn.microsoft.com/dynamics365", category: "CRM", composioSlug: "DYNAMICS365", managed: true, tier: H, hook: "Entra app + Dataverse application user per org" },
  { slug: "mailchimp", name: "Mailchimp", website: "https://mailchimp.com/developer", category: "Marketing", composioSlug: "MAILCHIMP", managed: true, tier: E, hook: "Self-serve; data-center prefix in API host" },
  { slug: "klaviyo", name: "Klaviyo", website: "https://developers.klaviyo.com", category: "Marketing", composioSlug: "KLAVIYO", managed: false, tier: M, hook: "OAuth needs a partner/integration account" },
  { slug: "brevo", name: "Brevo", website: "https://developers.brevo.com", category: "Marketing", composioSlug: "BREVO", managed: false, tier: M, hook: "OAuth reserved for partners; API key default" },
  { slug: "constant-contact", name: "Constant Contact", website: "https://developer.constantcontact.com", category: "Marketing", composioSlug: "CONSTANT_CONTACT", managed: false, tier: E, hook: "Self-serve v3 app" },
  { slug: "activecampaign", name: "ActiveCampaign", website: "https://developers.activecampaign.com", category: "Marketing", managed: false, tier: M, hook: "OAuth for marketplace apps only" },
  { slug: "omnisend", name: "Omnisend", website: "https://api-docs.omnisend.com", category: "Marketing", composioSlug: "OMNISEND", managed: true, tier: M, hook: "Partner app registration" },
  { slug: "kit", name: "Kit (ConvertKit)", website: "https://developers.kit.com", category: "Marketing", composioSlug: "KIT", managed: true, tier: E, hook: "Self-serve OAuth v4" },
  { slug: "google-ads", name: "Google Ads", website: "https://developers.google.com/google-ads", category: "Advertising", composioSlug: "GOOGLEADS", managed: true, tier: V, hook: "Developer token approval (Basic access) on top of OAuth verification" },
  { slug: "meta-ads", name: "Meta Ads", website: "https://developers.facebook.com/docs/marketing-apis", category: "Advertising", composioSlug: "METAADS", managed: false, tier: V, hook: "ads_management Advanced Access review + business verification" },
  { slug: "linkedin-ads", name: "LinkedIn Ads", website: "https://learn.microsoft.com/linkedin/marketing", category: "Advertising", composioSlug: "LINKEDIN_ADS", managed: false, tier: V, hook: "Marketing Developer Platform access request review" },
  { slug: "tiktok-ads", name: "TikTok Ads", website: "https://business-api.tiktok.com", category: "Advertising", composioSlug: "TIKTOK_ADS", managed: true, tier: H, hook: "App review for Marketing API" },
  { slug: "pinterest", name: "Pinterest", website: "https://developers.pinterest.com", category: "Social", composioSlug: "PINTEREST", managed: true, tier: H, hook: "Trial access then Standard access review" },
  { slug: "reddit", name: "Reddit", website: "https://www.reddit.com/dev/api", category: "Social", composioSlug: "REDDIT", managed: true, tier: M, hook: "Self-serve app; commercial use needs API access approval" },
  { slug: "linkedin", name: "LinkedIn", website: "https://www.linkedin.com/developers", category: "Social", composioSlug: "LINKEDIN", managed: true, tier: H, hook: "Most products are request-only; Community Management API review takes weeks" },
  { slug: "meta", name: "Meta (Facebook Pages, Instagram)", website: "https://developers.facebook.com", category: "Social", composioSlug: "FACEBOOK", managed: true, tier: V, hook: "App Review + Business Verification for nearly every useful permission" },
  { slug: "x-twitter", name: "X (Twitter)", website: "https://developer.x.com", category: "Social", managed: false, tier: H, hook: "Paid API tiers; free tier is write-only, limited" },
  { slug: "youtube", name: "YouTube", website: "https://developers.google.com/youtube", category: "Social", composioSlug: "YOUTUBE", managed: true, tier: H, hook: "Google OAuth verification + YouTube API compliance audit for quota" },
  { slug: "tiktok", name: "TikTok (Login Kit / Content Posting)", website: "https://developers.tiktok.com", category: "Social", managed: false, tier: H, hook: "App review per product; content posting audit" },
  { slug: "threads", name: "Threads (Meta)", website: "https://developers.facebook.com/docs/threads", category: "Social", managed: false, tier: H, hook: "Meta app review for publishing" },
  { slug: "twitch", name: "Twitch", website: "https://dev.twitch.tv", category: "Social", composioSlug: "TWITCH", managed: true, tier: E, hook: "Self-serve console; 2FA required" },
  { slug: "spotify", name: "Spotify", website: "https://developer.spotify.com", category: "Media", managed: false, tier: M, hook: "Development mode caps 25 users; extended quota review" },
  // ---- Developer tools ----
  { slug: "github", name: "GitHub", website: "https://github.com", category: "Developer tools", composioSlug: "GITHUB", managed: true, tier: E, hook: "No review; orgs can restrict third-party OAuth apps" },
  { slug: "gitlab", name: "GitLab", website: "https://docs.gitlab.com/ee/api/oauth2.html", category: "Developer tools", composioSlug: "GITLAB", managed: true, tier: E, hook: "Self-serve user/group/instance applications" },
  { slug: "bitbucket", name: "Bitbucket", website: "https://developer.atlassian.com/cloud/bitbucket", category: "Developer tools", composioSlug: "BITBUCKET", managed: true, tier: E, hook: "OAuth consumer per workspace" },
  { slug: "sentry", name: "Sentry", website: "https://docs.sentry.io/organization/integrations/integration-platform", category: "Developer tools", composioSlug: "SENTRY", managed: true, tier: M, hook: "Public integrations need Sentry publishing approval" },
  { slug: "pagerduty", name: "PagerDuty", website: "https://developer.pagerduty.com", category: "Developer tools", composioSlug: "PAGERDUTY", managed: true, tier: M, hook: "Public OAuth apps need app registration approval" },
  { slug: "vercel", name: "Vercel", website: "https://vercel.com/docs/integrations", category: "Developer tools", managed: false, tier: M, hook: "Integrations marketplace review for public listing" },
  { slug: "supabase", name: "Supabase", website: "https://supabase.com/docs/guides/integrations/build-a-supabase-integration", category: "Developer tools", composioSlug: "SUPABASE", managed: true, tier: E, hook: "OAuth app from org settings" },
  { slug: "digitalocean", name: "DigitalOcean", website: "https://docs.digitalocean.com/reference/api/oauth", category: "Developer tools", composioSlug: "DIGITAL_OCEAN", managed: false, tier: E, hook: "Self-serve OAuth application" },
  { slug: "heroku", name: "Heroku", website: "https://devcenter.heroku.com/articles/oauth", category: "Developer tools", managed: false, tier: E, hook: "Self-serve OAuth client" },
  { slug: "datadog", name: "Datadog", website: "https://docs.datadoghq.com/developers/integrations/oauth_for_integrations", category: "Developer tools", composioSlug: "DATADOG", managed: false, tier: H, hook: "OAuth only for partner integrations (Developer Platform)" },
  { slug: "launchdarkly", name: "LaunchDarkly", website: "https://launchdarkly.com/docs/guides/api/oauth", category: "Developer tools", composioSlug: "LAUNCH_DARKLY", managed: false, tier: M, hook: "OAuth clients by request" },
  { slug: "daytona", name: "Daytona", website: "https://www.daytona.io/docs", category: "Developer tools", composioSlug: "DAYTONA", managed: true, tier: E, hook: "Self-serve" },
  { slug: "hugging-face", name: "Hugging Face", website: "https://huggingface.co/docs/hub/oauth", category: "Developer tools", composioSlug: "HUGGING_FACE", managed: true, tier: E, hook: "Self-serve OAuth (OpenID Connect)" },
  // ---- Finance / commerce ----
  { slug: "stripe", name: "Stripe Connect", website: "https://docs.stripe.com/connect/oauth-reference", category: "Payments", composioSlug: "STRIPE", managed: true, tier: M, hook: "Platform profile + OAuth settings; Standard accounts only" },
  { slug: "square", name: "Square", website: "https://developer.squareup.com", category: "Payments", composioSlug: "SQUARE", managed: true, tier: M, hook: "Sandbox self-serve; App Marketplace review optional" },
  { slug: "paypal", name: "PayPal", website: "https://developer.paypal.com", category: "Payments", managed: false, tier: M, hook: "Log in with PayPal requires feature enablement review" },
  { slug: "shopify", name: "Shopify", website: "https://shopify.dev", category: "Commerce", managed: false, tier: M, hook: "Partner account; public apps reviewed before App Store listing" },
  { slug: "woocommerce", name: "WooCommerce", website: "https://woocommerce.github.io/woocommerce-rest-api-docs", category: "Commerce", managed: false, tier: E, hook: "Per-store REST key auth endpoint; no central app" },
  { slug: "bigcommerce", name: "BigCommerce", website: "https://developer.bigcommerce.com", category: "Commerce", managed: false, tier: M, hook: "Developer portal; single-click apps reviewed for marketplace" },
  { slug: "quickbooks", name: "QuickBooks Online", website: "https://developer.intuit.com", category: "Accounting", composioSlug: "QUICKBOOKS", managed: true, tier: M, hook: "Sandbox immediate; production keys need app assessment questionnaire" },
  { slug: "xero", name: "Xero", website: "https://developer.xero.com", category: "Accounting", managed: false, tier: M, hook: "Uncertified apps capped at a handful of tenants (5 on Starter tier per a live agent run); App Store listing needs certification" },
  { slug: "freshbooks", name: "FreshBooks", website: "https://www.freshbooks.com/api", category: "Accounting", composioSlug: "FRESHBOOKS", managed: true, tier: E, hook: "Self-serve developer app" },
  { slug: "zoho-books", name: "Zoho Books", website: "https://www.zoho.com/books/api", category: "Accounting", composioSlug: "ZOHO_BOOKS", managed: true, tier: M, hook: "Zoho API console; region data centers" },
  { slug: "gusto", name: "Gusto", website: "https://docs.gusto.com", category: "HR", composioSlug: "GUSTO", managed: false, tier: H, hook: "Demo environment self-serve; production requires partner approval" },
  { slug: "bamboohr", name: "BambooHR", website: "https://documentation.bamboohr.com", category: "HR", composioSlug: "BAMBOOHR", managed: false, tier: H, hook: "OAuth for approved partners; API keys otherwise" },
  { slug: "greenhouse", name: "Greenhouse", website: "https://developers.greenhouse.io", category: "HR", composioSlug: "GREENHOUSE", managed: true, tier: H, hook: "Partner program for OAuth; Harvest API keys otherwise" },
  { slug: "lever", name: "Lever", website: "https://hire.lever.co/developer", category: "HR", composioSlug: "LEVER", managed: false, tier: H, hook: "Partner OAuth requires Lever approval" },
  { slug: "docusign", name: "DocuSign", website: "https://developers.docusign.com", category: "E-signature", composioSlug: "DOCUSIGN", managed: false, tier: M, hook: "Sandbox self-serve; go-live review needs 20 successful API calls" },
  { slug: "dropbox-sign", name: "Dropbox Sign", website: "https://developers.hellosign.com", category: "E-signature", composioSlug: "DROPBOX_SIGN", managed: false, tier: M, hook: "App approval before production use" },
  { slug: "eventbrite", name: "Eventbrite", website: "https://www.eventbrite.com/platform", category: "Events", composioSlug: "EVENTBRITE", managed: true, tier: E, hook: "Self-serve API keys with OAuth" },
  { slug: "wrike", name: "Wrike", website: "https://developers.wrike.com", category: "Project management", composioSlug: "WRIKE", managed: true, tier: E, hook: "Self-serve app registration" },
  { slug: "basecamp", name: "Basecamp", website: "https://github.com/basecamp/api", category: "Project management", composioSlug: "BASECAMP", managed: true, tier: E, hook: "Launchpad integration self-serve" },
  { slug: "harvest", name: "Harvest", website: "https://help.getharvest.com/api-v2", category: "Time tracking", composioSlug: "HARVEST", managed: true, tier: E, hook: "Self-serve OAuth2 client" },
  { slug: "clockify", name: "Clockify", website: "https://docs.clockify.me", category: "Time tracking", composioSlug: "CLOCKIFY", managed: false, tier: M, hook: "OAuth via add-on marketplace only" },
  { slug: "contentful", name: "Contentful", website: "https://www.contentful.com/developers", category: "CMS", composioSlug: "CONTENTFUL", managed: true, tier: E, hook: "OAuth applications self-serve" },
  { slug: "webflow", name: "Webflow", website: "https://developers.webflow.com", category: "CMS", managed: false, tier: E, hook: "Self-serve app; Marketplace review optional" },
  { slug: "wordpress-com", name: "WordPress.com", website: "https://developer.wordpress.com", category: "CMS", managed: false, tier: E, hook: "Self-serve application" },
  { slug: "gong", name: "Gong", website: "https://gong.app.gong.io/settings/api/documentation", category: "Sales", composioSlug: "GONG", managed: true, tier: H, hook: "OAuth apps must be submitted to Gong for approval" },
  { slug: "fathom", name: "Fathom", website: "https://developers.fathom.ai", category: "Sales", composioSlug: "FATHOM", managed: true, tier: E, hook: "Self-serve OAuth app" },
  { slug: "aircall", name: "Aircall", website: "https://developer.aircall.io", category: "Telephony", composioSlug: "AIRCALL", managed: true, tier: M, hook: "Partner program for public OAuth apps" },
  { slug: "dialpad", name: "Dialpad", website: "https://developers.dialpad.com", category: "Telephony", composioSlug: "DIALPAD", managed: true, tier: M, hook: "OAuth app registration via partner request" },
  { slug: "google-analytics", name: "Google Analytics", website: "https://developers.google.com/analytics", category: "Analytics", composioSlug: "GOOGLE_ANALYTICS", managed: true, tier: M, hook: "Sensitive scope verification (no CASA)" },
  { slug: "google-search-console", name: "Google Search Console", website: "https://developers.google.com/webmaster-tools", category: "Analytics", composioSlug: "GOOGLE_SEARCH_CONSOLE", managed: true, tier: M, hook: "Sensitive scope verification" },
  { slug: "google-bigquery", name: "Google BigQuery", website: "https://cloud.google.com/bigquery/docs", category: "Databases", composioSlug: "GOOGLEBIGQUERY", managed: true, tier: M, hook: "Cloud-platform scope is sensitive; verification" },
  { slug: "google-photos", name: "Google Photos", website: "https://developers.google.com/photos", category: "Media", composioSlug: "GOOGLEPHOTOS", managed: true, tier: H, hook: "Library API scopes heavily restricted since 2025" },
  { slug: "sharepoint", name: "SharePoint", website: "https://learn.microsoft.com/sharepoint/dev", category: "Productivity", composioSlug: "SHARE_POINT", managed: true, tier: H, hook: "Entra app with Sites.* permissions; admin consent" },
  { slug: "zoho-mail", name: "Zoho Mail", website: "https://www.zoho.com/mail/help/api", category: "Productivity", composioSlug: "ZOHO_MAIL", managed: true, tier: M, hook: "Zoho API console; DC-specific endpoints" },
  { slug: "ynab", name: "YNAB", website: "https://api.ynab.com", category: "Finance", composioSlug: "YNAB", managed: true, tier: E, hook: "Self-serve OAuth application" },
  { slug: "splitwise", name: "Splitwise", website: "https://dev.splitwise.com", category: "Finance", composioSlug: "SPLITWISE", managed: true, tier: E, hook: "Self-serve app registration" },
  { slug: "coinbase", name: "Coinbase", website: "https://docs.cdp.coinbase.com", category: "Finance", managed: false, tier: H, hook: "OAuth apps require Coinbase approval" },
  { slug: "strava", name: "Strava", website: "https://developers.strava.com", category: "Fitness", managed: false, tier: M, hook: "Single-athlete cap until you request a higher athlete limit" },
  { slug: "fitbit", name: "Fitbit", website: "https://dev.fitbit.com", category: "Fitness", managed: false, tier: M, hook: "Intraday data requires access request" },
  { slug: "ticketmaster", name: "Ticketmaster", website: "https://developer.ticketmaster.com", category: "Events", composioSlug: "TICKETMASTER", managed: true, tier: M, hook: "Partner OAuth request" },
  { slug: "productboard", name: "Productboard", website: "https://developer.productboard.com", category: "Product", composioSlug: "PRODUCTBOARD", managed: true, tier: M, hook: "OAuth for partner integrations" },
  { slug: "crowdin", name: "Crowdin", website: "https://developer.crowdin.com", category: "Localization", composioSlug: "CROWDIN", managed: true, tier: E, hook: "Self-serve OAuth app" },
  { slug: "wakatime", name: "WakaTime", website: "https://wakatime.com/developers", category: "Developer tools", composioSlug: "WAKATIME", managed: true, tier: E, hook: "Self-serve OAuth app" },
];

export const CATALOG_BY_SLUG = new Map(CATALOG.map((c) => [c.slug, c]));
