# advanced-throttle-debounce

Converts a function into debounced or throttled one

- Well tested
- Supports both sync and async functions returning a value
- Can differentiate attempts by arguments, 'this' context, similar 'this' context, similar arguments
- Rich options for all needs
- Typescript support

## Terminology used in this documentation

- debounce (debounced) - used interchangeably with 'throttle' unless specified otherwise.
- ATTEMPT - an attempt to call a debounced function.
- CALL - a real call to function.
- ATTEMPT GROUP - a group of attempts that are divided by the 'wait' time and sometimes by the 'maxWait' time.
- LEADING CALL - the call in the beginning of an attempt group (simultaneously with LEADING ATTEMPT).
- TRAILING CALL - the call in the end of an attempt group. 'wait' time after the last ATTEMPT in the group.
- DIVIDING CALL - the call which divides too long groups of attempts into smaller groups by the 'maxWait' time (if it is provided in options).

## Features

- Choose between TRAILING and LEADING calls or choose them both – in this case the function will be CALLED twice except when there was only one ATTEMPT (can be overriden by 'forceDoubleCallEvenIfAttemptedOnlyOnes' flag).
- Choose the 'wait' time between ATTEMPTS in which they will be grouped.
- Choose the 'maxWait' time after which the ATTEMPT GROUP will be divided into smaller groups in order to avoid never-called situations.
- Both async and sync functions can return a value. This means that all ATTEMPTS are able to get a returned value. In all cases a Promise is returned by debounced function. If sync function throws an error, the Promise will be rejected.
- Choose whether the ATTEMPT should be considered as different if the arguments are different.
- Choose whether the ATTEMPT should be considered as different if the 'this' context is different.
- Choose whether the ATTEMPT should be considered as different if the 'this' context is an equal (similar) object but not the same.
- Choose whether the ATTEMPT should be considered as different if objects in arguments are similar but not the same.

### Coming soon

- changing of default options
- cancellation of TRAILING CALL before it is called. May be useful
- clearing of all ATTEMPTS and ATTEMPT GROUPS
- clearing of all ATTEMPTS for specific arguments and 'this' context

## Install

``` bash
npm install advanced-throttle-debounce
```

## Usage

[This tests](https://github.com/Oriery/debounce/tree/main/test) are ran in order to check the library. They are a good source of examples.

### Basic usage with default options (debounce)

``` js
const { debounce } = require('advanced-debounce-throttle');

function functionToDebounce(arg1, arg2) {
  console.log('functionToDebounce called');
  return arg1 + arg2;
}

const debouncedFunction = debounce(functionToDebounce, { wait: 1000 });

const result1 = debouncedFunction(1, 2);
const result2 = debouncedFunction(3, 4);
const result3 = debouncedFunction(1, 2);
// All results contain promises now
// result1 === result3

result1.then((result1) => {
  console.log(result1); // 3
});

result2.then((result2) => {
  console.log(result2); // 7
});

result3.then((result3) => {
  console.log(result3); // 3
});

/* Full output:
functionToDebounce called
7
functionToDebounce called
3
3
*/

```

As you can see, the function was called twice instead of thrice. Debouncer grouped the first and the third calls into one ATTEMPT GROUP and called the function only once. The second call was placed into another ATTEMPT GROUP because of different arguments (this is the default behaviour which can be changed by providing options).

## Options

### leading

Type: `boolean`

Default: `false`

Should the function be called on the leading edge.

### trailing

Type: `boolean`

Default: `true`

Should the function be called on the trailing edge.

### wait

Type: `number`

Default: `1000`

The time between attempts in milliseconds which is deviding the attempts into groups.

### maxWait

Type: `number`

Default: `Infinity`

The maximum length of the attempt group.

### differentArgs

Type: `boolean`

Default: `true`

Should the attempt be considered as different if the arguments are different.

### differentThis

Type: `boolean`

Default: `true`

Should the attempt be considered as different if the 'this' context is different.

### treatSimilarContextAsTheSame

Type: `boolean`

Default: `false`

Should the attempt be considered as different if the 'this' context is similar.

### treatSimilarArgsAsTheSame

Type: `boolean`

Default: `false`

Should the attempt be considered as different if objects in arguments are similar but not the same.

### forceDoubleCallEvenIfAttemptedOnlyOnes

Type: `boolean`

Default: `false`

Should the function be called twice if it was attempted only ones. By default if both 'leading' and 'trailing' are true, than only LEADING CALL will be called if there was only one attempt.
