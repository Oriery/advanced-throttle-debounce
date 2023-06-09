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

const NORMAL_WAIT = 20
const FASTER_THAN_WAIT = 10
const LONGER_THAN_WAIT = 30

let testFunc = sandbox.spy()
let debouncedTestFunc = controller.debounce(testFunc, { 
  leading: true, 
  trailing: false, 
  wait: NORMAL_WAIT
})

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
      await sleep(LONGER_THAN_WAIT)
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

      it('should only call LEADING CALL when one attempt is made (as oppose to calling both LEADING and TRAILING) if "forceDoubleCallEvenIfAttemptedOnlyOnes" is false', async () => {
        debouncedTestFunc = controller.debounce(testFunc, {
          leading: true,
          trailing: true,
          wait: NORMAL_WAIT,
          forceDoubleCallEvenIfAttemptedOnlyOnes: false
        })

        debouncedTestFunc()

        expect(testFunc).to.have.been.calledOnce
        await sleep(LONGER_THAN_WAIT)
        expect(testFunc).to.have.been.calledOnce
      })

      it('should call LEADING CALL and TRAILING CALL ones each when one attempt is made if "forceDoubleCallEvenIfAttemptedOnlyOnes" is true', async () => {
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

  describe('passing arguments', function () {

    this.beforeEach(() => {
      debouncedTestFunc = controller.debounce(testFunc, {
        wait: NORMAL_WAIT,
        leading: true, 
        trailing: false, 
      })
    })

    it('should LEADING CALL a function with the correct arguments', async () => {
      debouncedTestFunc(1, '2', { a: 3 }, [4, 5])

      expect(testFunc).to.have.been.calledWith(1, '2', { a: 3 }, [4, 5])
    })

    it('should TRAILING CALL a function with the correct arguments', async () => {
      debouncedTestFunc = controller.debounce(testFunc, {
        wait: NORMAL_WAIT,
        trailing: true,
        leading: false
      })

      debouncedTestFunc(1, '2', { a: 3 }, [4, 5])

      await sleep(LONGER_THAN_WAIT)
      expect(testFunc).to.have.been.calledWith(1, '2', { a: 3 }, [4, 5])
    })

    describe('passing different arguments and different context (this)', function () {
  
      it('should differentiate between different arguments if "differentArgs" is true', async () => {
        debouncedTestFunc = controller.debounce(testFunc, {
          wait: NORMAL_WAIT,
          differentArgs: true,
          leading: true, 
          trailing: false, 
        })
  
        debouncedTestFunc(1)
        debouncedTestFunc(2)
  
        expect(testFunc).to.have.callCount(2)
      })
  
      it('should NOT differentiate between different arguments if "differentArgs" is false', async () => {
        debouncedTestFunc = controller.debounce(testFunc, {
          wait: NORMAL_WAIT,
          differentArgs: false,
          leading: true, 
          trailing: false, 
        })
  
        debouncedTestFunc(1)
        debouncedTestFunc(2)
        debouncedTestFunc(1)
        debouncedTestFunc(2)
        debouncedTestFunc('1')
        debouncedTestFunc('1', { a: 1 })
  
        expect(testFunc).to.have.callCount(1)
      })
  
      it('should differentiate between different context (this) if "differentThis" is true', async () => {
        debouncedTestFunc = controller.debounce(testFunc, {
          wait: NORMAL_WAIT,
          differentThis: true,
          leading: true, 
          trailing: false, 
        })
  
        debouncedTestFunc.call({ a: 1 })
        debouncedTestFunc.call({ a: 2 })
  
        expect(testFunc).to.have.callCount(2)
      })
  
      it('should NOT differentiate between different context (this) if "differentThis" is false', async () => {
        debouncedTestFunc = controller.debounce(testFunc, {
          wait: NORMAL_WAIT,
          differentThis: false,
          leading: true, 
          trailing: false, 
        })
  
        debouncedTestFunc.call({ a: 1 })
        debouncedTestFunc.call({ a: 2 })
        debouncedTestFunc.call({ a: 1 })
        debouncedTestFunc.call({ a: 2 })
  
        expect(testFunc).to.have.callCount(1)
      })

      it('should TRAILING CALL a function only with last attempted arguments if "differentArgs" is false', async () => {
        debouncedTestFunc = controller.debounce(testFunc, {
          wait: NORMAL_WAIT,
          trailing: true,
          leading: false,
          differentArgs: false
        })
  
        debouncedTestFunc(1)
        debouncedTestFunc(2)
  
        await sleep(LONGER_THAN_WAIT)
        expect(testFunc).to.not.have.been.calledWith(1)
        expect(testFunc).to.have.been.calledWith(2)
      })
  
      describe('differentiation between equal but not the same context', function () {
  
        it('should NOT differentiate between truly same context', async () => {
          const obj = { a: 1 }
  
          debouncedTestFunc.call(obj)
          debouncedTestFunc.call(obj)
  
          expect(testFunc).to.have.callCount(1)
        })
  
        it('should NOT differentiate between equal but not the same context if "treatSimilarContextAsTheSame" is true', async () => {
          debouncedTestFunc = controller.debounce(testFunc, {
            wait: NORMAL_WAIT,
            treatSimilarContextAsTheSame: true,
            leading: true, 
            trailing: false, 
          })
  
          debouncedTestFunc.call({ a: 1 })
          debouncedTestFunc.call({ a: 1 })
  
          expect(testFunc).to.have.callCount(1)
        })

        it('should differentiate between equal but not the same context if "treatSimilarContextAsTheSame" is false', async () => {
          debouncedTestFunc = controller.debounce(testFunc, {
            wait: NORMAL_WAIT,
            treatSimilarContextAsTheSame: false,
            leading: true, 
            trailing: false, 
          })
  
          debouncedTestFunc.call({ a: 1 })
          debouncedTestFunc.call({ a: 1 })
  
          expect(testFunc).to.have.callCount(2)
        })
  
      })
  
      describe('differentiation between equal but not the same arguments', function () {
          
        it('should NOT differentiate between truly same arguments', async () => {
          const obj = { a: 1 }
          debouncedTestFunc(obj)
          debouncedTestFunc(obj)
  
          expect(testFunc).to.have.callCount(1)
        })
  
        it('should NOT differentiate between equal but not the same arguments if "treatSimilarArgsAsTheSame" is true', async () => {
          debouncedTestFunc = controller.debounce(testFunc, {
            wait: NORMAL_WAIT,
            treatSimilarArgsAsTheSame: true,
            leading: true, 
            trailing: false, 
          })
  
          debouncedTestFunc({ a: 1 })
          debouncedTestFunc({ a: 1 })
  
          expect(testFunc).to.have.callCount(1)
        })

        it('should differentiate between equal but not the same arguments if "treatSimilarArgsAsTheSame" is false', async () => {
          debouncedTestFunc = controller.debounce(testFunc, {
            wait: NORMAL_WAIT,
            treatSimilarArgsAsTheSame: false,
            leading: true, 
            trailing: false, 
          })
  
          debouncedTestFunc({ a: 1 })
          debouncedTestFunc({ a: 1 })
  
          expect(testFunc).to.have.callCount(2)
        })

      })
    })
  })

  describe('async functions (Promises)', function () {

    let resolvingWith;

    this.beforeEach(() => {
      resolvingWith = 'resolved'
      testFunc = sandbox.stub().resolves(resolvingWith)

      debouncedTestFunc = controller.debounce(testFunc, {
        wait: NORMAL_WAIT
      })
    })

    it('should return a Promise to each attempt when LEADING CALL', async () => {
      const promise1 = debouncedTestFunc()
      const promise2 = debouncedTestFunc()

      expect(promise1).to.be.a('promise')
      expect(promise2).to.be.a('promise')
      expect(promise1).to.eventually.equal(resolvingWith)
      expect(promise2).to.eventually.equal(resolvingWith)
    })

    it('should return a Promise to each attempt when TRAILING CALL', async () => {
      debouncedTestFunc = controller.debounce(testFunc, {
        wait: NORMAL_WAIT,
        trailing: true,
        leading: false
      })

      const promise1 = debouncedTestFunc()
      const promise2 = debouncedTestFunc()

      await sleep(LONGER_THAN_WAIT)
      expect(promise1).to.be.a('promise')
      expect(promise2).to.be.a('promise')
      expect(promise1).to.eventually.equal(resolvingWith)
      expect(promise2).to.eventually.equal(resolvingWith)
    })

    it('should work properly with erroring async functions', async () => {
      const error = new Error('error')
      testFunc = sandbox.stub().rejects(error)

      debouncedTestFunc = controller.debounce(testFunc, {
        wait: NORMAL_WAIT
      })

      const promise1 = debouncedTestFunc()
      const promise2 = debouncedTestFunc()

      expect(promise1).to.be.a('promise')
      expect(promise2).to.be.a('promise')
      expect(promise1).to.eventually.be.rejectedWith(error)
      expect(promise2).to.eventually.be.rejectedWith(error)
    })

  })

  describe('sync functions (debouce converts them into async which return a promise)', function () {

    let returnsWhat;

    this.beforeEach(() => {
      returnsWhat = 'result'
      testFunc = sandbox.stub().returns(returnsWhat)

      debouncedTestFunc = controller.debounce(testFunc, {
        wait: NORMAL_WAIT
      })
    })

    it('should return a resolved Promise to each attempt when LEADING CALL', async () => {
      const promise1 = debouncedTestFunc()
      const promise2 = debouncedTestFunc()

      expect(promise1).to.be.a('promise')
      expect(promise2).to.be.a('promise')
      expect(promise1).to.eventually.equal(returnsWhat)
      expect(promise2).to.eventually.equal(returnsWhat)
    })

    it('should return a resolved Promise to each attempt when TRAILING CALL', async () => {
      debouncedTestFunc = controller.debounce(testFunc, {
        wait: NORMAL_WAIT,
        trailing: true,
        leading: false
      })

      const promise1 = debouncedTestFunc()
      const promise2 = debouncedTestFunc()

      await sleep(LONGER_THAN_WAIT)
      expect(promise1).to.be.a('promise')
      expect(promise2).to.be.a('promise')
      expect(promise1).to.eventually.equal(returnsWhat)
      expect(promise2).to.eventually.equal(returnsWhat)
    })

    it('should return a rejected Promise when sync function thrown error', async () => {
      const error = new Error('error')
      testFunc = sandbox.stub().throws(error)

      debouncedTestFunc = controller.debounce(testFunc, {
        wait: NORMAL_WAIT
      })

      const promise1 = debouncedTestFunc()
      const promise2 = debouncedTestFunc()

      expect(promise1).to.be.a('promise')
      expect(promise2).to.be.a('promise')

      expect(promise1).to.eventually.be.rejectedWith(error)
      expect(promise2).to.eventually.be.rejectedWith(error)
    })

  })

  describe('should remove group of attempts after "maxWait" has passed (new call after maxWait has passed will be in separate group)', function () {

    // There is no good way to test whether maxWait is Infinity by default

    it('should LEADING CALL in old and new group', async () => {
      debouncedTestFunc = controller.debounce(testFunc, {
        wait: NORMAL_WAIT,
        maxWait: 2 * NORMAL_WAIT,
        leading: true,
        trailing: false
      })

      debouncedTestFunc()
      await sleep(NORMAL_WAIT / 2)
      debouncedTestFunc()
      await sleep(NORMAL_WAIT / 2)
      debouncedTestFunc()
      await sleep(NORMAL_WAIT / 2)
      debouncedTestFunc()
      await sleep(NORMAL_WAIT / 2)
      debouncedTestFunc()

      await sleep(LONGER_THAN_WAIT)
      expect(testFunc).to.have.been.calledTwice
    })

    it('should TRAILING CALL in old and new group', async () => {
      debouncedTestFunc = controller.debounce(testFunc, {
        wait: NORMAL_WAIT,
        maxWait: 2 * NORMAL_WAIT,
        leading: false,
        trailing: true
      })

      debouncedTestFunc()
      await sleep(NORMAL_WAIT / 2)
      debouncedTestFunc()
      await sleep(NORMAL_WAIT / 2)
      debouncedTestFunc()
      await sleep(NORMAL_WAIT / 2)
      debouncedTestFunc()
      await sleep(NORMAL_WAIT / 2)
      debouncedTestFunc()

      await sleep(LONGER_THAN_WAIT)
      expect(testFunc).to.have.been.calledTwice
    })

  })

  describe('defaults', function () {

    this.beforeEach(() => {
      debouncedTestFunc = controller.debounce(testFunc, {
        wait: NORMAL_WAIT,
        leading: true, 
        trailing: false,
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

    it('should differentiate between different context (this) by default', async () => {
      const obj1 = { a: 1 }
      const obj2 = { a: 2 }

      debouncedTestFunc.call(obj1)
      debouncedTestFunc.call(obj2)
      debouncedTestFunc.call(obj1)
      debouncedTestFunc.call(obj2)

      expect(testFunc).to.have.callCount(2)
    })
    
    it('should differentiate between equal but not the same context by default', async () => {
      debouncedTestFunc.call({ a: 1 })
      debouncedTestFunc.call({ a: 1 })

      expect(testFunc).to.have.callCount(2)
    })

    it('should differentiate between equal but not the same arguments by default', async () => {
      debouncedTestFunc({ a: 1 })
      debouncedTestFunc({ a: 1 })

      expect(testFunc).to.have.callCount(2)
    })

    it('should NOT call LEADING CALL by default', async () => {
        debouncedTestFunc = controller.debounce(testFunc, {
        wait: NORMAL_WAIT,
      })

      debouncedTestFunc()
      debouncedTestFunc()

      expect(testFunc).to.have.not.been.called
    })

    it('should call TRAILING CALL by default', async () => {
      debouncedTestFunc()
      debouncedTestFunc()

      await sleep(LONGER_THAN_WAIT)
      expect(testFunc).to.have.been.calledOnce
    })

    it('should only call LEADING CALL when one attempt is made (as oppose to calling both LEADING and TRAILING) by default', async () => {
      debouncedTestFunc = controller.debounce(testFunc, {
        wait: NORMAL_WAIT,
        trailing: true,
        leading: true,
      })

      debouncedTestFunc()

      expect(testFunc).to.have.been.calledOnce
      await sleep(LONGER_THAN_WAIT)
      expect(testFunc).to.have.been.calledOnce
    })

    describe('should have default "wait" of 1000', function () {

      const EXPECTED_DEFAULT_WAIT = 1000;
      this.slow(EXPECTED_DEFAULT_WAIT * 2.1)

      this.beforeEach(() => {
        debouncedTestFunc = controller.debounce(testFunc, {
          leading: true,
          trailing: false,
        })
      })

      it('more than 970', async () => {
        debouncedTestFunc()
        await sleep(EXPECTED_DEFAULT_WAIT - 30)
        debouncedTestFunc()

        expect(testFunc).to.have.been.calledOnce
      })

      it('less than 1030', async () => {
        debouncedTestFunc()
        await sleep(EXPECTED_DEFAULT_WAIT + 30)
        debouncedTestFunc()

        expect(testFunc).to.have.been.calledTwice
      })

    })

  })

})

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
