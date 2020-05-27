'use strict'
const DocumentService = require('./services/document.service')
const service = new DocumentService()

module.exports.handler = async event => {
  const allDocuments = []
  for (const record of event.Records) {
    const body = JSON.parse(record.body)
    const documents = body.data
    allDocuments.push(...documents)
  }

  console.log(allDocuments)
  const response = await service.execute(allDocuments)
  console.log(response)
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        event: event
        // bulkResponse: response
      },
      null,
      2
    )
  }

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
}
