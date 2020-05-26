const elasticsearch = require('elasticsearch')
const yenv = require('yenv')
const env = yenv()

module.exports = class DocumentRepository {
  constructor () {
    this.client = this.getClient()
  }

  async bulkDocuments (documents) {
    console.log('documents.length', documents.length)
    const indexName = env.ELASTICSEARCH.INDEX
    const body = this.getBulkBody(documents, indexName)
    console.log('body', body)
    // const body = documents.flatMap(doc => [{ index: { _index: indexName } }, doc])
    return await this.client.bulk({ body })
  }

  getClient () {
    const host = env.ELASTICSEARCH.HOST
    const requestTimeout = env.ELASTICSEARCH.REQUEST_TIMEOUT
    return new elasticsearch.Client({
      host,
      requestTimeout
    })
  }

  getBulkBody (documents, indexName) {
    const body = []
    for (const document of documents) {
      const item = this.getBulkItem(document.id, document, indexName)
      body.push(item.header)
      body.push(item.doc)
    }
    return body
  }

  getBulkItem (id, doc, indexName) {
    return {
      header: {
        update: {
          _index: indexName,
          _type: env.ELASTICSEARCH.INDEX_TYPE,
          _id: id
        }
      },
      doc: {
        doc: doc,
        doc_as_upsert: true
      }
    }
  }

  transformDocument (document) {
    // TODOD: implemnetar transformacion depende la necesidad
    delete document.id
    return document
  }
}
