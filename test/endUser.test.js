/*eslint indent: ["error", 2]*/
/*eslint semi: ["error", "never", { "beforeStatementContinuationChars": "never"}] */

const chai = require("chai")
var chaiAsPromised = require("chai-as-promised")
chai.use(chaiAsPromised)
const expect = chai.expect
var sinon = require("sinon")
var sinonChai = require("sinon-chai")
chai.use(sinonChai)
const rewire = require("rewire")

var mock = require('mock-require');

// Controller to test
let controller = require("../index.js")

const sandbox = sinon.createSandbox() // for resetting all mocks/stubs/etc. after each test

const NORMAL_WAIT = 100
const FASTER_THAN_WAIT = 50
const LONGER_THAN_WAIT = 150

let testFunc
let debouncedTestFunc

console.log("running endUser.test.js ...")

beforeEach(() => {
  sandbox.restore()
  controller = rewire("../index.js")
  testFunc = sandbox.spy()
})

describe("end-user test", function () {

  describe("LEADING CALL only", function () {

    this.beforeEach(() => {
      debouncedTestFunc = controller.debounce(testFunc, { 
        leading: true, 
        trailing: false, 
        wait: NORMAL_WAIT
      })
    })

    it('should call LEADING CALL ones when one attempt is made', async () => {
      debouncedTestFunc()

      expect(testFunc).to.have.been.calledOnce
    })

    it('should NOT call TRAILING CALL', async () => {
      debouncedTestFunc()

      expect(testFunc).to.have.been.calledOnce
      sleep(LONGER_THAN_WAIT)
      expect(testFunc).to.have.been.calledOnce
    })

    it('should call LEADING CALL ones when 2 very fast attempts are made', async () => {
      debouncedTestFunc()
      debouncedTestFunc()

      expect(testFunc).to.have.been.calledOnce
    })

    it('should call LEADING CALL ones when 2 norm fast attempts are made', async () => {
      debouncedTestFunc()
      await sleep(FASTER_THAN_WAIT)
      debouncedTestFunc()

      expect(testFunc).to.have.been.calledOnce
    })

    it('should call LEADING CALL twice when 2 slow attempts are made', async () => {
      debouncedTestFunc()
      await sleep(LONGER_THAN_WAIT)
      debouncedTestFunc()

      expect(testFunc).to.have.been.calledTwice
    })

    describe('more complex tests', function () {
      it('should call LEADING CALL 3 times when lots of attempts are executed in 3 groups', async () => {
        debouncedTestFunc()
        debouncedTestFunc()
        debouncedTestFunc()
        await sleep(LONGER_THAN_WAIT)
        debouncedTestFunc()
        await sleep(LONGER_THAN_WAIT)
        debouncedTestFunc()
        debouncedTestFunc()

        expect(testFunc).to.have.been.calledThrice
      })
    })
  })

  describe("TRAILING CALL only", function () {
    this.beforeEach(() => {
      debouncedTestFunc = controller.debounce(testFunc, { 
        leading: false, 
        trailing: true, 
        wait: NORMAL_WAIT
      })
    })

    it('should NOT call LEADING CALL', async () => {
      debouncedTestFunc()

      expect(testFunc).to.not.have.been.called
    })

    it('should call TRAILING CALL ones when one attempt is made', async () => {
      debouncedTestFunc()

      await sleep(LONGER_THAN_WAIT)
      expect(testFunc).to.have.been.calledOnce
    })

    it('should call TRAILING CALL ones when 2 very fast attempts are made', async () => {
      debouncedTestFunc()
      debouncedTestFunc()

      await sleep(LONGER_THAN_WAIT)
      expect(testFunc).to.have.been.calledOnce
    })

    it('should call TRAILING CALL ones when 2 norm fast attempts are made', async () => {
      debouncedTestFunc()
      await sleep(FASTER_THAN_WAIT)
      debouncedTestFunc()

      await sleep(LONGER_THAN_WAIT)
      expect(testFunc).to.have.been.calledOnce
    })

    it('should call TRAILING CALL twice when 2 slow attempts are made', async () => {
      debouncedTestFunc()
      await sleep(LONGER_THAN_WAIT)
      debouncedTestFunc()

      await sleep(LONGER_THAN_WAIT)
      expect(testFunc).to.have.been.calledTwice
    })

    describe('more complex tests', function () {
      it('should call TRAILING CALL 3 times when lots of attempts are executed in 3 groups', async () => {
        debouncedTestFunc()
        debouncedTestFunc()
        debouncedTestFunc()
        await sleep(LONGER_THAN_WAIT)
        debouncedTestFunc()
        await sleep(LONGER_THAN_WAIT)
        debouncedTestFunc()
        debouncedTestFunc()

        await sleep(LONGER_THAN_WAIT)
        expect(testFunc).to.have.been.calledThrice
      })
    })
  })

  describe("LEADING and TRAILING together", function () {

    this.beforeEach(() => {
      debouncedTestFunc = controller.debounce(testFunc, { 
        leading: true, 
        trailing: true, 
        wait: NORMAL_WAIT
      })
    })

    it('should call LEADING CALL and TRAILING CALL ones each when 2 fast attempts are made', async () => {
      debouncedTestFunc()
      debouncedTestFunc()

      expect(testFunc).to.have.been.calledOnce
      await sleep(LONGER_THAN_WAIT)
      expect(testFunc).to.have.been.calledTwice
    })

    describe('only one attempt is made', function () {

      it('should only call LEADING CALL when one attempt is made (as oppose to calling both LEADING and TRAILING)', async () => {
        debouncedTestFunc()

        expect(testFunc).to.have.been.calledOnce
        await sleep(LONGER_THAN_WAIT)
        expect(testFunc).to.have.been.calledOnce
      })

      it('should call LEADING CALL and TRAILING CALL ones each when one attempt is made if "forceDoubleCallEvenIfAttemptedOnlyOnes" is specified', async () => {
        debouncedTestFunc = controller.debounce(testFunc, {
          leading: true,
          trailing: true,
          wait: NORMAL_WAIT,
          forceDoubleCallEvenIfAttemptedOnlyOnes: true
        })

        debouncedTestFunc()

        expect(testFunc).to.have.been.calledOnce
        await sleep(LONGER_THAN_WAIT)
        expect(testFunc).to.have.been.calledTwice
      })

    })

    it('should call LEADING CALL and TRAILING CALL twice each when 2 groups of attempts are made', async () => {
      debouncedTestFunc()
      debouncedTestFunc()
      await sleep(LONGER_THAN_WAIT)
      debouncedTestFunc()
      debouncedTestFunc()

      await sleep(LONGER_THAN_WAIT)
      expect(testFunc).to.have.callCount(4)
    })
  })

  describe('passing different arguments and different context (this)', function () {

    this.beforeEach(() => {
      debouncedTestFunc = controller.debounce(testFunc, {
        wait: NORMAL_WAIT
      })
    })

    it('should differentiate between different arguments by default', async () => {
      debouncedTestFunc(1)
      debouncedTestFunc(2)
      debouncedTestFunc(1)
      debouncedTestFunc(2)
      debouncedTestFunc('1')
      debouncedTestFunc('1', { a: 1 })

      expect(testFunc).to.have.callCount(4)
    })

    it('should differentiate between different arguments if "differentArgs" is true', async () => {
      debouncedTestFunc = controller.debounce(testFunc, {
        wait: NORMAL_WAIT,
        differentArgs: true
      })

      debouncedTestFunc(1)
      debouncedTestFunc(2)

      expect(testFunc).to.have.callCount(2)
    })

    it('should NOT differentiate between different arguments if "differentArgs" is false', async () => {
      debouncedTestFunc = controller.debounce(testFunc, {
        wait: NORMAL_WAIT,
        differentArgs: false
      })

      debouncedTestFunc(1)
      debouncedTestFunc(2)
      debouncedTestFunc(1)
      debouncedTestFunc(2)
      debouncedTestFunc('1')
      debouncedTestFunc('1', { a: 1 })

      expect(testFunc).to.have.callCount(1)
    })

    it('should differentiate between different context (this) by default', async () => {
      const obj1 = { a: 1 }
      const obj2 = { a: 2 }

      debouncedTestFunc.call(obj1)
      debouncedTestFunc.call(obj2)
      debouncedTestFunc.call(obj1)
      debouncedTestFunc.call(obj2)

      expect(testFunc).to.have.callCount(2)
    })

    it('should differentiate between different context (this) if "differentThis" is true', async () => {
      debouncedTestFunc = controller.debounce(testFunc, {
        wait: NORMAL_WAIT,
        differentThis: true
      })

      debouncedTestFunc.call({ a: 1 })
      debouncedTestFunc.call({ a: 2 })

      expect(testFunc).to.have.callCount(2)
    })

    it('should NOT differentiate between different context (this) if "differentThis" is false', async () => {
      debouncedTestFunc = controller.debounce(testFunc, {
        wait: NORMAL_WAIT,
        differentThis: false
      })

      debouncedTestFunc.call({ a: 1 })
      debouncedTestFunc.call({ a: 2 })
      debouncedTestFunc.call({ a: 1 })
      debouncedTestFunc.call({ a: 2 })

      expect(testFunc).to.have.callCount(1)
    })

    describe('differentiation between equal but not the same context', function () {

      it('should NOT differentiate between truly same context', async () => {
        const obj = { a: 1 }

        debouncedTestFunc.call(obj)
        debouncedTestFunc.call(obj)

        expect(testFunc).to.have.callCount(1)
      })

      it('should differentiate between equal but not the same context by default', async () => {
        debouncedTestFunc.call({ a: 1 })
        debouncedTestFunc.call({ a: 1 })

        expect(testFunc).to.have.callCount(2)
      })

      it('should NOT differentiate between equal but not the same context if "treatSimilarContextAsTheSame" is true', async () => {
        debouncedTestFunc = controller.debounce(testFunc, {
          wait: NORMAL_WAIT,
          treatSimilarContextAsTheSame: true
        })

        debouncedTestFunc.call({ a: 1 })
        debouncedTestFunc.call({ a: 1 })

        expect(testFunc).to.have.callCount(1)
      })

    })

    describe('differentiation between equal but not the same arguments', function () {
        
      it('should NOT differentiate between truly same arguments', async () => {
        const obj = { a: 1 }
        debouncedTestFunc(obj)
        debouncedTestFunc(obj)

        expect(testFunc).to.have.callCount(1)
      })

      it('should differentiate between equal but not the same arguments by default', async () => {
        debouncedTestFunc({ a: 1 })
        debouncedTestFunc({ a: 1 })

        expect(testFunc).to.have.callCount(2)
      })

      it('should NOT differentiate between equal but not the same arguments if "treatSimilarArgsAsTheSame" is true', async () => {
        debouncedTestFunc = controller.debounce(testFunc, {
          wait: NORMAL_WAIT,
          treatSimilarArgsAsTheSame: true
        })

        debouncedTestFunc({ a: 1 })
        debouncedTestFunc({ a: 1 })

        expect(testFunc).to.have.callCount(1)
      })

    })
  })
})

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
