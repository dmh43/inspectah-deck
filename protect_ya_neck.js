"use strict"

const _ = require('lodash')

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


module.exports = protectYaNeck
