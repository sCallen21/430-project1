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

// returns the user object as JSON. Filters through results if
const getGames = (request, response, parsedQuery) => {
  let responseJSON = {};
  let gamesToReturn = {};

  // checks if there are any games to get back
  if (Object.keys(games).length > 0) {
    // if tags exist, otherwise parsedQuery will just be {}
    if (parsedQuery.tags) {
      const allSearches = parsedQuery.tags.split(' ');
      const gamesArray = Object.values(games);
      for (let i = 0; i < gamesArray.length; i++) {
        // skips adding game to object if it is already in the return object
        if (!gamesToReturn[gamesArray[i].name]) {
          for (let j = 0; j < allSearches.length; j++) {
            // if the search is exactly the game name
            if (allSearches[j] === gamesArray[i].name) {
              gamesToReturn[games[i].name] = games[i];
            } else {
              for (let k = 0; k < gamesArray[i].tags.length; k++) {
                // if the search is one of the games tags and it isn't in the object yet
                if (allSearches[j] === gamesArray[i].tags[k]) {
                  gamesToReturn[gamesArray[i].name] = gamesArray[i];
                }
              }
            }
          }
        }
      }
    } else {
      // else just return all games
      gamesToReturn = games;
    }

    responseJSON = {
      gamesToReturn,
    };
  } else {
    // otherwise send back a "no games" response
    responseJSON = { message: 'No games here!' };
  }

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

// adds a game via POST body
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

  // if body has tags in it, separate them into an array
  let allTags = [];
  if (body.tags) {
    allTags = body.tags.split(' ');
  }
  // updates/adds fields for game
  games[body.name].name = body.name;
  games[body.name].desc = body.desc;
  games[body.name].tags = allTags;

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
