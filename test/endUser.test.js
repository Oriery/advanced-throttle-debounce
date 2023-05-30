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

console.log("controller", controller)

const sandbox = sinon.createSandbox() // for resetting all mocks/stubs/etc. after each test

const NORMAL_WAIT = 100
const FASTER_THAN_WAIT = 50
const LONGER_THAN_WAIT = 150

let testFunc
let debouncedTestFunc

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

  describe("LEADING and TRAILING CALL", function () {

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
})

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
