/**
 * Primary file for the Hello World API
 *
 */

// Dependencies
const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const config = require("./config");

// Instantiating the HTTP server
const httpServer = http.createServer((req, res) => {
  serverLogic(req, res);
});

// Start the HTTP server
httpServer.listen(config.httpPort, () => {
  console.log(
    `The server is listening on port ${config.httpPort} in ${config.envName} mode`
  );
});

// All the server logic for both the http and https server
function serverLogic(req, res) {
  // Get the URL and parse it
  const parsedUrl = url.parse(req.url, true);

  // Get the path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");

  // Get the query string as an object
  const queryStringObject = parsedUrl.query;

  // Get the HTTP method
  const method = req.method.toUpperCase();

  // Get the headers as an object
  const headers = req.headers;

  // Get the payload, if any
  const decoder = new StringDecoder("utf-8");
  let buffer = "";

  req.on("data", data => {
    buffer += decoder.write(data);
  });

  req.on("end", () => {
    buffer += decoder.end();

    // Choose the handler this request should go to. If one is not found use the Not found handler.
    const chosenHandler =
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : handlers.notFound;

    // Construct the data object to send to the handler
    const data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload: buffer
    };

    // Route the request to the hand=ler specified in the router
    chosenHandler(data, (statusCode, payload) => {
      // Use the status code called by the handler, or default to 200
      const resolvedStatusCode =
        typeof statusCode === "number" ? statusCode : 200;

      // Use the payload called by the handler, or default to empty object
      const resolvedPayload = typeof payload === "object" ? payload : {};

      // Convert the payload to a string
      const payloadString = JSON.stringify(resolvedPayload);

      // Return the response
      res.setHeader("Content-Type", "application/json");
      res.writeHead(resolvedStatusCode);
      res.end(payloadString);
    });
  });
}

// Define the handlers.
const handlers = {};

// Ping handler
handlers.hello = (data, callback) => {
  const welcomeMessage = `Hello ${
    data.queryStringObject && data.queryStringObject.name
      ? data.queryStringObject.name
      : data.headers["user-agent"].split("/")[0]
  }! Welcome to the pirple NodeJs master class.`;
  callback(200, { welcomeMessage });
};

// Not found handler
handlers.notFound = (data, callback) => {
  callback(404);
};

// Define a request router
const router = {
  hello: handlers.hello
};
