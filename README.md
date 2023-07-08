# Tesults API results check

This action uses the Tesults API to check results for a given target and build.

## Inputs

### `target`

**Required** The id of the target.

### `build`

**Required** The build name for the test run to check results for.

### `api_token`

**Required** The api token to use, generated from the Tesults config.

## Outputs

### `pass`

The number of passing test cases

### `total`

The total number of test cases

## Example usage

```yaml
uses: actions/tesults-api-results-check@latest
with:
  target: '<target id>'
  build: '<build name>'
  api_token: '<api token>'
```
