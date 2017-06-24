#! /usr/bin/env node
const program = require('commander')
const path = require('path')
const home = require('user-home')
const excute = require('./interaction.js')

program
    .allowUnknownOption()
    .version('0.0.1')
    .usage('translator <cmd> [input]')

program
    .usage('<template-name> [project-name]')
    .description('生成活动页面')
    .action(function() {
      var template = program.args[0]
      var rawName = program.args[1]
      var inPlace = !rawName || rawName === '.'
      var name = inPlace ? path.relative('../', process.cwd()) : rawName
      const tmp = path.join(home, 'act-template')
      var to = path.resolve(rawName || '.')
      excute(tmp, template, to)
    })

program.parse(process.argv)