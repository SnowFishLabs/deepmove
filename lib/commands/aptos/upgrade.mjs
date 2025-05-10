import { upgrade_move_module } from '@deepmove/aptos';
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
        util.helpCommand("upgrade");
        rl.prompt();
        return;
    }

    let network = comd;

    // 'mainnet' | 'testnet' | 'devnet' | 'localnet'
    if (!util.isValidNetwork(network)) {
        console.log("invalid upgrade network: %s", network);
        util.helpCommand("upgrade");
        rl.prompt();
        return;
    }

    let package_path = process.cwd();

    let package_info = util.getPublishPackageInfos(package_path, network);
    let object_address = package_info.object_address;

    let new_object_address = upgrade_move_module("aptos", package_path, network, object_address);

    if (new_object_address) {
        util.updatePublishPackageInfos(package_path, network, {
            object_address: new_object_address,
        });
    }

    rl.prompt();
}