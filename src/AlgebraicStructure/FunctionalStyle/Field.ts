import { match } from 'ts-pattern'
import { Ring } from './Ring.ts'

/**
 * 域 (Field) :=
 * 1. 满足环的所有性质
 * 2. 乘法运算满足交换律
 * 3. 非零元素对乘法构成交换群
 * 
 * 域 = 交换环 + 非零元素的乘法逆元
 */
export interface Field<F> extends Ring<F> {
    /**
     * 乘法交换律验证
     */
    multiplicativeCommutative: (a: F, b: F) => boolean
    /**
     * 乘法逆元操作（仅对非零元素）
     */
    multiplicativeInverse: (a: F) => F
    /**
     * 乘法逆元律验证
     */
    multiplicativeInverseLaw: (a: F, empty: F) => boolean
}

/**
 * 有理数域
 * (Q,+,*,0,1)
 */
export const FieldRational: Field<number> = {
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
    rightDistributive: (a, b, c) => (a + b) * c === (a * c) + (b * c),
    multiplicativeCommutative: (a, b) => a * b === b * a,
    multiplicativeInverse: (a: number): number => 1 / a,
    multiplicativeInverseLaw: (a, empty) => a * (1 / a) === empty
}

/**
 * 实数域
 * (R,+,*,0,1)
 */
export const FieldReal: Field<number> = {
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
    rightDistributive: (a, b, c) => (a + b) * c === (a * c) + (b * c),
    multiplicativeCommutative: (a, b) => a * b === b * a,
    multiplicativeInverse: (a: number): number => 1 / a,
    multiplicativeInverseLaw: (a, empty) => a * (1 / a) === empty
}

/**
 * 复数域
 */
export type Complex = {
    real: number
    imaginary: number
}

export const FieldComplex: Field<Complex> = {
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
    },
    multiplicativeCommutative: (a, b) => {
        const result1 = {
            real: a.real * b.real - a.imaginary * b.imaginary,
            imaginary: a.real * b.imaginary + a.imaginary * b.real
        }
        const result2 = {
            real: b.real * a.real - b.imaginary * a.imaginary,
            imaginary: b.real * a.imaginary + b.imaginary * a.real
        }
        return result1.real === result2.real && result1.imaginary === result2.imaginary
    },
    multiplicativeInverse: (a: Complex): Complex => {
        const denominator = a.real * a.real + a.imaginary * a.imaginary
        return {
            real: a.real / denominator,
            imaginary: -a.imaginary / denominator
        }
    },
    multiplicativeInverseLaw: (a, empty) => {
        const denominator = a.real * a.real + a.imaginary * a.imaginary
        const inverse = {
            real: a.real / denominator,
            imaginary: -a.imaginary / denominator
        }
        const result = {
            real: a.real * inverse.real - a.imaginary * inverse.imaginary,
            imaginary: a.real * inverse.imaginary + a.imaginary * inverse.real
        }
        return result.real === empty.real && result.imaginary === empty.imaginary
    }
}

/**
 * 有限域 GF(p) 其中 p 是素数
 */
export const createFiniteField = (p: number): Field<number> => {
    const mod = (x: number) => ((x % p) + p) % p
    const isPrime = (n: number) => {
        if (n <= 1) return false
        if (n <= 3) return true
        if (n % 2 === 0 || n % 3 === 0) return false
        for (let i = 5; i * i <= n; i += 6) {
            if (n % i === 0 || n % (i + 2) === 0) return false
        }
        return true
    }
    
    if (!isPrime(p)) {
        throw new Error(`p must be prime, but ${p} is not prime`)
    }
    
    const extendedEuclidean = (a: number, b: number): [number, number, number] => {
        if (b === 0) return [a, 1, 0]
        const [gcd, x1, y1] = extendedEuclidean(b, a % b)
        return [gcd, y1, x1 - Math.floor(a / b) * y1]
    }
    
    return {
        additiveGroup: {
            biOperation: (a: number, b: number): number => mod(a + b),
            associative: (a, b, operation) => mod(operation(operation(a, b), b)) === mod(operation(a, operation(b, a))),
            empty: 0,
            identity: (empty, ele, operation) => operation(empty, ele) === ele,
            inverse: (a: number): number => mod(p - a),
            inverseLaw: (a, operation, empty) => operation(a, mod(p - a)) === empty,
            commutative: (a, b, operation) => operation(a, b) === operation(b, a)
        },
        multiplicativeMonoid: {
            biOperation: (a: number, b: number): number => mod(a * b),
            empty: 1,
            associative: (a, b, operation) => mod(operation(operation(a, b), b)) === mod(operation(a, operation(b, a))),
            identity: (empty, ele, operation) => operation(empty, ele) === ele
        },
        leftDistributive: (a, b, c) => mod(a * mod(b + c)) === mod(mod(a * b) + mod(a * c)),
        rightDistributive: (a, b, c) => mod(mod(a + b) * c) === mod(mod(a * c) + mod(b * c)),
        multiplicativeCommutative: (a, b) => mod(a * b) === mod(b * a),
        multiplicativeInverse: (a: number): number => {
            if (a === 0) throw new Error('Cannot compute inverse of 0')
            const [gcd, x, _] = extendedEuclidean(a, p)
            if (gcd !== 1) throw new Error(`${a} and ${p} are not coprime`)
            return mod(x)
        },
        multiplicativeInverseLaw: (a, empty) => {
            if (a === 0) return false
            const inverse = {
                real: a.real,
                imaginary: a.imaginary
            }
            return true
        }
    }
}

/**
 * 域同态
 */
export type FieldHomomorphism<F, K> = (a: F) => K

/**
 * 从实数域到复数域的嵌入同态
 */
export const realToComplexEmbedding: FieldHomomorphism<number, Complex> = (a: number) => ({
    real: a,
    imaginary: 0
})