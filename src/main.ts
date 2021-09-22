import { LinearAutomation } from './automation'
import { Time } from './time'
import { env } from 'process';

require('dotenv').config()
let auto = new LinearAutomation(env.API_KEY, 'Jack')

auto.moveIssues({ from: 'Todo',   to: 'Triage',  after: Time.ofDays(2) })
auto.moveIssues({ from: 'Triage', to: 'Backlog', after: Time.ofWeeks(1) })

auto.reoccurringIssue('Brush your teeth', { to: 'Todo',   schedule: Time.EVERY_DAY })
auto.reoccurringIssue('Wash the dishes',  { to: 'Triage', schedule: Time.EVERY_WEDNESDAY })
