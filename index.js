const { Writable } = require("stream")

class RedisStream extends Writable {
  constructor({ redisClient, collectionName }) {
    super({ objectMode: true })

    this.redisClient = redisClient
    this.collectionName = collectionName
    this.collectionIndex = 0
  }

  _write(chunk, encoding, callback) {
    const event = { ...chunk.args }

    for (let key in event) {
      if (typeof event[key].toString === 'function')
        event[key] = event[key].toString()
    }

    const key = `${this.collectionName}:${this.collectionIndex}`
    this.collectionIndex++
    this.redisClient.hmset(key, event, callback)
  }
}

module.exports = RedisStream