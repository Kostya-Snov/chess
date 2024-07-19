export const createArray = <T>(length: number, map: (index: number) => T): T[] =>
    Array.from({ length }, (_, i) => map(i));
