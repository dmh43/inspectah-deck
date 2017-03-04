"use strict"

const quoteOfTheDay = require('./fixtures/quote_of_the_day')
const expectedYelling = quoteOfTheDay.toUpperCase()

const assert = require('assert')
const rewire = require('rewire')
const fetchYellingInspiration = rewire('./fetch_yelling_inspiration')

const fetchInspirationStub = require('./fetch_inspiration_test')

describe('fetchYellingInspiration', function() {
  beforeEach(function() {
    this.revertRewire = fetchYellingInspiration.__set__({
      fetchInspiration: fetchInspirationStub
    })
  })
  it('yells at you, but is inspiring', function () {
    fetchYellingInspiration(function(err, yellingQuote) {
      assert.equal(yellingQuote, expectedYelling)
    })
  })
})
