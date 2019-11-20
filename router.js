// Define a request router
const router = {
  hello: (data, callback) => {
    const welcomeMessage = `Hello ${
      data.queryStringObject && data.queryStringObject.name
        ? data.queryStringObject.name
        : data.headers["user-agent"].split("/")[0]
    }! Welcome to the pirple NodeJs master class.`;
    callback(200, { welcomeMessage });
  },
  notFound: (data, callback) => {
    callback(404);
  }
};

// Export router
module.exports = router;
