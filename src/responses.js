const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const style = fs.readFileSync(`${__dirname}/../client/style.css`);

// this function sends a response
const respond = (request, response, content, code, type) => {
  response.writeHead(code, { 'Content-Type': type });
  response.write(content);
  response.end();
};

const getIndex = (request, response) => {
  respond(request, response, index, 200, 'text/html');
};
const getCSS = (request, response) => {
  respond(request, response, style, 200, 'text/css');
};

// helper function to return xml or json
const getReturnValue = (request, response, acceptedTypes, msg, code) => {
  if (acceptedTypes[0] === 'text/xml') {
    let responseXML = '<response>';
    if ('id' in msg) { responseXML = `${responseXML} <id>${msg.id}</id>`; }
    responseXML = `${responseXML} <message>${msg.message}</message>`;
    responseXML = `${responseXML} </response>`;

    return respond(request, response, responseXML, code, 'text/xml');
  }

  const messageString = JSON.stringify(msg);
  return respond(request, response, messageString, code, 'application/json');
};

// functions to return requests
const getSuccess = (request, response, acceptedTypes) => {
  // sends this object in either JSON or XML
  const msg = {
    message: 'This is a successful response',
  };

  return getReturnValue(request, response, acceptedTypes, msg, 200);
};

const getBadRequest = (request, response, acceptedTypes) => {
  // sends this object in either JSON or XML
  const msg = {
    id: 'Bad Request',
    message: 'Missing valid query parameter set to true',
  };

  return getReturnValue(request, response, acceptedTypes, msg, 400);
};

const getUnauthorized = (request, response, acceptedTypes) => {
  // sends this object in either JSON or XML
  const msg = {
    id: 'Unauthorized',
    message: 'Missing valid query parameter loggedIn set to yes',
  };

  return getReturnValue(request, response, acceptedTypes, msg, 401);
};

const getForbidden = (request, response, acceptedTypes) => {
  // sends this object in either JSON or XML
  const msg = {
    id: 'Forbidden',
    message: 'You do not have access to this content',
  };

  return getReturnValue(request, response, acceptedTypes, msg, 403);
};

const getInternal = (request, response, acceptedTypes) => {
  // sends this object in either JSON or XML
  const msg = {
    id: 'Internal Server Error',
    message: 'OOPSIE WOOPSIE!! Uwu We made a f*cky wucky!! A wittle f*cko boingo! The code monkeys at our headquarters are working VEWY HAWD to fix this!',
  };

  return getReturnValue(request, response, acceptedTypes, msg, 500);
};

const getNotImplemented = (request, response, acceptedTypes) => {
  // sends this object in either JSON or XML
  const msg = {
    id: 'Not Implemented',
    message: 'A get request for this page has not been implemented yet. Check back later for updated content.',
  };

  return getReturnValue(request, response, acceptedTypes, msg, 501);
};

const getNotFound = (request, response, acceptedTypes) => {
  // sends this object in either JSON or XML
  const msg = {
    id: 'Page Not Found',
    message: 'The page you are looking for was not found.',
  };

  return getReturnValue(request, response, acceptedTypes, msg, 404);
};

// exports all functions
module.exports = {
  getIndex,
  getCSS,
  getSuccess,
  getBadRequest,
  getUnauthorized,
  getForbidden,
  getInternal,
  getNotImplemented,
  getNotFound,
};
