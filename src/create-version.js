const semverInc = require('semver/functions/inc')
const semverMajor = require('semver/functions/major')
const semverMinor = require('semver/functions/minor')
const semverPatch = require('semver/functions/patch')
const createDockerImageVersion = (currentVersion) => {
  const semverPatchVersion = semverPatch(currentVersion)
  const semverMinorVersion = semverMinor(currentVersion)
  const semverMajorVersion = semverMajor(currentVersion)
  let patch = 0
  let minor = 0
  let major = 0
  if (semverPatchVersion === 20 && semverMinorVersion === 20) {
    major = semverMajor(semverInc(currentVersion, 'major'))
    patch = 0
    minor = 0
  } else if (semverPatchVersion === 20) {
    minor = semverMinor(semverInc(currentVersion, 'minor'))
    patch = 0
  } else if (semverMinorVersion === 20) {
    minor = 0
    major = semverMajor(semverInc(currentVersion, 'major'))
  } else {
    patch = semverPatch(semverInc(currentVersion, 'patch'))
  }
  console.log(patch)
  console.log(minor)
  console.log(major)
  console.log('modify version is:', `${major}.${minor}.${patch}`)
  return `${major}.${minor}.${patch}`
}
module.exports = createDockerImageVersion
