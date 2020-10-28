const fs = require('fs')
const path = require('path')
const execa = require('execa')
const cliProgress = require('cli-progress')
const createDockerImageVersion = require('./create-version')
const stdout = require('./stdout')
const colors = require('colors')
const b1 = new cliProgress.SingleBar({
  format: 'CLI Progress |' + colors.cyan('{bar}') + '| {percentage}% || {value}/{total} Chunks || Speed: {speed}',
  barCompleteChar: '\u2588',
  barIncompleteChar: '\u2591',
  hideCursor: true,
})
const contextPath = process.cwd()
const baseDockerFileName = 'Dockerfile.base'
const dockerFileName = 'Dockerfile'
const baseDockerFilePath = path.join(contextPath, baseDockerFileName)
const dockerFilePath = path.join(contextPath, dockerFileName)
console.log('baseDockerFilePath', baseDockerFilePath)
console.log('dockerFilePath', dockerFilePath)
const PROJECT = 'onionweb-base'
const REMOTE = 'docker.yc345.tv/teacherschool/'
;[('SIGINT', 'SIGTERM')].forEach(function (sig) {
  process.on(sig, function () {
    process.exit()
  })
})
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
  b1.start(1000, 0, {
    speed: 'N/A',
  })
  let canUseDocker = true
  while (canUseDocker) {
    try {
      canUseDocker = false
      b1.update(1)
      await execa('docker', ['ps', '-q'])
    } catch (error) {
      canUseDocker = true
    }
  }
  try {
    console.log('asdhhshajkl')
    b1.increment()
    console.log('laile')
    const buildDockerProgress = await execa('docker', ['build', '-t', BUILD_IMAGE, '.', '-f', baseDockerFileName])
    console.log(buildDockerProgress)
    b1.increment()
    const tagDockerImage = await execa('docker', ['tag', BUILD_IMAGE, SOURCE_IMAGE])
    console.log(tagDockerImage)
    b1.increment()
    const pushDockerImage = await execa('docker', ['push', SOURCE_IMAGE])
    console.log(pushDockerImage)
    b1.increment()
    const clearCurrentDockerImageId = await execa('docker', ['images', `${BUILD_IMAGE}`, '-q'])
    console.log(clearCurrentDockerImageId.stdout)
    b1.increment()
    const clearCurrentDockerImage = await execa('docker', [
      'rmi',
      '-f',
      `${clearCurrentDockerImageId.stdout.slice(0, 12)}`,
    ])
    console.log(clearCurrentDockerImage)
    b1.stop()
    console.log(`build successfully`)
    const config = fs.readFileSync(dockerFilePath, 'utf-8')
    const replaceStr = config.replace(/(docker\.yc345\.tv\/teacherschool\/(.*):)([a-zA-Z0-9]*)/g, (a, b, c, d) => {
      console.log(b)
      console.log(PROJECT)
      console.log(version)
      return `${b}${PROJECT}:${version}`
    })
    console.log(replaceStr)
    fs.writeFileSync(dockerFilePath, replaceStr)
    await execa('git', ['add', dockerFilePath])
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}
module.exports = createDockerBaseImage
