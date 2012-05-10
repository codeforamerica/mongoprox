var http = require('http'),
    https = require('https'),
    util = require('util'),
    colors = require('colors');

var welcome = [
  '#     #     #####  #####   ####  #    # #   #',
  '##   ##     #    # #    # #    #  #  #   # # ',  
  '# # # #     #    # #    # #    #   ##     #  ',   
  '#  #  # ### #####  #####  #    #   ##     #  ',   
  '#     #     #      #   #  #    #  #  #    #  ',   
  '#     #     #      #    #  ####  #    #   #  '
].join('\n');
util.puts(welcome.rainbow.bold);

var port = process.env.PORT || 3000;
console.log("started with APIkey: " + process.env.APIkey);
console.log("running on port: " + port);

//
// Http Proxy Server
//
http.createServer(function (request, proxyResponse) {

  console.log("recieved proxy request with path: " + request.url);
  if (request.url === "/favicon.ico") {
    proxyResponse.writeHead(404);
    proxyResponse.end();
    console.log(request.url + " " + 404);
    return;
  }
  
  // connecting to mongohq using secret key and path supplied by request
  var options = {
    host: 'api.mongohq.com',
    port: 443,
    path: request.url + "&_apikey=" + process.env.APIkey,
    method: 'GET'
  };

  // make https call to mongohq
  var req = https.request(options, function(res) {
    
    console.log("querying: " + options['path']);

    // hold data we recieve from mongohq
    var buffers = new Array();
    
    // when data is recieved, capture it
    res.on('data', function(data) {
      buffers.push(data);
    });

    // when call to proxy is complete, return the 
    // as if we were mongohq
    res.on('end', function() {
      //console.log("statusCode: ", res.statusCode);
      //console.log("headers: ", res.headers);
      proxyResponse.writeHead(res.statusCode,
                        {'Content-Type': res.headers['content-type'],
                         'server': res.headers['server'],
                         'date': res.headers['date'],
                         'connection': res.headers['connection']});
      allBuffers = null;
      buffers.forEach(function(buffer) {
        console.log(buffer.length);
        if (allBuffers === null) {
          allBuffers = buffer;
        } else {
          var currentLength = allBuffers.length;
          console.log("currentLength = " + currentLength);
          var newLength = currentLength + buffer.length;
          console.log("newLength = " + newLength);
          expandBuffer = new Buffer(newLength);
          //expandBuffer.copy(allBuffers);
          allBuffers.copy(expandBuffer);
          console.log("expandBuffer is now " + expandBuffer.length);
          console.log("currentLength = " + currentLength);
          //expandBuffer.copy(buffer, 0, currentLength+1, newLength);
          buffer.copy(expandBuffer, currentLength, 0);
          allBuffers = expandBuffer;
        }
      });
      if (allBuffers === null)
        allBuffers = {}; 
      proxyResponse.end(allBuffers.toString());
    });
  });
  req.end();

  // write errors to console
  req.on('error', function(e) {
    console.error(e);
  });

}).listen(port, "0.0.0.0");

util.puts('http proxy server'.blue + ' started '.green.bold + 'on port '.blue + port.toString().yellow);

