"use strict"

var fetchInspiration = require('./fetch_inspiration')

module.exports = function () {
  return fetchInspiration()
    .then(function(quote) {
      return quote.toUpperCase()
    })
}
