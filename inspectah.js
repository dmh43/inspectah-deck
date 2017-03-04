"use strict"

const _ = require('lodash')
const sinon = require('sinon')

const protectYaNeck = {
  areEqual: function (result, expected, stack) {
    const areEqual = _.isEqual(result, expected)
    if (!areEqual) {
      console.log("The assumption this stub makes is invalid!")
      console.log(stack)
      console.log(_.toString(result))
      console.log("is not equal to")
      console.log(_.toString(expected))
    }
  },
  check: function (result, expected, checker, failMessage, stack) {
    const success = checker(result, expected)
    if (!success) {
      console.log("The assumption this stub makes is invalid!")
      console.log(stack)
      console.log(_.toString(result))
      console.log(failMessage)
      console.log(_.toString(expected))
    }
  }
}

const inspectahDeck = {
  yields: {
    getClaimToTest: function (args) {
      return {callback: true, calledWith: args}
    },
    assessOutcome: function (result, claimToTest, stack) {
      protectYaNeck.areEqual(result, claimToTest.calledWith, stack)
    }
  },
  throws: {
    getClaimToTest: function(args) {
      return {errorThrown: args[0]}
    },
    assessOutcome: function (result, claimToTest, stack) {
      protectYaNeck.check(result.error, claimToTest.errorThrown, function(val, prototype) {
        return val instanceof prototype
      }, "is not an instance of", stack)
    }
  },
  returns: {
    getClaimToTest: function(args) {
      return {returnVal: args[0]}
    },
    assessOutcome: function (result, claimToTest, stack) {
      protectYaNeck.areEqual(result.result, claimToTest.returnVal, stack)
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
