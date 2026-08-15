// A small library. I export each function and also the whole object.
export function add(a: number, b: number): number { return a + b; }
export function subtract(a: number, b: number): number { return a - b; }
export function multiply(a: number, b: number): number { return a * b; }
export function divide(a: number, b: number): number { return a / b; }
const MathLib = { add, subtract, multiply, divide };
export default MathLib;
