const https = require("https");
const main = require("../output/cjs47cbdab43bb2a2f64af886af62acb6b12393867eaf85fd539268a9f9ba8118ab/index.js")
  .main;

const get = (url, callback) =>
  https
    .get(url, (resp) => {
      let data = "";

      // A chunk of data has been received.
      resp.on("data", (chunk) => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      resp.on("end", () => {
        callback([resp.statusCode, data.toString()]);
      });
    })
    .on("error", (err) => {
      callback([500, err.toString()]);
    });

const fetchHandler = (url, callback) => {
  get(url, callback);
};

const consoleHandler = (a, callback) => {
  console.log("Log:", a);
  callback(a);
};

const delayHandler = (ms, value, callback) => {
  setTimeout(() => {
    callback(value);
  }, ms);
};

const handler = (cmd, next) => {
  const callback = (cb) => (a) => handler(cb(a), next);
  switch (cmd.type) {
    case "Fetch3":
      return fetchHandler(cmd.vars[0], callback(cmd.vars[1]));
    case "Pure3":
      return next(cmd.vars[0]);
    case "Log":
      return consoleHandler(cmd.vars[0], callback(cmd.vars[1]));
    case "Wait":
      return delayHandler(cmd.vars[0], cmd.vars[1], callback(cmd.vars[1]));
  }
};

console.log("go!");
handler(main, (a) => console.log("Final Result:", a));
