const axios = require("axios")
const level = require("level")
const path = require("path")

var dbPath = process.env.DBDIR || path.join("/tmp/node-leveldb-sample", "swdb")
var db = level(dbPath, { keyEncoding: "binary", valueEncoding: "json" })

async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

async function movieDetails(n) {
    let details = ""
    await axios
        .get(`https://swapi.dev/api/films/${n}/`)
        .then(function (resp) {
            details = resp.data
            console.log("received JSON for: " + details.title)
        })
        .catch(function (err) {
            console.log(`error: ${err}`)
        })
    return details
}

async function push() {
    let i
    for (i = 1; i <= 6; i++) {
        console.log(`requesting JSON for: movie ${i}`)
        let details = await movieDetails(i)
        if (details !== "") {
            db.put(details.title, details)
        }
        await sleep(2000)
    }
}

async function pop() {
    var readStream = db.createReadStream({})
    readStream
        .on("data", async function (data) {
            console.log(`processing and deleting '${data.key}' ...`)
            let v = data.value
            console.log(`   ${v.title}, directed by ${v.director}`)
            console.log(`   released: ${v.release_date}`)
            db.del(data.key)
        })
        .on("error", async function (err) {
            console.log(`error reading stream: ${err}`)
        })
        .on("close", function () {
            // console.log("stream closed")
        })
        .on("end", function () {
            // console.log("stream ended")
        })
}

async function loopAndProcess() {
    while (true) {
        await pop()
        await sleep(5000)
    }
}

;(async () => {
    await Promise.all([push(), loopAndProcess()])
})()
