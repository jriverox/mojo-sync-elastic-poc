const yenv = require('yenv')
const RevenueRepository = require('../repositories/revenue.repository')
const QueueRepository = require('../repositories/queue.repository')
const utils = require('../utils/utils.js')
const env = yenv()
module.exports = class RevenueSyncService {
  constructor() {
    this.revenueRepository = new RevenueRepository(env.DATA_ORIGIN.BASE_URL)
    this.queueRepository = new QueueRepository(env.SQS.URL, env.SQS.REGION)
  }

  async sync(pageSize = 50, startPage = 0, endPage = 0) {
    console.log(`sync readPageSize: ${pageSize}, startPage: ${startPage}, endPage: ${endPage}`)
    for (let page = startPage; page <= endPage; page++) {
      const data = await this.tryGetRevenues(pageSize, page)
      await this.sendToQueue(data, page)
    }
  }

  async tryGetRevenues(readPageSize, page, attempt = 1, msDelay = 500) {
    try {
      return await this.revenueRepository.getRevenues(readPageSize, page)
    } catch (error) {
      const retries = env.BACKOFF_RETRIES || 0
      console.error(`Ha ocurrido un error, reintento ${attempt} de ${retries}, detalle: ${error}`)

      if (attempt <= retries) {
        attempt += 1
        await utils.delay(msDelay)
        return await this.tryGetRevenues(readPageSize, page, attempt, msDelay * 2)
      }
    }
  }

  async sendToQueue(data, page) {
    if (data && data.length && data.length > 0) {
      const maxBatchSize = env.SQS.MAX_BATCH_SIZE
      const chunkedArray = utils.chunkArray(data, maxBatchSize)
      console.log('chunkedArray devolvio', chunkedArray.length)
      for (let index = 0; index < chunkedArray.length; index++) {
        const singleArray = chunkedArray[index]
        const message = {
          header: `header-${page}-${index}`,
          data: singleArray,
        }
        const id = await this.queueRepository.send(message)
        console.log(id)
      }
    }
  }
}
