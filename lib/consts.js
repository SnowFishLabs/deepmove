var Consts = {};

module.exports = Consts;

Consts.CONSOLE_MODULE = "__console__";

Consts.PROMPT = "@deepmove";

// https://patorjk.com/software/taag/#p=display&f=Letters&t=DEEP%20MOVE
Consts.LOGO = ` 
  DDDDD   EEEEEEE EEEEEEE PPPPPP     MM    MM  OOOOO  VV     VV EEEEEEE 
  DD  DD  EE      EE      PP   PP    MMM  MMM OO   OO VV     VV EE      
  DD   DD EEEEE   EEEEE   PPPPPP     MM MM MM OO   OO  VV   VV  EEEEE   
  DD   DD EE      EE      PP         MM    MM OO   OO   VV VV   EE      
  DDDDDD  EEEEEEE EEEEEEE PP         MM    MM  OOOO0     VVV    EEEEEEE 
`;

Consts.WELCOME_INFO = `
Welcome to DeepMove Interactive Client.
DeepMove is a smart contract development toolchain for Move developers. 
Type \'help\' for more information.
`;

Consts.HELP_INFO_1 = `
For information about DeepMove, visit:
   https://github.com/SnowFishLabs/deepmove
List of all DeepMove commands:
`

Consts.HELP_INFO_2 = `
For more command usage, type : help command
example: help gen
`

Consts.HELP_LOGIN = `
Welcome to DeepMove Interactive Client.
DeepMove is a smart contract development toolchain for Move developers. 
You can use following command to connect to blockchain interactive client
deepmove -c chain
Default type deepmove equals to:
deepmove -c sui
`

Consts.COMANDS_ALL_SUI = [
	["command", "  description"],
	["?", "  symbol for help"],
	["help", "  display the help"],
	["quit", "  quit deepmove"],
	["init", "  init deepmove move project"],
	["move", "  tool to build move applications"],
	["deps", "  move dependencies management, pull remote repos into local deps"],
	["clone", "  clone on chain move modules"],
	["gen", "  generate typescript test scripts, typescript ptb scripts"],
	["test", "  run move unit test with vitest"],
	["publish", "  publish move package"],
	["upgrade", "  upgrade move package"],
	["debug", "  debug move function"]
];

Consts.COMANDS_ALL_APTOS = [
	["command", "  description"],
	["?", "  symbol for help"],
	["help", "  display the help"],
	["quit", "  quit deepmove"],
	["init", "  init deepmove move project"],
	["move", "  tool to build move applications"],
	["deps", "  move dependencies management, pull remote repos into local deps"],
	["clone", "  clone on chain move modules"],
	["gen", "  generate typescript test scripts"],
	["test", "  run move unit test with vitest"],
	["publish", "  publish move package"],
	["upgrade", "  upgrade move package"],
];

Consts.COMANDS_MAP = {
	"help": 1,
	"deps": `
move dependencies management, pull remote repos into local deps
example: deps
	`,
	"clone":`
clone on chain move modules
example: clone <network> <packageid>
	<network> mainnet, testnet, devnet, localnet
	<packageid> move on chain packageid
	`,
	"gen sui": 
	`
generate kinds of scripts like: test, ptb
"test" for typescript test scripts
"ptb" for typescript ptb scripts
example: gen test
example: gen ptb
	`,
"gen aptos": 
	`
generate kinds of scripts like: test
"test" for typescript test scripts
example: gen test
	`,
	"test":
	`
run move unit test with vitest
you can run with "report" for full gas reports
example: test
example: test report
	`,
	"publish":
	`
publish move package
example: publish testnet
example: publish mainnet
example: publish devnet
	`,
	"upgrade":
	`
upgrade move package
example: upgrade testnet
example: upgrade mainnet
example: upgrade devnet
	`,
	"debug":
	`
debug move function

example: debug <module> <func>
	<module>: module name
	<func>: function name
	`
};

Consts.SUPPORTED_CHAINS = ["sui", "aptos"];