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

export type Schedule = (today: Date) => boolean

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

	static isWeekday(date: Date): boolean {
		return (0 < date.getDay() && date.getDay() < 6)
	}

	static isSunday(date: Date): boolean {
		return (date.getDay() == 0)
	}

	static isMonday(date: Date): boolean {
		return (date.getDay() == 1)
	}

	static isTuesday(date: Date): boolean {
		return (date.getDay() == 2)
	}

	static isWednesday(date: Date): boolean {
		return (date.getDay() == 3)
	}

	static isThursday(date: Date): boolean {
		return (date.getDay() == 4)
	}

	static isFriday(date: Date): boolean {
		return (date.getDay() == 5)
	}

	static isSaturday(date: Date): boolean {
		return (date.getDay() == 6)
	}

	static isFirstWeekOfMonth(date: Date): boolean {
		return (date.getDate() < 8)
	}

	static isSecondWeekOfMonth(date: Date): boolean {
		return (7 < date.getDate() && date.getDate() < 15)
	}

	static isThirdWeekOfMonth(date: Date): boolean {
		return (14 < date.getDate() && date.getDate() < 22)
	}

	static isFourthWeekOfMonth(date: Date): boolean {
		return (21 < date.getDate() && date.getDate() < 29)
	}

	static isLastWeekOfMonth(date: Date): boolean {
		return (this.daysInMonth(date) - 7 <= date.getDate())
	}

	static daysInMonth(date: Date): number {
		return new Date(date.getFullYear(), date.getMonth(), 0).getDate();
	}

	static EVERY_DAY: Schedule = (today: Date) => (true)
	static EVERY_WEEKDAY: Schedule = (today: Date) => (this.isWeekday(today))
	static EVERY_WEEKEND_DAY: Schedule = (today: Date) => (! this.isWeekday(today))

	static EVERY_MONDAY: Schedule = (today: Date) => (this.isMonday(today))
	static EVERY_TUESDAY: Schedule = (today: Date) => (this.isTuesday(today))
	static EVERY_WEDNESDAY: Schedule = (today: Date) => (this.isWednesday(today))
	static EVERY_THURSDAY: Schedule = (today: Date) => (this.isThursday(today))
	static EVERY_FRIDAY: Schedule = (today: Date) => (this.isFriday(today))
	static EVERY_SATURDAY: Schedule = (today: Date) => (this.isSaturday(today))
	static EVERY_SUNDAY: Schedule = (today: Date) => (this.isSunday(today))

	static FIRST_OF_THE_MONTH: Schedule = (today: Date) => (today.getDate() == 1)
	static FIRST_MONDAY_OF_THE_MONTH: Schedule = (today: Date) => (this.isMonday(today) && this.isFirstWeekOfMonth(today))
	static FIRST_TUESDAY_OF_THE_MONTH: Schedule = (today: Date) => (this.isTuesday(today) && this.isFirstWeekOfMonth(today))
	static FIRST_WEDNESDAY_OF_THE_MONTH: Schedule = (today: Date) => (this.isWednesday(today) && this.isFirstWeekOfMonth(today))
	static FIRST_THURSDAY_OF_THE_MONTH: Schedule = (today: Date) => (this.isThursday(today) && this.isFirstWeekOfMonth(today))
	static FIRST_FRIDAY_OF_THE_MONTH: Schedule = (today: Date) => (this.isFriday(today) && this.isFirstWeekOfMonth(today))
	static FIRST_SATURDAY_OF_THE_MONTH: Schedule = (today: Date) => (this.isSaturday(today) && this.isFirstWeekOfMonth(today))
	static FIRST_SUNDAY_OF_THE_MONTH: Schedule = (today: Date) => (this.isSunday(today) && this.isFirstWeekOfMonth(today))
	
	static SECOND_MONDAY_OF_THE_MONTH: Schedule = (today: Date) => (this.isMonday(today) && this.isSecondWeekOfMonth(today))
	static SECOND_TUESDAY_OF_THE_MONTH: Schedule = (today: Date) => (this.isTuesday(today) && this.isSecondWeekOfMonth(today))
	static SECOND_WEDNESDAY_OF_THE_MONTH: Schedule = (today: Date) => (this.isWednesday(today) && this.isSecondWeekOfMonth(today))
	static SECOND_THURSDAY_OF_THE_MONTH: Schedule = (today: Date) => (this.isThursday(today) && this.isSecondWeekOfMonth(today))
	static SECOND_FRIDAY_OF_THE_MONTH: Schedule = (today: Date) => (this.isFriday(today) && this.isSecondWeekOfMonth(today))
	static SECOND_SATURDAY_OF_THE_MONTH: Schedule = (today: Date) => (this.isSaturday(today) && this.isSecondWeekOfMonth(today))
	static SECOND_SUNDAY_OF_THE_MONTH: Schedule = (today: Date) => (this.isSunday(today) && this.isSecondWeekOfMonth(today))

	static THIRD_MONDAY_OF_THE_MONTH: Schedule = (today: Date) => (this.isMonday(today) && this.isThirdWeekOfMonth(today))
	static THIRD_TUESDAY_OF_THE_MONTH: Schedule = (today: Date) => (this.isTuesday(today) && this.isThirdWeekOfMonth(today))
	static THIRD_WEDNESDAY_OF_THE_MONTH: Schedule = (today: Date) => (this.isWednesday(today) && this.isThirdWeekOfMonth(today))
	static THIRD_THURSDAY_OF_THE_MONTH: Schedule = (today: Date) => (this.isThursday(today) && this.isThirdWeekOfMonth(today))
	static THIRD_FRIDAY_OF_THE_MONTH: Schedule = (today: Date) => (this.isFriday(today) && this.isThirdWeekOfMonth(today))
	static THIRD_SATURDAY_OF_THE_MONTH: Schedule = (today: Date) => (this.isSaturday(today) && this.isThirdWeekOfMonth(today))
	static THIRD_SUNDAY_OF_THE_MONTH: Schedule = (today: Date) => (this.isSunday(today) && this.isThirdWeekOfMonth(today))

	static FOURTH_MONDAY_OF_THE_MONTH: Schedule = (today: Date) => (this.isMonday(today) && this.isFourthWeekOfMonth(today))
	static FOURTH_TUESDAY_OF_THE_MONTH: Schedule = (today: Date) => (this.isTuesday(today) && this.isFourthWeekOfMonth(today))
	static FOURTH_WEDNESDAY_OF_THE_MONTH: Schedule = (today: Date) => (this.isWednesday(today) && this.isFourthWeekOfMonth(today))
	static FOURTH_THURSDAY_OF_THE_MONTH: Schedule = (today: Date) => (this.isThursday(today) && this.isFourthWeekOfMonth(today))
	static FOURTH_FRIDAY_OF_THE_MONTH: Schedule = (today: Date) => (this.isFriday(today) && this.isFourthWeekOfMonth(today))
	static FOURTH_SATURDAY_OF_THE_MONTH: Schedule = (today: Date) => (this.isSaturday(today) && this.isFourthWeekOfMonth(today))
	static FOURTH_SUNDAY_OF_THE_MONTH: Schedule = (today: Date) => (this.isSunday(today) && this.isFourthWeekOfMonth(today))

	static LAST_MONDAY_OF_THE_MONTH: Schedule = (today: Date) => (this.isMonday(today) && this.isLastWeekOfMonth(today))
	static LAST_TUESDAY_OF_THE_MONTH: Schedule = (today: Date) => (this.isTuesday(today) && this.isLastWeekOfMonth(today))
	static LAST_WEDNESDAY_OF_THE_MONTH: Schedule = (today: Date) => (this.isWednesday(today) && this.isLastWeekOfMonth(today))
	static LAST_THURSDAY_OF_THE_MONTH: Schedule = (today: Date) => (this.isThursday(today) && this.isLastWeekOfMonth(today))
	static LAST_FRIDAY_OF_THE_MONTH: Schedule = (today: Date) => (this.isFriday(today) && this.isLastWeekOfMonth(today))
	static LAST_SATURDAY_OF_THE_MONTH: Schedule = (today: Date) => (this.isSaturday(today) && this.isLastWeekOfMonth(today))
	static LAST_SUNDAY_OF_THE_MONTH: Schedule = (today: Date) => (this.isSunday(today) && this.isLastWeekOfMonth(today))
}