const axios = require('axios')

module.exports = class RevenueRepository {
  constructor(baseUrl) {
    this.baseUrl = baseUrl
  }

  async getRevenues(pageSize = 50, page = 0) {
    const skip = page * pageSize
    const endpoint = `${this.baseUrl}/ingresos?perpage=${pageSize}&page=${skip}`
    const response = await axios.get(endpoint)
    let result = []
    if (
      response.data &&
      response.data.retorno === 'OK' &&
      response.data.result.data &&
      Array.isArray(response.data.result.data) &&
      response.data.result.data.length > 0
    ) {
      result = response.data.result.data
    }
    return result
  }
}
