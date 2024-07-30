/**
 * 原群 (Magma) :=
 * 1. 存在一个集合 M
 * 2. 在集合 M 上定义了一个二元运算 ⊕ (姑且称之为 direct sum) ，使得 ⊕:M x M -> M ,即对于任意 a, b ∈ S ，都有 a * b ∈ S，即具有封闭性的二元运算
 */


/**
 * 原群的上的操作的定义。
 * 根据对应集合的不同，操作的实现可能会有所不同
 */
export interface MagmaOperation<T> {
    /**
     * 二元运算
     * @param a 
     * @param b 
     * @returns 
     */
    directSum: (a: T, b: T) => T;
}

export abstract class Magma<T> implements MagmaOperation<T>{
    /**
     * 定义在原群上的二元运算
     * @param a 
     * @param b 
     */
    abstract directSum(a: T, b: T): T
    /**
     * 代表原群集合的某个元素， rep ∈ T
     */
    abstract rep:T 
}

/**
 * 数值原群
 */
export class NumberMagma extends Magma<number>{
    directSum(a: number, b: number): number {
        return a + b
    }
    rep:number = 0

    constructor(rep:number){
        super()
        this.rep = rep
    }
}
