const fs = require('fs')
const path = require('path')
const execa = require('execa')
const cliProgress = require('cli-progress')
const createDockerImageVersion = require('./create-version')
const stdout = require('./stdout')
const colors = require('colors')
const { resolve } = require('path')
const { rejects } = require('assert')
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
  const cachePackageInfo = require(cachePackagePath)
  const { dockerVersion } = cachePackageInfo
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
  const buildDocker = () => {
    return new Promise((resolve, rejects) => {
      try {
        console.log(colors.random('第一阶段：构建基础镜像 ➜ \n'))
        execa('docker', ['build', '-t', BUILD_IMAGE, '.', '-f', baseDockerFileName]).stdout.pipe(
          stdout(resolve, 'Successfully tagged'),
        )
      } catch (error) {
        rejects(error)
      }
    })
  }
  const pushDocker = (version) => {
    return new Promise((resolve, rejects) => {
      try {
        console.log(colors.random('第三阶段：上传镜像仓库 ➜ \n'))
        execa('docker', ['push', SOURCE_IMAGE]).stdout.pipe(stdout(resolve, version))
      } catch (error) {
        rejects(error)
      }
    })
  }
  try {
    // console.log('build docker\n')
    console.clear()
    await buildDocker()
    // const buildDockerProgress = execa('docker', ['build', '-t', BUILD_IMAGE, '.', '-f', baseDockerFileName])
    //   .stdout.pipe(stdout)
    //   .pipe(stdout)
    // console.log(buildDockerProgress.stdout.pipe(stdout))
    // b1.increment()
    console.log(colors.random(`第二阶段：基础镜像Tag ➜ ${SOURCE_IMAGE}\n`))
    await execa('docker', ['tag', BUILD_IMAGE, SOURCE_IMAGE])
    // console.log(tagDockerImage)
    // b1.increment()
    await pushDocker(version)
    // const pushDockerImage = await execa('docker', ['push', SOURCE_IMAGE])
    // console.log(pushDockerImage)
    // b1.increment()
    const clearCurrentDockerImageId = await execa('docker', ['images', `${BUILD_IMAGE}`, '-q'])
    console.log(colors.random(`第四阶段：删除本地基础镜像 ➜ ${clearCurrentDockerImageId.stdout.slice(0, 12)}\n`))
    await execa('docker', ['rmi', '-f', `${clearCurrentDockerImageId.stdout.slice(0, 12)}`])
    // const clearCurrentDockerImageId = await execa('docker', ['images', `${BUILD_IMAGE}`, '-q'])
    // console.log(clearCurrentDockerImageId.stdout)
    // b1.increment()
    // const clearCurrentDockerImage = await execa('docker', [
    //   'rmi',
    //   '-f',
    //   `${clearCurrentDockerImageId.stdout.slice(0, 12)}`,
    // ])
    // console.log(clearCurrentDockerImage)
    // b1.stop()
    console.log(colors.random(`第五阶段：改写本地docker文件版本号 ➜ `))
    const config = fs.readFileSync(dockerFilePath, 'utf-8')
    const replaceStr = config.replace(/(docker\.yc345\.tv\/teacherschool\/)(.*):([a-zA-Z0-9.]*)/g, (a, b, c, d) => {
      console.log(b)
      console.log(c)
      console.log(version)
      return `${b}${c}:${version}`
    })
    console.log(replaceStr)
    fs.writeFileSync(dockerFilePath, replaceStr)
    console.log(colors.random(`第六阶段：改写本地缓存文件版本号 ➜ `))
    const newCachePackageInfo = {
      ...cachePackageInfo,
      dockerVersion: version,
    }
    fs.writeFileSync(cachePackagePath, JSON.stringify(newCachePackageInfo, null, 2))
    await execa('git', ['add', '-u', '.'])
    console.log(colors.random(`构建成功`) + '🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉')
    // await execa('git', ['add', dockerFilePath])
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}
module.exports = createDockerBaseImage
