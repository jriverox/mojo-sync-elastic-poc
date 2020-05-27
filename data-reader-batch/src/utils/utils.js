module.exports = {
  chunkArray: (array, size) => {
    const result = []
    for (let i = 0; i < array.length; i += size) {
      const chunk = array.slice(i, i + size)
      result.push(chunk)
    }
    return result
  },
  delay: (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
  },
}
