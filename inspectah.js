"use strict"

const sinon = require('sinon')
const inspectahDeck = require('./inspectah_deck')

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
    } else if (claimToTest.synchronous) {
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
    } else {
      reject(new Error("Stub spec improperly specified!"))
    }
  })
}

module.exports = inspectah
