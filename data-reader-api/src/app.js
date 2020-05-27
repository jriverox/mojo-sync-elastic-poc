const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const json = require('koa-json')
const logger = require('koa-logger')
const routes = require('./routes')

const app = new Koa()

app.use(bodyParser()).use(json()).use(logger())

routes.map((route) => {
  app.use(route.routes()).use(route.allowedMethods())
})

module.exports = app
