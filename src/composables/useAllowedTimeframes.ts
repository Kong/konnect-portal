import { computed } from 'vue'
import {
  TimeframeKeys,
  TimePeriods,
  timeframeToDatepickerTimeperiod
} from '@kong-ui-public/analytics-utilities'
import { PortalTimeframeKeys } from '@/types/vitals'
import { useI18nStore } from '@/stores'

const helpText = useI18nStore().state.helpText

export default function useAllowedTimeframes (allowedTimePeriod) {
  const now = computed(() => new Date().getTime())
  const dateOffset = allowedTimePeriod.value === PortalTimeframeKeys.NINETY_DAYS
    ? TimePeriods.get(TimeframeKeys.THIRTY_DAY).timeframeLengthMs() * 3 // 90 days
    : TimePeriods.get(TimeframeKeys.ONE_DAY).timeframeLengthMs()

  const allowedTimePeriods = computed(() => {
    // Default to showing all possible timeframes
    const sections = [
      {
        section: helpText.analytics.sectionLast,
        values: [
          TimePeriods.get(TimeframeKeys.FIFTEEN_MIN),
          TimePeriods.get(TimeframeKeys.ONE_HOUR),
          TimePeriods.get(TimeframeKeys.SIX_HOUR),
          TimePeriods.get(TimeframeKeys.TWELVE_HOUR),
          TimePeriods.get(TimeframeKeys.ONE_DAY),
          TimePeriods.get(TimeframeKeys.SEVEN_DAY),
          TimePeriods.get(TimeframeKeys.THIRTY_DAY)
        ].filter((val) => val.timeframeLengthMs() <= dateOffset).map(timeframeToDatepickerTimeperiod)
      },

      // For "Current" and "Previous" sections, we check for less than because we want to ensure neither of these
      // section show up.
      {
        section: helpText.analytics.sectionCurrent,
        values: [
          TimePeriods.get(TimeframeKeys.CURRENT_WEEK),
          TimePeriods.get(TimeframeKeys.CURRENT_MONTH)
        ].filter((val) => val.timeframeLengthMs() < dateOffset).map(timeframeToDatepickerTimeperiod)
      },
      {
        section: helpText.analytics.sectionPrevious,
        values: [
          TimePeriods.get(TimeframeKeys.PREVIOUS_WEEK),
          TimePeriods.get(TimeframeKeys.PREVIOUS_MONTH)
        ].filter((val) => val.timeframeLengthMs() < dateOffset).map(timeframeToDatepickerTimeperiod)
      }
    ]

    // Strip out Sections that do not contain at least one Timeframe
    return sections.filter(s => s.values.length !== 0)
  })

  return {
    timePeriods: allowedTimePeriods,
    minDateCalendar: new Date(now.value - dateOffset)
  }
}
