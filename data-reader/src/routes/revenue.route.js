const { performance } = require('perf_hooks')
const KoaRouter = require('koa-router')
const router = new KoaRouter({ prefix: '/revenue' })
const RevenueSyncService = require('../services/revenue-sync.service')
const syncService = new RevenueSyncService()

router.put('sync-request', '/', async (ctx) => {
  const startTime = performance.now()
  const request = ctx.request.body
  // TODO: validar con joi
  await syncService.sync(request.readPageSize, request.startPage, request.endPage)
  const duration = performance.now() - startTime
  ctx.body = {
    message: 'success',
    duration: duration,
  }
})

module.exports = router
