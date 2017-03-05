"use strict"

const _ = require('lodash')
const sinon = require('sinon')

const protectYaNeck = {
  areEqual: function (result, expected, stack) {
    const areEqual = _.isEqual(result, expected)
    if (!areEqual) {
      return [
        "The assumption this stub makes is invalid!",
        stack,
        _.toString(result),
        "is not equal to",
        _.toString(expected)
      ].join('\n')
    }
  },
  check: function (result, expected, checker, failMessage, stack) {
    const success = checker(result, expected)
    if (!success) {
      return [
        "The assumption this stub makes is invalid!",
        stack,
        _.toString(result),
        failMessage,
        _.toString(expected)
      ].join('\n')
    }
  }
}

const inspectahDeck = {
  yields: {
    getClaimToTest: function (args) {
      return {callback: true, calledWith: args}
    },
    assessOutcome: function (result, claimToTest, stack) {
      return protectYaNeck.areEqual(result, claimToTest.calledWith, stack)
    }
  },
  throws: {
    getClaimToTest: function(args) {
      return {errorThrown: args[0]}
    },
    assessOutcome: function (result, claimToTest, stack) {
      return protectYaNeck.check(result.error, claimToTest.errorThrown, function(val, prototype) {
        return val instanceof prototype
      }, "is not an instance of", stack)
    }
  },
  returns: {
    getClaimToTest: function(args) {
      return {returnVal: args[0]}
    },
    assessOutcome: function (result, claimToTest, stack) {
      return protectYaNeck.areEqual(result.result, claimToTest.returnVal, stack)
    }
  }
}

const createStub = function(action, claimToTest) {
  const stub = sinon.stub()
  switch (action) {
  case 'yields':
    return stub[action].apply(stub, claimToTest.calledWith)
  case 'throws':
    return stub[action](new claimToTest.errorThrown)
  case 'returns':
    return stub[action](claimToTest.returnVal)
  default:
    return new Error('Not implemented yet!')
  }
}

const inspectah = function (fn, action) {
  var outcome
  const stack = new Error().stack
  const rest = Array.prototype.slice.call(arguments, 2)
  const claimToTest = inspectahDeck[action].getClaimToTest(rest)
  const stub = createStub(action, claimToTest)
  return new Promise(function(resolve, reject) {
    if (claimToTest.callback) {
      fn(function() {
        outcome = inspectahDeck[action].assessOutcome([...arguments], claimToTest, stack)
        if (outcome) {
          reject(new Error(outcome))
        } else {
          resolve(stub)
        }
      })
    } else if (claimToTest.promise) {
      reject(new Error("To be implemented!"))
    } else {
      var error, result
      try {
        result = fn()
      } catch (err) {
        error = err
      }
      outcome = inspectahDeck[action].assessOutcome({error: error, result: result}, claimToTest, stack)
      if (outcome) {
        reject(new Error(outcome))
      } else {
        resolve(stub)
      }
    }
  })
}

module.exports = inspectah
