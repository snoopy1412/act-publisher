var Metalsmith = require('metalsmith')
var Handlebars = require('handlebars')
var path = require('path')
var ask = require('./ask.js')

module.exports = function generate(src, name, to) {
  // register handlebars helper
  Handlebars.registerHelper('if_eq', function (a, b, opts) {
    return a === b
      ? opts.fn(this)
      : opts.inverse(this)
  })

  Handlebars.registerHelper('unless_eq', function (a, b, opts) {
    return a === b
      ? opts.inverse(this)
      : opts.fn(this)
  })
ask(src, name, function(answers) {
    Metalsmith(src)
        .source(`${name}/template`)
        .destination(to)
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
          console.log(err)
        })
  })
}
