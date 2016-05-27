import setup from './setup'
import expect from 'expect.js'
import FatherTime from '../src'

// Setup test environment with headless browser
// And extend window.performance
setup()

const fathertime = new FatherTime()

describe('FatherTime', () => {

  it('should be an instanceof Father Time', () => {
    expect(fathertime).to.be.ok()
    expect(fathertime).to.be.a(FatherTime)
  })

  it('should start', () => {
    fathertime.start()

    const marks = fathertime.getEntriesByType('mark')

    expect(marks).to.have.length(1)
    expect(marks).to.not.be.empty()
    expect(marks[0].name).to.equal('start_fathertime')
  })

  it('should end and clear', () => {
    fathertime.end()
    expect(fathertime.getEntriesByType('measure')).to.be.empty()
    expect(fathertime.getEntriesByType('mark')).to.be.empty()
  })

  // it('should measure fathertime', () => {
  //   expect(fathertime.measure()).to.throwError()
  // })

  it('should get entries by type', () => {
    fathertime.start()
    fathertime.measure()
    fathertime.measure()
    fathertime.measure()

    expect(fathertime.getEntriesByType('mark')).to.have.length(1)
    expect(fathertime.getEntriesByType('measure')).to.have.length(3)
    fathertime.end()
  })

  it('should properly name measures', () => {
    fathertime.start()

    for (let i = 0; i < 25; i += 1) {
      fathertime.measure()
    }

    const measures = fathertime.getEntriesByType('measure')

    expect(measures[measures.length - 1].name).to.equal('measure_fathertime24')
    expect(measures[5].name).to.equal('measure_fathertime5')
    expect(measures[17].name).not.to.equal('measure_fathertime18')
    expect(measures[22].name).not.to.equal('measure_fathertime21')
    expect(measures[0].entryType).to.equal('measure')
    fathertime.end()
  })
})
