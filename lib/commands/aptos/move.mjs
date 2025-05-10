import { get_module_name, set_move_toml_addresses } from '@deepmove/aptos';
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
var shell = require("shelljs");

export default function (opts) {
    return new Command(opts);
};

var Command = function (opt) {

}

Command.prototype.handle = function (agent, comd, argv, rl, msg) {
    let package_path = process.cwd();
    let module_name = get_module_name(package_path);
    
    set_move_toml_addresses(module_name, package_path, "0x0");

    let binPath = "aptos";

    shell.exec(`${binPath} ${argv}`);

    rl.prompt();
}

Command.prototype.move_build_test = function() {
    let binPath = "aptos";

    shell.exec(`${binPath} move build`);
}