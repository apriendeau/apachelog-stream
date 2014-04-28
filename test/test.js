// Test commone
var fs          = require('fs')
var apachelog   = require('../')

var sinon       = require('sinon')
var expect      = require('chai').expect

describe('Apachelog-stream', function (){
  it('should be able to parse a common log format', function (done) {
    var input    = fs.createReadStream(__dirname + '/data/common_log.log')
    var apache   = new apachelog()
    expect(apache).to.exist
    var output   = input.pipe(apache)
    var validateLineSpy = sinon.spy(validateLine)

    output.on('finish', finishHandler)
    output.on('readable', readableHandler)

    function validateLine(line) {
      line = line.toString()
      expect(line).to.exist
      expect(line).to.be.a('string')
      var json = JSON.parse(line)
      expect(json).to.exist
      expect(json).to.be.a('object')
      expect(json).to.not.be.empty
    }

    function readableHandler() {
      var data
      while (true) {
        data = output.read()
        if (!data) {
          break
        }
        validateLineSpy(data)
      }
    }

    function finishHandler() {
      expect(validateLineSpy.callCount).to.be.above(1)
      done()
    }
  })

  it('should be able to parse a combined log format', function (done){
    var combinedInput = fs.createReadStream(__dirname + '/data/combined_log.log')
    var apache   = new apachelog({logType: 'combined'})
    expect(apache).to.exist
    var combinedOutput   = combinedInput.pipe(apache)
    var validateLineSpy = sinon.spy(validateLine)

    combinedOutput.on('finish', finishHandler)
    combinedOutput.on('readable', readableHandler)

    function validateLine(line) {
      line = line.toString()
      expect(line).to.exist
      expect(line).to.be.a('string')
      var json = JSON.parse(line)
      expect(json).to.exist
      expect(json).to.be.a('object')
      expect(json).to.have.property('referrer');
      expect(json).to.have.property('userAgent');
      expect(json).to.not.be.empty
    }

    function readableHandler() {
      var data
      while (true) {
        data = combinedOutput.read()
        if (!data) {
          break
        }
        validateLineSpy(data)
      }
    }

    function finishHandler() {
      expect(validateLineSpy.callCount).to.be.above(1)
      done()
    }
  })
})
