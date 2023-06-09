/**
 * options that can be passed to the debounce function to change behavior of debouncing/throttling.
 */
export type Options = {
    /**
     * Should the function be called on the leading edge.
     * Default: false
     */
    leading?: boolean;
    /**
     * Should the function be called on the trailing edge.
     * Default: true
     */
    trailing?: boolean;
    /**
     * The time between attempts in milliseconds which is dividing the attempts into groups.
     * Default: 1000
     */
    wait?: number;
    /**
     * The maximum length of the attempt group.
     * Default: Infinity
     */
    maxWait?: number;
    /**
     * Should the attempt be considered as different if the arguments are different.
     * Default: true
     */
    differentArgs?: boolean;
    /**
     * Should the attempt be considered as different if the 'this' context is different.
     * Default: true
     */
    differentThis?: boolean;
    /**
     * Should the attempt be considered as different if the 'this' context is similar.
     * Default: false
     */
    treatSimilarContextAsTheSame?: boolean;
    /**
     * Should the attempt be considered as different if objects in arguments are similar but not the same.
     * Default: false
     */
    treatSimilarArgsAsTheSame?: boolean;
    /**
     * Should the function be called twice if it was attempted only once. By default if both 'leading' and 'trailing' are true, then only LEADING CALL will be called if there was only one attempt.
     * Default: false
     */
    forceDoubleCallEvenIfAttemptedOnlyOnes?: boolean;
};
export declare function debounce<T extends (...args: any[]) => any>(func: T, options?: Options): (...args: Parameters<T>) => Promise<ReturnType<T>>;
export declare function debounce<T extends (...args: any[]) => Promise<any>, R>(func: T, options?: Options): (...args: Parameters<T>) => ReturnType<T>;
