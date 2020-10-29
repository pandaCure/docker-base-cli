const path = require('path')
const homePath = process.env.HOME || process.env.USERPROFILE
const cachePackageFile = 'cachePackage.json'
const contextPath = process.cwd()
const cachePackagePath = path.resolve(contextPath, cachePackageFile)
const contextPackagePath = path.resolve(contextPath, 'package.json')
module.exports = {
  cachePackagePath,
  contextPackagePath,
}
