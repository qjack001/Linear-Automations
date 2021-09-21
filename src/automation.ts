import { LinearClient, Issue } from '@linear/sdk'
import { Duration, Time } from './time'

type MoveIssuesParams = {
	from: string,
	to: string,
	after: Duration
}

export class LinearAutomation {

	static now = new Date()
	linear: LinearClient
	states: Promise<Record<string, string>>

	constructor(apiKey: string) {
		this.linear = new LinearClient({ apiKey: apiKey })
		this.states = this.getStates()
	}

	async moveIssues(moveIssues: MoveIssuesParams) {
		let state = await this.states
		let issues = await this.allIssues(state[moveIssues.from])
		
		// While it would be more efficient to only query for stale issues,
		// the filter does not currently work as expected. For now, the brute
		// force way...
		//
		// let issues = await this.linear.workflowState(state[moveIssues.from])
		// 	.then(state => state.issues({ filter: lastUpdatedFilter(moveIssues.after) }))
		// 	.then(response => response.nodes)

		issues.forEach(issue => {
			if (this.stale(issue, moveIssues.after)) {
				this.linear.issueUpdate(issue.id, { stateId: state[moveIssues.to] })
					.then((update) => console.log(
						(update.success ? 'UPDATED ' : 'FAILED TO UPDATE ') +
						issue.identifier))
			}
		});
	}

	stale(issue: Issue, staleAfter: Duration): boolean {
		let timeSinceUpdated = Time.between(issue.updatedAt, Time.now())
		return staleAfter.lessThan(timeSinceUpdated)
	}

	async getStates(): Promise<Record<string, string>> {
		let states = {}
		let response = await this.linear.workflowStates()
		
		response.nodes.forEach(node => {
			states[node.name] = node.id
		})
		return states
	}

	async allIssues(state?: string): Promise<Issue[]> {
		if (state == undefined) {
			return this.linear.issues()
				.then(response => response.nodes)
		}

		return this.linear.workflowState(state)
			.then(state => state.issues())
			.then(response => response.nodes)
	}
}

function lastUpdatedFilter(after: Duration): import("@linear/sdk/dist/_generated_documents").IssueFilter {
	let expiryDate = Time.now().getTime() - Number(after.milliseconds)
	console.log(new Date(expiryDate))
	return { updatedAt: { lte: new Date(expiryDate) }}
}
