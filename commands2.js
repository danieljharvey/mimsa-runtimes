const https = require("https");
const main = require("../output/cjs19022d82af62ebfd38f06d20c0c7af460e8999e0df63314eb0670b13eadbca67/index.js")
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
        callback(JSON.parse(data));
      });
    })
    .on("error", (err) => {
      console.log("Error: " + err.message);
    });

const mkFree = (msg, cb) => ({ type: "Free", vars: [msg, cb] });

const mkPure = (a) => ({ type: "Pure", vars: [a] });

const mkFetch = (url, cb) => mkFree({ type: "Fetch", vars: [url] }, cb);

const mkLog = (message, cb) => mkFree({ type: "Log", vars: [message] }, cb);

const mkWait = (ms, value, cb) =>
  mkFree({ type: "Wait", vars: [ms, value] }, cb);

const mimsaFree = mkFetch("https://www.w3.org/TR/PNG/iso_8859-1.txt", (a) => {
  const b = a + "!!!";
  return mkLog(b, (val) => mkWait(500, val, mkPure));
});

const fetchHandler = (url, callback) => {
  //get(url, callback);
  callback(`Some  shit I found at ${url}`);
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

const handler = (lump, next) => {
  console.log("handler", lump, lump.vars[0]);
  const callback = (cb) => (a) => handler(cb(a), next);
  switch (lump.type) {
    case "Pure":
      return next(lump.vars[0]);
    case "Free":
      const cmd = lump.vars[0];
      switch (cmd.type) {
        case "Fetch":
          return fetchHandler(cmd.vars[0], callback(lump.vars[1]));
        case "Log":
          return consoleHandler(cmd.vars[0], callback(lump.vars[1]));
        case "Wait":
          return delayHandler(cmd.vars[0], cmd.vars[1], callback(lump.vars[1]));
      }
  }
};

console.log("go!");
handler(main, (a) => console.log("Final Result:", a));
