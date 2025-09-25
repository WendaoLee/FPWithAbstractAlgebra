import { match } from 'ts-pattern'
import { AbelianGroup } from './AbelianGroup.ts'

/**
 * 环 (Ring) :=
 * 一个集合 R 配备两个二元运算：
 * 1. 加法运算 +，使得 (R, +, 0) 构成交换群
 * 2. 乘法运算 *，使得 (R, *, 1) 构成幺半群
 * 3. 乘法对加法满足分配律：
 *    - 左分配律：a * (b + c) = (a * b) + (a * c)
 *    - 右分配律：(a + b) * c = (a * c) + (b * c)
 */
export interface Ring<R> {
    /**
     * 加法交换群
     */
    additiveGroup: AbelianGroup<R>
    /**
     * 乘法幺半群
     */
    multiplicativeMonoid: {
        biOperation: (a: R, b: R) => R
        empty: R
        associative: (a: R, b: R, operation: (arg0: R, arg1: R) => R) => boolean
        identity: (empty: R, ele: R, operation: (arg0: R, arg1: R) => R) => boolean
    }
    /**
     * 左分配律验证
     */
    leftDistributive: (a: R, b: R, c: R) => boolean
    /**
     * 右分配律验证
     */
    rightDistributive: (a: R, b: R, c: R) => boolean
}

/**
 * 整数环
 * (Z,+,*,0,1)
 */
export const RingInteger: Ring<number> = {
    additiveGroup: {
        biOperation: (a: number, b: number): number => a + b,
        associative: (a, b, operation) => operation(operation(a, b), b) === operation(a, operation(b, a)),
        empty: 0,
        identity: (empty, ele, operation) => operation(empty, ele) === ele,
        inverse: (a: number): number => -a,
        inverseLaw: (a, operation, empty) => operation(a, -a) === empty,
        commutative: (a, b, operation) => operation(a, b) === operation(b, a)
    },
    multiplicativeMonoid: {
        biOperation: (a: number, b: number): number => a * b,
        empty: 1,
        associative: (a, b, operation) => operation(operation(a, b), b) === operation(a, operation(b, a)),
        identity: (empty, ele, operation) => operation(empty, ele) === ele
    },
    leftDistributive: (a, b, c) => a * (b + c) === (a * b) + (a * c),
    rightDistributive: (a, b, c) => (a + b) * c === (a * c) + (b * c)
}

/**
 * 实数环
 * (R,+,*,0,1)
 */
export const RingReal: Ring<number> = {
    additiveGroup: {
        biOperation: (a: number, b: number): number => a + b,
        associative: (a, b, operation) => operation(operation(a, b), b) === operation(a, operation(b, a)),
        empty: 0,
        identity: (empty, ele, operation) => operation(empty, ele) === ele,
        inverse: (a: number): number => -a,
        inverseLaw: (a, operation, empty) => operation(a, -a) === empty,
        commutative: (a, b, operation) => operation(a, b) === operation(b, a)
    },
    multiplicativeMonoid: {
        biOperation: (a: number, b: number): number => a * b,
        empty: 1,
        associative: (a, b, operation) => operation(operation(a, b), b) === operation(a, operation(b, a)),
        identity: (empty, ele, operation) => operation(empty, ele) === ele
    },
    leftDistributive: (a, b, c) => a * (b + c) === (a * b) + (a * c),
    rightDistributive: (a, b, c) => (a + b) * c === (a * c) + (b * c)
}

/**
 * 模 n 整数环
 */
export const createRingModularIntegers = (n: number): Ring<number> => {
    const mod = (x: number) => ((x % n) + n) % n
    
    return {
        additiveGroup: {
            biOperation: (a: number, b: number): number => mod(a + b),
            associative: (a, b, operation) => mod(operation(operation(a, b), b)) === mod(operation(a, operation(b, a))),
            empty: 0,
            identity: (empty, ele, operation) => operation(empty, ele) === ele,
            inverse: (a: number): number => mod(n - a),
            inverseLaw: (a, operation, empty) => operation(a, mod(n - a)) === empty,
            commutative: (a, b, operation) => operation(a, b) === operation(b, a)
        },
        multiplicativeMonoid: {
            biOperation: (a: number, b: number): number => mod(a * b),
            empty: 1,
            associative: (a, b, operation) => mod(operation(operation(a, b), b)) === mod(operation(a, operation(b, a))),
            identity: (empty, ele, operation) => operation(empty, ele) === ele
        },
        leftDistributive: (a, b, c) => mod(a * mod(b + c)) === mod(mod(a * b) + mod(a * c)),
        rightDistributive: (a, b, c) => mod(mod(a + b) * c) === mod(mod(a * c) + mod(b * c))
    }
}

/**
 * 复数环
 */
export type Complex = {
    real: number
    imaginary: number
}

export const RingComplex: Ring<Complex> = {
    additiveGroup: {
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
    },
    multiplicativeMonoid: {
        biOperation: (a: Complex, b: Complex): Complex => ({
            real: a.real * b.real - a.imaginary * b.imaginary,
            imaginary: a.real * b.imaginary + a.imaginary * b.real
        }),
        empty: { real: 1, imaginary: 0 },
        associative: (a, b, operation) => {
            const result1 = operation(operation(a, b), b)
            const result2 = operation(a, operation(b, a))
            return result1.real === result2.real && result1.imaginary === result2.imaginary
        },
        identity: (empty, ele, operation) => {
            const result = operation(empty, ele)
            return result.real === ele.real && result.imaginary === ele.imaginary
        }
    },
    leftDistributive: (a, b, c) => {
        const left = {
            real: a.real * (b.real + c.real) - a.imaginary * (b.imaginary + c.imaginary),
            imaginary: a.real * (b.imaginary + c.imaginary) + a.imaginary * (b.real + c.real)
        }
        const right = {
            real: (a.real * b.real - a.imaginary * b.imaginary) + (a.real * c.real - a.imaginary * c.imaginary),
            imaginary: (a.real * b.imaginary + a.imaginary * b.real) + (a.real * c.imaginary + a.imaginary * c.real)
        }
        return left.real === right.real && left.imaginary === right.imaginary
    },
    rightDistributive: (a, b, c) => {
        const left = {
            real: (a.real + b.real) * c.real - (a.imaginary + b.imaginary) * c.imaginary,
            imaginary: (a.real + b.real) * c.imaginary + (a.imaginary + b.imaginary) * c.real
        }
        const right = {
            real: (a.real * c.real - a.imaginary * c.imaginary) + (b.real * c.real - b.imaginary * c.imaginary),
            imaginary: (a.real * c.imaginary + a.imaginary * c.real) + (b.real * c.imaginary + b.imaginary * c.real)
        }
        return left.real === right.real && left.imaginary === right.imaginary
    }
}

/**
 * 矩阵环
 */
export type Matrix = {
    rows: number
    cols: number
    data: number[][]
}

export const createRingMatrix = (size: number): Ring<Matrix> => {
    const createZeroMatrix = (): Matrix => ({
        rows: size,
        cols: size,
        data: Array(size).fill(null).map(() => Array(size).fill(0))
    })
    
    const createIdentityMatrix = (): Matrix => ({
        rows: size,
        cols: size,
        data: Array(size).fill(null).map((_, i) => 
            Array(size).fill(null).map((_, j) => i === j ? 1 : 0)
        )
    })
    
    const matrixAdd = (a: Matrix, b: Matrix): Matrix => ({
        rows: size,
        cols: size,
        data: a.data.map((row, i) => row.map((val, j) => val + b.data[i][j]))
    })
    
    const matrixMultiply = (a: Matrix, b: Matrix): Matrix => ({
        rows: size,
        cols: size,
        data: a.data.map((row, i) => 
            Array(size).fill(null).map((_, j) => 
                row.reduce((sum, val, k) => sum + val * b.data[k][j], 0)
            )
        )
    })
    
    return {
        additiveGroup: {
            biOperation: matrixAdd,
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
                rows: size,
                cols: size,
                data: a.data.map(row => row.map(val => -val))
            }),
            inverseLaw: (a, operation, empty) => {
                const result = operation(a, { 
                    rows: size, 
                    cols: size, 
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
        },
        multiplicativeMonoid: {
            biOperation: matrixMultiply,
            empty: createIdentityMatrix(),
            associative: (a, b, operation) => {
                const result1 = operation(operation(a, b), b)
                const result2 = operation(a, operation(b, a))
                return result1.data.every((row, i) => 
                    row.every((val, j) => Math.abs(val - result2.data[i][j]) < 1e-10)
                )
            },
            identity: (empty, ele, operation) => {
                const result = operation(empty, ele)
                return result.data.every((row, i) => 
                    row.every((val, j) => Math.abs(val - ele.data[i][j]) < 1e-10)
                )
            }
        },
        leftDistributive: (a, b, c) => {
            const left = matrixMultiply(a, matrixAdd(b, c))
            const right = matrixAdd(matrixMultiply(a, b), matrixMultiply(a, c))
            return left.data.every((row, i) => 
                row.every((val, j) => Math.abs(val - right.data[i][j]) < 1e-10)
            )
        },
        rightDistributive: (a, b, c) => {
            const left = matrixMultiply(matrixAdd(a, b), c)
            const right = matrixAdd(matrixMultiply(a, c), matrixMultiply(b, c))
            return left.data.every((row, i) => 
                row.every((val, j) => Math.abs(val - right.data[i][j]) < 1e-10)
            )
        }
    }
}

/**
 * 多项式环
 */
export type Polynomial = {
    coefficients: number[]
}

export const RingPolynomial: Ring<Polynomial> = {
    additiveGroup: {
        biOperation: (a: Polynomial, b: Polynomial): Polynomial => {
            const maxLength = Math.max(a.coefficients.length, b.coefficients.length)
            const coefficients = Array(maxLength).fill(0).map((_, i) => 
                (a.coefficients[i] || 0) + (b.coefficients[i] || 0)
            )
            return { coefficients }
        },
        associative: (a, b, operation) => {
            const result1 = operation(operation(a, b), b)
            const result2 = operation(a, operation(b, a))
            return JSON.stringify(result1.coefficients) === JSON.stringify(result2.coefficients)
        },
        empty: { coefficients: [] },
        identity: (empty, ele, operation) => {
            const result = operation(empty, ele)
            return JSON.stringify(result.coefficients) === JSON.stringify(ele.coefficients)
        },
        inverse: (a: Polynomial): Polynomial => ({
            coefficients: a.coefficients.map(coeff => -coeff)
        }),
        inverseLaw: (a, operation, empty) => {
            const result = operation(a, { coefficients: a.coefficients.map(coeff => -coeff) })
            return JSON.stringify(result.coefficients) === JSON.stringify(empty.coefficients)
        },
        commutative: (a, b, operation) => {
            const result1 = operation(a, b)
            const result2 = operation(b, a)
            return JSON.stringify(result1.coefficients) === JSON.stringify(result2.coefficients)
        }
    },
    multiplicativeMonoid: {
        biOperation: (a: Polynomial, b: Polynomial): Polynomial => {
            const coefficients = Array(a.coefficients.length + b.coefficients.length - 1).fill(0)
            for (let i = 0; i < a.coefficients.length; i++) {
                for (let j = 0; j < b.coefficients.length; j++) {
                    coefficients[i + j] += a.coefficients[i] * b.coefficients[j]
                }
            }
            return { coefficients }
        },
        empty: { coefficients: [1] },
        associative: (a, b, operation) => {
            const result1 = operation(operation(a, b), b)
            const result2 = operation(a, operation(b, a))
            return JSON.stringify(result1.coefficients) === JSON.stringify(result2.coefficients)
        },
        identity: (empty, ele, operation) => {
            const result = operation(empty, ele)
            return JSON.stringify(result.coefficients) === JSON.stringify(ele.coefficients)
        }
    },
    leftDistributive: (a, b, c) => {
        const left = {
            coefficients: a.coefficients.map((coeff, i) => 
                coeff * ((b.coefficients[i] || 0) + (c.coefficients[i] || 0))
            )
        }
        const right = {
            coefficients: a.coefficients.map((coeff, i) => 
                coeff * (b.coefficients[i] || 0) + coeff * (c.coefficients[i] || 0)
            )
        }
        return JSON.stringify(left.coefficients) === JSON.stringify(right.coefficients)
    },
    rightDistributive: (a, b, c) => {
        const left = {
            coefficients: ((a.coefficients[i] || 0) + (b.coefficients[i] || 0) for (let i = 0; i < Math.max(a.coefficients.length, b.coefficients.length); i++)).
                map((sum, i) => sum * (c.coefficients[i] || 0))
        }
        const right = {
            coefficients: Array(Math.max(a.coefficients.length, b.coefficients.length, c.coefficients.length)).fill(0).map((_, i) => 
                ((a.coefficients[i] || 0) * (c.coefficients[i] || 0)) + ((b.coefficients[i] || 0) * (c.coefficients[i] || 0))
            )
        }
        return JSON.stringify(left.coefficients) === JSON.stringify(right.coefficients)
    }
}