const inquirer = require('inquirer') // 命令行交互工具
const exists = require('fs').existsSync // 文件是否存在
const path = require('path')
const home = require('user-home')
const download = require('download-git-repo') // 从git下载模板
const ora = require('ora') // 命令行加载效果
const chalk = require('chalk')
const questions = require('./questions.js')
const generate = require('./generate.js')

/**
 * 判断当前选中的模板是否存在，不存在则后面不再执行
 * @param  {str} tmp      临放地址
 * @param  {str} template 模板名称
 * @return {boolean}      返回true/false
 */
const checkTemplate = function(tmp, template) {
  if (!exists(path.join(tmp, template))) {
    console.log(chalk.red('指定的模板不存在~'))
    return false
  }
  return true
}

const excute = function() {
  inquirer.prompt(questions.preQuestions).then(function(answers) {
    // 初期选择模板类型
    const template = answers.buildType
    // 临时存储位置
    const tmp = path.join(home, 'act-template')
    // 加载效果初始化
    const spinner = ora('downloading template')
    // 缓存
    if (exists(tmp)) {
      if (checkTemplate(tmp, template)) {
        generate(tmp, template, answers)
      }
    } else {
      // 否则从github下载
      spinner.start()
      download(`snoopy1412/act-template`, tmp, function(err) {
        spinner.stop()
        if (!err) {
          if (checkTemplate(tmp, template)) {
            generate(tmp, template, answers)
          }
        } else {
          console.log(err)
        }
      })
    }
  })
}

module.exports = excute