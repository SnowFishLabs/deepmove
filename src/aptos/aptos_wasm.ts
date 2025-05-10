import { AptosWasm, MoveGen } from './wasm/pkg/aptos_wasm';
import dotenv from 'dotenv'
dotenv.config()

let wasm = AptosWasm.new_wasm()
let move_gen = MoveGen.new();
// let move_code_helper = MoveCodeHelper.new();

export function refresh_vm() {
    wasm.refresh_vm();
}

export function new_wasm() {
    return AptosWasm.new_wasm();
}

export function get_wasm(): AptosWasm {
    return wasm
}

// export function new_move_code_helper() {
//     return MoveCodeHelper.new();
// }

export function new_move_gen() {
    return MoveGen.new();
}


export function get_move_gen(): MoveGen {
    return move_gen
}

// export function get_move_code_helper(): MoveCodeHelper {
//     return move_code_helper
// }

export * from './gas';
export * from './gen';
export * from './deps';
export * from './util';
export * from './types';
export * from './clone';
// export * from './debug'; // aptos vm 没有VMTracer
export * from './setup';
export * from './config';
export * from './publish';