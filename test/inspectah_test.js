const sinon = require('sinon')
const chai = require('chai')
const chaiAsPromised = require("chai-as-promised")
const sinonChai = require("sinon-chai")
chai.use(chaiAsPromised)
chai.use(sinonChai)

const expect = chai.expect

const inspectah = require('../inspectah')

describe('inspectah', function () {
  describe('returns', function () {
    describe('the assumption made by the stub is valid', function() {
      beforeEach(function() {
        const fnToStub = function () {
          return 3
        }
        this.result = inspectah(fnToStub, 'returns', 3)
      })

      it('resolves to a stub', function () {
        return expect(this.result).to.eventually.be.a('function')
      })
    })

    describe('the assumption made by the stub is incorrect', function() {
      it('rejects with an error containing the failure summary', function () {
        const fnToStub = function () {
          return 3
        }
        return expect(inspectah(fnToStub, 'returns', 4))
          .to.be.rejectedWith('The assumption this stub makes is invalid!')
      })
    })
  })

  describe('throws', function() {
    describe('the assumption made by the stub is valid', function() {
      beforeEach(function() {
        const fnToStub = function (){
          throw new Error()
        }
        this.result = inspectah(fnToStub, 'throws', Error)
        return this.result
      })

      it('resolves to a stub', function() {
        return expect(this.result).to.eventually.be.a('function')
      })
    })

    describe('the assumption made by the stub is incorrect', function() {
      it('rejects with an error containing the failure summary', function () {
        const fnToStub = function () {
          throw new Error()
        }
        return expect(inspectah(fnToStub, 'throws', SyntaxError))
          .to.be.rejectedWith('The assumption this stub makes is invalid!')
      })
    })
  })

  describe('yields', function() {
    describe('the assumption made by the stub is valid', function() {
      beforeEach(function() {
        const fnToStub = function(done) {
          done(null, 10)
        }
        this.result = inspectah(fnToStub, 'yields', null, 10)
        return this.result
      })

      it('resolves to a stub', function() {
        return expect(this.result).to.eventually.be.a('function')
      })
    })

    describe('the assumption made by the stub is incorrect', function() {
      it('rejects with an error containing the failure summary', function () {
        const fnToStub = function(done) {
          done(null, 10)
        }
        return expect(inspectah(fnToStub, 'yields', null, 5))
          .to.be.rejectedWith('The assumption this stub makes is invalid!')
      })
    })
  })
})
