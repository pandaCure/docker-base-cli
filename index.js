const fs = require('fs')
const semver = require('semver')
const path = require('path')
const package = require('./package.json')
const createCacheFile = require('./src/create-cache-file')
const isNeedBuildBaseImage = require('./src/need-build-base-image')
const { cachePackagePath } = require('./src/need-path')
// TODO：是否更新最新docker-base-cli
const hodorCheck = () => {
  console.log(process.cwd())
  if (fs.existsSync(cachePackagePath)) {
    isNeedBuildBaseImage()
  } else {
    createCacheFile(cachePackagePath)
  }
}

module.exports = hodorCheck
