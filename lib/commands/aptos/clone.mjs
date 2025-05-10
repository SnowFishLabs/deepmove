import { new_move_gen, clone_chain_move_module } from '@deepmove/aptos';
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

var util = require('../../util');

export default function (opts) {
    return new Command(opts);
};

var Command = function (opt) {

}

Command.prototype.handle = async function (agent, comd, argv, rl, msg) {
    if (!comd) {
        util.helpCommand("clone");
        rl.prompt();
        return;
    }

    var argvs = util.argsFilter(argv);

    let package_path = process.cwd();
    let move_gen = new_move_gen();

    if (argvs.length < 3) {
        console.error("invalid params");
        util.helpCommand("clone");
        rl.prompt();
        return;
    }

    let network = argvs[1];

    if (!util.isValidNetwork(network)) {
        console.error("invalid network %s", network);
        util.helpCommand("clone");
        rl.prompt();
        return;
    }

    let account_address = argvs[2];

    await clone_chain_move_module(move_gen, network, account_address, package_path);

    rl.prompt();
}