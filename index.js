"use strict";
// ATTEMPT - an attempt to call a debounced function.
// CALL - a real call to function.
// ATTEMPT GROUP - a group of attempts that are divided by the 'wait' time and sometimes forced to divide because of the 'maxWait' time.
// LEADING ATTEMPT - the first attempt in the attempt group.
// TRAILING ATTEMPT - the last attempt in the attempt group.
// LEADING CALL - the call in the beginning of an attempt group (simultaneously with LEADING ATTEMPT).
// TRAILING CALL - the call in the end of an attempt group. 'wait' time after the last ATTEMPT in the group.
// DIVIDING CALL - the call which divides too long groups of attempts into smaller groups by the 'maxWait' time.
Object.defineProperty(exports, "__esModule", { value: true });
exports.debounce = void 0;
const defaultOptions = {
    leading: false,
    trailing: true,
    wait: 1000,
    maxWait: Infinity,
    differentArgs: true,
    differentThis: true,
    treatSimilarContextAsTheSame: false,
    treatSimilarArgsAsTheSame: false,
    forceDoubleCallEvenIfAttemptedOnlyOnes: false
};
function debounce(func, options = {}) {
    options = Object.assign({}, defaultOptions, options);
    checkOptions(options);
    const map = new Map();
    const mapOfSimilarObjectsHashes = new Map();
    return function (...args) {
        const context = this;
        const hash = getHashForMap(context, args);
        let element = map.get(hash);
        if (!element) {
            newElement();
        }
        else {
            existingElement(element);
        }
        element = map.get(hash);
        return element.promise;
        function newElement(forceCallLeading = false) {
            setupElement();
            if (forceCallLeading) {
                callFunc();
            }
            else {
                callLeadingIfNeeded();
            }
        }
        function existingElement(element) {
            element.timesAttempted++;
            clearTimeout(element.timeoutForWait || undefined);
            element.timeoutForWait = setTimeout(timeoutWentOff, options.wait, hash);
        }
        function setupElement() {
            const defferedPromise = new Deferred();
            const element = {
                func: func,
                timeoutForWait: null,
                timeoutForMaxWait: null,
                timesAttempted: 1,
                defProm: defferedPromise,
                promise: defferedPromise.promise
            };
            element.timeoutForWait = setTimeout(timeoutWentOff, options.wait, hash);
            if (options.maxWait && options.maxWait !== Infinity) {
                element.timeoutForMaxWait = setTimeout(timeoutMaxWaitWentOff, options.maxWait);
            }
            map.set(hash, element);
        }
        function timeoutWentOff(hash) {
            callTrailingIfNeeded(hash);
            clearElement(hash);
        }
        function timeoutMaxWaitWentOff() {
            clearElement(hash);
            newElement(true);
        }
        function callLeadingIfNeeded() {
            if (options.leading) {
                callFunc();
            }
        }
        function callTrailingIfNeeded(hash) {
            if (options.trailing) {
                const element = map.get(hash);
                // don't call trailing if there was only one attempt and both leading and trailing are true
                if (element && options.leading && element.timesAttempted === 1 && !options.forceDoubleCallEvenIfAttemptedOnlyOnes) {
                    return;
                }
                callFunc();
            }
        }
        function callFunc() {
            const element = map.get(hash);
            let res;
            try {
                res = func.apply(context, args);
            }
            catch (err) {
                element.defProm.reject(err);
                return;
            }
            if (res instanceof Promise) {
                res.then((result) => {
                    element.defProm.resolve(result);
                }).catch((err) => {
                    element.defProm.reject(err);
                });
            }
            else {
                element.defProm.resolve(res);
            }
        }
    };
    function clearElement(hash) {
        const element = map.get(hash);
        if (element) {
            if (element.timeoutForWait) {
                clearTimeout(element.timeoutForWait);
            }
            if (element.timeoutForMaxWait) {
                clearTimeout(element.timeoutForMaxWait);
            }
            map.delete(hash);
        }
    }
    function getHashForMap(context, args) {
        let hashOfThis = '';
        let hashOfArgs = '';
        if (options.differentThis) {
            if (options.treatSimilarContextAsTheSame) {
                hashOfThis = simpleHash(JSON.stringify(context, getCircularReplacer()));
            }
            else {
                if (typeof context === 'object') {
                    hashOfThis = getUniqueHashOfObject(context);
                }
                else {
                    hashOfThis = simpleHash(JSON.stringify(context, getCircularReplacer()));
                }
            }
        }
        if (options.differentArgs) {
            if (options.treatSimilarArgsAsTheSame) {
                hashOfArgs = simpleHash(JSON.stringify(args, getCircularReplacer()));
            }
            else {
                for (let arg of args) {
                    if (typeof arg === 'object') {
                        hashOfArgs += getUniqueHashOfObject(arg);
                    }
                    else {
                        hashOfArgs += simpleHash(JSON.stringify(arg, getCircularReplacer()));
                    }
                }
            }
        }
        return simpleHash(hashOfThis + hashOfArgs);
    }
    function getUniqueHashOfObject(object) {
        const hash = mapOfSimilarObjectsHashes.get(object);
        if (hash) {
            return hash;
        }
        else {
            const newHash = simpleHash(JSON.stringify(object, getCircularReplacer()) + Math.random());
            mapOfSimilarObjectsHashes.set(object, newHash);
            return newHash;
        }
    }
}
exports.debounce = debounce;
const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
                return;
            }
            seen.add(value);
        }
        return value;
    };
};
function checkOptions(options) {
    if (options.wait && options.wait < 0) {
        throw new Error("The 'wait' option can't be negative.");
    }
    if (options.maxWait && options.maxWait < 0) {
        throw new Error("The 'maxWait' option can't be negative.");
    }
    if (options.wait && !(typeof options.wait !== 'undefined' || typeof options.wait !== 'number')) {
        throw new Error("The 'wait' option must be a number if provided.");
    }
    if (options.maxWait && !(typeof options.maxWait !== 'undefined' || typeof options.maxWait !== 'number')) {
        throw new Error("The 'maxWait' option must be a number if provided.");
    }
    if (options.wait && options.maxWait && options.wait > options.maxWait) {
        throw new Error("The 'wait' option can't be greater than the 'maxWait' option.");
    }
    if (typeof options.leading !== 'undefined' && typeof options.leading !== 'boolean') {
        throw new Error("The 'leading' option must be a boolean if provided.");
    }
    if (typeof options.trailing !== 'undefined' && typeof options.trailing !== 'boolean') {
        throw new Error("The 'trailing' option must be a boolean if provided.");
    }
    if (typeof options.differentArgs !== 'undefined' && typeof options.differentArgs !== 'boolean') {
        throw new Error("The 'differentArgs' option must be a boolean if provided.");
    }
    if (typeof options.differentThis !== 'undefined' && typeof options.differentThis !== 'boolean') {
        throw new Error("The 'differentThis' option must be a boolean if provided.");
    }
    if (typeof options.treatSimilarContextAsTheSame !== 'undefined' && typeof options.treatSimilarContextAsTheSame !== 'boolean') {
        throw new Error("The 'treatSimilarContextAsTheSame' option must be a boolean if provided.");
    }
    if (typeof options.treatSimilarArgsAsTheSame !== 'undefined' && typeof options.treatSimilarArgsAsTheSame !== 'boolean') {
        throw new Error("The 'treatSimilarArgsAsTheSame' option must be a boolean if provided.");
    }
    if (typeof options.forceDoubleCallEvenIfAttemptedOnlyOnes !== 'undefined' && typeof options.forceDoubleCallEvenIfAttemptedOnlyOnes !== 'boolean') {
        throw new Error("The 'forceDoubleCallEvenIfAttemptedOnlyOnes' option must be a boolean if provided.");
    }
}
function simpleHash(input) {
    let encoder = new TextEncoder();
    let data = encoder.encode(input);
    let hash1 = 0, hash2 = 0, hash3 = 0, hash4 = 0, hash5 = 0, hash6 = 0;
    for (let i = 0; i < data.length; i++) {
        switch (i % 6) {
            case 0:
                hash1 = hash1 ^ data[i];
                break;
            case 1:
                hash2 = hash2 ^ data[i];
                break;
            case 2:
                hash3 = hash3 ^ data[i];
                break;
            case 3:
                hash4 = hash4 ^ data[i];
                break;
            case 4:
                hash5 = hash5 ^ data[i];
                break;
            case 5:
                hash6 = hash6 ^ data[i];
                break;
        }
    }
    return ((hash1 << 40) | (hash2 << 32) | (hash3 << 24) | (hash4 << 16) | (hash5 << 8) | hash6).toString(16);
}
class Deferred {
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.reject = reject;
            this.resolve = resolve;
        });
    }
}
