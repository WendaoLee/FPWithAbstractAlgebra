import { match } from 'ts-pattern'


/**
 * @inspiredBy fp-ts
 * 原群 (Magma) :=
 * 1. 存在一个集合 M
 * 2. 在集合 M 上定义了一个二元运算 ⊕ ，使得 ⊕:M x M -> M ,即对于任意 a, b ∈ S ，都有 a * b ∈ S，即具有封闭性的二元运算
 * 根据对应集合的不同，操作的实现可能会有所不同
 */
export interface Magma<M> {
    /**
     * 二元运算, ⊕ ，它可以是 加法、乘法、减法等
     * @param a 
     * @param b 
     * @returns 
     */
    biOperation: (a: M, b: M) => M;
}

/**
 * @inspiredBy fp-ts/number.ts
 * @note 由于 TypeScript 不存在 Int ，所以无法定义 PPT 上的 Int原群
 * 一个 数值加法原群 (Number,+)
 */
export const MagmaNumberWithAddition: Magma<number> = {
    biOperation: (a: number, b: number): number => a + b
}

/**
 * 一个 数值减法原群 (Number,-)
 */
export const MagmaNumberWithSubtraction: Magma<number> = {
    biOperation: (a: number, b: number): number => a - b
}


/**
 * -------------------------------------
 * 以下是对于 全二叉树原群 的定义
 * -------------------------------------
 */

/**
 * 全二叉树的节点
 */
export type Tree<M> = Leaf<M> | Fork<M>

/**
 * 关于这种表达方式
 * @see https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html#discriminated-unions
 */
interface Leaf<M> {
    kind: 'Leaf'
    value: M
}

interface Fork<M> {
    kind: 'Fork'
    left: Tree<M>
    right: Tree<M>
}

const sampleNumberTree: Tree<number> = {
    kind: 'Fork',
    left: {
        kind: 'Leaf',
        value: 1
    },
    right: {
        kind: 'Fork',
        left: {
            kind: 'Leaf',
            value: 2
        },
        right: {
            kind: 'Leaf',
            value: 3
        }
    }
}

/**
 * 全二叉树带 Fork 操作的原群
 */
export const MagmaFullBinaryTreeWithFork: Magma<Tree<number>> = {
    /**
     * 操作 fork ，将两个二叉树合并为一个新的二叉树
     * @param a 
     * @param b 
     * @returns 
     */
    biOperation: (a: Tree<number>, b: Tree<number>): Tree<number> => ({
        kind: 'Fork',
        left: a,
        right: b
    })
}

/**
 * tsum :: Tree Number -> Number
 * 实质上是一个在 (Tree Number,⊕) 和 （Number,⊕）之间的同态态射
 */
type tsum = (a: Tree<number>) => number
export const tsum: tsum = (a: Tree<number>): number => {
    return match(a)
        /**
         * tsum (Leaf n) = n
         */
        .with({ kind: 'Leaf' }, ({ value }) => value)
        /**
         * tsum (Fork left right) = tsum left + tsum right
         */
        .with({ kind: 'Fork' }, ({ left, right }) => tsum(left) + tsum(right))
        .run()
}