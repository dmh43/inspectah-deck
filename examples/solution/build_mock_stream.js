const stream = require('stream')

module.exports = function(mockResponse) {
  const s = new stream.Readable
  s.push(mockResponse)
  s.push(null)
  return s
}
