const https = require("https");

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
        callback(JSON.parse(data).explanation);
      });
    })
    .on("error", (err) => {
      console.log("Error: " + err.message);
    });

const mimsa2 = {
  type: "Fetch",
  vars: [
    "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY",
    (a) => {
      const b = a + "!!!";
      return {
        type: "Log",
        vars: [
          b,
          (val) => ({
            type: "Wait",
            vars: [500, val, (a) => ({ type: "Done", vars: [a] })],
          }),
        ],
      };
    },
  ],
};

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

const handler = (lump, next) => {
  const callback = (cb) => (a) => handler(cb(a), next);
  switch (lump.type) {
    case "Fetch":
      return fetchHandler(lump.vars[0], callback(lump.vars[1]));
    case "Log":
      return consoleHandler(lump.vars[0], callback(lump.vars[1]));
    case "Wait":
      return delayHandler(lump.vars[0], lump.vars[1], callback(lump.vars[2]));
    case "Done":
      return next(lump.vars[0]);
  }
};

console.log("go!");
handler(mimsa2, (a) => console.log("Final Result:", a));
