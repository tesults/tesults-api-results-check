// index.js

// Requires

const core = require('@actions/core')
const github = require('@actions/github')
const https = require('https')

// Input validation

const target = core.getInput('target')
const build = core.getInput('build')
const api_token = core.getInput('api_token')

if (target === undefined || target === "-") {
    console.log("Missing input: target")
    process.exit(1)
}
if (build === undefined || build === "-") {
    console.log("Missing input: build")
    process.exit(1)
}
if (api_token === undefined || api_token === "-") {
    console.log("Missing input: api_token")
    process.exit(1)
}

// Check results

console.log("Check results for build: " + build)

const options = {
    hostname: 'www.tesults.com',
    path: encodeURI('/api/results?target=' + target + '&build=' + build),
    headers: {
        Authorization: 'Bearer ' + api_token
    }
}
https.get(options, (response) => {
    var result = ''
    response.on('data', function (chunk) {
        result += chunk;
    });
    response.on('end', function () {
        try {
            const resultObject = JSON.parse(result)
            const run = resultObject.data.results.runs[0]
            console.log("Results url: " + run.run_url)
            if (run.pass !== run.total) {
                console.log(run.pass + " tests passed out of " + run.total)
                process.exit(1)
            } else {
                console.log("All tests passed. Total tests: " + run.total)
                process.exit(0)
            }
        } catch (err) {
            console.log("Error: " + err)
            console.log(result)
            process.exit(1)
        }
    });
})