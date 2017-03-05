"use strict"

var fetchInspiration = require('./fetch_inspiration')

module.exports = function (done) {
  return fetchInspiration()
    .then(function(quote) {
      return quote.toUpperCase()
    })
}
