export type Options = {
    leading?: boolean;
    trailing?: boolean;
    wait?: number;
    maxWait?: number;
    differentArgs?: boolean;
    differentThis?: boolean;
    treatSimilarContextAsTheSame?: boolean;
    treatSimilarArgsAsTheSame?: boolean;
    forceDoubleCallEvenIfAttemptedOnlyOnes?: boolean;
};
export declare function debounce(func: Function, options?: Options): (this: any) => Promise<any> | null;
