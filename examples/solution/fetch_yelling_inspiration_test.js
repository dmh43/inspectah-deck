"use strict"

const quoteOfTheDay = require('./fixtures/quote_of_the_day')
const expectedYelling = quoteOfTheDay.toUpperCase()

const assert = require('assert')
const rewire = require('rewire')
const fetchYellingInspiration = rewire('./fetch_yelling_inspiration')
const fetchInspirationStubPromise = require('./fetch_inspiration_test')

describe('fetchYellingInspiration', function() {
  beforeEach(function() {
    return fetchInspirationStubPromise
      .then((stub) => {
        this.revertRewire = fetchYellingInspiration.__set__({
          fetchInspiration: stub
        })
      })
  })
  it('yells at you, but is inspiring', function () {
    return fetchYellingInspiration()
      .then(function(yellingQuote) {
        assert.equal(yellingQuote, expectedYelling)
      })
  })
})
