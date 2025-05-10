import { new_move_gen, gen_move_test_scripts, gen_move_ptb_scripts } from '@deepmove/sui';
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

var util = require('../../util');

export default function (opts) {
    return new Command(opts);
};

var Command = function (opt) {

}

Command.prototype.sub_commands = ["test", "ptb"]

Command.prototype.handle = async function (agent, comd, argv, rl, msg) {
    if (!comd) {
        util.helpCommand("gen sui");
        rl.prompt();
        return;
    }

    let package_path = process.cwd();
    let move_gen = new_move_gen();

    if (comd == "test") {
        try {
            gen_move_test_scripts(move_gen, package_path);
        } catch (e) {
            console.error(e);
            rl.prompt();
            return;
        }
    } else if (comd == "ptb") {
        try {
            gen_move_ptb_scripts(move_gen, package_path);
        } catch (e) {
            console.error(e);
            rl.prompt();
            return;
        }
    } else {
        util.helpCommand("gen sui");
        rl.prompt();
        return;
    }

    rl.prompt();
}

Command.prototype.gen_test = function () {
    let package_path = process.cwd();

    let move_gen = new_move_gen();
    gen_move_test_scripts(move_gen, package_path);
}