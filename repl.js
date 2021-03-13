// this part to be added by runtime
const main = require("../output/cjseb45276f936f01182e2b6d960065a06ac3984ed5b3091d46f8a29fba88fa109d")
  .main;

// this is all standard boilerplate
const repl = require("repl");

const createRepl = (mimsaRepl) => {
  let mutableState = mimsaRepl.init;

  function myEval(cmd, _context, _filename, callback) {
    const cleanCmd = cmd.trim();
    const [state, str] = mimsaRepl.next(mutableState)(cleanCmd);
    mutableState = state;
    // console.log("state", mutableState);
    callback(null, str);
  }

  repl.start({ prompt: "> ", eval: myEval });
};

createRepl(main);
