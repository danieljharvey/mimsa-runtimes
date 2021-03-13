const main = require("../output/cjs0ace8ac964a4089efde6c6e2b4fac860308a9259493e22128401ef068806e88a/index.js")
  .main;

const fetch = (url) => (cb) => {
  console.log(`fetching from ${url}`);
  setTimeout(() => {
    cb("horses!");
  }, 500);
};

main("google.com")({ fetch })(console.log);
