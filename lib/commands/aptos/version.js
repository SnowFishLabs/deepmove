var package_json = require('../../../package.json');
var util = require('../../util');
var shell = require("shelljs");

module.exports = function (opts) {
    return new Command(opts);
};

var Command = function (opt) {

}

Command.prototype.handle = function (agent, comd, argv, rl, msg) {
    let binPath = "aptos";
    
    util.log(`deepmove ${package_json.version}`)
    shell.exec(`${binPath} -V`);

    rl.prompt();
}