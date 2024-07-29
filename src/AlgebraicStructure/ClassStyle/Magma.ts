/**
 * 原群 (Magma) :=
 * 1. 存在一个集合 M
 * 2. 在集合 M 上定义了一个二元运算 ⊕ (姑且称之为 direct sum) ，使得 ⊕:M x M -> M ,即对于任意 a, b ∈ S ，都有 a * b ∈ S，即具有封闭性的二元运算
 */


/**
 * 原群的上的操作的定义。
 * 根据对应集合的不同，操作的实现可能会有所不同
 */
interface MagmaOperation<T> {
    /**
     * 二元运算
     * @param a 
     * @param b 
     * @returns 
     */
    directSum: (a: T, b: T) => T;
}

/**
 * 供给 class 使用的原群定义
 * 使用 setter 和 getter 来明确的表明这是一个值
 */
export interface Magma<T> extends MagmaOperation<T> {
    _val: T
    get val(): T
    set val(val: T)
} 

export class NumbericMagma implements Magma<number>{
    _val: number;
    directSum(a: number, b: number): number {
        return a + b
    }

    constructor(val: number) {
        this._val = val
    }

    get val() {
        return this._val
    }

    set val(val: number) {
        this._val = val
    }
}

export class StringMagma implements Magma<string>{
    _val: string;

    directSum(a: string, b: string): string {
        return a + b
    }

    constructor(val: string) {
        this._val = val
    }

    get val() {
        return this._val
    }

    set val(val: string) {
        this._val = val
    }
}
