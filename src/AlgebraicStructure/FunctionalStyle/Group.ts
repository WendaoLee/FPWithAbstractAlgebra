import { match } from 'ts-pattern'
import { Monoid } from './Monoid.ts'

/**
 * 群 (Group) :=
 * 1. 存在一个集合 G
 * 2. 在集合 G 上定义了一个二元运算 ⊕ ，使得 ⊕:G x G -> G
 * 3. 满足结合律，即对于任意 a, b, c ∈ G ，都有 (a ⊕ b) ⊕ c = a ⊕ (b ⊕ c)
 * 4. 存在单位元 e ∈ G ，使得对于任意 a ∈ G ，都有 e ⊕ a = a = a ⊕ e
 * 5. 对于每个元素 a ∈ G ，都存在逆元 a⁻¹ ∈ G ，使得 a ⊕ a⁻¹ = e = a⁻¹ ⊕ a
 * 
 * 群 = 幺半群 + 逆元
 */
export interface Group<G> extends Monoid<G> {
    /**
     * 逆元操作，返回元素的逆元
     */
    inverse: (a: G) => G
    /**
     * 逆元律验证
     * 由于 TypeScript 的限制，这里只能用注释来表达这个性质
     * @param a 要验证的元素
     * @param operation 二元运算
     * @param empty 单位元
     * @returns 是否满足逆元律
     */
    inverseLaw: (a: G, operation: (arg0: G, arg1: G) => G, empty: G) => boolean
}

/**
 * 整数加法群
 * (Z,+,0)
 * 每个元素的逆元是其相反数
 */
export const GroupIntegerWithAddition: Group<number> = {
    biOperation: (a: number, b: number): number => a + b,
    associative: (a, b, operation) => operation(operation(a, b), b) === operation(a, operation(b, a)),
    empty: 0,
    identity: (empty, ele, operation) => operation(empty, ele) === ele,
    inverse: (a: number): number => -a,
    inverseLaw: (a, operation, empty) => operation(a, -a) === empty
}

/**
 * 非零有理数乘法群
 * (Q\{0},*,1)
 * 每个元素的逆元是其倒数
 */
export const GroupNonZeroRationalWithMultiplication: Group<number> = {
    biOperation: (a: number, b: number): number => a * b,
    associative: (a, b, operation) => operation(operation(a, b), b) === operation(a, operation(b, a)),
    empty: 1,
    identity: (empty, ele, operation) => operation(empty, ele) === ele,
    inverse: (a: number): number => 1 / a,
    inverseLaw: (a, operation, empty) => operation(a, 1 / a) === empty
}

/**
 * 向量加法群
 */
export type Vector2D = {
    x: number
    y: number
}

export const GroupVector2DWithAddition: Group<Vector2D> = {
    biOperation: (a: Vector2D, b: Vector2D): Vector2D => ({
        x: a.x + b.x,
        y: a.y + b.y
    }),
    associative: (a, b, operation) => {
        const result1 = operation(operation(a, b), b)
        const result2 = operation(a, operation(b, a))
        return result1.x === result2.x && result1.y === result2.y
    },
    empty: { x: 0, y: 0 },
    identity: (empty, ele, operation) => {
        const result = operation(empty, ele)
        return result.x === ele.x && result.y === ele.y
    },
    inverse: (a: Vector2D): Vector2D => ({
        x: -a.x,
        y: -a.y
    }),
    inverseLaw: (a, operation, empty) => {
        const result = operation(a, { x: -a.x, y: -a.y })
        return result.x === empty.x && result.y === empty.y
    }
}

/**
 * 模 n 加法群
 */
export const createModularAdditionGroup = (n: number): Group<number> => {
    const mod = (x: number) => ((x % n) + n) % n
    return {
        biOperation: (a: number, b: number): number => mod(a + b),
        associative: (a, b, operation) => mod(operation(operation(a, b), b)) === mod(operation(a, operation(b, a))),
        empty: 0,
        identity: (empty, ele, operation) => operation(empty, ele) === ele,
        inverse: (a: number): number => mod(n - a),
        inverseLaw: (a, operation, empty) => operation(a, mod(n - a)) === empty
    }
}

/**
 * 对称群 S₃ 的元素
 */
export type Permutation = {
    name: string
    mapping: [number, number, number]
}

export const GroupS3Symmetric: Group<Permutation> = {
    biOperation: (a: Permutation, b: Permutation): Permutation => {
        const compose = (f: [number, number, number], g: [number, number, number]): [number, number, number] => {
            return [f[g[0] - 1], f[g[1] - 1], f[g[2] - 1]]
        }
        return {
            name: `${a.name} ∘ ${b.name}`,
            mapping: compose(a.mapping, b.mapping)
        }
    },
    associative: (a, b, operation) => {
        const result1 = operation(operation(a, b), b)
        const result2 = operation(a, operation(b, a))
        return JSON.stringify(result1.mapping) === JSON.stringify(result2.mapping)
    },
    empty: { name: 'id', mapping: [1, 2, 3] },
    identity: (empty, ele, operation) => {
        const result = operation(empty, ele)
        return JSON.stringify(result.mapping) === JSON.stringify(ele.mapping)
    },
    inverse: (a: Permutation): Permutation => {
        const findInverse = (perm: [number, number, number]): [number, number, number] => {
            return [
                perm.indexOf(1) + 1,
                perm.indexOf(2) + 1,
                perm.indexOf(3) + 1
            ]
        }
        return {
            name: `${a.name}⁻¹`,
            mapping: findInverse(a.mapping)
        }
    },
    inverseLaw: (a, operation, empty) => {
        const result = operation(a, {
            name: `${a.name}⁻¹`,
            mapping: [
                a.mapping.indexOf(1) + 1,
                a.mapping.indexOf(2) + 1,
                a.mapping.indexOf(3) + 1
            ]
        })
        return JSON.stringify(result.mapping) === JSON.stringify(empty.mapping)
    }
}

/**
 * 群同态
 */
export type GroupHomomorphism<G, H> = (a: G) => H

/**
 * 从整数加法群到模 n 加法群的同态
 */
export const createIntToModNHomomorphism = (n: number): GroupHomomorphism<number, number> => {
    return (a: number) => ((a % n) + n) % n
}