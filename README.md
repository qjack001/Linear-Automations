# Linear Automations

Simple workflows for automating [Linear](https://linear.app/) workspaces.

### Automation

Currently, there is a single automation option: `moveIssues({from: string, to: string, after: Duration})`. This automation moves issues from one status to another after they sit un-updated for a certain period of time.

For example, the following moves *In Progress* items back to *Todo* if they have not been updated in the last two weeks:

```typescript
let auto = new LinearAutomation(env.API_KEY)
auto.moveIssues({ from: 'In Progress', to: 'Todo', after: Time.ofWeeks(2) })
```

### Local development

This script automates Linear workflows, and by extension, requires that you have a [Linear](https://linear.app/) account set up. To get started:

```bash
# clone the repo
git clone https://github.com/qjack001/Linear-Automations.git

# install its dependencies
npm install
```

Add your Linear API key to your environment. For example:

```env
# .env file at the root of the repo
API_KEY=lin_api_1234567890
```

If you do not have an API key, you can generate a new one in **Settings > Account > API > Personal API keys**, and click <kbd>Create key</kbd>.

Then, run the main script:

```bash
npm run automate
```

### Operational notes

This project is set up to run every day at 6 AM Pacific (13:00 UTC), via a [cron-scheduled Github action](.github/workflows/run_automation.yml). For this to work, your Linear API key must be set in the repository’s **Settings > Secrets** as `API_KEY`.

