/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var requestHandler = function(request, response) {
// var utils = require('utils');
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log("Serving request type " + request.method + " for url " + request.url);


  // The outgoing status.
  var statusCode = 200;

  // console.log("request post data", request._postData);


  // if(request.method === 'GET' && request.url === '/classes/room1') {
  //   statusCode = 201;
  // } 

  // if(request.method === 'POST' && request.url !== '/classes/messages') {
  //   statusCode = 404;
  // }

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  // response.writeHead(statusCode, headers);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  var resultsObject = {results: []};
  // console.log("resultsObject", resultsObject);



  if (request.method === 'POST') {
    var body = '';
    request.on('data', function(chunk) {
      body += chunk.toString();
      console.log("chunk", chunk);
      console.log("chunk to string", chunk.toString()); // {'username': 'Jono' , 'message': 'Do my bidding'}
    });

    if (request.url === '/classes/messages' || request.url === '/classes/room1'){
      statusCode = 201;
      // if(request._postData !== undefined) {
      // }
    } else {
      statusCode = 404;
    };
     // JSON.parse(res._data).results;
    // var stringify = querystring.stringify(body);
    // console.log("parsedBody",parsedBody);
    // console.log('stringify', stringify);
    // JSON.parse(body).results
    // console.log("body results", body);

    request.on('end', function(){
    // var parsedBody = JSON.parse(body);
    // console.log("parsedBody", parsedBody);
      response.writeHead(statusCode, headers);
      response.write(body, function(){
        resultsObject.results.push(JSON.parse(body)); 
        // console.log('resultsObject', resultsObject);
        console.log('results Object[0].username', JSON.stringify(resultsObject.results[0].username));
        response.end(JSON.stringify(resultsObject));
      });
      // console.log("body", body);

    });
    // console.log("body", body)
  }
  
  if (request.method === 'GET') {
    if(request.url === '/classes/messages' || request.url === '/classes/room1') {
      statusCode = 200;
    } else {  
      statusCode = 404;
    }
    // request.on('end', function(){
      // console.log("resultsObject", resultsObject);
      response.writeHead(statusCode, headers);
      response.end(JSON.stringify(resultsObject));
      
    // })
  }

  if (request.method === 'OPTIONS') {

  }

  console.log("request URL true?",request.url === '/classes/room1')
  // if(request.method === 'POST' && request.url === '/classes/messages') {
  //   statusCode = 201;
  // } else if(request.method === 'POST' && request.url === '/classes/room1') {
  //   // console.log("post in classes/room1")
  //   statusCode = 201;
  // } else {
  //   statusCode = 404;
  // }

  // if(request.method === 'GET' && request.url === '/classes/messages') {
  //   statusCode = 200;
  // } else if(request.method === 'GET' && request.url === '/classes/room1') {
  //   statusCode = 200;
  // } else {
  //   statusCode = 404;
  // }
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  // response.end(JSON.stringify({results:[]}));

  if (response.url === '/1/classes/chatterbox') {
    console.log("hi");
  }

};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  "Content-Type": "application/json"
};

exports.requestHandler = requestHandler;
