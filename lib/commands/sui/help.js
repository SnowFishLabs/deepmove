var consts = require('../../consts');
var util = require('../../util');

module.exports = function(opts) {
	return new Command(opts);
};

var Command = function(opt){

}

Command.prototype.handle = function(agent, comd, argv, rl, msg){
	if (!comd) {
		util.errorHandle(argv, rl);
		return;
	}

	var argvs = util.argsFilter(argv);

	if (argvs.length > 2) {
		util.errorHandle(argv, rl);
		return;
	}

	if (comd === 'help') {
		util.help();
		rl.prompt();
		return;
	}

	if (consts.COMANDS_MAP[comd]) {
		var INFOS = consts.COMANDS_MAP[comd];
		util.log(INFOS);
		rl.prompt();
		return;
	}

	util.errorHandle(argv, rl);
}