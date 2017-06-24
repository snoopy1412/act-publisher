const path = require('path')
const exists = require('fs').existsSync
module.exports = function getMetadata(dir, template) {
  var js = path.join(dir, template, 'meta.js')
  var opts = {}
if (exists(js)) {
    var req = require(path.resolve(js))
    if (req !== Object(req)) {
      throw new Error('meta.js needs to expose an object')
    }
    opts = req
  }
  return opts
}