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
        this.fnToStub = function () {
          return 3
        }
        this.outcomeOrStubPromise = inspectah(this.fnToStub, 'returns', 3)
        return this.outcomeOrStubPromise
      })

      it('resolves to a stub', function () {
        return expect(this.outcomeOrStubPromise).to.eventually.be.a('function')
      })

      describe('the stub', function() {
        before(function(done) {
          this.outcomeOrStubPromise.then((stub) => {
            this.stub = stub
            done()
          })
        })

        it('returns the expected value when called', function() {
          expect(this.stub()).to.eql(3)
        })

        it('is not the same as the original function', function() {
          expect(this.stub).to.not.eql(this.fnToStub)
        })
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
        this.fnToStub = function (){
          throw new Error()
        }
        this.outcomeOrStubPromise = inspectah(this.fnToStub, 'throws', Error)
        return this.outcomeOrStubPromise
      })

      it('resolves to a stub', function() {
        return expect(this.outcomeOrStubPromise).to.eventually.be.a('function')
      })

      describe('the stub', function() {
        before(function(done) {
          this.outcomeOrStubPromise.then((stub) => {
            this.stub = stub
            done()
          })
        })

        it('throws the expected error when called', function() {
          expect(this.stub).to.throw(Error)
        })

        it('is not the same as the original function', function() {
          expect(this.stub).to.not.eql(this.fnToStub)
        })
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
        this.fnToStub = function(done) {
          done(null, 10)
        }
        this.outcomeOrStubPromise = inspectah(this.fnToStub, 'yields', null, 10)
        return this.outcomeOrStubPromise
      })

      it('resolves to a stub', function() {
        return expect(this.outcomeOrStubPromise).to.eventually.be.a('function')
      })

      describe('the stub', function() {
        before(function(done) {
          this.outcomeOrStubPromise.then((stub) => {
            this.stub = stub
            done()
          })
        })

        it('yields the expected values when called', function(done) {
          this.stub(function(err, val) {
            expect(err).to.be.null
            expect(val).to.eql(10)
            done()
          })
        })

        it('is not the same as the original function', function() {
          expect(this.stub).to.not.eql(this.fnToStub)
        })
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
