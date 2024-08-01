import { match } from "ts-pattern";
import { Magma } from "./Magma.ts";

/**
 * 半群 (Semigroup) :=
 * 1. 存在一个集合 M
 * 2. 在集合 M 上定义了一个二元运算 ⊕ ，使得 ⊕:M x M -> M ,即对于任意 a, b ∈ S ，都有 a * b ∈ S，即具有封闭性的二元运算
 * 3. 满足结合律
 * 半群 (Semigroup) 是原群，在满足原群的性质上，它还满足结合律
 */
export interface Semigroup<M> extends Magma<M> {
    /**
     * 半群应该满足结合结合律
     * 即 ∀ a, b, c ∈ M, (a ⊕ b) ⊕ c = a ⊕ (b ⊕ c)
     * 很可惜 TypeScript 没有办法表达这个性质，所以这里只能用注释和一个使用起来没意义的类型注释
     * @param a 
     * @param b 
     * @param c 
     * @returns 
     */
    associative: (a: M, b: M, operation: (arg0: M, arg1: M) => M) => boolean
}

/**
 * 数值加法半群
 */
export const SemigroupNumberWithAddition: Semigroup<number> = {
    biOperation: (a: number, b: number): number => a + b,
    associative(a, b, operation) {
        return operation(operation(a, b), b) === operation(a, operation(b, a))
    },
}

/**
 * 自函数 Endofunction
 */
type Endofunction<A> = (a: A) => A

/**
 * 自函数组合（或者说 复合）半群
 */
export const SemigroupNumberEndofunctionWithComposition: Semigroup<Endofunction<number>> = {
    biOperation: (f: Endofunction<number>, g: Endofunction<number>): Endofunction<number> => (a: number) => f(g(a)),
    associative(a, b, operation) {
        return operation(operation(a, b), b) === operation(a, operation(b, a))
    }
}

/**
 * -------------------------------------------
 * 下面是关于 非空列表 的半群定义
 * -------------------------------------------
 */

/**
 * 非空列表 
 * data NEList a = Nil a | Cons a (NEList a)
 */
type NEList<a> = Nil<a> | Cons<a>

interface Nil<a> {
    kind: 'Nil',
    value: a
}

interface Cons<a> {
    kind: 'Cons',
    head: a,
    tail: NEList<a>
}

const sampleNEList: NEList<number> = {
    kind: 'Cons',
    head: 1,
    tail: {
        kind: 'Cons',
        head: 2,
        tail: {
            kind: 'Nil',
            value: 3
        }
    }
}


/**
 * 非空列表的连接操作
 * @param pre 
 * @param next 
 * @returns 
 */
const contact = <a>(pre: NEList<a>, next: NEList<a>): NEList<a> => {
    return match(pre)
        .with({ kind: 'Nil' }, ({ value }) => {
            return {
                kind: 'Cons',
                head: value,
                tail: next
            }
        })
        .with({ kind: 'Cons' }, ({ head, tail }) => {
            return {
                kind: 'Cons',
                head: head,
                tail: contact(tail, next)
            }
        }).run() as NEList<a>
}

/**
 * 非空数值列表的连接操作半群
 * (Number,contact)
 */
export const SemigroupNumberNEListWithContact: Semigroup<NEList<number>> = {
    /**
     * 非空列表之间可以进行 连接 操作
     * @param nil 
     * @param cons 
     * @returns 
     */
    biOperation: contact,
    associative(a, b, operation) {
        return operation(operation(a, b), b) === operation(a, operation(b, a))
    }    
}

/**
 * nesum :: NEList Int -> Int
 * 一个在 (NEList Int,contact) 和 (Int,+) 之间的同态态射（homomorphism）
 * 同态态射是在代数结构之间保持结构的映射
 * e.g. (A,·),(B,*) 如果它们存在同态态射 f:A->B, 那么对于任意 a,b ∈ A, f(a·b) = f(a) * f(b)
 */
type nesum = (a: NEList<number>) => number
export const nesum: nesum = (a: NEList<number>): number => {
    return match(a)
        .with({ kind: 'Nil' }, ({ value }) => value)
        .with({ kind: 'Cons' }, ({ head, tail }) => head + nesum(tail))
        .run()
}


/**
 * -------------------------------------------
 * 证明感觉没什么好写的，于是忽略了。
 * Left/Right Semigroup Action
 * -------------------------------------------
 */

/**
 * Left Semigroup Action,左半群作用。用于展示半群元素如何作用于集合元素
 * 其中，M 代表半群，S 代表集合
 * ∙ : M × S → S
 * (x ⊕ y) ∙ s = x ∙ (y ∙ s)
 * 
 * 在这里，由于 Typescript 不存在 Semigroup => M 这样的对类型的约束，而实际上的运算是使用 Semigroup 中的成员，因此此处定义实际上并不精确
 * 合理的定义应该是 LeftSemigroupOperation<Semigroup => M, S> = (m:M, s: S) => S
 */
export type LeftSemigroupAction<M, S> = (m:M, s: S) => S


/**
 * Vector 定义
 */
export type Vector = {
    x:number,
    y:number
}

/**
 * 向量的旋转是一个左半群作用, 旋转角度是一个数值加法半群
 * @param m 数值半群
 * @param s 
 * @returns 
 */
export const vectorRotation: LeftSemigroupAction<number, Vector> = (m, s) => {
    // 计算旋转角度
    const radians = (m * Math.PI) / 180
    return {
        // 避免精度以及-0的问题
        x:parseFloat((Math.cos(radians) * s.x - Math.sin(radians) * s.y).toFixed(2)) === -0?0:parseFloat((Math.cos(radians) * s.x - Math.sin(radians) * s.y).toFixed(2)),
        y:parseFloat((Math.sin(radians) * s.x + Math.cos(radians) * s.y).toFixed(2)) === -0?0:parseFloat((Math.sin(radians) * s.x + Math.cos(radians) * s.y).toFixed(2))
    }
}

export const sampleVector = {x:1, y:0}


/**
 * 对于JS中的对象，我们可以使用 JSON.stringify 来判断两个对象是否相等
 * 否则会因为是引用比较，而导致无法得出正确结果
 * @param a 
 * @param b 
 * @returns 
 */
export const equal = (a:Object, b:Object) => JSON.stringify(a) === JSON.stringify(b)

/**
 * 此处 ∙ 代表左半群作用
 * 满足结合律
 * (30 + 60) ∙ sampleVector = 30 ∙ (60 ∙ sampleVector)
 */
export const sampleLeftSemigroupOperationOfVectorRoation = (
    equal(
        vectorRotation((30 + 60), sampleVector),
        vectorRotation(30, vectorRotation(60, sampleVector))
    )
)

/**
 * Right Semigroup Action,右半群作用。用于展示半群元素如何作用于集合元素
 * 其中，M 代表半群，S 代表集合
 * ∙ : S × M → S
 */
export type RightSemigroupAction<S, M> = (s: S, m: M) => S

/**
 * 幂等是一个右半群作用，幂等元素 N 是一个乘法半群，它作用在实数集上。
 * ^ : R x N -> R
 */
export const N:Semigroup<number> = {
    biOperation: (a, b) => a ** b,
    associative(a, b, operation) {
        return operation(operation(a, b), b) === operation(a, operation(b, a))
    }
}
export const power: RightSemigroupAction<number, number> = (s, m) => s ** m
export const sampleRightSemigroupOperationOfPower = (
    power(2,(3*2)) === power(power(2,3),2)
)

/**
 * 左半群作用和右半群作用实质上共同体现了半群的 结合性。
 * 
 * 对于左半群作用和右半群作用（统称为 Action）:
 * · : M x S -> S
 * 
 * 实质上可以理解为使用一个 半群元素 和 一个集合元素 经过 Action 之后得到一个新的集合元素，即一个 M -> S -> S 的映射。
 * 于是，我们可以这么理解 Action：M -> (S -> S)
 * 
 * 而 (S -> S, ∘) 又是一个半群，其中 ∘ 代表函数的复合。数学上称之为自同态群。
 * 
 * 故而，我们可以认为 Action 是一个到 (S -> S, ∘) 的同态态射，即 M -> (S -> S)。
 * 这也就是所谓的 currying
 */