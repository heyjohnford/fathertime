import {jsdom} from 'jsdom'

export default function() {
  global.document = jsdom()
  global.window = document.defaultView
  global.navigator = window.navigator

  window.performance = {
    _now: 0,
    _entries: {
      mark: [],
      measure: []
    },

    now: () => {
      const time = Date.now()
      window.performance._now = time
      return time
    },

    mark: markName => {
      window.performance._entries.mark.push(
        {
          duration: 0,
          entryType: 'mark',
          name: markName,
          startTime: window.performance._calculateNow()
        }
      )
    },

    measure: measureName => {
      window.performance._entries.measure.push(
        {
          duration: window.performance._calculateDuration,
          entryType: 'measure',
          name: measureName,
          startTime: window.performance._calculateNow()
        }
      )
    },

    getEntriesByType: entry => {
      return window.performance._entries[entry]
    },

    clearMeasures: () => window.performance._entries.measure = [],

    clearMarks: () => window.performance._entries.mark = [],

    _calculateNow: () => window.performance._now - window.performance.now(),

    _calculateDuration: () => {
      const entries = window.performance._entries
      const measureLength = entries.measure.length
      const markLength = entries.mark.length

      if (measureLength) {
        return entries.measure[measureLength - 1].startTime - window.performance.now()
      } else if (markLength) {
        return entries.mark[markLength - 1].startTime - window.performance.now()
      }

      return 0
    },
  }
}
