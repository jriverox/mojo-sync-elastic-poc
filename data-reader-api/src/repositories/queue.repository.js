const AWS = require('aws-sdk')
module.exports = class QueueManager {
  constructor(queueUrl, region) {
    AWS.config.update({ region: region })
    this.sqs = new AWS.SQS({ apiVersion: '2012-11-05' })
    this.queueUrl = queueUrl
  }

  async send(message) {
    const params = {
      MessageBody: JSON.stringify(message),
      QueueUrl: this.queueUrl,
    }

    const response = await this.sqs.sendMessage(params).promise()
    return response.MessageId
  }

  async sendBatch(messageBatch) {
    const messages = messageBatch.map((task, i) => {
      return {
        Id: `task-${i}`,
        MessageBody: JSON.stringify(task),
      }
    })
    const params = {
      Entries: messages,
      QueueUrl: this.queueUrl,
    }
    return await this.sqs.sendMessageBatch(params).promise()
  }
}
