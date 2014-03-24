apachelog-stream
================

This is an apache parser that takes a line of an apache log and returns it in json line by line through the stream.

## To install 

`npm install --save apachelog-stream`

Requires that it be fed into it line by line so we will use linerstream in this example. Possibly will build in the future.

## Example

```javascript
  // read a file
  var fs = require('fs')
  // liner stream
  var linerstream = require('linerstream')
  var splitter    = new linerstream()
  // apachelog-stream
  var ApacheStream = require('apachelog-stream')
  var apStream = new ApacheStream()
  // input/output
  var input  = fs.createReadStream('/some_random_log.log')
  var output = input.pipe(splitter).pipe(apStream)
  
  output.on('data', function(chunk){
    console.log(chunk.toString())
  })
```

## Options

`logType`
  `combined` or `common`
  
`format`
  Takes an array for strings of what you want it to output. Ex: ['ipAddress', 'host']. This needs to be in the same order   of the log that it is parsing. THIS WILL OVERRIDE LOGTYPE! So include all the fields that you are wanting.
