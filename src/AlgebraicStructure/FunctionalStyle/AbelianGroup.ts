import { match } from 'ts-pattern'
import { Group } from './Group.ts'

/**
 * 交换群 (Abelian Group) :=
 * 1. 满足群的所有性质
 * 2. 满足交换律，即对于任意 a, b ∈ G ，都有 a ⊕ b = b ⊕ a
 * 
 * 交换群 = 群 + 交换律
 */
export interface AbelianGroup<G> extends Group<G> {
    /**
     * 交换律验证
     * @param a 第一个元素
     * @param b 第二个元素
     * @param operation 二元运算
     * @returns 是否满足交换律
     */
    commutative: (a: G, b: G, operation: (arg0: G, arg1: G) => G) => boolean
}

/**
 * 整数加法交换群
 * (Z,+,0)
 */
export const AbelianGroupIntegerWithAddition: AbelianGroup<number> = {
    biOperation: (a: number, b: number): number => a + b,
    associative: (a, b, operation) => operation(operation(a, b), b) === operation(a, operation(b, a)),
    empty: 0,
    identity: (empty, ele, operation) => operation(empty, ele) === ele,
    inverse: (a: number): number => -a,
    inverseLaw: (a, operation, empty) => operation(a, -a) === empty,
    commutative: (a, b, operation) => operation(a, b) === operation(b, a)
}

/**
 * 实数加法交换群
 * (R,+,0)
 */
export const AbelianGroupRealWithAddition: AbelianGroup<number> = {
    biOperation: (a: number, b: number): number => a + b,
    associative: (a, b, operation) => operation(operation(a, b), b) === operation(a, operation(b, a)),
    empty: 0,
    identity: (empty, ele, operation) => operation(empty, ele) === ele,
    inverse: (a: number): number => -a,
    inverseLaw: (a, operation, empty) => operation(a, -a) === empty,
    commutative: (a, b, operation) => operation(a, b) === operation(b, a)
}

/**
 * 非零实数乘法交换群
 * (R\{0},*,1)
 */
export const AbelianGroupNonZeroRealWithMultiplication: AbelianGroup<number> = {
    biOperation: (a: number, b: number): number => a * b,
    associative: (a, b, operation) => operation(operation(a, b), b) === operation(a, operation(b, a)),
    empty: 1,
    identity: (empty, ele, operation) => operation(empty, ele) === ele,
    inverse: (a: number): number => 1 / a,
    inverseLaw: (a, operation, empty) => operation(a, 1 / a) === empty,
    commutative: (a, b, operation) => operation(a, b) === operation(b, a)
}

/**
 * 复数加法交换群
 */
export type Complex = {
    real: number
    imaginary: number
}

export const AbelianGroupComplexWithAddition: AbelianGroup<Complex> = {
    biOperation: (a: Complex, b: Complex): Complex => ({
        real: a.real + b.real,
        imaginary: a.imaginary + b.imaginary
    }),
    associative: (a, b, operation) => {
        const result1 = operation(operation(a, b), b)
        const result2 = operation(a, operation(b, a))
        return result1.real === result2.real && result1.imaginary === result2.imaginary
    },
    empty: { real: 0, imaginary: 0 },
    identity: (empty, ele, operation) => {
        const result = operation(empty, ele)
        return result.real === ele.real && result.imaginary === ele.imaginary
    },
    inverse: (a: Complex): Complex => ({
        real: -a.real,
        imaginary: -a.imaginary
    }),
    inverseLaw: (a, operation, empty) => {
        const result = operation(a, { real: -a.real, imaginary: -a.imaginary })
        return result.real === empty.real && result.imaginary === empty.imaginary
    },
    commutative: (a, b, operation) => {
        const result1 = operation(a, b)
        const result2 = operation(b, a)
        return result1.real === result2.real && result1.imaginary === result2.imaginary
    }
}

/**
 * n 维向量加法交换群
 */
export type VectorN = {
    components: number[]
}

export const createAbelianGroupVectorNWithAddition = (n: number): AbelianGroup<VectorN> => {
    return {
        biOperation: (a: VectorN, b: VectorN): VectorN => ({
            components: a.components.map((comp, i) => comp + b.components[i])
        }),
        associative: (a, b, operation) => {
            const result1 = operation(operation(a, b), b)
            const result2 = operation(a, operation(b, a))
            return result1.components.every((comp, i) => comp === result2.components[i])
        },
        empty: { components: Array(n).fill(0) },
        identity: (empty, ele, operation) => {
            const result = operation(empty, ele)
            return result.components.every((comp, i) => comp === ele.components[i])
        },
        inverse: (a: VectorN): VectorN => ({
            components: a.components.map(comp => -comp)
        }),
        inverseLaw: (a, operation, empty) => {
            const result = operation(a, { components: a.components.map(comp => -comp) })
            return result.components.every((comp, i) => comp === empty.components[i])
        },
        commutative: (a, b, operation) => {
            const result1 = operation(a, b)
            const result2 = operation(b, a)
            return result1.components.every((comp, i) => comp === result2.components[i])
        }
    }
}

/**
 * 模 n 加法交换群
 */
export const createAbelianGroupModularAddition = (n: number): AbelianGroup<number> => {
    const mod = (x: number) => ((x % n) + n) % n
    return {
        biOperation: (a: number, b: number): number => mod(a + b),
        associative: (a, b, operation) => mod(operation(operation(a, b), b)) === mod(operation(a, operation(b, a))),
        empty: 0,
        identity: (empty, ele, operation) => operation(empty, ele) === ele,
        inverse: (a: number): number => mod(n - a),
        inverseLaw: (a, operation, empty) => operation(a, mod(n - a)) === empty,
        commutative: (a, b, operation) => operation(a, b) === operation(b, a)
    }
}

/**
 * 矩阵加法交换群
 */
export type Matrix = {
    rows: number
    cols: number
    data: number[][]
}

export const createAbelianGroupMatrixAddition = (rows: number, cols: number): AbelianGroup<Matrix> => {
    const createZeroMatrix = (): Matrix => ({
        rows,
        cols,
        data: Array(rows).fill(null).map(() => Array(cols).fill(0))
    })
    
    return {
        biOperation: (a: Matrix, b: Matrix): Matrix => ({
            rows,
            cols,
            data: a.data.map((row, i) => row.map((val, j) => val + b.data[i][j]))
        }),
        associative: (a, b, operation) => {
            const result1 = operation(operation(a, b), b)
            const result2 = operation(a, operation(b, a))
            return result1.data.every((row, i) => 
                row.every((val, j) => val === result2.data[i][j])
            )
        },
        empty: createZeroMatrix(),
        identity: (empty, ele, operation) => {
            const result = operation(empty, ele)
            return result.data.every((row, i) => 
                row.every((val, j) => val === ele.data[i][j])
            )
        },
        inverse: (a: Matrix): Matrix => ({
            rows,
            cols,
            data: a.data.map(row => row.map(val => -val))
        }),
        inverseLaw: (a, operation, empty) => {
            const result = operation(a, { 
                rows, 
                cols, 
                data: a.data.map(row => row.map(val => -val)) 
            })
            return result.data.every((row, i) => 
                row.every((val, j) => val === empty.data[i][j])
            )
        },
        commutative: (a, b, operation) => {
            const result1 = operation(a, b)
            const result2 = operation(b, a)
            return result1.data.every((row, i) => 
                row.every((val, j) => val === result2.data[i][j])
            )
        }
    }
}