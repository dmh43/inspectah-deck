"use strict"

const buildMockStream = require('./build_mock_stream')
const inspectah = require('../../inspectah')
const mockResponse = require('./fixtures/inspiration_response')
const rewire = require('rewire')

const fetchInspiration = rewire('./fetch_inspiration')

const quoteOfTheDay= "get up. because mickey loves ya"

const mockStream = buildMockStream(JSON.stringify(mockResponse))
const revertRewire = fetchInspiration.__set__({
  http: {
    get: function(url, done) {
      done(mockStream)
    }
  }
})

var stub = inspectah(fetchInspiration, 'yields', null, quoteOfTheDay)


revertRewire()

module.exports = stub
