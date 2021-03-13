// this part to be added by runtime
const main = require("../output/cjseb45276f936f01182e2b6d960065a06ac3984ed5b3091d46f8a29fba88fa109d")
  .main;

var http = require("http");

const createServer = (mimsaServer) => {
  let mutableState = mimsaServer.init;

  function respond(req, res) {
    const cleanUrl = req.url.substring(1);
    const [state, response] = mimsaServer.next(mutableState)(cleanUrl);
    mutableState = state;
    // console.log("state", mutableState);
    res.write(response);
    res.end();
  }

  //create a server object:
  http.createServer(respond).listen(8080); //the server object listens on port 8080
};

createServer(main);
