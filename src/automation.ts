import { LinearClient, Issue, IssuePayload } from '@linear/sdk'
import { Duration, Time, Schedule } from './time'

type MoveIssuesParams = {
	/** The name of the state to move issues out of (exact string matching the name you see in Linear). */
	from: string,
	
	/** The name of the state to move the issues to (exact string matching the name you see in Linear). */
	to: string,
	
	/** The length of time (without updates) before an issue should be moved. */
	after: Duration
}

type RecurringIssueParams = {
	/** The cadence at which to re-occur. */
	schedule: Schedule,
	
	/** The name of the state to move the issues to (exact string matching the name you see in Linear). */
	to: string,

	/** If true, creates a new issue — even when there is a pre-existing (closed) issue. */
	alwaysCreateNew?: boolean

	/** If true, skips checking for a pre-existing issue altogether and creates a new one. */
	duplicateIfAlreadyOpen?: boolean

	/** If true, snoozed recurring issues are left as snoozed */
	doNotUnSnooze?: boolean
}

type CreateNewIssueParams = {
	/** What the initial state (AKA status) should be set to (exact string matching the name you see in Linear). */
	setTo: string
}

type NewIssueValues = {
	/** The name of the issue. */
	title: string,
	
	/** Additional context (Markdown supported). */
	description?: string,

	/** Optionally, include a due date */
	dueDate?: Date

	// TODO: add labels, projects, assignees
}

export class LinearAutomation {

	linear: LinearClient
	teamName: string

	private _states:   Record<string, string> | undefined
	private _teams:    Record<string, string> | undefined
	private _projects: Record<string, string> | undefined
	private _labels:   Record<string, string> | undefined

	/**
	 * An automation object that can preform tasks within a Linear team.
	 * 
	 * @param apiKey Your API key (see **Settings > Account > API**).
	 * @param team The name of the team to preform actions on (exact string matching the name you see in Linear).
	 */
	constructor(apiKey: string, team: string) {
		this.linear = new LinearClient({ apiKey: apiKey })
		this.teamName = team
	}

	/**
	 * Moves issues automatically from one state (AKA status) to another. Will not move snoozed issues.
	 * 
	 * @param moveIssues
	 */
	async moveIssues(moveIssues: MoveIssuesParams) {

		let state = await this.fetchStates()
		let issues = await this.allIssues(state[moveIssues.from])
		
		/*
		 * While it would be more efficient to only query for stale issues,
		 * the filter does not currently work as expected. For now, the brute
		 * force way...
		 */
		// let issues = await this.linear.workflowState(state[moveIssues.from])
		// 	.then(state => state.issues({ filter: lastUpdatedFilter(moveIssues.after) }))
		// 	.then(response => response.nodes)

		issues.forEach(issue => {
			if (this.isStale(issue, moveIssues.after) && !this.isSnoozed(issue)) {

				this.linear.issueUpdate(issue.id, { stateId: state[moveIssues.to] })
					.then((update) => console.log((update.success ? 'UPDATED ' : 'FAILED TO UPDATE ') + issue.identifier))
			}
		});
	}

	/**
	 * Creates a recurring issue. If a matching issue already exists it is re-opened. If there is a matching
	 * issue already open, nothing occurs (these behaviors can be overridden in the RecurringIssueParams options).
	 * Note: the scheduling will only work if the function is run once a day. If a different cadence is required,
	 * consider handling the schedule within the cron job, and call `createNewIssue()` directly.
	 * 
	 * @param issue The issue to create (or reopen). If just a string, it is treated as a title with no other params
	 * @param options Recurring Issue parameters: the schedule to create the issue on, and the initial state, etc.
	 */
	async reoccurringIssue(issue: NewIssueValues | string, options: RecurringIssueParams) {
		if (typeof issue == 'string') {
			let newIssue: NewIssueValues = { title: issue }
			issue = newIssue
		}

		if (options.schedule(Time.now())) {

			if(options.duplicateIfAlreadyOpen) {
				await this.createNewIssue(issue, { setTo: options.to })
					.then((update) => console.log(
						update.success ? 'CREATED NEW TICKET' : 'FAILED TO CREATE NEW TICKET'))
			}
			else {
				let preexisting = await this.getIssue(issue.title)

				if (!preexisting) {
					await this.createNewIssue(issue, { setTo: options.to })
						.then(update => console.log(
							update.success ? 'CREATED NEW TICKET' : 'FAILED TO CREATE NEW TICKET'))
				}
				else if (options.alwaysCreateNew && !this.isOpen(preexisting)) {
					await this.createNewIssue(issue, { setTo: options.to })
						.then(update => console.log(
							update.success ? 'CREATED NEW TICKET' : 'FAILED TO CREATE NEW TICKET'))
				}
				else if (options.doNotUnSnooze && this.isSnoozed(preexisting)) {
					console.log('Recurring issue is snoozed; will not modify.')
				}
				else {
					await this.linear.issueUpdate(preexisting.id, {
						description: issue.description,
						stateId: (await this.fetchStates())[options.to],
						snoozedUntilAt: Time.now(), // un-snooze
					}).then(update => console.log(
						update.success ? 'UPDATED ' : 'FAILED TO UPDATE ' + preexisting.identifier))
				}
			}
		}
	}

	/**
	 * Creates a new issue.
	 * 
	 * @param issue The issue that will be created.
	 * @param options Additional options, such as what the initial status of the issue is.
	 * @returns The API response.
	 */
	async createNewIssue(issue: NewIssueValues, options: CreateNewIssueParams): Promise<IssuePayload> {

		let team = (await this.fetchTeams())[this.teamName]
		let state = (await this.fetchStates())[options.setTo]

		return this.linear.issueCreate({
			title: issue.title,
			description: issue.description,
			stateId: state,
			teamId: team,
			dueDate: issue.dueDate?.toUTCString(),
			// TODO: add labels, projects, assignees
		})
	}

	/**
	 * Gets an issue based on the inputted title.
	 * 
	 * @param title Issue title to search for.
	 * @returns A matching issue, or `undefined` if none were found.
	 */
	async getIssue(title: string): Promise<Issue | undefined> {
		let match: Issue | undefined = undefined
		await this.linear.issueSearch(title) // TODO: filter by team
			.then(res => res.nodes)
			.then(matches => matches.some(issue => {
				if (issue.title == title) {
					match = issue 
					return true
				}
			}))

		return match
	}

	/**
	 * Checks if the provided issue has not had any updates for the duration provided.
	 * 
	 * @param issue 
	 * @param staleAfter The duration required to be considered stale.
	 * @returns True if the issue is stale, false if it's been updated recently.
	 */
	isStale(issue: Issue, staleAfter: Duration): boolean {
		let timeSinceUpdated = Time.between(issue.updatedAt, Time.now())
		return staleAfter.lessThan(timeSinceUpdated)
	}

	/**
	 * Checks whether the given issue is open or not.
	 * 
	 * @param issue 
	 * @returns True if the issue has not been closed or completed.
	 */
	isOpen(issue: Issue): boolean {
		return (issue.completedAt || issue.canceledAt || issue.archivedAt) ? false : true
	}

	/**
	 * Checks if the given issue has been snoozed.
	 * 
	 * @param issue 
	 * @returns True if the issue is currently snoozed.
	 */
	isSnoozed(issue: Issue): boolean {
		return (issue.snoozedUntilAt) ? true : false
	}

	/**
	 * Get all the issues in the workspace. If `state` is provided, only get issues
	 * with that status.
	 * 
	 * @param state The state ID to filter by.
	 * @returns The list of issues
	 */
	private async allIssues(state?: string): Promise<Issue[]> {
		let issues: Issue[]

		if (state == undefined) {
			await this.linear.issues()
				.then(response => issues = response.nodes)
		}
		else {
			await this.linear.workflowState(state)
				.then(state => state.issues())
				.then(response => issues = response.nodes)
		}

		return issues
	}

	/**
	 * Get the available issue states (AKA "statuses") in the workspace.
	 * 
	 * @returns A map of state names (as you see in Linear) to their respective IDs.
	 */
	async fetchStates(): Promise<Record<string, string>> {
		if (typeof this._states != 'undefined') {
			return this._states
		}

		var global = this
		await this.linear.workflowStates().then(res => {
			let states = {}
			res.nodes.forEach(node => {
				states[node.name] = node.id
			})

			global._states = states
		})
		return this._states
	}

	/**
	 * Get the available teams in the workspace.
	 * 
	 * @returns A map of team names (as you see in Linear) to their respective IDs.
	 */
	async fetchTeams(): Promise<Record<string, string>> {
		if (typeof this._teams != 'undefined') {
			return this._teams
		}

		var global = this
		await this.linear.teams().then(res => {
			let teams = {}
			res.nodes.forEach(node => {
				teams[node.name] = node.id
			})
	
			global._teams = teams
		})
		return this._teams
	}

	/**
	 * Get the available projects in the workspace.
	 * 
	 * @returns A map of project names (as you see in Linear) to their respective IDs.
	 */
	async fetchProjects(): Promise<Record<string, string>> {
		if (typeof this._projects != 'undefined') {
			return this._projects
		}
		
		var global = this
		await this.linear.teams().then(res => {
			let projects = {}
			res.nodes.forEach(node => {
				projects[node.name] = node.id
			})
	
			global._projects = projects
		})
		return this._projects
	}

	/**
	 * Get the available issue labels in the workspace.
	 * 
	 * @returns A map of label names (as you see in Linear) to their respective IDs.
	 */
	async fetchLabels(): Promise<Record<string, string>> {
		if (typeof this._labels != 'undefined') {
			return this._labels
		}
		
		var global = this
		await this.linear.teams().then(res => {
			let labels = {}
			res.nodes.forEach(node => {
				labels[node.name] = node.id
			})
	
			global._labels = labels
		})
		return this._labels
	}
}
