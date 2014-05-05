var Transform = require('stream').Transform
var util = require('util')
util.inherits(Apache, Transform)

var combinedLog = [
  'ipAddress',
  'RFC1413',
  'userId',
  'timeProcessed',
  'request',
  'status',
  'size',
  'referrer',
  'userAgent'
]

var commonLog = [
  'ipAddress',
  'RFC1413',
  'userId',
  'timeProcessed',
  'request',
  'status',
  'size'
]

function Apache(opts) {
  opts = opts || {}
  opts.objectMode = false
  this._apacheFormat = selectFormat(opts)
  delete opts.format
  Transform.call(this, opts)
}

Apache.prototype._transform = function transform(chunk, encoding, done) {
  if(Buffer.isBuffer(chunk)){
    chunk = chunk.toString()
  }
  if(chunk === null){
    return done()
  }
  if (this._lastLineData) { chunk = this._lastLineData + chunk }
  var lines = chunk.split('\n')
  this._lastLineData = lines.splice(lines.length - 1, 1)[0]

  lines.forEach(function (line) {
    var data = line.match(/(?:[^\s"]+|"[^"]*"|\s\+)+/g)
    var format = this._apacheFormat
    var obj = {}
    if(data !== null) {
      format.forEach(function(element, index){
        if(data[index]){
          obj[format[index]] = data[index].replace('"','')
        }
      })
      obj.request = splitRequest(obj.request)
      var buf = new Buffer(JSON.stringify(obj))
      this.push(buf)
    }
  }.bind(this))
  done()
}

Apache.prototype._flush = function flush(done) {
  if (this._lastLineData) {
    var line   = this._lastLineData
    var data   = line.match(/(?:[^\s"]+|"[^"]*"|\s\+)+/g)
    var format = this._apacheFormat
    var obj    = {}
    if(data !== null) {
      format.forEach(function(element, index){
        if(data[index]){
          obj[format[index]] = data[index].replace('"','')
        }
      })
      obj.request = splitRequest(obj.request)
      var buf = new Buffer(JSON.stringify(obj))
      this.push(buf)
    }
  }
  this._lastLineData = null
  done()
}

function selectFormat (opts) {
  if(opts.format) { return opts.format }
  if(opts.logType === 'combined'){
    return combinedLog
  }
  return commonLog
}

function splitRequest(request){
  var obj = {}
  var req = request.split(' ')
  obj.method = req[0]
  obj.route = req[1]
  obj.protocol = req[2]
  return obj
}

module.exports = Apache
