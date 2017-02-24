"use strict"

var fetchInspiration = require('./fetch_inspiration')

module.exports = function (done) {
  fetchInspiration(function(err, quote) {
    done(err, quote.toUpperCase())
  })
}
