const yenv = require('yenv')
const RevenueRepository = require('../repositories/revenue.repository')
const QueueRepository = require('../repositories/queue.repository')

const env = yenv()
module.exports = class RevenueSyncService {
  constructor() {
    this.revenueRepository = new RevenueRepository(env.DATA_ORIGIN.BASE_URL)
    this.queueRepository = new QueueRepository(env.SQS.URL, env.SQS.REGION)
  }

  async sync(readPageSize = 50, startPage = 0, endPage = 0) {
    let sqsMessages = []
    let sqsBatchCount = 0
    console.log(`sync readPageSize: ${readPageSize}, startPage: ${startPage}, endPage: ${endPage}`)
    for (let page = startPage; page <= endPage; page++) {
      const revenues = await this.revenueRepository.getRevenues(readPageSize, page)
      // console.log(revenues)
      const message = {
        header: `header-${page}`,
        data: revenues,
      }

      sqsMessages.push(message)
      sqsBatchCount += 1
      console.log('for', sqsBatchCount, page, endPage)
      if (sqsBatchCount === 10 || page === endPage) {
        await this.queueRepository.sendBatch(sqsMessages)
        sqsMessages = []
        sqsBatchCount = 0
      }
    }
  }
}
