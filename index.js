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
  opts.objectMode = true
  this._apacheFormat = selectFormat(opts)
  delete opts.format
  Transform.call(this, opts)
}

Apache.prototype._transform = function transform(chunk, encoding, done) {
  var data = chunk.match(/(?:[^\s"]+|"[^"]*"|\s\+)+/g)
  if(data === null){
    return done()
  }
  var format = this._apacheFormat
  var obj = {}
  format.forEach(function(element, index){
    if(data[index]){
      obj[format[index]] = data[index].replace('"','')
    }
  })
  obj.request = splitRequest(obj.request)
  var buf = new Buffer(JSON.stringify(obj)+'\n')
  this.push(buf)
  done()
}

function selectFormat (opts) {
  if(opts.format) {
    return opts.format
  }
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