const { Transform } = require('stream')
const cliProgress = require('cli-progress')
const colors = require('colors')
const ora = require('ora')
// const b1 = new cliProgress.SingleBar({
//   format: ora(`Loading ${colors.red('unicorns')}`).start() + ' ➜ ' + colors.rainbow('{bar}') + '| {percentage}%',
//   barCompleteChar: '\u2588',
//   barIncompleteChar: '\u2591',
//   hideCursor: true,
// })

let total = 100
let count = 0
// b1.start(total, count, {
//   speed: 'N/A',
// })

const stdout = (resolve, leaveTag) => {
  const spinner = ora(`Loading ${colors.red('docker base image build start 😁')}`).start()
  const transform = new Transform({
    readableObjectMode: true,
    writableObjectMode: true,
    transform(chunk, encoding, callback) {
      // console.log(`------------------->`, 'write')
      // console.log(chunk.toString())
      const str = chunk.toString()
      spinner.text = str
      const numArr = str.match(/(\d+)\/(\d+)/)
      if (Array.isArray(numArr)) {
        // if (total === count) {
        //   total = total + numArr[2]
        //   b1.start(total, count, {
        //     speed: 'N/A',
        //   })
        //   count++
        // } else {
        //   count++
        // }
        if (Array.isArray(numArr)) {
          // b1.increment()
        }
      }
      if (str.includes(leaveTag)) {
        // b1.update(total)
        // b1.stop()
        resolve()
        spinner.succeed()
      }
      callback()
    },
    end(chunk, encoding, callback) {
      console.log(`------------------->`, 'end')
      console.log(chunk.toString())
      // b1.stop()
      callback()
    },
  })
  return transform
}
module.exports = stdout
