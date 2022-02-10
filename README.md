# node-leveldb-sample

A sample project with Node and LevelDB.

Similar to, but much simpler than [CryptoEndpoint](https://github.com/pdvcs/crypto-endpoint), which operated a producer/consumer using Java and RocksDB.

## Building and Running

```bash
npm install
export DBDIR=/tmp/node-leveldb-sample
if [ -d $DBDIR ]; then rm -rf $DBDIR; fi && mkdir $DBDIR
node index.js
```
