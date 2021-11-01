export function add(...numbers: number[]) {
    return numbers.reduce((acc, x) => acc + x, 0);
}