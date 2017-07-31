#! /usr/bin/env node
const program = require('commander') // 引入命令行增强工具
const chalk = require('chalk')
const version = process.version
const excute = require('./interaction.js')
const checkVersion = require('./check-version') 

// 判断nodejs版本，如果小于4 不支持箭头函数等
// 虽然暂时我也没用多少
if (version.substr(1) <= '4.0.0') {
  console.log(chalk.red('请升级你的node版本至4.0.0以上'))
  return false
}

program
    .allowUnknownOption()
    .version('0..0')
    .usage('translator <cmd> [input]')

program
    .usage('<init project>')
    .description('生成xwowmall的活动页面')
    .action(function() {
      var entrance = program.args[0]
      // 本版本中，当参数为 init 时启动项目
      if (entrance === 'init') {
        checkVersion(() => {
          excute()
        })
      } else {
        console.log('参数错误，请使用 act-publisher init 开始项目')
      }
    })

program.parse(process.argv)