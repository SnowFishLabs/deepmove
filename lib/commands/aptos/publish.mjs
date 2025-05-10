import { publish_move_module } from '@deepmove/aptos';
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
var util = require('../../util');

export default function (opts) {
    return new Command(opts);
};

var Command = function (opt) {

}

Command.prototype.handle = async function (agent, comd, argv, rl, msg) {
    if (comd === 'help') {
        util.helpCommand("publish");
        rl.prompt();
        return;
    }

    let network = comd;
    // 'mainnet' | 'testnet' | 'devnet' | 'localnet'
    if (!util.isValidNetwork(network)) {
        console.log("invalid publish network: %s", network);
        util.helpCommand("publish");
        rl.prompt();
        return;
    }

    let package_path = process.cwd();

    let object_address = publish_move_module("aptos", package_path, network)

    if (object_address) {
        util.updatePublishPackageInfos(package_path, network, {
            object_address: object_address,
        });
    }
    
    rl.prompt();
}