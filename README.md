apachelog-stream
================

This is an apache parser that takes a line of an apache log and returns it in json line by line through the stream.

[![Code Climate](https://codeclimate.com/github/apriendeau/apachelog-stream/coverage.png)](https://codeclimate.com/github/apriendeau/apachelog-stream)

## To install

`npm install --save apachelog-stream`

## Example

```javascript
  // read a file
  var fs = require('fs')
  // liner stream
  // apachelog-stream
  var ApacheStream = require('apachelog-stream')
  var logStream = new ApacheStream()
  var input  = fs.createReadStream('/some_random_log.log')  // can be from a stream such as knox or request
  var output = input.pipe(logStream)

  output.on('data', function(chunk){
    console.log(chunk.toString())
  })
```

## Options

#### logType

  `combined` or `common`

#### format

  Takes an array for strings of what you want it to output. Ex: ['ipAddress', 'host']. This needs to be in the same order   of the log that it is parsing. THIS WILL OVERRIDE LOGTYPE! So include all the fields that you are wanting.
