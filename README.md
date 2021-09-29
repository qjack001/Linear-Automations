# Linear Automations

[ [Automation](#automation) ] [ [Local development](#local-development) ] [ [Operational notes](#operational-notes) ]

Simple workflows for automating [Linear](https://linear.app/) workspaces.

### Automation

Currently, there are two automation options: 

1. **`moveIssues`**
2. **`recurringIssue`**


The _moveIssues_ function (`moveIssues({from: string, to: string, after: Duration})`) updates the status of issues that have gone stale. If an issue in the given `from` status hasn't had any updates in the amount of time given in `after`, it is moved to the `to` status. For example, the following moves *In Progress* items back to *Todo* if they have not been updated in the last two weeks:

```typescript
let auto = new LinearAutomation(env.API_KEY)
auto.moveIssues({ from: 'In Progress', to: 'Todo', after: Time.ofWeeks(2) })
```

The _recurringIssue_ function (`recurringIssue(issue: string, options: { to: string, schedule: Schedule })`) creates an issue on a set cadence. The issue title is set with `issue`, and it is given the status provided in `to`. The issue will be created on the `schedule` provided — which has granularity in days. The issue will be re-opened instead of re-created if one already exists. For example, the following creates (or reopens an existing) issue to update dependencies on the first Monday of the month:

```typescript
let auto = new LinearAutomation(env.API_KEY)
auto.recurringIssue('Update dependencies', { to: 'Todo', schedule: Time.FIRST_MONDAY_OF_THE_MONTH })
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

