var util = require('./util');
var fs = require('fs');

var Command = function () {
	this.commands = {};
	this.Context = 'all';
}

module.exports = function () {
	return new Command();
}

Command.prototype.get_command = function(name) {
	return this.commands[name];
}

Command.prototype.get_commands = function () {
	var commands = [];
	for (var k in this.commands) {
		commands.push(k);
	}
	return commands;
}

Command.prototype.init = function () {
	let chain = process.env.CURRENT_CHAIN;
	this.initDir(__dirname + '/commands/' + chain)
}

Command.prototype.initDir = function(dir) {
	var self = this;
	fs.readdirSync(dir).forEach(function (filename) {
		if (/\.js$/.test(filename) || /\.mjs$/.test(filename)) {
			var name = filename.substr(0, filename.lastIndexOf('.'));
			var _command = require(`${dir}/` + filename)
			self.commands[name] = _command;
		}
	});
}

Command.prototype.handle = function (argv, msg, rl) {
	var self = this;
	var argvs = util.argsFilter(argv);
	var comd = argvs[0];
	var comd1 = argvs[1] || "";

	comd1 = comd1.trim();
	var m = this.commands[comd];
	if (m) {
		var _command;
		if (m.__esModule) {
			_command = m.default();
		} else {
			_command = m();
		}
		_command.handle(self, comd1, argv, rl, msg);
	} else {
		util.errorHandle(argv, rl);
	}
}

Command.prototype.quit = function (rl) {
	rl.emit('close');
}

Command.prototype.getContext = function () {
	return this.Context;
}

Command.prototype.setContext = function (context) {
	this.Context = context;
}