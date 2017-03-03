"use strict"

const _ = require('lodash')
const assert = require('assert')
const buildMockStream = require('./build_mock_stream')
const mockResponse = require('./fixtures/inspiration_response')
const rewire = require('rewire')
const sinon = require('sinon')

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

var inspectahDeck = {
  yields: {
    getClaimToTest: function (args) {
      return {callback: true, calledWith: args}
    },
    assessOutcome: function (result, expected) {
      const areEqual = _.isEqual(result, expected)
      if (areEqual) {
        console.log("Success!")
      } else {
        console.log(JSON.stringify(result))
        console.log("is not equal to")
        console.log(JSON.stringify(expected))
      }
    }
  }
}

var inspectah = function (fn, action) {
  const rest = Array.prototype.slice.call(arguments, 2)
  const claimToTest = inspectahDeck[action].getClaimToTest(rest)
  if (claimToTest.callback) {
    var callback = function() {
      inspectahDeck[action].assessOutcome([...arguments], claimToTest.calledWith)
    }
    fn(callback)
  } else {
    console.log("To be implemented!")
  }
  var stub = sinon.stub()
  return stub[action].apply(stub, claimToTest.calledWith)
}

var stub = inspectah(fetchInspiration, 'yields', null, quoteOfTheDay)


revertRewire()

module.exports = stub
