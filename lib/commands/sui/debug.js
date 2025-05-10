var wasm = require('@deepmove/sui');
var util = require('../../util');

module.exports = function (opts) {
    return new Command(opts);
};

var Command = function (opt) {

}

Command.prototype.handle = function (agent, comd, argv, rl, msg) {
    if (!comd) {
        util.helpCommand("debug");
        rl.prompt();
        return;
    }

    var argvs = util.argsFilter(argv);

    if (argvs.length < 3) {
        util.helpCommand("debug");
        rl.prompt();
        return;
    }

    let module = argvs[1];
    let func = argvs[2];

    let package_path = process.cwd();
    let wasm_runtime = wasm.new_wasm();
    let move_code_helper = wasm.new_move_code_helper();

    wasm.debug_move_function(wasm_runtime, move_code_helper, package_path, module, func);

    rl.prompt();
}