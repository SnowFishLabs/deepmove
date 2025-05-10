var chalk = require('./chalk.mjs').default;
var command = require('./command')();
var argv = require('optimist').argv;
var readline = require('readline');
var consts = require('./consts');
var util = require('./util');
require('dotenv').config();

var chain = argv['c'] = argv['c'] || 'sui';

module.exports = doConnect;

function doConnect() {
  if (!util.isValidChain(chain)) {
    console.error("invalid chain %s", chain);
    console.error("current supported chains: ", consts.SUPPORTED_CHAINS.join(","));
    return;
  }

  util.log(chalk.blueBright(consts.LOGO));
  util.log(chalk.blue(`                                     Move development for professionals`));
  util.log(consts.WELCOME_INFO);

  process.env.CURRENT_CHAIN = chain;
  startCli();
}

function startCli() {
  var rl = readline.createInterface(process.stdin, process.stdout, completer);
  var PROMPT = `${chain}@deepmove>`
  rl.setPrompt(PROMPT);
  rl.prompt();

  command.init();

  rl.on('line', function (line) {
    var key = line.trim();
    if (!key) {
      util.help();
      rl.prompt();
      return;
    }
    switch (key) {
      case 'help':
        util.help();
        rl.prompt();
        break;
      case '?':
        util.help();
        rl.prompt();
        break;
      case 'quit':
        command.quit(rl);
        break;
      default:
        command.handle(key, {
          user: chain
        }, rl);
        break;
    }
  }).on('close', function () {
    util.log('bye ' + chain);
    process.exit(0);
  });
}

function completer(line) {
  line = line.trim();
  var hits = [];
  // commands tab for infos 
  if (line === "help") {
    var commands = command.get_commands();
    for (var i = 0; i < commands.length; i++) {
      hits.push(commands[i])
    }
  }

  var m = command.get_command(line);

  if (m) {
    let c;
    if (m.__esModule) {
      c = m.default();
    } else {
      c = m();
    }

    if (c && c.sub_commands) {
      console.log(c.sub_commands)
      for (var i = 0; i < c.sub_commands.length; i++) {
        hits.push(c.sub_commands[i])
      }
    }
  }

  console.log(hits)
  console.log(line)
  // show all completions if none found
  return [hits.length ? hits : [], line];
}

process.on("uncaughtException", function(error) {
  console.error(error.stack)
})