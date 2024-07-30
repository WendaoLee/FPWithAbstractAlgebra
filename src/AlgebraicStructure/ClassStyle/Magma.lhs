
让我们思考一下在 Haskell 中 Magma 的定义：

> class Magma a where 
>   (<>) :: a -> a -> a

Int 显然是一个 Magma，因为它有一个二元操作符 +。我们可以定义一个 Magma 实例：

> instance Magma Int where
>  (<>) = (+)

类型类是对 类型 做约束的。