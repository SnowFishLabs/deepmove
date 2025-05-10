import { upgrade_move_module } from '@deepmove/sui';
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
var chalk = require('../../chalk.mjs').default;
var cliff = require("../../cliff");
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
    let oldPackageId = package_info.packageId;
    let oldUpgradeCapId = package_info.upgradeCapId;

    var { binPath } = util.getSuiBin();
    const { packageId, upgradeCapId, created, mutated, digest } = await upgrade_move_module(binPath, package_path, network, oldPackageId, oldUpgradeCapId);

    console.log(chalk.greenBright("\nSuccessfully Upgrade package\n"));
    console.log(chalk.greenBright(`https://${network}.suivision.xyz/txblock/${digest}`));
    if (created.length) {
        console.log(chalk.greenBright("\nCreated Objects:"));
        let createdInfos = []
        created.forEach(({ type, objectId, owner }) => {
            createdInfos.push(["Type", type]);
            createdInfos.push(["ObjectId", objectId]);
            createdInfos.push(["", ""]);
        });
        console.log(chalk.greenBright(cliff.stringifyRows(createdInfos, null, { columnSpacing: 5 })));
    }

    if (mutated.length) {
        console.log(chalk.greenBright("\nMutated Objects:"));
        let mutatedInfos = []
        mutated.forEach(({ type, objectId, owner }) => {
            mutatedInfos.push(["Type", type]);
            mutatedInfos.push(["ObjectId", objectId]);
            mutatedInfos.push(["", ""]);
        });
        console.log(chalk.greenBright(cliff.stringifyRows(mutatedInfos, null, { columnSpacing: 5 })));
    }

    console.log(chalk.greenBright("\nPackage info:"));
    let packageInfos = [
        ["PackageId", packageId],
        ["UpgradeCapId", upgradeCapId],
        ["", ""]
    ]
    console.log(chalk.greenBright(cliff.stringifyRows(packageInfos, null, { columnSpacing: 5 })));

    if (packageId && upgradeCapId) {
        util.updatePublishPackageInfos(package_path, network, {
            packageId: packageId,
            upgradeCapId: upgradeCapId
        });
    }

    rl.prompt();
}