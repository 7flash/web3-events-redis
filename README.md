## Install
`npm install --save web3-events-redis`

## Example:

```
const Web3Wallet = require("web3-wallet");
const { Web3EventStream } = require("web3-stream");
const RedisStream = require("web3-events-redis")

const redis = require("fakeredis")

const web3 = Web3Wallet.create(null, 'https://api.myetherapi.com/eth');
const contract = web3.eth.loadContract(require('./CryptoKitties.json'), '0x06012c8cf97bead5deae237070f9587f8e7a266d');

const redisClient = redis.createClient({fast: false})
const collectionName = 'transfers'

const web3Stream = new Web3EventStream(web3, contract.Transfer, {}, { fromBlock: 4605167 })
const redisStream = new RedisStream({ redisClient, collectionName })

web3Stream.pipe(redisStream)
```