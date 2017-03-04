"use strict"

const buildMockStream = require('./build_mock_stream')
const inspectah = require('../../inspectah')
const mockResponse = require('./fixtures/inspiration_response')
const quoteOfTheDay = require('./fixtures/quote_of_the_day')
const rewire = require('rewire')
const sinon = require('sinon')

const fetchInspiration = rewire('./fetch_inspiration')

const mockStream = buildMockStream(JSON.stringify(mockResponse))
const revertRewire = fetchInspiration.__set__({
  http: {
    get: function(url, done) {
      done(mockStream)
    }
  }
})

var stub = inspectah(fetchInspiration, 'yields', null, quoteOfTheDay)
inspectah(JSON.parse.bind(this, "(}"), 'throws', SyntaxError)
inspectah(JSON.stringify.bind(this, 10), 'returns', '10')


revertRewire()

module.exports = stub
