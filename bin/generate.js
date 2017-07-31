const Metalsmith = require('metalsmith')
const inquirer = require('inquirer') // 命令行交互工具
const Handlebars = require('handlebars')
const path = require('path')
const home = require('user-home')
const questions = require('./questions.js')
const exists = require('fs').existsSync // 文件是否存在
const ask = require('./ask.js')
const fs = require('fs')

module.exports = function generate(src, name, ans) {
  inquirer.prompt(questions.nextQuestions).then((ans2) => {
    // register handlebars helper
    Handlebars.registerHelper('if_eq', function(a, b, opts) {
      return a === b ? opts.fn(this) : opts.inverse(this)
    })
    Handlebars.registerHelper('unless_eq', function(a, b, opts) {
      return a === b ? opts.inverse(this) : opts.fn(this)
    })

    ask(src, name, function(answers) {
      let rawName = ans2.fileName
      const inPlace = !rawName || rawName === '.'
      rawName = inPlace ? path.relative('../', process.cwd()) : rawName
      const to = path.resolve(rawName || '.')
      
      const fileType = ans2.fileType
      let dest
      let buildTrans = () => {}
      if (fileType === 'folder') {
        dest = to
      } else if (fileType === 'file') {
        dest = 'build'
        buildTrans = () => {
          fs.rename(src + '/build/index.vue', process.cwd() + '/' + rawName + '.vue', function(err) {
            if (err) {
              throw err;
            }
          })
        }
      }
      Metalsmith(src)
        .source(`${name}/template`)
        .destination(dest)
        .use(function(files, meta) {
          var keys = Object.keys(files)
          keys.forEach((key) => {
            var str = files[key].contents.toString()
            var template = Handlebars.compile(str);
            var result = template(answers);
            files[key].contents = new Buffer(result)
          })
        })
        .clean(true)
        .build(function(err) {
          if (err) {
            throw Error(err)
          } else {
            console.log('页面生成成功！')
          }
          buildTrans()
        })
    })
  })
}