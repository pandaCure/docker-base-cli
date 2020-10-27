const path = require('path')
const homePath = process.env.HOME || process.env.USERPROFILE
const cachePackageFile = 'cachePackage.json'
const cachePackagePath = path.resolve(homePath, cachePackageFile)
module.exports = {
  cachePackagePath,
}
