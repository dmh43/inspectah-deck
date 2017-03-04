"use strict"

const _ = require('lodash')
const sinon = require('sinon')

const inspectahDeck = {
  yields: {
    getClaimToTest: function (args) {
      return {callback: true, calledWith: args}
    },
    assessOutcome: function (expected, claimToTest, stack) {
      const result = claimToTest.calledWith
      const areEqual = _.isEqual(result, expected)
      if (!areEqual) {
        console.log("The assumption this stub makes is invalid!")
        console.log(stack)
        console.log(_.toString(result))
        console.log("is not equal to")
        console.log(_.toString(expected))
      }
    }
  },
  throws: {
    getClaimToTest: function(args) {
      return {errorThrown: args[0]}
    },
    assessOutcome: function (expected, claimToTest, stack) {
      const expectedErr = expected.error
      const result = claimToTest.errorThrown
      const areEqual = _.isEqual(result, expectedErr)
      if (!areEqual) {
        console.log("The assumption this stub makes is invalid!")
        console.log(stack)
        console.log(_.toString(result))
        console.log("is not equal to")
        console.log(_.toString(expectedErr))
      }
    }
  },
  returns: {
    getClaimToTest: function(args) {
      return {returnVal: args[0]}
    },
    assessOutcome: function (expected, claimToTest, stack) {
      const expectedReturnVal = expected.result
      const result = claimToTest.returnVal
      const areEqual = _.isEqual(result, expectedReturnVal)
      if (!areEqual) {
        console.log("The assumption this stub makes is invalid!")
        console.log(stack)
        console.log(_.toString(result))
        console.log("is not equal to")
        console.log(_.toString(expectedReturnVal))
      }
    }
  }
}

const inspectah = function (fn, action) {
  var stack = new Error().stack
  const rest = Array.prototype.slice.call(arguments, 2)
  const claimToTest = inspectahDeck[action].getClaimToTest(rest)
  if (claimToTest.callback) {
    var callback = function() {
      inspectahDeck[action].assessOutcome([...arguments], claimToTest, stack)
    }
    fn(callback)
  } else {
    var error, result
    try {
      result = fn()
    } catch (err) {
      error = err
    }
    inspectahDeck[action].assessOutcome({error: error, result: result}, claimToTest, stack)
  }
  var stub = sinon.stub()
  return stub[action].apply(stub, claimToTest.calledWith)
}

module.exports = inspectah
