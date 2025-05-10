var shell = require("shelljs");

module.exports = function (opts) {
    return new Command(opts);
};

var Command = function (opt) {

}

Command.prototype.handle = function (agent, comd, argv, rl, msg) {
    if (comd == "report") {
        shell.exec(`npx cross-env GAS_REPORT=true npm run test`);
    } else {
        shell.exec(`npm run test`);
    }

    rl.prompt();
}