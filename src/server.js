const http = require('http');
const url = require('url');

const query = require('querystring');
const responseHandler = require('./responses.js');
const jsonHandler = require('./jsonResponses.js');


const port = process.env.PORT || process.env.NODE_PORT || 3000;

// handles POST requests
const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/addUser') {
    const body = [];

    // spits out bad request if the upload stream errors
    request.on('error', (err) => {
      console.dir(err);
      response.statusCode = 400;
      response.end();
    });

    // adds chunks to byte array
    request.on('data', (chunk) => {
      body.push(chunk);
    });

    // on end of upload stream
    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();

      const bodyParams = query.parse(bodyString);

      // pass to the addUser function
      jsonHandler.addUser(request, response, bodyParams);
    });
  }
};

// handles GET requests
const handleGet = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/style.css') responseHandler.getCSS(request, response);
  else if (parsedUrl.pathname === '/getUsers') {
    jsonHandler.getUsers(request, response);
  } else if (parsedUrl.pathname === '/notReal') {
    jsonHandler.getNotFound(request, response);
  } else if (parsedUrl.pathname === '/') {
    responseHandler.getIndex(request, response);
  } else jsonHandler.getNotFound(request, response);
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else {
    handleGet(request, response, parsedUrl);
  }
};

http.createServer(onRequest).listen(port);
console.log(`Listening on 127.0.0.1:${port}`);
