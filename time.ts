export type Duration = {
	milliseconds: bigint
	seconds: bigint
	minutes: bigint
	hours: bigint
	days: bigint
	weeks: bigint
	years: bigint

	greaterThan: (other: Duration) => boolean
	lessThan: (other: Duration) => boolean
	equals: (other: Duration) => boolean
}

export class Time {
	
	static now(): Date {
		return new Date()
	}

	static from(isoDate: string): Date {
		return new Date(isoDate)
	}

	static between(start: Date|string, end: Date|string): Duration {
		if (typeof start == 'string') {
			start = new Date(start)
		}
		if (typeof end == 'string') {
			end = new Date(start)
		}

		let timeBetweenInMilliseconds = BigInt(end.getTime() - start.getTime())
		return this.ofMilliseconds(timeBetweenInMilliseconds)
	}

	static ofMilliseconds(ms: bigint|number): Duration {
		if (typeof ms == 'number') {
			ms = BigInt(ms)
		}

		let duration: Duration = {
			milliseconds: ms,
			seconds:      ms / 1000n,
			minutes:      ms / 1000n / 60n,
			hours:        ms / 1000n / 60n / 60n,
			days:         ms / 1000n / 60n / 60n / 24n,
			weeks:        ms / 1000n / 60n / 60n / 24n / 7n,
			years:        ms / 1000n / 60n / 60n / 24n / 365n,

			greaterThan: function (other: Duration): boolean {
				return this.milliseconds > other.milliseconds
			},
			lessThan: function (other: Duration): boolean {
				return this.milliseconds < other.milliseconds
			},
			equals: function (other: Duration): boolean {
				return this.milliseconds == other.milliseconds
			}
		}
		return duration
	}

	static ofSeconds(s: bigint|number): Duration {
		if (typeof s == 'number') {
			s = BigInt(s)
		}

		let duration: Duration = {
			milliseconds: s * 1000n,
			seconds:      s,
			minutes:      s / 60n,
			hours:        s / 60n / 60n,
			days:         s / 60n / 60n / 24n,
			weeks:        s / 60n / 60n / 24n / 7n,
			years:        s / 60n / 60n / 24n / 365n,

			greaterThan: function (other: Duration): boolean {
				return this.milliseconds > other.milliseconds
			},
			lessThan: function (other: Duration): boolean {
				return this.milliseconds < other.milliseconds
			},
			equals: function (other: Duration): boolean {
				return this.milliseconds == other.milliseconds
			}
		}
		return duration
	}

	static ofMinutes(m: bigint|number): Duration {
		if (typeof m == 'number') {
			m = BigInt(m)
		}

		let duration: Duration = {
			milliseconds: m * 1000n * 60n,
			seconds:      m * 60n,
			minutes:      m,
			hours:        m / 60n,
			days:         m / 60n / 24n,
			weeks:        m / 60n / 24n / 7n,
			years:        m / 60n / 24n / 365n,

			greaterThan: function (other: Duration): boolean {
				return this.milliseconds > other.milliseconds
			},
			lessThan: function (other: Duration): boolean {
				return this.milliseconds < other.milliseconds
			},
			equals: function (other: Duration): boolean {
				return this.milliseconds == other.milliseconds
			}
		}
		return duration
	}

	static ofHours(h: bigint|number): Duration {
		if (typeof h == 'number') {
			h = BigInt(h)
		}

		let duration: Duration = {
			milliseconds: h * 1000n * 60n * 60n,
			seconds:      h * 60n * 60n,
			minutes:      h * 60n,
			hours:        h,
			days:         h / 24n,
			weeks:        h / 24n / 7n,
			years:        h / 24n / 365n,

			greaterThan: function (other: Duration): boolean {
				return this.milliseconds > other.milliseconds
			},
			lessThan: function (other: Duration): boolean {
				return this.milliseconds < other.milliseconds
			},
			equals: function (other: Duration): boolean {
				return this.milliseconds == other.milliseconds
			}
		}
		return duration
	}

	static ofDays(d: bigint|number): Duration {
		if (typeof d == 'number') {
			d = BigInt(d)
		}

		let duration: Duration = {
			milliseconds: d * 1000n * 60n * 60n * 24n,
			seconds:      d * 60n * 60n * 24n,
			minutes:      d * 60n * 24n,
			hours:        d * 24n,
			days:         d,
			weeks:        d / 7n,
			years:        d / 365n,

			greaterThan: function (other: Duration): boolean {
				return this.milliseconds > other.milliseconds
			},
			lessThan: function (other: Duration): boolean {
				return this.milliseconds < other.milliseconds
			},
			equals: function (other: Duration): boolean {
				return this.milliseconds == other.milliseconds
			}
		}
		return duration
	}

	static ofWeeks(w: bigint|number): Duration {
		if (typeof w == 'number') {
			w = BigInt(w)
		}

		let duration: Duration = {
			milliseconds: w * 1000n * 60n * 60n * 24n * 7n,
			seconds:      w * 60n * 60n * 24n * 7n,
			minutes:      w * 60n * 24n * 7n,
			hours:        w * 24n * 7n,
			days:         w * 7n,
			weeks:        w,
			years:        w / 52n,

			greaterThan: function (other: Duration): boolean {
				return this.milliseconds > other.milliseconds
			},
			lessThan: function (other: Duration): boolean {
				return this.milliseconds < other.milliseconds
			},
			equals: function (other: Duration): boolean {
				return this.milliseconds == other.milliseconds
			}
		}
		return duration
	}

	static ofYears(y: bigint|number): Duration {
		if (typeof y == 'number') {
			y = BigInt(y)
		}

		let duration: Duration = {
			milliseconds: y * 1000n * 60n * 60n * 24n * 365n,
			seconds:      y * 60n * 60n * 24n * 365n,
			minutes:      y * 60n * 24n * 365n,
			hours:        y * 24n * 365n,
			days:         y * 365n,
			weeks:        y * 52n,
			years:        y,

			greaterThan: function (other: Duration): boolean {
				return this.milliseconds > other.milliseconds
			},
			lessThan: function (other: Duration): boolean {
				return this.milliseconds < other.milliseconds
			},
			equals: function (other: Duration): boolean {
				return this.milliseconds == other.milliseconds
			}
		}
		return duration
	}
}