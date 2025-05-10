import { MoveGen, MoveCodeHelper } from './wasm/pkg/sui_wasm';
import { decodeSuiPrivateKey } from '@mysten/sui/cryptography';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { SuiWasm } from './wasm/pkg/sui_wasm';
import { get_config } from './config';
import dotenv from 'dotenv'
dotenv.config()

let wasm = SuiWasm.new_wasm()
let move_gen = MoveGen.new();
let move_code_helper = MoveCodeHelper.new();

export function refresh_vm() {
    wasm.refresh_vm();
}

export function new_wasm() {
    return SuiWasm.new_wasm();
}

export function new_move_code_helper() {
    return MoveCodeHelper.new();
}

export function new_move_gen() {
    return MoveGen.new();
}

export function get_wasm(): SuiWasm {
    return wasm
}

export function get_move_gen(): MoveGen {
    return move_gen
}

export function get_move_code_helper(): MoveCodeHelper {
    return move_code_helper
}

export function new_sui_client(): SuiClient | null {
    let network = get_config()?.network;
    if (network) {
        return new SuiClient({ url: getFullnodeUrl(network) });;
    }

    return null;
}

export async function sign_execute_transaction(client: SuiClient, tx: any) {
    const pair = decodeSuiPrivateKey(process.env.SUI_PRIVATE_KEY || "");
    const keypair = Ed25519Keypair.fromSecretKey(pair.secretKey);

    return await client.signAndExecuteTransaction({
        transaction: tx,
        signer: keypair,
        options: {
            showEffects: true
        }
    });
}

export * from './gas';
export * from './gen';
export * from './deps';
export * from './util';
export * from './types';
export * from './clone';
export * from './debug';
export * from './setup';
export * from './config';
export * from './publish';