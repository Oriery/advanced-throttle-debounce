
# SUMMARY:

Passed: `46`

Failed: `0`

Total: `46`


# TESTS:
status | test
--- | ---
success | end-user test LEADING CALL only should call LEADING CALL ones when one attempt is made
success | end-user test LEADING CALL only should NOT call TRAILING CALL
success | end-user test LEADING CALL only should call LEADING CALL ones when 2 very fast attempts are made
success | end-user test LEADING CALL only should call LEADING CALL ones when 2 norm fast attempts are made
success | end-user test LEADING CALL only should call LEADING CALL twice when 2 slow attempts are made
success | end-user test LEADING CALL only more complex tests should call LEADING CALL 3 times when lots of attempts are executed in 3 groups
success | end-user test TRAILING CALL only should NOT call LEADING CALL
success | end-user test TRAILING CALL only should call TRAILING CALL ones when one attempt is made
success | end-user test TRAILING CALL only should call TRAILING CALL ones when 2 very fast attempts are made
success | end-user test TRAILING CALL only should call TRAILING CALL ones when 2 norm fast attempts are made
success | end-user test TRAILING CALL only should call TRAILING CALL twice when 2 slow attempts are made
success | end-user test TRAILING CALL only more complex tests should call TRAILING CALL 3 times when lots of attempts are executed in 3 groups
success | end-user test LEADING and TRAILING together should call LEADING CALL and TRAILING CALL ones each when 2 fast attempts are made
success | end-user test LEADING and TRAILING together should call LEADING CALL and TRAILING CALL twice each when 2 groups of attempts are made
success | end-user test LEADING and TRAILING together only one attempt is made should only call LEADING CALL when one attempt is made (as oppose to calling both LEADING and TRAILING) if "forceDoubleCallEvenIfAttemptedOnlyOnes" is false
success | end-user test LEADING and TRAILING together only one attempt is made should call LEADING CALL and TRAILING CALL ones each when one attempt is made if "forceDoubleCallEvenIfAttemptedOnlyOnes" is true
success | end-user test passing arguments should LEADING CALL a function with the correct arguments
success | end-user test passing arguments should TRAILING CALL a function with the correct arguments
success | end-user test passing arguments passing different arguments and different context (this) should differentiate between different arguments if "differentArgs" is true
success | end-user test passing arguments passing different arguments and different context (this) should NOT differentiate between different arguments if "differentArgs" is false
success | end-user test passing arguments passing different arguments and different context (this) should differentiate between different context (this) if "differentThis" is true
success | end-user test passing arguments passing different arguments and different context (this) should NOT differentiate between different context (this) if "differentThis" is false
success | end-user test passing arguments passing different arguments and different context (this) should TRAILING CALL a function only with last attempted arguments if "differentArgs" is false
success | end-user test passing arguments passing different arguments and different context (this) differentiation between equal but not the same context should NOT differentiate between truly same context
success | end-user test passing arguments passing different arguments and different context (this) differentiation between equal but not the same context should NOT differentiate between equal but not the same context if "treatSimilarContextAsTheSame" is true
success | end-user test passing arguments passing different arguments and different context (this) differentiation between equal but not the same context should differentiate between equal but not the same context if "treatSimilarContextAsTheSame" is false
success | end-user test passing arguments passing different arguments and different context (this) differentiation between equal but not the same arguments should NOT differentiate between truly same arguments
success | end-user test passing arguments passing different arguments and different context (this) differentiation between equal but not the same arguments should NOT differentiate between equal but not the same arguments if "treatSimilarArgsAsTheSame" is true
success | end-user test passing arguments passing different arguments and different context (this) differentiation between equal but not the same arguments should differentiate between equal but not the same arguments if "treatSimilarArgsAsTheSame" is false
success | end-user test async functions (Promises) should return a Promise to each attempt when LEADING CALL
success | end-user test async functions (Promises) should return a Promise to each attempt when TRAILING CALL
success | end-user test async functions (Promises) should work properly with erroring async functions
success | end-user test sync functions (debouce converts them into async which return a promise) should return a resolved Promise to each attempt when LEADING CALL
success | end-user test sync functions (debouce converts them into async which return a promise) should return a resolved Promise to each attempt when TRAILING CALL
success | end-user test sync functions (debouce converts them into async which return a promise) should return a rejected Promise when sync function thrown error
success | end-user test should remove group of attempts after "maxWait" has passed (new call after maxWait has passed will be in separate group) should LEADING CALL in old and new group
success | end-user test should remove group of attempts after "maxWait" has passed (new call after maxWait has passed will be in separate group) should TRAILING CALL in old and new group
success | end-user test defaults should differentiate between different arguments by default
success | end-user test defaults should differentiate between different context (this) by default
success | end-user test defaults should differentiate between equal but not the same context by default
success | end-user test defaults should differentiate between equal but not the same arguments by default
success | end-user test defaults should NOT call LEADING CALL by default
success | end-user test defaults should call TRAILING CALL by default
success | end-user test defaults should only call LEADING CALL when one attempt is made (as oppose to calling both LEADING and TRAILING) by default
success | end-user test defaults should have default "wait" of 1000 more than 970
success | end-user test defaults should have default "wait" of 1000 less than 1030

