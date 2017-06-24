const inquirer = require('inquirer')
var getMetadata = require('./getMetadata.js')

module.exports = function ask(src, name, callback) {
  var meta = getMetadata(src, name)
  var questions = Object.keys(meta.prompts).map(item => {
    meta.prompts[item].name = item
    return meta.prompts[item]
  })
  inquirer.prompt(questions).then(function (answers) {
    callback(answers)
  });  
}
