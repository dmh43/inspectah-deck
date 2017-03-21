"use strict"

const protectYaNeck = require('./protect_ya_neck')

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
      return {synchronous: true, errorThrown: args[0]}
    },
    assessOutcome: function (result, claimToTest, stack) {
      return protectYaNeck.check(result.error, claimToTest.errorThrown, function(val, prototype) {
        return val instanceof prototype
      }, "is not an instance of", stack)
    }
  },
  returns: {
    getClaimToTest: function(args) {
      return {synchronous: true, returnVal: args[0]}
    },
    assessOutcome: function (result, claimToTest, stack) {
      return protectYaNeck.areEqual(result.result, claimToTest.returnVal, stack)
    }
  }
}


module.exports = inspectahDeck
