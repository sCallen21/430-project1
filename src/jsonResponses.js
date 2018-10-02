const games = {};

// responds with body
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

// responds without body
const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

// returns the user object as JSON
const getGames = (request, response) => {
  const responseJSON = {
    games,
  };

  respondJSON(request, response, 200, responseJSON);
};

// returns a not found message
const getNotFound = (request, response) => {
  const responseJSON = {
    message: 'The resource you were looking for was not found.',
    id: 'Page not Found',
  };

  respondJSON(request, response, 404, responseJSON);
};

// adds a user via POST body
const addGame = (request, response, body) => {
  // default message
  const responseJSON = {
    message: 'Name and description are both required.',
  };

  // checks for both fields
  if (!body.name || !body.desc) {
    responseJSON.id = 'Missing Parameters';
    return respondJSON(request, response, 400, responseJSON);
  }

  // default status code is 201 (created)
  let responseCode = 201;

  // if game name already exists, switch to 204 (updated). Otherwise make a new obj in games
  if (games[body.name]) {
    responseCode = 204;
  } else {
    games[body.name] = {};
  }

  // updates/adds fields for game
  games[body.name].name = body.name;
  games[body.name].desc = body.desc;

  // sends JSON response if created, otherwise sends meta response
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSONMeta(request, response, responseCode);
};

// exports
module.exports = {
  getGames,
  getNotFound,
  addGame,
};
