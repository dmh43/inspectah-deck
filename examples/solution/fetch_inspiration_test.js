"use strict"

const quoteOfTheDay = "Meaning is something you build into your life. You build it out of your own past, out of your affections and loyalties, out of the experience of humankind as it is passed on to you. ... You are the only one who can put them together into that unique pattern that will be your life."

const assert = require('assert')
const buildMockStream = require('./build_mock_stream')
const mockResponse = require('./fixtures/inspiration_response')
const rewire = require('rewire')

const fetchInspiration = rewire('./fetch_inspiration')

const stubs = {}

const mockStream = buildMockStream(JSON.stringify(mockResponse))
const revertRewire = fetchInspiration.__set__({
  http: {
    request: function(url, done) {
      done(mockStream)
    }
  }
})
stubs['fetchInspiration'] = fetchInspiration

describe('fetchInspiration', function() {
  before(function(done) {
    fetchInspiration((function(err, quote) {
      this.result = quote
      this.err = err
      done()
    }).bind(this))
  })

  after(function() {
    revertRewire()
  })

  it('calls the callback with the quote of the day', function() {
    assert.equal(this.result, quoteOfTheDay)
  })
})


module.exports = stubs
