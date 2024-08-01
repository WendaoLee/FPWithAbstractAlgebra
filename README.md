# 👏 Hi~

### 这个项目是什么东东？

是我本人在学习 [北京大学计算机学院的暑期课 Functional Programming with Abstract Algebra](https://www.koushare.com/live/details/35605) 的过程中，尝试使用 `Typescript` 对该课程过程中的一些概念进行描述的代码仓库。

### 为什么要这么做？

首先是我自己抽象瘾上来了。

其次是因为我现在的工作用不到 Haskell ，基本上都是使用 Typescript 。加上我觉得用表达性没有 Haskell 强（横向对比）的语言去描述抽象概念是一种新体验。因此我就这么做了。

### 我该如何查看这个项目？

确保你手头有 [北京大学计算机学院的暑期课 Functional Programming with Abstract Algebra](https://www.koushare.com/live/details/35605) 的相关 PPT。

代码仓库里的内容都是根据该 PPT 的顺序逐渐实现的。对于相关内容有我个人写的一些注释。

对于代码，应当先运行 `npm install` 安装相关依赖后尝试进行执行。

你可以运行 `npm run repl` 进入交互环境，查看一些内容的运行结果。

目前，根据PPT，你应该依次查看以下代码：

#### 1. Day 1 Basics

- 原群：[Magma.ts](./src/AlgebraicStructure/FunctionalStyle/Magma.ts)
- 半群：[Semigroup.ts](./src/AlgebraicStructure/FunctionalStyle/Semigroup.ts)
- 幺半群：[Monoid.ts](./src/AlgebraicStructure/FunctionalStyle/Monoid.ts)



### 其他参考学习资料

1. [fp-ts](https://github.com/gcanti/fp-ts) ，typescript 的 fp 库，提供了大量可以使用的 fp 概念与工具。可以说是真正的宝藏库。