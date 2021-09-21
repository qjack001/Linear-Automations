import { LinearAutomation } from './automation'
import { Time } from './time'
import { env } from 'process';

require('dotenv').config()
let auto = new LinearAutomation(env.API_KEY)


auto.moveIssues({ from: 'Todo', to: 'Triage', after: Time.ofDays(2) })
	.then(() => console.log('Done moving old Todo items to Triage!'))

auto.moveIssues({ from: 'Triage', to: 'Backlog', after: Time.ofDays(7) })
	.then(() => console.log('Done moving old Triage items to Backlog!'))