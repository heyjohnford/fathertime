
const FATHERTIME = 'fathertime'
const START_FATHERTIME = 'start_fathertime'
const MEASURE_FATHERTIME = 'measure_fathertime'
const END_FATHERTIME = 'end_fathertime'
const MISHAP = 'Time not measured properly.'

export default class FatherTime {

  constructor() {

    if (!window || !window.performance || !window.performance.now) {
      throw new Error('window.performance.now is not supported in your browser')
    }

    this.requestCount = 0
    this.totalDuration = 0
    this.averageDuration = 0
    this.totalTime = 0
    this.verbose = false
  }

  start() {
    window.performance.mark(START_FATHERTIME)
  }

  measure() {
    window.performance.measure(MEASURE_FATHERTIME + this.requestCount, START_FATHERTIME)
    this.requestCount += 1
  }

  end() {
    this.measure()
    window.performance.mark(END_FATHERTIME)

    const marks = this.getEntriesByType('mark')
    const measures = this.getEntriesByType('measure')

    this.totalDuration = this._calculateDuration(measures)
    this.totalTime = this._calculateTotalTime(marks)
    this.averageDuration = this.totalDuration / this.requestCount
    this.clearEntries(marks, measures)
    this.requestCount = 0
  }

  _calculateDuration(measures) {
    return measures
      .filter(m => m.name.includes(FATHERTIME))
      .reduce(
        (completedTime, performanceMeasure) => completedTime += performanceMeasure.duration, 0
      )
  }

  _calculateTotalTime(marks) {
    const start = marks.find(m => m.name === START_FATHERTIME)
    const end = marks.find(m => m.name === END_FATHERTIME)

    return end.startTime - start.startTime
  }

  getMeasuredTime(label = '') {
    if (this.totalDuration === 0) {
      return MISHAP
    }

    return `${label} Completed: ${(this.totalDuration / 1000).toFixed(2)} seconds [${this.totalDuration}]`
  }

  getTotalTime(label = '') {
    if (this.totalTime === 0) {
      return MISHAP
    }

    return `${label} Completed: ${(this.totalTime / 1000).toFixed(2)} seconds [${this.totalTime}]`
  }

  getAverageDuration(label = '') {
    if (this.averageDuration === 0) {
      return MISHAP
    }

    return `${label} Average: ${(this.averageDuration / 1000).toFixed(2)} seconds [${this.averageDuration}]`
  }

  getEntriesByType(entry) {
    return window.performance.getEntriesByType(entry)
  }

  clearEntries(marks, measures) {
    marks.forEach(this._clearEntryType)
    measures.forEach(this._clearEntryType)
  }

  _clearEntryType(entry) {
    const name = entry.name || ''

    if (name.includes(FATHERTIME)) {
      if (entry.entryType === 'measure') {
        window.performance.clearMeasures(name)
      } else {
        window.performance.clearMarks(name)
      }
    }
  }

  _resetTimeValues() {
    this.requestCount = 0
    this.totalDuration = 0
    this.averageDuration = 0
    this.totalTime = 0
  }

  logger(msg) {
    if (this.verbose) {
      console.log(msg)
    }
  }

}
