'use strict'
const DocumentProcessor = require('./services/document.service')
const processor = new DocumentProcessor()

module.exports.handler = async event => {
  const allDocuments = []
  for (const record of event.Records) {
    const body = JSON.parse(record.body)
    const documents = body.data
    allDocuments.push(documents)
  }

  // console.log(allDocuments)
  const response = await processor.execute(allDocuments)
  // console.log(response)
  // console.log(event)
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        event: event,
        // bulkResponse: response
      },
      null,
      2
    )
  }

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
}
