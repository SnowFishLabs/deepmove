import { MoveGen } from './wasm/pkg/aptos_wasm';
import { setup_move } from './aptos_wasm';
import fs from 'fs-extra';

// export function gen_move_ptb_scripts(
//     move_gen: MoveGen, 
//     package_path: string
// ) {
//     setup_move(move_gen, package_path, true);

//     let out = package_path + "/ptb/wrappers";
//     if (!fs.existsSync(out)) {
//         fs.mkdirpSync(out);
//     }

//     move_gen.run_move_tx_gen(out)
// }

export function gen_move_test_scripts(
    move_gen: MoveGen, 
    package_path: string
) {
    setup_move(move_gen, package_path, true);

    let out = package_path + "/tests/wrappers";
    if (!fs.existsSync(out)) {
        fs.mkdirpSync(out);
    }

    move_gen.run_move_gen(out)
}