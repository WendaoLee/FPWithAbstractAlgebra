import { match, P } from "ts-pattern";
import { Semigroup, Vector } from "./Semigroup.ts";

/**
 * @inspiredBy fp-ts/Monoid.ts
 * 
 * 幺半群 (Monoid) :=
 * 1. 存在一个集合 M
 * 2. 在集合 M 上定义了一个二元运算 ⊕ ，使得 ⊕:M x M -> M ,即对于任意 a, b ∈ S ，都有 a * b ∈ S，即具有封闭性的二元运算
 * 3. 满足恒等律，即存在一个单位元 ɛ ∈ M ，使得对于任意 a ∈ M ，都有 ɛ ⊕ a = a = a ⊕ ɛ 。
 *    恒等律即集合中的任何元素与单位元进行运算，都会得到原来的元素。
 *    同样，也可认为 ɛ 是一种操作。
 * 4. 满足结合律
 * 
 * 即，幺半群 = 半群 + 单位元
 */
export interface Monoid<M> extends Semigroup<M> {
    /**
     * 单位元，也可称之为幺元、零元
     */
    readonly empty: M
    /**
     * 恒等律
     * 同样，由于 TypeScript 的限制，这里只能用注释和没什么卵用的声明来表达这个性质
     * @returns 
     */
    identity: (empty: M, ele: M, operation: (arg0: M, arg1: M) => M) => boolean
}

/**
 * 布尔和 幺半群
 * (Boolean,&&,true)
 * 此时的 ⊕ 为 逻辑与 ，单位元为 true (布尔代数可用⊤表示)
 */
export const MonoidBooleanWithConjunction: Monoid<boolean> = {
    biOperation: (a: boolean, b: boolean): boolean => a && b,
    associative(a, b, operation) {
        return operation(operation(a, b), b) === operation(a, operation(b, a))
    },
    empty: true,
    /**
     * true && true = true = true && true
     * true && false = false = false && true 
     */
    identity(empty, ele, operation) {
        return operation(empty, ele) === ele
    }
}

/**
 * 布尔或 幺半群
 * (Boolean,||,false)
 * 此时的 ⊕ 为 逻辑或 ，单位元为 false (布尔代数可用⊥表示)
 */
export const MonoidBooleanWithDisjunction: Monoid<boolean> = {
    biOperation: (a: boolean, b: boolean): boolean => a || b,
    associative(a, b, operation) {
        return operation(operation(a, b), b) === operation(a, operation(b, a))
    },
    empty: false,
    /**
     * false || true = true = true || false
     * false || false = false = false || false
     */
    identity(empty, ele, operation) {
        return operation(empty, ele) === ele
    }
}

/**
 * 数值加法 幺半群
 * (Number,+,0)
 * 此时的 ⊕ 为 加法 ，单位元为 0
 */
export const MonoidNumberWithAddition: Monoid<number> = {
    biOperation: (a: number, b: number): number => a + b,
    associative(a, b, operation) {
        return operation(operation(a, b), b) === operation(a, operation(b, a))
    },
    empty: 0,
    /**
     * 0 + 1 = 1 = 1 + 0
     * 0 + 0 = 0 = 0 + 0
     */
    identity(empty, ele, operation) {
        return operation(empty, ele) === ele
    }
}

/**
 * 数值乘法 幺半群
 * (Number,*,1)
 * 此时的 ⊕ 为 乘法 ，单位元为 1
 */
export const MonoidNumberWithMultiplication: Monoid<number> = {
    biOperation: (a: number, b: number): number => a * b,
    associative(a, b, operation) {
        return operation(operation(a, b), b) === operation(a, operation(b, a))
    },
    empty: 1,
    /**
     * 1 * 2 = 2 = 2 * 1
     * 1 * 1 = 1 = 1 * 1
     */
    identity(empty, ele, operation) {
        return operation(empty, ele) === ele
    }
}

/**
 * 自函数Endofunction
 */
type Endofunction = <A>(a: A) => A

/**
 * 自函数组合 幺半群
 * 此时， ⊕ 为 函数组合(或称复合) ，单位元为永远返回自身的函数
 */
export const MonoidEndofunctionWithComposition: Monoid<Endofunction> = {
    biOperation: (f: Endofunction, g: Endofunction): Endofunction => (a: any) => f(g(a)),
    associative(a, b, operation) {
        return operation(operation(a, b), b) === operation(a, operation(b, a))
    },
    /**
     * 返回自身的函数即为 自函数组合幺半群 的单位元
     * @param a 
     * @returns 
     */
    empty: (a: any) => a,
    /**
     * f . id = f = id . f
     */
    identity(empty, ele, operation) {
        return operation(empty, ele) === ele
    }
}

/**
 * -------------------------------------------
 * 下面是关于 列表 的幺半群定义
 * -------------------------------------------
 */
/**
 * 因为 TS 的数组便是列表，因此这里直接使用 Array 了~
 */
type List<a> = Array<a>

/**
 * 数值列表及其连接操作构成了一个半群
 * (List Number,concat)
 */
export const SemigroupListWithConcatenation: Semigroup<List<number>> = {
    /**
     * 列表的连接操作即为其上的二元运算
     * @param a 
     * @param b 
     * @returns 
     */
    biOperation: (a: List<number>, b: List<number>): List<number> => a.concat(b),
    associative(a, b, operation) {
        return operation(operation(a, b), b) === operation(a, operation(b, a))
    }
}

/**
 * 数值列表、连接操作及空列表构成了一个幺半群
 * (List Number,concat,[])
 * 由于该幺半群是基于 Number 幺半群生成的，因此也称之为 自由幺半群（Free Monoid）
 * 此时， ⊕ 为 列表连接 ，单位元为 空列表 []
 */
export const MonoidListWithConcatenation: Monoid<List<number>> = {
    biOperation: (a: List<number>, b: List<number>): List<number> => a.concat(b),
    associative(a, b, operation) {
        return operation(operation(a, b), b) === operation(a, operation(b, a))
    },
    /**
     * 空列表即为 数值列表的幺半群 的单位元
     */
    empty: [],
    /**
     * [] + [1,2,3] = [1,2,3] = [1,2,3] + []
     * [] + [] = [] = [] + []
     */
    identity(empty, ele, operation) {
        return operation(empty, ele) === ele
    }
}

/**
 * 数值列表幺半群 与 数值加法幺半群 的同态态射
 * sum ::: [Int] ->- Int 
 */
export type sum = (a: List<number>) => number
export const sum: sum = (a: List<number>): number => {
    return a.reduce((acc, cur) => acc + cur, 0)
}

/**
 * -------------------------------------------
 * 幺半群的泛型同态态射(Generic Homomorphism)
 * -------------------------------------------
 */
/**
 * map:: (a -> b) -> a -> b
 */
type map = <a, b>(f: (a: a) => b, a: a) => b
/**
 * @inspiredBy fp-ts/Array.ts
 * foldMap:: Monoid m => (a -> m) -> ([a] -> m)
 * foldMap 可以通过 一个 f::a->m 的函数将一个列表 [a] 合并为一个值，该值属于幺半群 m
 * 原本讲义是想表达 一个任意类型（A）的列表的结合（concat,++）幺半群 和 幺半群这个结构 之间存在同态态射，但是 TS 的类型系统限制了这个表达
 * 即对于任意类型的列表，它总是存在一个从这个列表到幺半群的同态态射
 */
type foldMap =  <m>(m: Monoid<m>) => <a>(f: (a: a) => m) => (a: List<a>) => m
export const foldMap:foldMap = (m) => (f) => (a) => {
    return a.reduce((acc, cur) => m.biOperation(acc, f(cur)), m.empty)
}

export const foldMapSum = foldMap(MonoidNumberWithAddition)(
    (a:number) => a
)
export const foldMapSumExaple = foldMapSum([1,2,3,4,5])

export const foldMapLength = foldMap(MonoidNumberWithAddition)(
    (a:number) => 1
)

/**
 * -------------------------------------------
 * Monoid 的作用 (Action)
 * 其实和半群同理
 * 原课程的 Slides 存在 Typo 问题，PPT上把 Monoid 打成了 Semigroup
 * -------------------------------------------
 */
export type LeftMonoidAction<M,S> = (m:M, s: S) => S

export const vectorRotationWithMonoid:LeftMonoidAction<number,Vector> = (m,s) => {
    // 计算旋转角度
    const radians = (m * Math.PI) / 180
    return {
        // 避免精度以及-0的问题
        x:parseFloat((Math.cos(radians) * s.x - Math.sin(radians) * s.y).toFixed(2)) === -0?0:parseFloat((Math.cos(radians) * s.x - Math.sin(radians) * s.y).toFixed(2)),
        y:parseFloat((Math.sin(radians) * s.x + Math.cos(radians) * s.y).toFixed(2)) === -0?0:parseFloat((Math.sin(radians) * s.x + Math.cos(radians) * s.y).toFixed(2))
    }
}

export const sampleVector = {x:1, y:0}

export const equal = (a:Object, b:Object) => JSON.stringify(a) === JSON.stringify(b)

export const sampleLeftMonoidActionOfVectorRotation = (
    equal(
        vectorRotationWithMonoid((90 + 30),sampleVector),
        vectorRotationWithMonoid(90, vectorRotationWithMonoid(30, sampleVector))
    )
    &&
    equal(
        vectorRotationWithMonoid(0,sampleVector),
        sampleVector
    )
)

/**
 * -------------------------------------------
 * 下面是关于 Monoid Constructions 相关的内容
 * -------------------------------------------
 */

/**
 * tuple monoid，元组幺半群
 * 这是一种组合两种幺半群的构造方法。
 */
export type TupleMonoid<M1,M2> = Monoid<[M1,M2]>
export const TupleMonoid = <M1,M2>(m1:Monoid<M1>,m2:Monoid<M2>):TupleMonoid<M1,M2> => {
    return {
        biOperation: ([a1,a2],[b1,b2]) => [m1.biOperation(a1,b1),m2.biOperation(a2,b2)],
        empty: [m1.empty,m2.empty],
        identity: (empty,ele,operation) => {
            return operation(empty,ele) === ele
        },
        associative: (a,b,operation) => {
            return operation(operation(a,b),b) === operation(a,operation(b,a))
        }
    }
}
export const exampleTupleMonoid = TupleMonoid(MonoidNumberWithAddition,MonoidNumberWithMultiplication)

/**
 * -------------------------------------------
 * 如何让 Monoid 变得更快只在如 Haskell 一类的真正纯净函数式语言中有意义，
 * 因为它们的演算是通过一个又一个 thunk 实现的。
 * 因此这里不做阐述。
 * -------------------------------------------
 */

/**
 * Cayley Representation
 */
export type rep = <M>(m: Monoid<M>) => (a: M) => (a:List<M>) => List<M>
export const rep = <M>(m: Monoid<M>) => (a: M) => (b:List<M>) => {
    return b.map((x) => m.biOperation(a,x))
}

export type abs = <M>(m: Monoid<M>) => (a:List<M>) => M