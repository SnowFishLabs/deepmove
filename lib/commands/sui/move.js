var util = require('../../util');
var shell = require("shelljs");

module.exports = function (opts) {
    return new Command(opts);
};

var Command = function (opt) {

}

Command.prototype.handle = function (agent, comd, argv, rl, msg) {
    var { binPath } = util.getSuiBin();

    shell.exec(`${binPath} ${argv}`);

    rl.prompt();
}

Command.prototype.move_build_test = function() {
    var { binPath } = util.getSuiBin();

    shell.exec(`${binPath} move build --test`);
}