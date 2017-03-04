"use strict"

const _ = require('lodash')
const sinon = require('sinon')

const inspectahDeck = {
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

const inspectah = function (fn, action) {
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

module.exports = inspectah
