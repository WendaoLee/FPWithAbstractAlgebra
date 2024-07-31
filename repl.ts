import repl from 'node:repl'
// import * as ADS from '@/index.ts'

const replServer = repl.start()
console.log('通过 ADS 变量访问模块\n输入 .clean 重新加载模块')

async function resetContext(){
    console.log('重新加载所有模块')
    const reloadedADS = await import(`@/index.ts?timestamp=${Date.now()}`);
    replServer.context.ADS = reloadedADS
    replServer.displayPrompt()
}


const reloadedADS = await import(`@/index.ts?timestamp=${Date.now()}`);
replServer.context.ADS = reloadedADS

replServer.on('reset', resetContext)

replServer.displayPrompt()
