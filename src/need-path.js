const path = require('path')
const homePath = process.env.HOME || process.env.USERPROFILE
const cachePackageFile = 'cachePackage.json'
const cachePackagePath = path.resolve(homePath, cachePackageFile)
const contextPath = process.cwd()
const contextPackagePath = path.resolve(contextPath, 'package.json')
module.exports = {
  cachePackagePath,
  contextPackagePath,
}
