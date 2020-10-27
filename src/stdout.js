const { Transform } = require('stream')
const cliProgress = require('cli-progress')
const colors = require('colors')
const b1 = new cliProgress.SingleBar({
  format: 'CLI Progress |' + colors.cyan('{bar}') + '| {percentage}% || {value}/{total} Chunks || Speed: {speed}',
  barCompleteChar: '\u2588',
  barIncompleteChar: '\u2591',
  hideCursor: true,
})
let total = 0
let count = 0
const stdout = new Transform({
  readableObjectMode: true,
  writableObjectMode: true,
  transform(chunk, encoding, callback) {
    console.log(`------------------->`, 'write')
    console.log(chunk.toString())
    const str = chunk.toString()
    const numArr = str.match(/(\d+)\/(\d+)/)
    if (Array.isArray(numArr)) {
      if (total === count) {
        total = total + numArr[2]
        b1.start(total, count, {
          speed: 'N/A',
        })
        count++
      } else {
        count++
      }
      if (Array.isArray(numArr)) {
        b1.increment()
      }
    }
    if (str.includes('Successfully tagged')) {
      b1.stop()
    }
    callback()
  },
  end(chunk, encoding, callback) {
    console.log(`------------------->`, 'end')
    console.log(chunk.toString())
    b1.stop()
    callback()
  },
})
module.exports = stdout
