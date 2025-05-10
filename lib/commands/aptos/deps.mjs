import { deps_init } from '@deepmove/aptos';

export default function (opts) {
    return new Command(opts);
};

var Command = function (opt) {

}

Command.prototype.handle = async function (agent, comd, argv, rl, msg) {
    let package_path = process.cwd();
    
    await deps_init(package_path);

    rl.prompt();
}

Command.prototype.deps_init = async function() {
    let package_path = process.cwd();

    deps_init(package_path);
}