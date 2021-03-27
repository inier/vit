#!/usr/bin/env node

require('v8-compile-cache');

const resolveCwd = require('@umijs/deps/compiled/resolve-cwd');

const { name, bin } = require('../package.json');
const localCLI = resolveCwd.silent(`${name}/${bin['vit']}`);
if (localCLI && localCLI !== __filename) {
  const debug = require('@umijs/utils').createDebug('vit:cli');
  debug('Using local install of vit');
  require(localCLI);
} else {
  require('../lib/cli');
}
