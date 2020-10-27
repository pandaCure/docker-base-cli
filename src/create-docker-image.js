const fs = require('fs')
const path = require('path')
const execa = require('execa')
const cliProgress = require('cli-progress')
const createDockerImageVersion = require('./create-version')
const stdout = require('./stdout')
const contextPath = process.cwd()
const baseDockerFileName = 'Dockerfile.base'
const baseDockerFilePath = path.join(contextPath, baseDockerFileName)
console.log('baseDockerFilePath', baseDockerFilePath)

const PROJECT = 'onionweb-base'
const REMOTE = 'docker.yc345.tv/teacherschool/'

const createDockerBaseImage = async () => {
  const { cachePackagePath } = require('./need-path')
  const { dockerVersion } = require(cachePackagePath)
  if (!fs.existsSync(baseDockerFilePath)) {
    const baseFile = fs.readFileSync(path.resolve(__dirname, './template/Dockerfile.base'))
    fs.writeFileSync(baseDockerFilePath, baseFile)
  }
  const version = createDockerImageVersion(dockerVersion)
  console.log('version', version)
  const SOURCE_IMAGE = `${REMOTE}${PROJECT}:${version}`
  const BUILD_IMAGE = `${REMOTE}${PROJECT}`
  try {
    await execa('docker', ['ps', '-q'])
  } catch (error) {
    await execa('open', ['/Applications/Docker.app'])
  }
  let canUseDocker = true
  while (canUseDocker) {
    try {
      canUseDocker = false
      await execa('docker', ['ps', '-q'])
    } catch (error) {
      canUseDocker = true
    }
  }
  console.log('laile')
  const buildDockerProgress = await execa('docker', [
    'build',
    '-t',
    BUILD_IMAGE,
    '.',
    '-f',
    baseDockerFileName,
  ]).stdout.pipe(stdout)
  console.log(buildDockerProgress)
  const tagDockerImage = await execa('docker', ['tag', BUILD_IMAGE, SOURCE_IMAGE]).stdout.pipe(stdout)
  console.log(tagDockerImage)
  const pushDockerImage = await execa('docker', ['push', SOURCE_IMAGE]).stdout.pipe(stdout)
  console.log(pushDockerImage)
  const clearCurrentDockerImageId = await execa('docker', ['images', `${BUILD_IMAGE}`, '-q'])
  const clearCurrentDockerImage = await execa('docker', [
    'rmi',
    '-f',
    `$(docker images ${BUILD_IMAGE} -q)`,
  ]).stdout.pipe(stdout)
  console.log(clearCurrentDockerImage)
  // console.log(`build successfully`)
}
module.exports = createDockerBaseImage
