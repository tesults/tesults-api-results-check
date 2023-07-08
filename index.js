// index.js

// Requires

const core = require('@actions/core')
const github = require('@actions/github')
const https = require('https')

// Input validation

const target = core.getInput('target')
const build = core.getInput('build')
const api_token = core.getInput('api_token')

if (target === undefined) {
    console.log("Missing input: target")
    process.exit(1)
}
if (build === undefined) {
    console.log("Missing input: build")
    process.exit(1)
}
if (api_token === undefined) {
    console.log("Missing input: api_token")
    process.exit(1)
}

// Check results

console.log("Check results for build: " + process.env.BUILD)

const options = {
    hostname: 'www.tesults.com',
    path: encodeURI('/api/results?target=' + process.env.TARGET + '&build=' + process.env.BUILD),
    headers: {
        Authorization: 'Bearer ' + process.env.API_TOKEN
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