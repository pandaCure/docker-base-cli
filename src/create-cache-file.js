const fs = require('fs')
const path = require('path')
const createDockerBaseImage = require('./create-docker-image')
const contextPath = process.cwd()
const contextPackageFilePath = path.join(contextPath, 'package.json')
const contextPackageFile = require(contextPackageFilePath)
const contextPackageFileDevDependencies = contextPackageFile.devDependencies
const contextPackageFileDependencies = contextPackageFile.dependencies
const createCacheFile = (filePath) => {
  console.log('暂无缓存文件，创建中。。。')
  const writePackageData = {
    devDependencies: contextPackageFileDevDependencies,
    dependencies: contextPackageFileDependencies,
    dockerVersion: '0.0.0',
  }
  console.log(filePath)
  fs.writeFileSync(filePath, JSON.stringify(writePackageData, null, 2))
  // 创建project base image
  createDockerBaseImage()
}
module.exports = createCacheFile
