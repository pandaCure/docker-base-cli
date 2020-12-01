const fs = require('fs')
const semver = require('semver')
const { cachePackagePath, contextPackagePath } = require('./need-path')
const createDockerBaseImage = require('./create-docker-image')
const isNeedBuildBaseImage = () => {
  const cacheData = JSON.parse(fs.readFileSync(cachePackagePath, 'utf-8'))
  const { devDependencies, dependencies } = cacheData
  const package = require(contextPackagePath)
  const contextDevDependencies = package.devDependencies
  const contextDependencies = package.dependencies
  // TODO: 相等且install package is same || 版本号兼容问题
  const validDependencies = Object.keys(contextDependencies).every((v) =>
    semver.gte(contextDependencies[v], dependencies[v]),
  )
  const validDevDependencies = Object.keys(contextDevDependencies).every((v) =>
    semver.gte(contextDevDependencies[v], devDependencies[v]),
  )
  if (
    Object.keys(contextDependencies).length !== Object.keys(dependencies).length ||
    Object.keys(contextDevDependencies).length !== Object.keys(devDependencies).length ||
    !validDependencies ||
    !validDevDependencies
  ) {
    cacheData.devDependencies = contextDevDependencies
    cacheData.dependencies = contextDependencies
    fs.writeFileSync(cachePackagePath, JSON.stringify(cacheData, null, 2))
    createDockerBaseImage()
  } else {
    console.log('🙅‍♀️  不需要build')
    process.exit(1)
  }
}
module.exports = isNeedBuildBaseImage
