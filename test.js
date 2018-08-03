const expect = require("chai").expect
const redis = require("fakeredis")

const RedisStream = require('./index.js')

describe('RedisStream', () => {
  const redisClient = redis.createClient({fast: false})
  const collectionName = 'ethbtc'

  it('should be instantiated as a writable redis stream', () => {
    const stream = new RedisStream({ redisClient, collectionName })

    expect(stream).to.have.a.property('write')
    expect(stream).to.have.a.property('_write')
    expect(stream).to.have.a.property('redisClient')
    expect(stream).to.have.a.property('collectionName', collectionName)
    expect(stream).to.have.a.property('collectionIndex', 0)
    expect(stream).to.have.nested.property('_writableState.objectMode', true)
  })

  it('should save items passed into collection', (done) => {
    const stream = new RedisStream({ redisClient, collectionName })
    const event = { args: { from: '0x1', to: '0x2', value: 100 } }
    const event2 = { args: { from: '0x2', to: '0x3', value: 100 } }

    const p1 = new Promise((resolve) => stream.write(event, 'utf8', resolve))
    const p2 = new Promise((resolve) => stream.write(event2, 'utf8', resolve))

    Promise.all([p1, p2]).then(() => {
      const p3 = new Promise((resolve) => {
        redisClient.hgetall(`${collectionName}:0`, (err, reply) => {
          expect(reply).to.be.deep.equal({ ...event.args, value: event.args.value.toString() })
          resolve()
        })
      })

      const p4 = new Promise((resolve) => {
        redisClient.hgetall(`${collectionName}:1`, (err, reply) => {
          expect(reply).to.be.deep.equal({ ...event2.args, value: event2.args.value.toString() })
          resolve()
        })
      })

      return Promise.all([p3, p4])
    }).then(() => done())
  })
})