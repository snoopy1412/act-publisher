const inquirer = require('inquirer')
const Table = require('cli-table2')
var exists = require('fs').existsSync
const questions = require('./questions.js')
const download = require('download-git-repo')
const generate = require('./generate.js')
var ora = require('ora') // 命令行加载效果

const excute = function(src, template, to) {
  inquirer.prompt(questions).then(function(answers) {
    var spinner = ora('downloading template')
    if (exists(src)) {
      generate(src, template, to)
    } else {
      spinner.start()
      download(`snoopy1412/act-template`, src, function(err) {
        spinner.stop()
        console.log(err ? err : 'Success')
        if (!err) {
          generate(src, template, to)
        }
      })
    }
  });
}

module.exports = excute