const sinon = require('sinon')
const expect = require('chai').expect

const rewire = require('rewire')
const inspectah = rewire('../inspectah')

inspectah(JSON.parse.bind(this, "(}"), 'throws', SyntaxError)
JSON.stringify.bind(this, 10)

describe('inspectah', function () {
  beforeEach(function() {
    inspectah.__set__({console: {log: sinon.stub()}})
  })

  describe('returns', function () {
    describe('the assumption made by the stub is valid', function() {
      beforeEach(function() {
        const fnToStub = function () {
          return 3
        }
        return inspectah(fnToStub, 'returns', 3)
      })

      it('does nothing', function () {
        expect(console.log).to.not.have.been.called
      })
    })

    describe('the assumption made by the stub is incorrect', function() {
      beforeEach(function() {
        const fnToStub = function () {
          return 3
        }
        return inspectah(fnToStub, 'returns', 4)
      })

      it('reports the inconsistency to the console', function () {
        expect(console.log).to.have.been.called
      })
    })
  })

  describe('throws', function() {
    describe('the assumption made by the stub is valid', function() {
      beforeEach(function() {
        const fnToStub = function (){
          throw new Error()
        }
        return inspectah(fnToStub, 'throws', Error)
      })

      it('does nothing', function() {
        expect(console.log).to.not.have.been.called
      })
    })

    describe('the assumption made by the stub is incorrect', function() {
      beforeEach(function() {
        const fnToStub = function () {
          throw new SyntaxError()
        }
        return inspectah(fnToStub, 'throws', Error)
      })

      it('reports the inconsistency to the console', function () {
        expect(console.log).to.have.been.called
      })
    })
  })

  describe('yields', function() {
    describe('the assumption made by the stub is valid', function() {
      beforeEach(function() {
        const fnToStub = function(done) {
          done(null, 10)
        }
        return inspectah(fnToStub, 'yields', null, 10)
      })

      it('does nothing', function() {
        expect(console.log).to.not.have.been.called
      })
    })

    describe('the assumption made by the stub is incorrect', function() {
      beforeEach(function() {
        const fnToStub = function(done) {
          done(null, 10)
        }
        return inspectah(fnToStub, 'yields', null, 5)
      })

      it('reports the inconsistency to the console', function () {
        expect(console.log).to.have.been.called
      })
    })
  })
})
