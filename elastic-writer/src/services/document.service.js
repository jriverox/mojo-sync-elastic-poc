const yenv = require('yenv')
const DocumentRepository = require('../repositories/document.respository')
const utils = require('../utils/utils')

const env = yenv()
const repository = new DocumentRepository()

module.exports = class DocumentProcessor {
  async execute (documents) {
    const chunkedArray = utils.chunkArray(documents)
    const retries = env.ELASTICSEARCH.BACKOFF_RETRIES
    const responses = []

    for (let index = 0; index < chunkedArray.length; index++) {
      const batchOfDocuments = chunkedArray[index]
      const bulkResult = await this.tryBulkDocuments(batchOfDocuments, retries)
      // TODO: habria que manejar los rechazos
      // bulkResult.response.errors
      responses.push(bulkResult)
    }
    return responses
  }

  async tryBulkDocuments (documents, reties = 3, attemp = 1, msDelay = 1000) {
    try {
      return await repository.bulkDocuments(documents)
    } catch (error) {
      console.error(error)
      if (attemp <= reties) {
        attemp += 1
        console.log(`tryBulkDocuments reintento: ${attemp} de ${reties}`)
        await utils.delay(msDelay)
        return await this.tryBulkDocuments(documents, reties, attemp, msDelay * 2)
      } else {
        throw error
      }
    }
  }
}
