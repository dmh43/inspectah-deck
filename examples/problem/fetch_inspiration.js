"use strict"

var http = require('http')

module.exports = function (done) {
  const quotesUrl = 'http://quotes.rest/qod.json'
  http.request(quotesUrl, function(response) {
    var str = ''
    response.on('data', function (chunk) {
      str += chunk
    })
    response.on('end', function () {
      const data = JSON.parse(str)
      done(null, data.contents.quotes[0].quote)
    })
  })
}
