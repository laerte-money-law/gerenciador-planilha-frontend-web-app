declare global {
    interface NumberConstructor {
        /**
         * Returns a random integer between min (inclusive) and max (inclusive)
         * @param min The minimum value for the random integer (inclusive)
         * @param max The maximum value for the random integer (inclusive)
         * @returns A random integer between min and max (inclusive)
         */
        randomInt(min: number, max: number): number;
    }
}

Number.randomInt = function (min: number, max: number): number {
    // Swap min and max if min is greater than max
    if (min > max) {
        [min, max] = [max, min];
    }

    // Calculate the range of numbers
    const range = max - min + 1;

    // Generate a random number within the range
    return Math.floor(Math.random() * range) + min;
};

export {};
