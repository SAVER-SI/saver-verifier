# Bazaar metadata preservation: SELAT discovery

A proposed interoperability correction for the published Apache-2.0 package `@selat-ai/selat-discovery`. Checked on 25 October 2026 against versions 0.28.1 and 0.28.2. This is not a deployed SELAT fix, endorsement or ranking guarantee. SAVER operates a service affected by this ingestion behavior.

## Reproduction

Bazaar resources can declare a description and tags, but `mapBazaarToServices()` omits the service description and tags. `normalizeAgenticCatalog()` subsequently initializes tags to `[]`. Endpoint descriptions and methods survive. The ranker uses service tags as a matching field, so this loses declared discovery information; it does not establish the cause of every search miss.

The included regression failed against unchanged 0.28.2 at the missing service-description assertion and passed after applying the patch. It also passed on patched 0.28.1. There is no change to ranking weights, spam filtering, payment logic, endpoint preference or API prices.

The candidate keeps the first declared description per service and deduplicates bounded string tags across resources. The maintainer should decide whether endpoint-specific metadata needs a finer model before merging. Categories are not inferred.

## Run without wallets or dependency installation

From a scratch directory with Node 24, download the published package (do not install it):

```sh
mkdir -p source
curl -fsS https://registry.npmjs.org/@selat-ai/selat-discovery/-/selat-discovery-0.28.2.tgz -o discovery.tgz
tar -xzf discovery.tgz -C source
# Place this directory's files in ./correction next to ./source.
node correction/metadata-regression.mjs
# Expected assertion failure on the unchanged source.
(cd source/package && patch -p1 --dry-run -i ../../correction/preserve-bazaar-metadata.patch)
(cd source/package && patch -p1 -i ../../correction/preserve-bazaar-metadata.patch)
node correction/metadata-regression.mjs
# Expected PASS.
```

`bazaar-fixture.json` projects the public discovery metadata onto fields needed for this regression, with a synthetic request example. It is not a paid response, customer input or benchmark. Tests additionally cover an unrelated synthetic provider, malformed tags, deduplication, unchanged POST methods and prices. They import mapping functions locally; no wallet, paid verification or model call is required.

The advertised source repository returned404 from our current connection. This package is ready for maintainer review through SELAT's public support channel; it has not been submitted or deployed upstream.

## License and attribution

The patch changes upstream Apache-2.0 code. The original package license accompanies it; the published tarball contains no NOTICE file. Modified code is marked by this document and the patch; no SELAT trademarks or endorsement rights are claimed. Public SAVER contracts and examples remain separate from the private production server.
