"use strict"

const quoteOfTheDay = "get up. because mickey loves ya"
const expectedYelling = "GET UP. BECAUSE MICKEY LOVES YA"

const assert = require('assert')
const rewire = require('rewire')
const fetchYellingInspiration = rewire('./fetch_yelling_inspiration')

describe('fetchYellingInspiration', function() {
  beforeEach(function() {
    this.revertRewire = fetchYellingInspiration.__set__({
      fetchInspiration: function() {
        return Promise.resolve(quoteOfTheDay)
      }
    })
  })
  it('yells at you, but is inspiring', function () {
    return fetchYellingInspiration()
      .then(function(yellingQuote) {
        assert.equal(yellingQuote, expectedYelling)
      })
  })
})
