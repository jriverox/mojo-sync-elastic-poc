const KoaRouter = require('koa-router')
const router = new KoaRouter({ prefix: '/revenue' })
const RevenueSyncService = require('../services/revenue-sync.service')
const syncService = new RevenueSyncService()

router.put('sync-request', '/', async (ctx) => {
  const request = ctx.request.body
  console.log(request)
  // TODO: validar con joi
  await syncService.sync(request.readPageSize, request.startPage, request.endPage)
  ctx.body = true
})

module.exports = router
